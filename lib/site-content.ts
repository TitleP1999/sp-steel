import { mkdir, open, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { cache } from "react";
import { defaultSiteContent, siteImageMaxLength, type SiteContent } from "../data/site-content";

type SiteContentData = { revision: string; content: SiteContent };
export class SiteContentError extends Error {}

const directory = () => process.env.SITE_CONTENT_DATA_DIR || path.join(process.cwd(), "storage");
const filename = () => path.join(directory(), "site-content.json");
const useDatabase = () => Boolean(process.env.DATABASE_URL) && !process.env.SITE_CONTENT_DATA_DIR;
let schemaPromise: Promise<void> | undefined;

function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return neon(process.env.DATABASE_URL);
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new SiteContentError("รูปแบบข้อมูลเว็บไซต์ไม่ถูกต้อง");
  return value as Record<string, unknown>;
}

function text(value: unknown, label: string, max = 200) {
  const clean = typeof value === "string" ? value.trim() : "";
  if (!clean || clean.length > max) throw new SiteContentError(`กรุณาระบุ${label} ไม่เกิน ${max} ตัวอักษร`);
  return clean;
}

function httpsUrl(value: unknown, label: string, mapEmbed = false) {
  const clean = text(value, label, 2000);
  try {
    const url = new URL(clean);
    if (url.protocol === "https:" && !url.username && !url.password &&
      (!mapEmbed || (["www.google.com", "maps.google.com"].includes(url.hostname) &&
        (url.pathname === "/maps/embed" || (url.pathname === "/maps" && url.searchParams.get("output") === "embed"))))) {
      return url.href;
    }
  } catch {}
  throw new SiteContentError(`กรุณาระบุ${label}เป็นลิงก์ HTTPS ที่ถูกต้อง`);
}

function image(value: unknown, label: string) {
  const clean = text(value, label, siteImageMaxLength);
  if (/^\/(?!\/)[\w./-]+$/.test(clean) || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(clean)) return clean;
  throw new SiteContentError(`กรุณาอัปโหลด${label}เป็น JPEG หรือ PNG`);
}

function phone(value: unknown, label: string) {
  const clean = text(value, label, 30);
  if (/^\+?[\d ()-]+$/.test(clean) && /^\d{8,15}$/.test(clean.replace(/\D/g, ""))) return clean;
  throw new SiteContentError(`กรุณาระบุ${label}ที่ติดต่อได้`);
}

export function validateSiteContent(input: unknown): SiteContent {
  const value = record(input);
  const home = record(value.home);
  const contact = record(value.contact);
  const branches = value.branches;
  if (!Array.isArray(branches) || branches.length !== defaultSiteContent.branches.length) {
    throw new SiteContentError("ข้อมูลสาขาไม่ครบ");
  }
  return {
    home: {
      heading: text(home.heading, "หัวข้อแบนเนอร์", 50),
      subheading: text(home.subheading, "หัวข้อรอง", 70),
      description: text(home.description, "ข้อความแบนเนอร์", 500),
      image: image(home.image, "รูปพื้นหลังหน้าแรก"),
      productButton: text(home.productButton, "ข้อความปุ่มสินค้า", 60),
      quoteButton: text(home.quoteButton, "ข้อความปุ่ม LINE", 60),
    },
    contact: {
      title: text(contact.title, "หัวข้อหน้าติดต่อ", 100),
      description: text(contact.description, "คำอธิบายหน้าติดต่อ", 500),
      image: image(contact.image, "รูปพื้นหลังหน้าติดต่อ"),
      phone: phone(contact.phone, "เบอร์โทรบริษัท"),
      line: httpsUrl(contact.line, "ลิงก์ LINE"),
      social: httpsUrl(contact.social, "ลิงก์รวมช่องทางติดต่อ"),
    },
    branches: defaultSiteContent.branches.map((original, index) => {
      const branch = record(branches[index]);
      if (branch.id !== original.id) throw new SiteContentError("รหัสสาขาไม่ถูกต้อง");
      return {
        id: original.id,
        name: text(branch.name, "ชื่อสาขา", 120),
        shortName: text(branch.shortName, "ชื่อสาขาแบบสั้น", 50),
        en: text(branch.en, "ชื่อสาขาภาษาอังกฤษ", 100),
        address: text(branch.address, "ที่อยู่สาขา", 500),
        phone: phone(branch.phone, "เบอร์หลัก"),
        backupPhone: phone(branch.backupPhone, "เบอร์สำรอง"),
        facebook: httpsUrl(branch.facebook, "ลิงก์ Facebook"),
        map: httpsUrl(branch.map, "ลิงก์เปิดเส้นทาง"),
        embed: httpsUrl(branch.embed, "ลิงก์ฝัง Google Maps", true),
        image: image(branch.image, "รูปหน้าร้าน"),
        logo: image(branch.logo, "โลโก้สาขา"),
        warehouseImage: image(branch.warehouseImage, "รูปโกดัง"),
      };
    }),
  };
}

