import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export type ReviewItem = {
  id: string;
  customerName: string;
  company: string;
  message: string;
  product: string;
  rating: number;
  reviewedAt: string;
  imageUrl: string;
  published: boolean;
};

type ReviewData = { revision: string; updatedAt: string | null; items: ReviewItem[] };
export class ReviewError extends Error {}

const directory = () => process.env.REVIEW_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "reviews.json");
const useDatabase = () => Boolean(process.env.DATABASE_URL) && !process.env.REVIEW_DATA_DIR;
const databaseState = globalThis as typeof globalThis & { reviewSchemaPromise?: Promise<void> };

function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isSafeImage(value: string) {
  return value === "" || (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value);
}

export function validateReviews(items: unknown): ReviewItem[] {
  if (!Array.isArray(items) || items.length > 100) throw new ReviewError("รีวิวต้องเป็นรายการไม่เกิน 100 รายการ");
  const ids = new Set<string>();
  return items.map((item, index) => {
    if (!item || typeof item !== "object") throw new ReviewError(`รีวิวรายการที่ ${index + 1} ไม่ถูกต้อง`);
    const value = item as Record<string, unknown>;
    const id = typeof value.id === "string" ? value.id.trim() : "";
    const customerName = typeof value.customerName === "string" ? value.customerName.trim() : "";
    const company = typeof value.company === "string" ? value.company.trim() : "";
    const message = typeof value.message === "string" ? value.message.trim() : "";
    const product = typeof value.product === "string" ? value.product.trim() : "";
    const reviewedAt = typeof value.reviewedAt === "string" ? value.reviewedAt : "";
    const imageUrl = typeof value.imageUrl === "string" ? value.imageUrl.trim() : "";
    const rating = typeof value.rating === "number" ? value.rating : Number(value.rating);
    if (!id || id.length > 80 || !/^[A-Za-z0-9_-]+$/.test(id) || ids.has(id)) throw new ReviewError(`รหัสรีวิวรายการที่ ${index + 1} ไม่ถูกต้องหรือซ้ำกัน`);
    if (!customerName || customerName.length > 120) throw new ReviewError(`กรุณาระบุชื่อลูกค้ารีวิวรายการที่ ${index + 1} ไม่เกิน 120 ตัวอักษร`);
    if (company.length > 160) throw new ReviewError(`ชื่อบริษัทรีวิวรายการที่ ${index + 1} ต้องไม่เกิน 160 ตัวอักษร`);
    if (!message || message.length > 1500) throw new ReviewError(`กรุณาระบุข้อความรีวิวรายการที่ ${index + 1} ไม่เกิน 1,500 ตัวอักษร`);
    if (product.length > 160) throw new ReviewError(`สินค้า/บริการรีวิวรายการที่ ${index + 1} ต้องไม่เกิน 160 ตัวอักษร`);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new ReviewError(`คะแนนรีวิวรายการที่ ${index + 1} ต้องอยู่ระหว่าง 1–5 ดาว`);
    if (!isDate(reviewedAt)) throw new ReviewError(`วันที่รีวิวรายการที่ ${index + 1} ไม่ถูกต้อง`);
    if (imageUrl.length > 1000 || !isSafeImage(imageUrl)) throw new ReviewError(`รูปภาพรีวิวรายการที่ ${index + 1} ไม่ถูกต้อง`);
    ids.add(id);
    return { id, customerName, company, message, product, rating, reviewedAt, imageUrl, published: value.published === true };
  });
}

async function ensureDatabase() {
  if (!databaseState.reviewSchemaPromise) databaseState.reviewSchemaPromise = (async () => {
    const sql = database();
    await sql.query(`CREATE TABLE IF NOT EXISTS sp_reviews_config (
      id SMALLINT PRIMARY KEY CHECK (id = 1),
      revision UUID NOT NULL,
      items JSONB NOT NULL,
      updated_at TIMESTAMPTZ
    )`);
    await sql.query("INSERT INTO sp_reviews_config (id, revision, items, updated_at) VALUES (1, $1, $2::jsonb, NULL) ON CONFLICT (id) DO NOTHING", [randomUUID(), JSON.stringify([])]);
  })().catch(error => { databaseState.reviewSchemaPromise = undefined; throw error; });
  await databaseState.reviewSchemaPromise;
}

async function readFileData(): Promise<ReviewData> {
  let raw: string;
  try { raw = await readFile(filename(), "utf8"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { revision: "initial", updatedAt: null, items: [] };
    throw error;
  }
  const data = JSON.parse(raw) as Partial<ReviewData>;
  if (!data || typeof data.revision !== "string" || !(typeof data.updatedAt === "string" || data.updatedAt === null)) throw new Error("Invalid review storage");
  return { revision: data.revision, updatedAt: data.updatedAt, items: validateReviews(data.items) };
}

async function readDatabase(): Promise<ReviewData> {
  await ensureDatabase();
  const rows = await database().query("SELECT revision::text AS revision, items, updated_at FROM sp_reviews_config WHERE id = 1");
  const row = rows[0] as { revision: string; items: unknown; updated_at: unknown } | undefined;
  if (!row) throw new Error("Review database state is missing");
  return { revision: String(row.revision), updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : null, items: validateReviews(row.items) };
}

export async function getReviews() {
  return useDatabase() ? readDatabase() : readFileData();
}

export async function saveReviews(items: unknown, revision: string) {
  const nextItems = validateReviews(items);
  if (useDatabase()) {
    await ensureDatabase();
    const nextRevision = randomUUID();
    const result = await database().query("UPDATE sp_reviews_config SET revision = $1, items = $2::jsonb, updated_at = NOW() WHERE id = 1 AND revision::text = $3 RETURNING revision::text AS revision", [nextRevision, JSON.stringify(nextItems), revision]);
    if (!result[0]) throw new ReviewError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    return nextRevision;
  }
  await mkdir(directory(), { recursive: true });
  const lockfile = path.join(directory(), "reviews.lock");
  let lock;
  try { lock = await open(lockfile, "wx"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new ReviewError("มีการบันทึกรีวิวอื่นอยู่ กรุณาลองอีกครั้ง");
    throw error;
  }
  const temporary = path.join(directory(), `reviews-${randomUUID()}.tmp`);
  try {
    const data = await readFileData();
    if (data.revision !== revision) throw new ReviewError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    data.items = nextItems; data.revision = randomUUID(); data.updatedAt = new Date().toISOString();
    await writeFile(temporary, JSON.stringify(data, null, 2), { mode: 0o600 });
    await rename(temporary, filename());
    return data.revision;
  } finally {
    await unlink(temporary).catch(() => {}); await lock.close(); await unlink(lockfile);
  }
}
