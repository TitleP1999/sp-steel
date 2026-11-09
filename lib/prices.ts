import { mkdir, readFile, rename, unlink, writeFile, open } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { products } from "../data/products";
import priceSeed from "../data/price-seed.json";

type SizePrices = (number | null)[];
type PriceData = { revision: string; updatedAt: string | null; prices: Record<string, SizePrices>; previousPrices: Record<string, SizePrices> };
export class PriceError extends Error {}
const directory = () => process.env.PRICE_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "prices.json");
const useDatabase = () => Boolean(process.env.DATABASE_URL) && !process.env.PRICE_DATA_DIR;

const PRICE_SCHEMA_VERSION = 2;
const databaseState = globalThis as typeof globalThis & { priceSchemaPromise?: Promise<void>; priceSchemaVersion?: number };
function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

async function ensureDatabase() {
  if (databaseState.priceSchemaVersion !== PRICE_SCHEMA_VERSION) {
    databaseState.priceSchemaPromise = undefined;
    databaseState.priceSchemaVersion = PRICE_SCHEMA_VERSION;
  }
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
  })().catch(error => {
    databaseState.priceSchemaPromise = undefined;
    databaseState.priceSchemaVersion = undefined;
    throw error;
  });
  await databaseState.priceSchemaPromise;
}

export function validatePrices(slug: string, values: unknown): SizePrices {
  const product = products.find(p => p.slug === slug);
  if (!product || !Array.isArray(values) || values.length !== product.options.length ||
    values.some(v => v !== null && (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 100000000 || Math.abs(v * 100 - Math.round(v * 100)) > 0.000001))) {
    throw new PriceError("ราคาต้องอยู่ระหว่าง 0–100,000,000 บาท ทศนิยมไม่เกิน 2 ตำแหน่ง หรือเว้นว่างเพื่อให้สอบถามราคา");
  }
  return values;
}

function readStoredPrices(slug: string, values: unknown): SizePrices {
  // Keep the original ten TISCON prices at their existing option indices.
  if (slug === "tiscon-superlinks" && Array.isArray(values) && values.length === 10) {
    const optionCount = products.find(product => product.slug === slug)!.options.length;
    return validatePrices(slug, [...values, ...Array(optionCount - values.length).fill(null)]);
  }
  return validatePrices(slug, values);
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
  for (const [slug, values] of Object.entries(data.prices)) data.prices[slug] = readStoredPrices(slug, values);
  const previousPrices = data.previousPrices && typeof data.previousPrices === "object" && !Array.isArray(data.previousPrices) ? data.previousPrices : {};
  for (const [slug, values] of Object.entries(previousPrices)) previousPrices[slug] = readStoredPrices(slug, values);
  return { ...data, previousPrices };
}

async function readDatabase(): Promise<PriceData> {
  await ensureDatabase();
  const rows = await database().query(`
    SELECT state.revision::text AS revision, state.updated_at,
           product.product_slug, product.prices, product.previous_prices
    FROM sp_price_state state
    LEFT JOIN sp_product_prices product ON TRUE
    WHERE state.id = 1
  `);
  const state = rows[0];
  if (!state) throw new Error("Price database state is missing");
  const prices: Record<string, SizePrices> = {};
  const previousPrices: Record<string, SizePrices> = {};
  for (const row of rows as Array<{ product_slug: string | null; prices: unknown; previous_prices: unknown }>) {
    if (row.product_slug === null) continue;
    const values = readStoredPrices(row.product_slug, row.prices);
    const seed = (priceSeed as Record<string, number[]>)[row.product_slug];
    // Older deployments inserted this sample row before anyone saved a price.
    if (!row.previous_prices && seed?.every((value, index) => values[index] === value) && seed.length === values.length) continue;
    prices[row.product_slug] = values;
    if (row.previous_prices) previousPrices[row.product_slug] = readStoredPrices(row.product_slug, row.previous_prices);
  }
  const updatedAt = state.updated_at ? new Date(String(state.updated_at)).toISOString() : null;
  return { revision: String(state.revision), updatedAt, prices, previousPrices };
}

async function getData() {
  return useDatabase() ? readDatabase() : readData();
}

export async function getCatalog() {
  const data = await getData();
  const minPrice = (prices: SizePrices) => {
    const available = prices.filter((value): value is number => value !== null);
    return available.length ? Math.min(...available) : null;
  };
  return { revision: data.revision, updatedAt: data.updatedAt, products: products.map(product => {
    const previous = data.previousPrices[product.slug];
    const options = product.options.map((option, index) => {
      const price = data.prices[product.slug]?.[index] ?? null;
      const previousPrice = previous?.[index] ?? null;
      const changePercent = price !== null && previousPrice !== null && previousPrice > 0 ? ((price - previousPrice) / previousPrice) * 100 : null;
      return { ...option, price, previousPrice, changePercent };
    });
    const price = minPrice(options.map(option => option.price));
    const previousPrice = minPrice(previous ?? []);
    const changePercent = price !== null && previousPrice !== null && previousPrice > 0 ? ((price - previousPrice) / previousPrice) * 100 : null;
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
        INSERT INTO sp_product_prices (product_slug, prices, previous_prices, updated_at)
        SELECT $3, $4::jsonb, $5::jsonb, NOW() FROM changed
        ON CONFLICT (product_slug) DO UPDATE SET previous_prices = sp_product_prices.prices, prices = EXCLUDED.prices, updated_at = NOW()
        RETURNING product_slug
      )
      SELECT product_slug FROM saved`,
      [nextRevision, revision, slug, JSON.stringify(prices), JSON.stringify(prices.map(() => null))]
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
