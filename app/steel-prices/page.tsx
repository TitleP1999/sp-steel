import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { categories } from "../../data/products";
import { getCatalog } from "../../lib/prices";
import { getProductSpecifications } from "../../lib/product-specifications";
import { QuoteProductButton } from "../../components/QuoteSelection";

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
    <section className="overflow-hidden border-y border-black/10 bg-zinc-100">
      <div className="mx-auto grid max-w-[1600px] lg:min-h-[720px] lg:grid-cols-[minmax(340px,.72fr)_minmax(0,1.55fr)]">
        <div className="relative flex min-h-[620px] flex-col overflow-hidden bg-[#f6f4f1] px-6 pt-12 sm:px-10 lg:min-h-0 lg:px-12 lg:pt-16 xl:px-16">
          <Image src="/steel-price-board-hero.png" alt="เหล็กก่อสร้างหลายประเภท" fill priority sizes="(max-width: 1024px) 100vw, 38vw" className="scale-110 object-cover object-[center_58%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f6f4f1] via-[#f6f4f1]/75 to-[#f6f4f1]/5" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f6f4f1]/60 via-transparent to-transparent" />
          <div className="relative z-10"><p className="text-xs font-black tracking-[.2em] text-[#8b352d]">DAILY STEEL PRICE</p><h1 className="mt-3 text-4xl font-black leading-tight text-[#17181a] sm:text-5xl">ราคาเหล็กวันนี้</h1><p className="mt-3 text-xl font-black text-[#8b352d]">ตารางอัปเดตราคารวม</p><p className="mt-3 text-sm leading-6 text-zinc-600">อัปเดตล่าสุด<br/><strong className="text-zinc-900">{formatUpdatedAt(updatedAt)}</strong></p></div>
        </div>

        <div className="bg-[#8b352d] px-4 py-9 text-white sm:px-7 lg:px-10 lg:py-12 xl:px-14">
          <div className="mb-7"><p className="text-xs font-black tracking-[.18em] text-[#efb4ae]">STEEL MARKET BOARD</p><h2 className="mt-2 text-2xl font-black sm:text-3xl">สรุปราคาเหล็กวันนี้</h2></div>
          <div className="hidden grid-cols-[1fr_220px] px-5 pb-3 text-sm font-bold text-[#efc8c4] md:grid"><span>รายการ</span><span className="text-right">ราคา</span></div>
          <div className="space-y-3">{featured.map(product => {
          return <Link key={product.slug} href={`/products/${product.slug}`} className="grid items-center gap-4 rounded-xl bg-[#f7f8fa] p-3 text-[#202124] transition hover:-translate-y-0.5 hover:shadow-2xl md:grid-cols-[1fr_220px]">
            <span className="flex min-w-0 items-center gap-4"><span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-white sm:h-[74px] sm:w-24"><Image src={product.image} alt="" fill sizes="96px" className="object-cover" /></span><span><strong className="block text-base sm:text-lg">{product.name}</strong><small className="mt-1 block text-zinc-500">{product.options.length} ขนาด</small></span></span>
            <span className="flex items-baseline justify-between gap-3 md:block md:text-right"><small className="font-bold text-zinc-500 md:hidden">ราคา</small><strong className="text-lg font-black text-[#8b352d]">สอบถามราคา</strong></span>
          </Link>;
        })}</div>
          <p className="mt-5 text-xs leading-5 text-[#efc8c4]">กรุณาติดต่อฝ่ายขายเพื่อสอบถามราคาปัจจุบันของแต่ละขนาด</p>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="space-y-14">{categories.map(category => {
        const categoryProducts = products.filter(product => product.category === category);
        return <section key={category}>
          <div className="mb-6 flex items-center gap-4"><h2 className="text-2xl font-black sm:text-3xl">{category}</h2><div className="h-px flex-1 bg-zinc-200" /></div>
          <div className="space-y-6">{categoryProducts.map(product => <article key={product.slug} className="overflow-hidden border bg-white">
            <div className="grid md:grid-cols-[220px_1fr]">
              <Link href={`/products/${product.slug}`} className={`relative block min-h-48 overflow-hidden !rounded-r-none md:min-h-full ${product.slug === "tiscon-superlinks" ? "bg-white" : "bg-zinc-200"}`}><Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 100vw, 220px" className={product.slug === "tiscon-superlinks" ? "object-contain p-6 sm:p-8" : "scale-110 object-cover object-right transition duration-500 hover:scale-[1.15]"} /></Link>
              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#742820] bg-[#8b352d] px-5 py-5 text-white sm:px-6"><div><p className="text-xs font-bold tracking-widest text-white/70">{product.code}</p><h3 className="mt-1 text-xl font-black text-white">{product.name}</h3></div><Link href={`/products/${product.slug}`} className="text-sm font-bold text-white underline">ดูรายละเอียดสินค้า →</Link></div>
                <div className="divide-y md:hidden">{product.options.map((option,index)=>{const spec=getProductSpecifications(product)[index];return <details key={option.size} className="group bg-white"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 marker:hidden"><span className="font-bold leading-6 text-zinc-800">{option.size}</span><ChevronDown size={21} className="shrink-0 text-[#8b352d] transition group-open:rotate-180"/></summary><div className="border-t bg-zinc-50 px-5 py-4"><div className="grid grid-cols-2 gap-3"><div><p className="text-xs font-bold text-zinc-500">น้ำหนัก</p><p className="mt-1 text-sm font-black text-zinc-800">{spec?.saleWeight?`${spec.saleWeight.toLocaleString("th-TH",{minimumFractionDigits:2,maximumFractionDigits:2})} กก./${spec.saleUnit}`:spec?.weight??"สอบถามฝ่ายขาย"}</p></div><div className="text-right"><p className="text-xs font-bold text-zinc-500">ราคา/{product.slug === "tiscon-superlinks" ? "กก." : spec?.saleUnit ?? "หน่วย"}</p><p className="mt-1 text-sm font-black text-[#8b352d]">สอบถามราคา</p></div></div><QuoteProductButton product={product} size={option.size} className="mt-4 w-full justify-center rounded-lg px-3 py-2 text-xs"/></div></details>})}</div>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="bg-zinc-100 text-xs text-zinc-500"><tr><th className="px-5 py-3 font-bold sm:px-6">ขนาด</th><th className="w-40 px-5 py-3 text-right font-bold sm:px-6">ราคา/{product.slug === "tiscon-superlinks" ? "กก." : getProductSpecifications(product)[0]?.saleUnit ?? "หน่วย"}</th><th className="w-44 px-5 py-3 text-right font-bold sm:px-6">รายการขอราคา</th></tr></thead>
                    <tbody>{product.options.map(option => <tr key={option.size} className="border-t"><td className="px-5 py-4 sm:px-6">{option.size}</td><td className="px-5 py-4 text-right text-base font-black text-[#8b352d] sm:px-6">สอบถามราคา</td><td className="px-5 py-4 text-right sm:px-6"><QuoteProductButton product={product} size={option.size} className="mt-0 rounded-lg px-3 py-2 text-xs"/></td></tr>)}</tbody>
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
