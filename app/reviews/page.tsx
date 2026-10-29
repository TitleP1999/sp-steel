import PageHero from "../../components/PageHero";
import { getGoogleBusinessReviews } from "../../lib/google-business-reviews";

export const dynamic = "force-dynamic";
const formatDate = (value: string) => new Date(`${value}T00:00:00+07:00`).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });

export default async function Reviews() {
  const { configured, items } = await getGoogleBusinessReviews();
  return <main><PageHero eyebrow="GOOGLE REVIEWS" title="รีวิวจากลูกค้า" desc="รีวิวจริงจาก Google ของทั้งสองสาขา แสดงเฉพาะรีวิวที่ให้ 5 ดาว" backgroundImage="/steel-warehouse-background.jpg"/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
    {items.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{items.map(item => <article key={item.id} className="flex h-full flex-col border bg-white p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3"><div className="text-xl tracking-wider text-amber-500" aria-label="5 จาก 5 ดาว">★★★★★</div><span className="rounded-full bg-[#f1f0ed] px-3 py-1 text-xs font-bold text-zinc-700">สาขา{item.branchName}</span></div>
      {item.message && <blockquote className="mt-4 whitespace-pre-wrap text-lg leading-8 text-zinc-700">“{item.message}”</blockquote>}
      {item.photos.length > 0 && <div className="mt-4 grid grid-cols-2 gap-2">{item.photos.map((photo, index) => <a key={`${photo.url}-${index}`} href={item.googleMapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`${photo.label} · ดูบน Google Maps`} className="overflow-hidden rounded-lg bg-zinc-100"><img src={photo.url} alt={photo.label} loading="lazy" referrerPolicy="no-referrer" className="aspect-square h-full w-full object-cover transition duration-300 hover:scale-105" /></a>)}</div>}
      <footer className="mt-5 border-t pt-4"><p className="font-black">{item.customerName}</p><time dateTime={item.reviewedAt} className="mt-2 block text-xs text-zinc-500">{formatDate(item.reviewedAt)}</time><a href={item.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-bold text-[#8b352d] underline underline-offset-4">รีวิวจาก Google · ดูบน Google Maps</a></footer>
    </article>)}</div> : <div className="border bg-white px-6 py-16 text-center"><h2 className="text-2xl font-black">{configured ? "ยังไม่พบรีวิว Google ที่มีข้อความและให้ 5 ดาว" : "ยังไม่ได้เชื่อมต่อ Google Business Profile"}</h2><p className="mx-auto mt-3 max-w-2xl leading-7 text-zinc-500">{configured ? "ลองตรวจสอบสิทธิ์บัญชี Google และรหัสสาขาในค่าตั้งค่า" : "เชื่อมบัญชี Google Business Profile ที่ยืนยันแล้วของร้าน เพื่อดึงรีวิวจริงและกรองเฉพาะ 5 ดาว"}</p><div className="mt-5 flex flex-wrap justify-center gap-4"><a href="https://maps.app.goo.gl/tddg4Y9Gv5Dd25cX8?g_st=il" target="_blank" rel="noopener noreferrer" className="font-bold text-[#8b352d] underline">Google Maps สุพรรณบุรี</a><a href="https://maps.app.goo.gl/jTfe5Rd5fkLsmCnz8?g_st=il" target="_blank" rel="noopener noreferrer" className="font-bold text-[#8b352d] underline">Google Maps กาญจนบุรี</a></div></div>}
  </section></main>;
}
