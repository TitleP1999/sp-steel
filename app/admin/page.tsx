import Link from "next/link";
import { requireAdmin } from "../../lib/admin-session";
import { getCatalog } from "../../lib/prices";
import { logout } from "./actions";
import PriceEditor from "./PriceEditor";

export default async function AdminPage() {
  requireAdmin();
  const catalog = await getCatalog();
  return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold tracking-widest text-[#8b352d]">SUPARERK STEEL · ADMIN</p><h1 className="mt-2 text-3xl font-black">จัดการราคาเหล็ก</h1></div><div className="flex items-center gap-5"><Link href="/products" className="underline">ดูหน้าร้าน</Link><form action={logout}><button className="rounded border px-4 py-2">ออกจากระบบ</button></form></div></div>
    <p className="mt-4 text-zinc-600">แก้ราคาตามขนาด แล้วกดบันทึกในสินค้านั้น ราคาจะใช้ในหน้าแรก หน้ารวมสินค้า และหน้ารายละเอียดสินค้า</p>
    {catalog.unpricedCount > 0 && <p className="mt-5 rounded border border-amber-300 bg-amber-50 p-4 text-sm">ยังมี {catalog.unpricedCount} สินค้าที่ใช้ราคาตัวอย่างจากเว็บเดิม กรุณาตรวจสอบและแก้ไขทุกรายการก่อนใช้งานจริง</p>}
    {catalog.updatedAt && <p className="mt-4 text-sm text-zinc-500">บันทึกล่าสุด: {new Date(catalog.updatedAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</p>}
    <PriceEditor products={catalog.products} revision={catalog.revision} />
  </main>;
}
