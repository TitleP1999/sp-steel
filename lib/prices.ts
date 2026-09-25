import { mkdir, readFile, rename, unlink, writeFile, open } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { products } from "../data/products";

type PriceData = { revision: string; updatedAt: string | null; prices: Record<string, number[]> };
export class PriceError extends Error {}
const directory = () => process.env.PRICE_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "prices.json");

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
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { revision: "initial", updatedAt: null, prices: {} };
    throw error;
  }
  const data = JSON.parse(raw) as PriceData;
  if (!data || typeof data.revision !== "string" || typeof data.updatedAt !== "string" || !data.prices || typeof data.prices !== "object" || Array.isArray(data.prices)) throw new Error("Invalid price storage");
  for (const [slug, values] of Object.entries(data.prices)) validatePrices(slug, values);
  return data;
}

export async function getCatalog() {
  const data = await readData();
  return { revision: data.revision, updatedAt: data.updatedAt, unpricedCount: products.filter(product => !Object.hasOwn(data.prices, product.slug)).length, products: products.map(product => {
    const options = product.options.map((option, index) => ({ ...option, price: data.prices[product.slug]?.[index] ?? option.price }));
    return { ...product, options, price: Math.min(...options.map(option => option.price)) };
  }) };
}

export async function savePrices(slug: string, values: unknown, revision: string) {
  const prices = validatePrices(slug, values);
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
