import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

export type QuoteRequest = {
  id: string;
  name: string;
  phone: string;
  product: string;
  details: string;
  status: "new" | "contacted";
  createdAt: string;
};

export class QuoteRequestError extends Error {}

const quoteState = globalThis as typeof globalThis & { quoteSchemaPromise?: Promise<void> };
const directory = () => process.env.QUOTE_REQUEST_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "quote-requests.json");
const useDatabase = () => Boolean(process.env.DATABASE_URL) && !process.env.QUOTE_REQUEST_DATA_DIR;

function database() {
  if (!process.env.DATABASE_URL) throw new QuoteRequestError("ระบบรับคำขอยังไม่พร้อมใช้งาน กรุณาติดต่อฝ่ายขายทางโทรศัพท์หรือ LINE");
  return neon(process.env.DATABASE_URL);
}

async function ensureSchema() {
  if (!quoteState.quoteSchemaPromise) quoteState.quoteSchemaPromise = (async () => {
    const sql = database();
    await sql.query(`CREATE TABLE IF NOT EXISTS sp_quote_requests (
      id UUID PRIMARY KEY,
      customer_name VARCHAR(100) NOT NULL,
      phone VARCHAR(30) NOT NULL,
      product TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await sql.query("ALTER TABLE sp_quote_requests ALTER COLUMN product TYPE TEXT");
    await sql.query("CREATE INDEX IF NOT EXISTS sp_quote_requests_created_at_idx ON sp_quote_requests (created_at DESC)");
    await sql.query("CREATE INDEX IF NOT EXISTS sp_quote_requests_phone_created_idx ON sp_quote_requests (phone, created_at DESC)");
  })().catch(error => {
    quoteState.quoteSchemaPromise = undefined;
    throw error;
  });
  await quoteState.quoteSchemaPromise;
}

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

async function readLocalQuotes(): Promise<QuoteRequest[]> {
  let raw: string;
  try { raw = await readFile(filename(), "utf8"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const items = JSON.parse(raw) as unknown;
  if (!Array.isArray(items)) throw new Error("Invalid quote request storage");
  return items as QuoteRequest[];
}

async function saveLocalQuote(input: ReturnType<typeof validateQuoteRequest>) {
  await mkdir(directory(), { recursive: true });
  const lockfile = path.join(directory(), "quote-requests.lock");
  let lock;
  try { lock = await open(lockfile, "wx"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new QuoteRequestError("มีการบันทึกคำขออื่นอยู่ กรุณาลองอีกครั้ง");
    throw error;
  }

  const temporary = path.join(directory(), `quote-requests-${randomUUID()}.tmp`);
  try {
    const items = await readLocalQuotes();
    const cutoff = Date.now() - 15 * 60 * 1000;
    const recentCount = input.phone ? items.filter(item => item.phone === input.phone && new Date(item.createdAt).getTime() > cutoff).length : 0;
    if (recentCount >= 3) throw new QuoteRequestError("ส่งคำขอบ่อยเกินไป กรุณารอ 15 นาที หรือติดต่อฝ่ายขายโดยตรง");
    items.push({ id: randomUUID(), ...input, status: "new", createdAt: new Date().toISOString() });
    await writeFile(temporary, JSON.stringify(items, null, 2), { mode: 0o600 });
    await rename(temporary, filename());
  } finally {
    await unlink(temporary).catch(() => {});
    await lock.close();
    await unlink(lockfile).catch(() => {});
  }
}

export function validateQuoteRequest(form: FormData) {
  const name = clean(form.get("name"));
  const phone = clean(form.get("phone"));
  const product = clean(form.get("product"));
  const details = clean(form.get("details"));
  const digits = phone.replace(/\D/g, "");
  if (name.length > 100) throw new QuoteRequestError("ชื่อหรือบริษัทต้องไม่เกิน 100 ตัวอักษร");
  if (phone && (phone.length > 30 || digits.length < 8 || digits.length > 15 || !/^[+()\d\s-]+$/.test(phone))) throw new QuoteRequestError("กรุณาระบุเบอร์โทรที่ติดต่อได้");
  if (product.length < 2 || product.length > 5000) throw new QuoteRequestError("กรุณาระบุสินค้าที่สนใจ 2–5,000 ตัวอักษร");
  if (details.length > 2000) throw new QuoteRequestError("รายละเอียดเพิ่มเติมต้องไม่เกิน 2,000 ตัวอักษร");
  return { name, phone, product, details };
}

export async function createQuoteRequest(input: ReturnType<typeof validateQuoteRequest>) {
  if (!useDatabase()) {
    if (process.env.VERCEL && !process.env.QUOTE_REQUEST_DATA_DIR) throw new QuoteRequestError("ระบบรับคำขอยังไม่ได้ตั้งค่าฐานข้อมูล กรุณาติดต่อผู้ดูแลเว็บไซต์");
    return saveLocalQuote(input);
  }
  await ensureSchema();
  const result = await database().query(
    `INSERT INTO sp_quote_requests (id, customer_name, phone, product, details)
     SELECT $1::uuid, $2::varchar(100), $3::varchar(30), $4::text, $5::text
     WHERE $3::varchar(30) = '' OR (SELECT COUNT(*) FROM sp_quote_requests WHERE phone = $3::varchar(30) AND created_at > NOW() - INTERVAL '15 minutes') < 3
     RETURNING id`,
    [randomUUID(), input.name, input.phone, input.product, input.details]
  );
  if (!result[0]) throw new QuoteRequestError("ส่งคำขอบ่อยเกินไป กรุณารอ 15 นาที หรือติดต่อฝ่ายขายโดยตรง");
}

export async function getQuoteRequests(limit = 100): Promise<QuoteRequest[]> {
  if (!useDatabase()) return readLocalQuotes().then(items => items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, Math.max(1, Math.min(200, Math.trunc(limit)))));
  await ensureSchema();
  const safeLimit = Math.max(1, Math.min(200, Math.trunc(limit)));
  const rows = await database().query(
    `SELECT id::text, customer_name, phone, product, details, status, created_at
     FROM sp_quote_requests ORDER BY created_at DESC LIMIT $1`,
    [safeLimit]
  );
  return (rows as Array<Record<string, unknown>>).map(row => ({
    id: String(row.id),
    name: String(row.customer_name),
    phone: String(row.phone),
    product: String(row.product),
    details: String(row.details),
    status: row.status === "contacted" ? "contacted" : "new",
    createdAt: new Date(String(row.created_at)).toISOString()
  }));
}
