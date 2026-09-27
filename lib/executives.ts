import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export type ExecutiveItem = { id: string; name: string; position: string; imageUrl: string; published: boolean };
type ExecutiveData = { revision: string; updatedAt: string | null; items: ExecutiveItem[] };
export class ExecutiveError extends Error {}

const directory = () => process.env.EXECUTIVE_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "executives.json");
const useDatabase = () => Boolean(process.env.DATABASE_URL) && !process.env.EXECUTIVE_DATA_DIR;
const databaseState = globalThis as typeof globalThis & { executiveSchemaPromise?: Promise<void> };
function database() { if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured"); return neon(process.env.DATABASE_URL); }
function isSafeImage(value: string) { return (value.startsWith("/") && !value.startsWith("//")) || /^https?:\/\//i.test(value); }

export function validateExecutives(items: unknown): ExecutiveItem[] {
  if (!Array.isArray(items) || items.length > 50) throw new ExecutiveError("รายชื่อผู้บริหารต้องไม่เกิน 50 รายการ");
  const ids = new Set<string>();
  return items.map((item, index) => {
    if (!item || typeof item !== "object") throw new ExecutiveError(`ข้อมูลผู้บริหารรายการที่ ${index + 1} ไม่ถูกต้อง`);
    const value = item as Record<string, unknown>;
    const id = typeof value.id === "string" ? value.id.trim() : "";
    const name = typeof value.name === "string" ? value.name.trim() : "";
    const position = typeof value.position === "string" ? value.position.trim() : "";
    const imageUrl = typeof value.imageUrl === "string" ? value.imageUrl.trim() : "";
    if (!id || id.length > 80 || !/^[A-Za-z0-9_-]+$/.test(id) || ids.has(id)) throw new ExecutiveError(`รหัสผู้บริหารรายการที่ ${index + 1} ไม่ถูกต้องหรือซ้ำกัน`);
    if (!name || name.length > 160) throw new ExecutiveError(`กรุณาระบุชื่อผู้บริหารรายการที่ ${index + 1} ไม่เกิน 160 ตัวอักษร`);
    if (!position || position.length > 300) throw new ExecutiveError(`กรุณาระบุตำแหน่งรายการที่ ${index + 1} ไม่เกิน 300 ตัวอักษร`);
    if (!imageUrl || imageUrl.length > 1000 || !isSafeImage(imageUrl)) throw new ExecutiveError(`กรุณาระบุรูปผู้บริหารรายการที่ ${index + 1} ให้ถูกต้อง`);
    ids.add(id);
    return { id, name, position, imageUrl, published: value.published === true };
  });
}

async function ensureDatabase() {
  if (!databaseState.executiveSchemaPromise) databaseState.executiveSchemaPromise = (async () => {
    const sql = database();
    await sql.query(`CREATE TABLE IF NOT EXISTS sp_executives_config (id SMALLINT PRIMARY KEY CHECK (id = 1), revision UUID NOT NULL, items JSONB NOT NULL, updated_at TIMESTAMPTZ)`);
    await sql.query("INSERT INTO sp_executives_config (id, revision, items, updated_at) VALUES (1, $1, $2::jsonb, NULL) ON CONFLICT (id) DO NOTHING", [randomUUID(), JSON.stringify([])]);
  })().catch(error => { databaseState.executiveSchemaPromise = undefined; throw error; });
  await databaseState.executiveSchemaPromise;
}

async function readFileData(): Promise<ExecutiveData> {
  let raw: string;
  try { raw = await readFile(filename(), "utf8"); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return { revision: "initial", updatedAt: null, items: [] }; throw error; }
  const data = JSON.parse(raw) as Partial<ExecutiveData>;
  if (!data || typeof data.revision !== "string" || !(typeof data.updatedAt === "string" || data.updatedAt === null)) throw new Error("Invalid executive storage");
  return { revision: data.revision, updatedAt: data.updatedAt, items: validateExecutives(data.items) };
}

async function readDatabase(): Promise<ExecutiveData> {
  await ensureDatabase();
  const rows = await database().query("SELECT revision::text AS revision, items, updated_at FROM sp_executives_config WHERE id = 1");
  const row = rows[0] as { revision: string; items: unknown; updated_at: unknown } | undefined;
  if (!row) throw new Error("Executive database state is missing");
  return { revision: String(row.revision), updatedAt: row.updated_at ? new Date(String(row.updated_at)).toISOString() : null, items: validateExecutives(row.items) };
}

export async function getExecutives() { return useDatabase() ? readDatabase() : readFileData(); }
export async function saveExecutives(items: unknown, revision: string) {
  const nextItems = validateExecutives(items);
  if (useDatabase()) {
    await ensureDatabase(); const nextRevision = randomUUID();
    const result = await database().query("UPDATE sp_executives_config SET revision = $1, items = $2::jsonb, updated_at = NOW() WHERE id = 1 AND revision::text = $3 RETURNING revision::text AS revision", [nextRevision, JSON.stringify(nextItems), revision]);
    if (!result[0]) throw new ExecutiveError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    return nextRevision;
  }
  await mkdir(directory(), { recursive: true }); const lockfile = path.join(directory(), "executives.lock"); let lock;
  try { lock = await open(lockfile, "wx"); } catch (error) { if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new ExecutiveError("มีการบันทึกข้อมูลผู้บริหารอื่นอยู่ กรุณาลองอีกครั้ง"); throw error; }
  const temporary = path.join(directory(), `executives-${randomUUID()}.tmp`);
  try {
    const data = await readFileData();
    if (data.revision !== revision) throw new ExecutiveError("ข้อมูลถูกแก้ไขจากหน้าต่างอื่นแล้ว กรุณาโหลดข้อมูลล่าสุดก่อนแก้ไขอีกครั้ง");
    data.items = nextItems; data.revision = randomUUID(); data.updatedAt = new Date().toISOString();
    await writeFile(temporary, JSON.stringify(data, null, 2), { mode: 0o600 }); await rename(temporary, filename()); return data.revision;
  } finally { await unlink(temporary).catch(() => {}); await lock.close(); await unlink(lockfile); }
}
