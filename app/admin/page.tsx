import { requireAdmin } from "../../lib/admin-session";
import { getCatalog } from "../../lib/prices";
import AdminDashboard from "./AdminDashboard";
import DeleteQuoteButton from "./DeleteQuoteButton";
import PriceEditor from "./PriceEditor";
import { getQuoteRequests } from "../../lib/quote-requests";
import { getHomeProjects } from "../../lib/home-projects";
import HomeProjectEditor from "./HomeProjectEditor";
import { getExecutives } from "../../lib/executives";
import ExecutiveEditor from "./ExecutiveEditor";
import { getProductGallery } from "../../lib/product-gallery";
import ProductGalleryEditor from "./ProductGalleryEditor";

export default async function AdminPage() {
  requireAdmin();
  const [catalog, quoteRequests, projects, executives, gallery] = await Promise.all([getCatalog(), getQuoteRequests(), getHomeProjects(), getExecutives(), getProductGallery()]);
  return <AdminDashboard
    counts={{
      prices: catalog.products.length,
      quotes: quoteRequests.length,
      "product-gallery": gallery.items.length,
      "home-projects": projects.items.length,
      executives: executives.items.length,
    }}
    panels={{
      prices: <section>
        <p className="text-sm leading-6 text-zinc-600">ราคาที่บันทึกจะแสดงบนหน้าร้านตามขนาด เว้นช่องว่างเพื่อแสดง “สอบถามราคา”</p>
        {catalog.updatedAt && <p className="mt-2 text-sm text-zinc-500">บันทึกล่าสุด {new Date(catalog.updatedAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</p>}
        <PriceEditor products={catalog.products} revision={catalog.revision} />
      </section>,
      quotes: <section id="quote-requests">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold tracking-widest text-[#8b352d]">QUOTATION REQUESTS</p><h2 className="mt-1 text-2xl font-black">คำขอใบเสนอราคา</h2></div><p className="text-sm text-zinc-500">ล่าสุด {quoteRequests.length} รายการ</p></div>
      {!quoteRequests.length ? <p className="mt-5 rounded-lg border bg-white p-6 text-zinc-500">ยังไม่มีคำขอใบเสนอราคา</p> : <div className="mt-5 grid gap-4 md:grid-cols-2">{quoteRequests.map(request => <article key={request.id} className="rounded-lg border bg-white p-5">
        <div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{request.name}</h3><a className="mt-1 inline-block text-[#8b352d] underline" href={`tel:${request.phone.replace(/[^+\d]/g, "")}`}>{request.phone}</a></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">รายการใหม่</span></div>
        <p className="mt-4 text-sm font-bold">สินค้าที่สนใจ</p><p className="mt-1 text-zinc-700">{request.product}</p>
        {request.details && <><p className="mt-4 text-sm font-bold">รายละเอียด</p><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-600">{request.details}</p></>}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3 border-t pt-3">
          <time className="text-xs text-zinc-500" dateTime={request.createdAt}>{new Date(request.createdAt).toLocaleString("th-TH", { timeZone: "Asia/Bangkok" })}</time>
          <DeleteQuoteButton id={request.id} />
        </div>
      </article>)}</div>}
    </section>,
      "product-gallery": <ProductGalleryEditor products={catalog.products} items={gallery.items} revision={gallery.revision} />,
      "home-projects": <HomeProjectEditor items={projects.items} revision={projects.revision} />,
      executives: <ExecutiveEditor items={executives.items} revision={executives.revision} />,
    }}
  />;
}
