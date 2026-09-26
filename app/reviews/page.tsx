import PageHero from "../../components/PageHero";
import { getReviews } from "../../lib/reviews";

export const dynamic = "force-dynamic";
const formatDate = (value: string) => new Date(`${value}T00:00:00+07:00`).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

export default async function Reviews() {
  const { items } = await getReviews();
  const visible = items.filter(item => item.published).sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));
  return <main><PageHero eyebrow="CUSTOMER REVIEWS" title="รีวิวจากลูกค้า" desc="เสียงตอบรับจากลูกค้าที่ไว้วางใจสินค้าและบริการของ SUPARERK STEEL"/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
    {visible.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{visible.map(item => <article key={item.id} className="flex h-full flex-col overflow-hidden border bg-white">
      {item.imageUrl && <img src={item.imageUrl} alt={`รีวิวจาก ${item.customerName}`} className="aspect-[16/9] w-full object-cover" />}
      <div className="flex flex-1 flex-col p-6 sm:p-7"><div className="text-xl tracking-wider text-amber-500" aria-label={`${item.rating} จาก 5 ดาว`}>{"★".repeat(item.rating)}<span className="text-zinc-300">{"★".repeat(5 - item.rating)}</span></div><blockquote className="mt-4 flex-1 whitespace-pre-wrap text-lg leading-8 text-zinc-700">“{item.message}”</blockquote>{item.product && <p className="mt-5 text-sm font-bold text-[#8b352d]">{item.product}</p>}<footer className="mt-5 border-t pt-4"><p className="font-black">{item.customerName}</p>{item.company && <p className="mt-1 text-sm text-zinc-500">{item.company}</p>}<time dateTime={item.reviewedAt} className="mt-2 block text-xs text-zinc-400">{formatDate(item.reviewedAt)}</time></footer></div>
    </article>)}</div> : <div className="border bg-white px-6 py-16 text-center"><h2 className="text-2xl font-black">ยังไม่มีรีวิวที่เผยแพร่</h2><p className="mt-3 text-zinc-500">รีวิวจากลูกค้าจะแสดงในหน้านี้</p></div>}
  </section></main>;
}
