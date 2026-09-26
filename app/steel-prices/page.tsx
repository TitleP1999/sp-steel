import Image from "next/image";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import { categories } from "../../data/products";
import { getCatalog } from "../../lib/prices";

export const dynamic = "force-dynamic";

const featuredSlugs = ["deformed-bar", "square-tube", "c-channel", "galvanized-c-channel", "black-steel-plate", "galvanized-square-tube"];

function formatUpdatedAt(value: string | null) {
  if (!value) return "ยังไม่มีการบันทึกราคาใหม่";
  return new Date(value).toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default async function SteelPricesPage() {
  const { products, updatedAt } = await getCatalog();
  const featured = featuredSlugs.map(slug => products.find(product => product.slug === slug)).filter((product): product is NonNullable<typeof product> => Boolean(product));
  return <main>
    <PageHero eyebrow="DAILY STEEL PRICE" title="ราคาเหล็กวันนี้" desc="ตรวจสอบราคาเหล็กแต่ละประเภทและทุกขนาดจาก SUPARERK STEEL" />
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mb-10 grid gap-5 border bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div><p className="text-xs font-black tracking-[.18em] text-[#8b352d]">PRICE UPDATE</p><h2 className="mt-2 text-2xl font-black">ตารางราคาเหล็กรวม</h2><p className="mt-2 text-sm text-zinc-500">อัปเดตล่าสุด: {formatUpdatedAt(updatedAt)}</p></div>
        <a href="https://lin.ee/Yurg5Hy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#8b352d] px-5 py-3 text-sm font-black text-white hover:bg-[#742c26]"><Image src="/line-logo.svg" alt="" width={22} height={22} />ขอใบเสนอราคาทางไลน์</a>
      </div>

      <section className="mb-14 overflow-hidden bg-[#202124] p-4 text-white sm:p-7 lg:p-9">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black tracking-[.18em] text-[#d5685d]">STEEL MARKET BOARD</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">สรุปราคาเหล็กวันนี้</h2></div><div className="text-right text-sm text-zinc-400"><p>ราคาเริ่มต้นจากทุกขนาด</p><p>เปรียบเทียบกับราคาก่อนแก้ไขล่าสุด</p></div></div>
        <div className="hidden grid-cols-[1fr_180px_180px] px-5 pb-3 text-sm font-bold text-zinc-400 md:grid"><span>รายการ</span><span className="text-right">ราคาเริ่มต้น</span><span className="text-right">% เปลี่ยนแปลง</span></div>
        <div className="space-y-3">{featured.map(product => {
          const change = product.changePercent;
          const direction = change === null || Math.abs(change) < 0.005 ? "same" : change > 0 ? "up" : "down";
          return <Link key={product.slug} href={`/products/${product.slug}`} className="grid items-center gap-4 rounded-lg bg-white p-3 text-[#202124] transition hover:-translate-y-0.5 hover:shadow-xl md:grid-cols-[1fr_180px_180px]">
            <span className="flex min-w-0 items-center gap-4"><span className="relative h-16 w-20 shrink-0 overflow-hidden rounded bg-zinc-100 sm:h-20 sm:w-28"><Image src={product.image} alt="" fill sizes="112px" className="object-cover" /></span><span><strong className="block text-base sm:text-xl">{product.name}</strong><small className="mt-1 block text-zinc-500">{product.options.length} ขนาด</small></span></span>
            <span className="flex items-baseline justify-between gap-3 md:block md:text-right"><small className="font-bold text-zinc-500 md:hidden">ราคาเริ่มต้น</small><strong className="text-2xl font-black">฿{product.price.toLocaleString("th-TH", { maximumFractionDigits: 2 })}</strong></span>
            <span className="flex items-center justify-between gap-3 md:justify-end"><small className="font-bold text-zinc-500 md:hidden">เปลี่ยนแปลง</small><strong className={`rounded-full px-3 py-1.5 text-base font-black ${direction === "up" ? "bg-red-100 text-red-700" : direction === "down" ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{change === null ? "—" : `${direction === "up" ? "▲ " : direction === "down" ? "▼ " : ""}${Math.abs(change).toFixed(2)}%`}</strong></span>
          </Link>;
        })}</div>
        <p className="mt-5 text-xs leading-5 text-zinc-400">เปอร์เซ็นต์จะแสดงหลังมีการแก้และบันทึกราคาสินค้านั้นในแอดมินอย่างน้อยหนึ่งครั้ง หากไม่มีราคาก่อนหน้า ระบบจะแสดง —</p>
      </section>

      <div className="space-y-14">{categories.map(category => {
        const categoryProducts = products.filter(product => product.category === category);
        return <section key={category}>
          <div className="mb-6 flex items-center gap-4"><h2 className="text-2xl font-black sm:text-3xl">{category}</h2><div className="h-px flex-1 bg-zinc-200" /></div>
          <div className="space-y-6">{categoryProducts.map(product => <article key={product.slug} className="overflow-hidden border bg-white">
            <div className="grid md:grid-cols-[220px_1fr]">
              <Link href={`/products/${product.slug}`} className="relative block min-h-48 overflow-hidden bg-zinc-200 md:min-h-full"><Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 220px" className="object-cover transition duration-500 hover:scale-105" /></Link>
              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-5 sm:px-6"><div><p className="text-xs font-bold tracking-widest text-zinc-400">{product.code}</p><h3 className="mt-1 text-xl font-black">{product.name}</h3></div><Link href={`/products/${product.slug}`} className="text-sm font-bold text-[#8b352d] underline">ดูรายละเอียดสินค้า →</Link></div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-zinc-100 text-xs text-zinc-500"><tr><th className="px-5 py-3 font-bold sm:px-6">ขนาด</th><th className="w-40 px-5 py-3 text-right font-bold sm:px-6">ราคา</th><th className="w-44 px-5 py-3 text-right font-bold sm:px-6">สอบถาม / สั่งซื้อ</th></tr></thead>
                    <tbody>{product.options.map(option => <tr key={option.size} className="border-t"><td className="px-5 py-4 sm:px-6">{option.size}</td><td className="px-5 py-4 text-right text-lg font-black text-[#8b352d] sm:px-6">฿{option.price.toLocaleString("th-TH", { maximumFractionDigits: 2 })}</td><td className="px-5 py-4 text-right sm:px-6"><a href="https://lin.ee/Yurg5Hy" target="_blank" rel="noopener noreferrer" className="font-bold text-[#8b352d] underline">ขอใบเสนอราคา</a></td></tr>)}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </article>)}</div>
        </section>;
      })}</div>

      <div className="mt-12 border border-amber-300 bg-amber-50 p-5 text-sm leading-7 text-amber-950 sm:p-6"><p className="font-black">หมายเหตุเกี่ยวกับราคา</p><p className="mt-1">ราคาสินค้าอาจเปลี่ยนแปลงตามต้นทุน ปริมาณ สถานที่จัดส่ง และเงื่อนไขการสั่งซื้อ กรุณาติดต่อฝ่ายขายเพื่อยืนยันราคา สต๊อกสินค้า ภาษีมูลค่าเพิ่ม และค่าจัดส่งก่อนสั่งซื้อทุกครั้ง</p></div>
    </section>
  </main>;
}
