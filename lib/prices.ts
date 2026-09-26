import { mkdir, readFile, rename, unlink, writeFile, open } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { products } from "../data/products";
import priceSeed from "../data/price-seed.json";

type PriceData = { revision: string; updatedAt: string | null; prices: Record<string, number[]>; previousPrices: Record<string, number[]> };
export class PriceError extends Error {}
const directory = () => process.env.PRICE_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "prices.json");
const useDatabase = () => Boolean(process.env.DATABASE_URL) && !process.env.PRICE_DATA_DIR;

const databaseState = globalThis as typeof globalThis & { priceSchemaPromise?: Promise<void> };
function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

async function ensureDatabase() {
  if (!databaseState.priceSchemaPromise) databaseState.priceSchemaPromise = (async () => {
    const sql = database();
    await sql.query(`CREATE TABLE IF NOT EXISTS sp_price_state (
      id SMALLINT PRIMARY KEY CHECK (id = 1),
      revision UUID NOT NULL,
      updated_at TIMESTAMPTZ
    )`);
    await sql.query(`CREATE TABLE IF NOT EXISTS sp_product_prices (
      product_slug TEXT PRIMARY KEY,
      prices JSONB NOT NULL,
      previous_prices JSONB,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
    await sql.query("ALTER TABLE sp_product_prices ADD COLUMN IF NOT EXISTS previous_prices JSONB");
    await sql.query(
      "INSERT INTO sp_price_state (id, revision, updated_at) VALUES (1, $1, NULL) ON CONFLICT (id) DO NOTHING",
      [randomUUID()]
    );
    for (const [slug, values] of Object.entries(priceSeed)) {
      const prices = validatePrices(slug, values);
      await sql.query(
        "INSERT INTO sp_product_prices (product_slug, prices) VALUES ($1, $2::jsonb) ON CONFLICT (product_slug) DO NOTHING",
        [slug, JSON.stringify(prices)]
      );
    }
  })().catch(error => {
    databaseState.priceSchemaPromise = undefined;
    throw error;
  });
  await databaseState.priceSchemaPromise;
}

export function validatePrices(slug: string, values: unknown): number[] {
  const product = products.find(p => p.slug === slug);
  if (!product || !Array.isArray(values) || values.length !== product.options.length ||
    values.some(v => typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 100000000 || Math.abs(v * 100 - Math.round(v * 100)) > 0.000001)) {
    throw new PriceError("กรุณาระบุราคาทุกขนาดเป็นตัวเลข 0–100,000,000 บาท และทศนิยมไม่เกิน 2 ตำแหน่ง");
  }
  return values;
}

async function readData(): Promise<PriceData> {
  let raw: string;
  try { raw = await readFile(filename(), "utf8"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { revision: "initial", updatedAt: null, prices: {}, previousPrices: {} };
    throw error;
  }
  const data = JSON.parse(raw) as PriceData;
  if (!data || typeof data.revision !== "string" || typeof data.updatedAt !== "string" || !data.prices || typeof data.prices !== "object" || Array.isArray(data.prices)) throw new Error("Invalid price storage");
  for (const [slug, values] of Object.entries(data.prices)) validatePrices(slug, values);
  const previousPrices = data.previousPrices && typeof data.previousPrices === "object" && !Array.isArray(data.previousPrices) ? data.previousPrices : {};
  for (const [slug, values] of Object.entries(previousPrices)) validatePrices(slug, values);
  return { ...data, previousPrices };
}

async function readDatabase(): Promise<PriceData> {
  await ensureDatabase();
  const sql = database();
  const [state, rows] = await Promise.all([
    sql.query("SELECT revision::text AS revision, updated_at FROM sp_price_state WHERE id = 1"),
    sql.query("SELECT product_slug, prices, previous_prices FROM sp_product_prices")
  ]);
  if (!state[0]) throw new Error("Price database state is missing");
  const prices: Record<string, number[]> = {};
  const previousPrices: Record<string, number[]> = {};
  for (const row of rows as Array<{ product_slug: string; prices: unknown; previous_prices: unknown }>) {
    prices[row.product_slug] = validatePrices(row.product_slug, row.prices);
    if (row.previous_prices) previousPrices[row.product_slug] = validatePrices(row.product_slug, row.previous_prices);
  }
  const updatedAt = state[0].updated_at ? new Date(String(state[0].updated_at)).toISOString() : null;
  return { revision: String(state[0].revision), updatedAt, prices, previousPrices };
}

async function getData() {
  return useDatabase() ? readDatabase() : readData();
}

export async function getCatalog() {
  const data = await getData();
  return { revision: data.revision, updatedAt: data.updatedAt, unpricedCount: products.filter(product => !Object.hasOwn(data.prices, product.slug)).length, products: products.map(product => {
    const options = product.options.map((option, index) => ({ ...option, price: data.prices[product.slug]?.[index] ?? option.price }));
    const price = Math.min(...options.map(option => option.price));
    const previous = data.previousPrices[product.slug];
    const previousPrice = previous?.length ? Math.min(...previous) : null;
    const changePercent = previousPrice && previousPrice > 0 ? ((price - previousPrice) / previousPrice) * 100 : null;
    return { ...product, options, price, changePercent };
  }) };
}

export async function savePrices(slug: string, values: unknown, revision: string) {
  const prices = validatePrices(slug, values);
  if (useDatabase()) {
    await ensureDatabase();
    const nextRevision = randomUUID();
    const result = await database().query(
      `WITH changed AS (
        UPDATE sp_price_state
        SET revision = $1, updated_at = NOW()
        WHERE id = 1 AND revision::text = $2
        RETURNING id
      ), saved AS (
        INSERT INTO sp_product_prices (product_slug, prices, updated_at)
        SELECT $3, $4::jsonb, NOW() FROM changed
        ON CONFLICT (product_slug) DO UPDATE SET previous_prices = sp_product_prices.prices, prices = EXCLUDED.prices, updated_at = NOW()
        RETURNING product_slug
      )
      SELECT product_slug FROM saved`,
      [nextRevision, revision, slug, JSON.stringify(prices)]
    );
    if (!result[0]) throw new PriceError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    return nextRevision;
  }
  await mkdir(directory(), { recursive: true });
  const lockfile = path.join(directory(), "prices.lock");
  let lock;
  try { lock = await open(lockfile, "wx"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new PriceError("มีการบันทึกอื่นอยู่ กรุณาลองอีกครั้ง หากยังไม่สำเร็จให้ผู้ดูแลตรวจสอบไฟล์ prices.lock");
    throw error;
  }
  const temporary = path.join(directory(), `prices-${randomUUID()}.tmp`);
  try {
    const data = await readData();
    if (data.revision !== revision) throw new PriceError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    if (data.prices[slug]) data.previousPrices[slug] = [...data.prices[slug]];
    data.prices[slug] = prices;
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
