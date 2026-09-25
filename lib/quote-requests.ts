import { randomUUID } from "node:crypto";
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
      product VARCHAR(200) NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
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

export function validateQuoteRequest(form: FormData) {
  const name = clean(form.get("name"));
  const phone = clean(form.get("phone"));
  const product = clean(form.get("product"));
  const details = clean(form.get("details"));
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2 || name.length > 100) throw new QuoteRequestError("กรุณาระบุชื่อหรือบริษัท 2–100 ตัวอักษร");
  if (phone.length > 30 || digits.length < 8 || digits.length > 15 || !/^[+()\d\s-]+$/.test(phone)) throw new QuoteRequestError("กรุณาระบุเบอร์โทรที่ติดต่อได้");
  if (product.length < 2 || product.length > 200) throw new QuoteRequestError("กรุณาระบุสินค้าที่สนใจ 2–200 ตัวอักษร");
  if (details.length > 2000) throw new QuoteRequestError("รายละเอียดเพิ่มเติมต้องไม่เกิน 2,000 ตัวอักษร");
  return { name, phone, product, details };
}

export async function createQuoteRequest(input: ReturnType<typeof validateQuoteRequest>) {
  await ensureSchema();
  const result = await database().query(
    `INSERT INTO sp_quote_requests (id, customer_name, phone, product, details)
     SELECT $1, $2, $3, $4, $5
     WHERE (SELECT COUNT(*) FROM sp_quote_requests WHERE phone = $3 AND created_at > NOW() - INTERVAL '15 minutes') < 3
     RETURNING id`,
    [randomUUID(), input.name, input.phone, input.product, input.details]
  );
  if (!result[0]) throw new QuoteRequestError("ส่งคำขอบ่อยเกินไป กรุณารอ 15 นาที หรือติดต่อฝ่ายขายโดยตรง");
}

export async function getQuoteRequests(limit = 100): Promise<QuoteRequest[]> {
  if (!process.env.DATABASE_URL) return [];
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
