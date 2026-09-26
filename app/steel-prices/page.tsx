import Image from "next/image";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import { categories } from "../../data/products";
import { getCatalog } from "../../lib/prices";

export const dynamic = "force-dynamic";

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
  return <main>
    <PageHero eyebrow="DAILY STEEL PRICE" title="ราคาเหล็กวันนี้" desc="ตรวจสอบราคาเหล็กแต่ละประเภทและทุกขนาดจาก SUPARERK STEEL" />
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mb-10 grid gap-5 border bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
        <div><p className="text-xs font-black tracking-[.18em] text-[#8b352d]">PRICE UPDATE</p><h2 className="mt-2 text-2xl font-black">ตารางราคาเหล็กรวม</h2><p className="mt-2 text-sm text-zinc-500">อัปเดตล่าสุด: {formatUpdatedAt(updatedAt)}</p></div>
        <a href="https://lin.ee/Yurg5Hy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#8b352d] px-5 py-3 text-sm font-black text-white hover:bg-[#742c26]"><Image src="/line-logo.svg" alt="" width={22} height={22} />ขอใบเสนอราคาทางไลน์</a>
      </div>

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
