import Link from "next/link";
import { requireAdmin } from "../../lib/admin-session";
import { getCatalog } from "../../lib/prices";
import { getNews } from "../../lib/news";
import { logout } from "./actions";
import NewsEditor from "./NewsEditor";
import PriceEditor from "./PriceEditor";

export default async function AdminPage() {
  requireAdmin();
  const [catalog, news] = await Promise.all([getCatalog(), getNews()]);
  return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold tracking-widest text-[#8b352d]">SUPARERK STEEL · ADMIN</p><h1 className="mt-2 text-3xl font-black">จัดการเว็บไซต์</h1></div><div className="flex items-center gap-5"><Link href="/news" className="underline">ดูข่าวสาร</Link><Link href="/products" className="underline">ดูหน้าร้าน</Link><form action={logout}><button className="rounded border px-4 py-2">ออกจากระบบ</button></form></div></div>
    <p className="mt-4 text-zinc-600">จัดการข่าวสารที่จะแสดงบนเว็บไซต์ และแก้ราคาสินค้าตามขนาด</p>
    <NewsEditor items={news.items} revision={news.revision} />
    {news.updatedAt && <p className="mt-4 text-sm text-zinc-500">ข่าวสารบันทึกล่าสุด: {new Date(news.updatedAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</p>}
    <section className="mt-14 border-t pt-10">
      <h2 className="text-2xl font-black">จัดการราคาเหล็ก</h2>
      <p className="mt-2 text-zinc-600">แก้ราคาตามขนาด แล้วกดบันทึกในสินค้านั้น ราคาจะใช้ในหน้าแรก หน้ารวมสินค้า และหน้ารายละเอียดสินค้า</p>
    {catalog.unpricedCount > 0 && <p className="mt-5 rounded border border-amber-300 bg-amber-50 p-4 text-sm">ยังมี {catalog.unpricedCount} สินค้าที่ใช้ราคาตัวอย่างจากเว็บเดิม กรุณาตรวจสอบและแก้ไขทุกรายการก่อนใช้งานจริง</p>}
    {catalog.updatedAt && <p className="mt-4 text-sm text-zinc-500">บันทึกล่าสุด: {new Date(catalog.updatedAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</p>}
    <PriceEditor products={catalog.products} revision={catalog.revision} />
    </section>
  </main>;
}
