import { mkdir, readFile, rename, unlink, writeFile, open } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  href: string;
  imageUrl: string;
  published: boolean;
};

type NewsData = { revision: string; updatedAt: string | null; items: NewsItem[] };
export class NewsError extends Error {}

const directory = () => process.env.NEWS_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "news.json");
const useDatabase = () => Boolean(process.env.DATABASE_URL) && !process.env.NEWS_DATA_DIR;

const databaseState = globalThis as typeof globalThis & { newsSchemaPromise?: Promise<void> };
function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isSafeLink(value: string) {
  return value === "" || (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value);
}

function isSafeImage(value: string) {
  return value === "" || (/^data:image\/(jpeg|png|webp);base64,/i.test(value) ? value.length <= 1_200_000 : value.length <= 1000 && isSafeLink(value));
}

export function validateNews(items: unknown): NewsItem[] {
  if (!Array.isArray(items) || items.length > 100) throw new NewsError("ข่าวสารต้องเป็นรายการไม่เกิน 100 รายการ");
  const ids = new Set<string>();
  return items.map((item, index) => {
    if (!item || typeof item !== "object") throw new NewsError(`ข่าวสารรายการที่ ${index + 1} ไม่ถูกต้อง`);
    const value = item as Record<string, unknown>;
    const id = typeof value.id === "string" ? value.id.trim() : "";
    const title = typeof value.title === "string" ? value.title.trim() : "";
    const summary = typeof value.summary === "string" ? value.summary.trim() : "";
    const category = typeof value.category === "string" ? value.category.trim() : "";
    const publishedAt = typeof value.publishedAt === "string" ? value.publishedAt : "";
    const href = typeof value.href === "string" ? value.href.trim() : "";
    const imageUrl = typeof value.imageUrl === "string" ? value.imageUrl.trim() : "";
    if (!id || id.length > 80 || !/^[A-Za-z0-9_-]+$/.test(id) || ids.has(id)) throw new NewsError(`รหัสข่าวสารรายการที่ ${index + 1} ไม่ถูกต้องหรือซ้ำกัน`);
    if (!title || title.length > 160) throw new NewsError(`กรุณาระบุหัวข้อข่าวสารรายการที่ ${index + 1} ไม่เกิน 160 ตัวอักษร`);
    if (summary.length > 500) throw new NewsError(`คำโปรยข่าวสารรายการที่ ${index + 1} ต้องไม่เกิน 500 ตัวอักษร`);
    if (category.length > 60) throw new NewsError(`หมวดข่าวสารรายการที่ ${index + 1} ต้องไม่เกิน 60 ตัวอักษร`);
    if (!isDate(publishedAt)) throw new NewsError(`วันที่ข่าวสารรายการที่ ${index + 1} ไม่ถูกต้อง`);
    if (href.length > 500 || !isSafeLink(href)) throw new NewsError(`ลิงก์ข่าวสารรายการที่ ${index + 1} ไม่ถูกต้อง`);
    if (!isSafeImage(imageUrl)) throw new NewsError(`รูปภาพข่าวสารรายการที่ ${index + 1} ต้องเป็น JPEG หรือ PNG`);
    ids.add(id);
    return { id, title, summary, category, publishedAt, href, imageUrl, published: value.published === true };
  });
}

async function ensureDatabase() {
  if (!databaseState.newsSchemaPromise) databaseState.newsSchemaPromise = (async () => {
    const sql = database();
    await sql.query(`CREATE TABLE IF NOT EXISTS sp_news_config (
      id SMALLINT PRIMARY KEY CHECK (id = 1),
      revision UUID NOT NULL,
      items JSONB NOT NULL,
      updated_at TIMESTAMPTZ
    )`);
    await sql.query(
      "INSERT INTO sp_news_config (id, revision, items, updated_at) VALUES (1, $1, $2::jsonb, NULL) ON CONFLICT (id) DO NOTHING",
      [randomUUID(), JSON.stringify([])]
    );
  })().catch(error => {
    databaseState.newsSchemaPromise = undefined;
    throw error;
  });
  await databaseState.newsSchemaPromise;
}

async function readFileData(): Promise<NewsData> {
  let raw: string;
  try { raw = await readFile(filename(), "utf8"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { revision: "initial", updatedAt: null, items: [] };
    throw error;
  }
  const data = JSON.parse(raw) as Partial<NewsData>;
  if (!data || typeof data.revision !== "string" || !(typeof data.updatedAt === "string" || data.updatedAt === null)) throw new Error("Invalid news storage");
  return { revision: data.revision, updatedAt: data.updatedAt, items: validateNews(data.items) };
}

async function readDatabase(): Promise<NewsData> {
  await ensureDatabase();
  const rows = await database().query("SELECT revision::text AS revision, items, updated_at FROM sp_news_config WHERE id = 1");
  const row = rows[0] as { revision: string; items: unknown; updated_at: unknown } | undefined;
  if (!row) throw new Error("News database state is missing");
  const updatedAt = row.updated_at ? new Date(String(row.updated_at)).toISOString() : null;
  return { revision: String(row.revision), updatedAt, items: validateNews(row.items) };
}

async function getData() {
  return useDatabase() ? readDatabase() : readFileData();
}

export async function getNews() {
  return getData();
}

export async function saveNews(items: unknown, revision: string) {
  const nextItems = validateNews(items);
  if (useDatabase()) {
    await ensureDatabase();
    const nextRevision = randomUUID();
    const result = await database().query(
      "UPDATE sp_news_config SET revision = $1, items = $2::jsonb, updated_at = NOW() WHERE id = 1 AND revision::text = $3 RETURNING revision::text AS revision",
      [nextRevision, JSON.stringify(nextItems), revision]
    );
    if (!result[0]) throw new NewsError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    return nextRevision;
  }

  await mkdir(directory(), { recursive: true });
  const lockfile = path.join(directory(), "news.lock");
  let lock;
  try { lock = await open(lockfile, "wx"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new NewsError("มีการบันทึกข่าวสารอื่นอยู่ กรุณาลองอีกครั้ง หากยังไม่สำเร็จให้ผู้ดูแลตรวจสอบไฟล์ news.lock");
    throw error;
  }
  const temporary = path.join(directory(), `news-${randomUUID()}.tmp`);
  try {
    const data = await readFileData();
    if (data.revision !== revision) throw new NewsError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    data.items = nextItems;
    data.revision = randomUUID();
    data.updatedAt = new Date().toISOString();
    await writeFile(temporary, JSON.stringify(data, null, 2), { mode: 0o600 });
    await rename(temporary, filename());
    return data.revision;
  } finally {
    await unlink(temporary).catch(() => {});
    await lock.close();
    await unlink(lockfile);
  }
}
