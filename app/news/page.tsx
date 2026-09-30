import Link from "next/link";
import PageHero from "../../components/PageHero";
import FacebookFeeds from "../../components/FacebookFeeds";
import { getNews } from "../../lib/news";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Date(`${value}T00:00:00+07:00`).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
}

function NewsLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (/^https?:\/\//i.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-bold text-[#8b352d] underline">{children}</a>;
  return <Link href={href} className="mt-5 inline-block font-bold text-[#8b352d] underline">{children}</Link>;
}

export default async function News() {
  const { items } = await getNews();
  const visible = items.filter(item => item.published).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return <main><PageHero eyebrow="NEWS & UPDATE" title="ข่าวสาร" desc="ข่าวสาร กิจกรรม โปรโมชั่น และบทความจาก SUPARERK STEEL"/><FacebookFeeds showIntro={false}/>{visible.length > 0 && <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visible.map(item => <article key={item.id} className="border bg-white p-5 sm:p-7">
      {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="-mx-5 -mt-5 mb-5 aspect-[16/9] w-[calc(100%+2.5rem)] object-cover sm:-mx-7 sm:-mt-7 sm:mb-7 sm:w-[calc(100%+3.5rem)]" />}
      <div className="flex items-center justify-between gap-3 text-xs font-black text-[#8b352d]"><span>{item.category || "NEWS"}</span><time dateTime={item.publishedAt} className="font-normal text-zinc-500">{formatDate(item.publishedAt)}</time></div>
      <h2 className="mt-3 text-xl font-black">{item.title}</h2>
      {item.summary && <p className="mt-3 leading-7 text-zinc-500">{item.summary}</p>}
      {item.href && <NewsLink href={item.href}>อ่านเพิ่มเติม →</NewsLink>}
    </article>)}</div>
  </section>}</main>;
}
