import Link from "next/link";
import { requireAdmin } from "../../lib/admin-session";
import { getCatalog } from "../../lib/prices";
import { getNews } from "../../lib/news";
import { logout } from "./actions";
import NewsEditor from "./NewsEditor";
import PriceEditor from "./PriceEditor";
import { getQuoteRequests } from "../../lib/quote-requests";
import { getProjects } from "../../lib/projects";
import ProjectEditor from "./ProjectEditor";

export default async function AdminPage() {
  requireAdmin();
  const [catalog, news, projects, quoteRequests] = await Promise.all([getCatalog(), getNews(), getProjects(), getQuoteRequests()]);
  return <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-bold tracking-widest text-[#8b352d]">SUPARERK STEEL · ADMIN</p><h1 className="mt-2 text-3xl font-black">จัดการเว็บไซต์</h1></div><div className="flex flex-wrap items-center gap-5"><a href="#quote-requests" className="underline">คำขอใบเสนอราคา</a><Link href="/news" className="underline">ดูข่าวสาร</Link><Link href="/projects" className="underline">ดูผลงาน</Link><Link href="/products" className="underline">ดูหน้าร้าน</Link><form action={logout}><button className="rounded border px-4 py-2">ออกจากระบบ</button></form></div></div>
    <p className="mt-4 text-zinc-600">จัดการข่าวสารที่จะแสดงบนเว็บไซต์ และแก้ราคาสินค้าตามขนาด</p>
    <NewsEditor items={news.items} revision={news.revision} />
    {news.updatedAt && <p className="mt-4 text-sm text-zinc-500">ข่าวสารบันทึกล่าสุด: {new Date(news.updatedAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</p>}
    <ProjectEditor items={projects.items} revision={projects.revision} />
    {projects.updatedAt && <p className="mt-4 text-sm text-zinc-500">ผลงานบันทึกล่าสุด: {new Date(projects.updatedAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</p>}
    <section className="mt-14 scroll-mt-24 border-t pt-10" id="quote-requests">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold tracking-widest text-[#8b352d]">QUOTATION REQUESTS</p><h2 className="mt-1 text-2xl font-black">คำขอใบเสนอราคา</h2></div><p className="text-sm text-zinc-500">ล่าสุด {quoteRequests.length} รายการ</p></div>
      {!quoteRequests.length ? <p className="mt-5 rounded-lg border bg-white p-6 text-zinc-500">ยังไม่มีคำขอใบเสนอราคา</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{quoteRequests.map(request => <article key={request.id} className="rounded-lg border bg-white p-5">
        <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{request.name}</h3><a className="mt-1 inline-block text-[#8b352d] underline" href={`tel:${request.phone.replace(/[^+\d]/g, "")}`}>{request.phone}</a></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">รายการใหม่</span></div>
        <p className="mt-4 text-sm font-bold">สินค้าที่สนใจ</p><p className="mt-1 text-zinc-700">{request.product}</p>
        {request.details && <><p className="mt-4 text-sm font-bold">รายละเอียด</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{request.details}</p></>}
        <time className="mt-4 block border-t pt-3 text-xs text-zinc-500" dateTime={request.createdAt}>{new Date(request.createdAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</time>
      </article>)}</div>}
    </section>
    <section className="mt-14 border-t pt-10">
      <h2 className="text-2xl font-black">จัดการราคาเหล็ก</h2>
      <p className="mt-2 text-zinc-600">แก้ราคาตามขนาด แล้วกดบันทึกในสินค้านั้น ราคาจะใช้ในหน้าแรก หน้ารวมสินค้า และหน้ารายละเอียดสินค้า</p>
      {catalog.unpricedCount > 0 && <p className="mt-5 rounded border border-amber-300 bg-amber-50 p-4 text-sm">ยังมี {catalog.unpricedCount} สินค้าที่ใช้ราคาตัวอย่างจากเว็บเดิม กรุณาตรวจสอบและแก้ไขทุกรายการก่อนใช้งานจริง</p>}
      {catalog.updatedAt && <p className="mt-4 text-sm text-zinc-500">บันทึกล่าสุด: {new Date(catalog.updatedAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</p>}
      <div className="my-10 border-t" />
      <PriceEditor products={catalog.products} revision={catalog.revision} />
    </section>
  </main>;
}
