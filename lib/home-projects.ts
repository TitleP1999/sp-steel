import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export type HomeProjectItem = {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  href: string;
  published: boolean;
};

type HomeProjectData = { revision: string; updatedAt: string | null; items: HomeProjectItem[] };
export class HomeProjectError extends Error {}

const directory = () => process.env.HOME_PROJECT_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "home-projects.json");
const useDatabase = () => Boolean(process.env.DATABASE_URL) && !process.env.HOME_PROJECT_DATA_DIR;
const databaseState = globalThis as typeof globalThis & { homeProjectSchemaPromise?: Promise<void> };

function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

function isSafeUrl(value: string) {
  return value === "" || (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value);
}

export function validateHomeProjects(items: unknown): HomeProjectItem[] {
  if (!Array.isArray(items) || items.length > 50) throw new HomeProjectError("โครงการต้องเป็นรายการไม่เกิน 50 รายการ");
  const ids = new Set<string>();
  return items.map((item, index) => {
    if (!item || typeof item !== "object") throw new HomeProjectError(`โครงการรายการที่ ${index + 1} ไม่ถูกต้อง`);
    const value = item as Record<string, unknown>;
    const id = typeof value.id === "string" ? value.id.trim() : "";
    const title = typeof value.title === "string" ? value.title.trim() : "";
    const summary = typeof value.summary === "string" ? value.summary.trim() : "";
    const imageUrl = typeof value.imageUrl === "string" ? value.imageUrl.trim() : "";
    const href = typeof value.href === "string" ? value.href.trim() : "";
    if (!id || id.length > 80 || !/^[A-Za-z0-9_-]+$/.test(id) || ids.has(id)) throw new HomeProjectError(`รหัสโครงการรายการที่ ${index + 1} ไม่ถูกต้องหรือซ้ำกัน`);
    if (!title || title.length > 160) throw new HomeProjectError(`กรุณาระบุชื่อโครงการรายการที่ ${index + 1} ไม่เกิน 160 ตัวอักษร`);
    if (summary.length > 500) throw new HomeProjectError(`รายละเอียดโครงการรายการที่ ${index + 1} ต้องไม่เกิน 500 ตัวอักษร`);
    if (!imageUrl || imageUrl.length > 1000 || !isSafeUrl(imageUrl)) throw new HomeProjectError(`กรุณาระบุรูปภาพโครงการรายการที่ ${index + 1} ให้ถูกต้อง`);
    if (href.length > 1000 || !isSafeUrl(href)) throw new HomeProjectError(`ลิงก์โครงการรายการที่ ${index + 1} ไม่ถูกต้อง`);
    ids.add(id);
    return { id, title, summary, imageUrl, href, published: value.published === true };
  });
}

async function ensureDatabase() {
  if (!databaseState.homeProjectSchemaPromise) databaseState.homeProjectSchemaPromise = (async () => {
    const sql = database();
    await sql.query(`CREATE TABLE IF NOT EXISTS sp_home_projects_config (
      id SMALLINT PRIMARY KEY CHECK (id = 1),
      revision UUID NOT NULL,
      items JSONB NOT NULL,
      updated_at TIMESTAMPTZ
    )`);
    await sql.query("INSERT INTO sp_home_projects_config (id, revision, items, updated_at) VALUES (1, $1, $2::jsonb, NULL) ON CONFLICT (id) DO NOTHING", [randomUUID(), JSON.stringify([])]);
  })().catch(error => { databaseState.homeProjectSchemaPromise = undefined; throw error; });
  await databaseState.homeProjectSchemaPromise;
}

async function readFileData(): Promise<HomeProjectData> {
  let raw: string;
  try { raw = await readFile(filename(), "utf8"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { revision: "initial", updatedAt: null, items: [] };
    throw error;
  }
  const data = JSON.parse(raw) as Partial<HomeProjectData>;
  if (!data || typeof data.revision !== "string" || !(typeof data.updatedAt === "string" || data.updatedAt === null)) throw new Error("Invalid home project storage");
  return { revision: data.revision, updatedAt: data.updatedAt, items: validateHomeProjects(data.items) };
}

async function readDatabase(): Promise<HomeProjectData> {
  await ensureDatabase();
  const rows = await database().query("SELECT revision::text AS revision, items, updated_at FROM sp_home_projects_config WHERE id = 1");
  const row = rows[0] as { revision: string; items: unknown; updated_at: unknown } | undefined;
  if (!row) throw new Error("Home project database state is missing");
  return { revision: String(row.revision), updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : null, items: validateHomeProjects(row.items) };
}

export async function getHomeProjects() {
  return useDatabase() ? readDatabase() : readFileData();
}

export async function saveHomeProjects(items: unknown, revision: string) {
  const nextItems = validateHomeProjects(items);
  if (useDatabase()) {
    await ensureDatabase();
    const nextRevision = randomUUID();
    const result = await database().query("UPDATE sp_home_projects_config SET revision = $1, items = $2::jsonb, updated_at = NOW() WHERE id = 1 AND revision::text = $3 RETURNING revision::text AS revision", [nextRevision, JSON.stringify(nextItems), revision]);
    if (!result[0]) throw new HomeProjectError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    return nextRevision;
  }
  await mkdir(directory(), { recursive: true });
  const lockfile = path.join(directory(), "home-projects.lock");
  let lock;
  try { lock = await open(lockfile, "wx"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new HomeProjectError("มีการบันทึกโครงการอื่นอยู่ กรุณาลองอีกครั้ง");
    throw error;
  }
  const temporary = path.join(directory(), `home-projects-${randomUUID()}.tmp`);
  try {
    const data = await readFileData();
    if (data.revision !== revision) throw new HomeProjectError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    data.items = nextItems; data.revision = randomUUID(); data.updatedAt = new Date().toISOString();
    await writeFile(temporary, JSON.stringify(data, null, 2), { mode: 0o600 });
    await rename(temporary, filename());
    return data.revision;
  } finally {
    await unlink(temporary).catch(() => {}); await lock.close(); await unlink(lockfile);
  }
}