async function ensureSchema() {
  if (!schemaPromise) schemaPromise = database().query(`
    CREATE TABLE IF NOT EXISTS sp_site_content_config (
      id SMALLINT PRIMARY KEY CHECK (id = 1),
      revision UUID NOT NULL,
      content JSONB NOT NULL
    )
  `).then(() => {}).catch(error => {
    schemaPromise = undefined;
    throw error;
  });
  await schemaPromise;
}

const initial = (): SiteContentData => ({ revision: "initial", content: defaultSiteContent });

async function readFileData(): Promise<SiteContentData> {
  let raw: string;
  try { raw = await readFile(filename(), "utf8"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return initial();
    throw error;
  }
  const data = record(JSON.parse(raw));
  if (typeof data.revision !== "string") throw new Error("Invalid site content revision");
  return { revision: data.revision, content: validateSiteContent(data.content) };
}

export const getSiteContent = cache(async (): Promise<SiteContentData> => {
  if (!useDatabase()) return readFileData();
  await ensureSchema();
  const [row] = await database().query("SELECT revision::text, content FROM sp_site_content_config WHERE id = 1");
  return row ? { revision: String(row.revision), content: validateSiteContent(row.content) } : initial();
});

export async function saveSiteContent(input: unknown, revision: string) {
  const content = validateSiteContent(input);
  const nextRevision = randomUUID();
  const conflict = () => new SiteContentError("ข้อมูลถูกแก้จากหน้าต่างอื่น กรุณาโหลดข้อมูลล่าสุดก่อนบันทึก");
  if (useDatabase()) {
    await ensureSchema();
    const sql = database();
    const rows = revision === "initial"
      ? await sql.query("INSERT INTO sp_site_content_config VALUES (1, $1, $2::jsonb) ON CONFLICT (id) DO NOTHING RETURNING id", [nextRevision, JSON.stringify(content)])
      : await sql.query("UPDATE sp_site_content_config SET revision = $1, content = $2::jsonb WHERE id = 1 AND revision::text = $3 RETURNING id", [nextRevision, JSON.stringify(content), revision]);
    if (!rows.length) throw conflict();
    return nextRevision;
  }
  if (process.env.VERCEL && !process.env.SITE_CONTENT_DATA_DIR) throw new SiteContentError("กรุณาตั้งค่าฐานข้อมูลก่อนบันทึกข้อมูลเว็บไซต์");
  await mkdir(directory(), { recursive: true });
  const lockfile = path.join(directory(), "site-content.lock");
  let lock;
  try { lock = await open(lockfile, "wx"); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") throw new SiteContentError("มีการบันทึกข้อมูลเว็บไซต์อยู่ กรุณาลองอีกครั้ง");
    throw error;
  }
  const temporary = path.join(directory(), `site-content-${nextRevision}.tmp`);
  try {
    if ((await readFileData()).revision !== revision) throw conflict();
    await writeFile(temporary, JSON.stringify({ revision: nextRevision, content }), { mode: 0o600 });
    await rename(temporary, filename());
    return nextRevision;
  } finally {
    await unlink(temporary).catch(() => {});
    await lock.close();
    await unlink(lockfile);
  }
}
