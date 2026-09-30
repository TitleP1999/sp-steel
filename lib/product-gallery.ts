import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { products } from "../data/products";

export type ProductGalleryItem = {
  id: string;
  productSlug: string;
  title: string;
  imageUrl: string;
  published: boolean;
};

type GalleryData = { revision: string; updatedAt: string | null; items: ProductGalleryItem[] };
export class ProductGalleryError extends Error {}

const directory = () => process.env.PRODUCT_GALLERY_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "product-gallery.json");
const useDatabase = () => Boolean(process.env.DATABASE_URL) && !process.env.PRODUCT_GALLERY_DATA_DIR;
const databaseState = globalThis as typeof globalThis & { productGallerySchemaPromise?: Promise<void> };

function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

export function validateProductGallery(items: unknown): ProductGalleryItem[] {
  if (!Array.isArray(items) || items.length > 100) throw new ProductGalleryError("ภาพสินค้าต้องมีไม่เกิน 100 รายการ");
  const slugs = new Set(products.map(product => product.slug));
  const ids = new Set<string>();
  let totalSize = 0;
  return items.map((item, index) => {
    if (!item || typeof item !== "object") throw new ProductGalleryError(`ภาพรายการที่ ${index + 1} ไม่ถูกต้อง`);
    const value = item as Record<string, unknown>;
    const id = typeof value.id === "string" ? value.id.trim() : "";
    const productSlug = typeof value.productSlug === "string" ? value.productSlug.trim() : "";
    const title = typeof value.title === "string" ? value.title.trim() : "";
    const imageUrl = typeof value.imageUrl === "string" ? value.imageUrl.trim() : "";
    if (!id || id.length > 80 || !/^[A-Za-z0-9_-]+$/.test(id) || ids.has(id)) throw new ProductGalleryError(`รหัสภาพรายการที่ ${index + 1} ไม่ถูกต้องหรือซ้ำกัน`);
    if (!slugs.has(productSlug)) throw new ProductGalleryError(`สินค้าของภาพรายการที่ ${index + 1} ไม่ถูกต้อง`);
    if (!title || title.length > 160) throw new ProductGalleryError(`กรุณาใส่คำบรรยายภาพรายการที่ ${index + 1} ไม่เกิน 160 ตัวอักษร`);
    if (!/^data:image\/(jpeg|png|webp);base64,/i.test(imageUrl) || imageUrl.length > 1_200_000) throw new ProductGalleryError(`รูปภาพรายการที่ ${index + 1} ต้องเป็น JPEG หรือ PNG และมีขนาดหลังย่อไม่เกินกำหนด`);
    totalSize += imageUrl.length;
    if (totalSize > 8_000_000) throw new ProductGalleryError("ขนาดรูปภาพรวมมากเกินไป กรุณาลดจำนวนรูปหรือย่อรูปเพิ่มเติม");
    ids.add(id);
    return { id, productSlug, title, imageUrl, published: value.published === true };
  });
}

async function ensureDatabase() {
  if (!databaseState.productGallerySchemaPromise) databaseState.productGallerySchemaPromise = (async () => {
    const sql = database();
    await sql.query(`CREATE TABLE IF NOT EXISTS sp_product_gallery_config (
      id SMALLINT PRIMARY KEY CHECK (id = 1), revision UUID NOT NULL,
      items JSONB NOT NULL, updated_at TIMESTAMPTZ
    )`);
    await sql.query("INSERT INTO sp_product_gallery_config (id, revision, items, updated_at) VALUES (1, $1, $2::jsonb, NULL) ON CONFLICT (id) DO NOTHING", [randomUUID(), JSON.stringify([])]);
  })().catch(error => { databaseState.productGallerySchemaPromise = undefined; throw error; });
  await databaseState.productGallerySchemaPromise;
}

async function readFileData(): Promise<GalleryData> {
  try {
    const data = JSON.parse(await readFile(filename(), "utf8")) as Partial<GalleryData>;
    if (!data || typeof data.revision !== "string" || !(typeof data.updatedAt === "string" || data.updatedAt === null)) throw new Error("Invalid product gallery storage");
    return { revision: data.revision, updatedAt: data.updatedAt, items: validateProductGallery(data.items) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { revision: "initial", updatedAt: null, items: [] };
    throw error;
  }
}

async function readDatabase(): Promise<GalleryData> {
  await ensureDatabase();
  const rows = await database().query("SELECT revision::text AS revision, items, updated_at FROM sp_product_gallery_config WHERE id = 1");
  const row = rows[0] as { revision: string; items: unknown; updated_at: unknown };
  return { revision: String(row.revision), updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : null, items: validateProductGallery(row.items) };
}

export async function getProductGallery() { return useDatabase() ? readDatabase() : readFileData(); }

export async function saveProductGallery(items: unknown, revision: string) {
  const nextItems = validateProductGallery(items);
  if (useDatabase()) {
    await ensureDatabase();
    const nextRevision = randomUUID();
    const result = await database().query("UPDATE sp_product_gallery_config SET revision = $1, items = $2::jsonb, updated_at = NOW() WHERE id = 1 AND revision::text = $3 RETURNING revision::text AS revision", [nextRevision, JSON.stringify(nextItems), revision]);
    if (!result[0]) throw new ProductGalleryError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดหน้าใหม่ก่อนบันทึก");
    return nextRevision;
  }
  await mkdir(directory(), { recursive: true });
  const lockfile = path.join(directory(), "product-gallery.lock");
  let lock;
  try { lock = await open(lockfile, "wx"); } catch { throw new ProductGalleryError("มีการบันทึกข้อมูลอื่นอยู่ กรุณาลองใหม่"); }
  const temporary = path.join(directory(), `product-gallery-${randomUUID()}.tmp`);
  try {
    const data = await readFileData();
    if (data.revision !== revision) throw new ProductGalleryError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดหน้าใหม่ก่อนบันทึก");
    const nextRevision = randomUUID();
    await writeFile(temporary, JSON.stringify({ revision: nextRevision, updatedAt: new Date().toISOString(), items: nextItems }), { mode: 0o600 });
    await rename(temporary, filename());
    return nextRevision;
  } finally { await unlink(temporary).catch(() => {}); await lock.close(); await unlink(lockfile); }
}
