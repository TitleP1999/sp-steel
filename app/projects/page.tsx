import Link from "next/link";
import PageHero from "../../components/PageHero";
import { getProjects } from "../../lib/projects";

export const dynamic = "force-dynamic";
const formatDate = (value: string) => new Date(`${value}T00:00:00+07:00`).toLocaleDateString("th-TH", { day: "numeric", month: "long", year: "numeric" });
function ProjectLink({ href }: { href: string }) {
  if (/^https?:\/\//i.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-bold text-[#8b352d] underline">ดูรายละเอียด →</a>;
  return <Link href={href} className="mt-5 inline-block font-bold text-[#8b352d] underline">ดูรายละเอียด →</Link>;
}
export default async function Projects() {
  const { items } = await getProjects();
  const visible = items.filter(item => item.published).sort((a, b) => b.completedAt.localeCompare(a.completedAt));
  return <main><PageHero eyebrow="PROJECTS" title="ผลงานและโครงการ" desc="พื้นที่รวบรวมผลงาน การจัดส่ง และโครงการของ SUPARERK STEEL"/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
    {visible.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visible.map(item => <article key={item.id} className="overflow-hidden border bg-white">
      {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="aspect-[4/3] w-full object-cover" /> : <div className="steel grid aspect-[4/3] place-items-center font-black text-zinc-500">PROJECT PHOTO</div>}
      <div className="p-6"><div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">{item.location && <span className="font-bold text-[#8b352d]">{item.location}</span>}<time dateTime={item.completedAt}>{formatDate(item.completedAt)}</time></div><h2 className="mt-3 text-xl font-black">{item.title}</h2>{item.summary && <p className="mt-3 whitespace-pre-wrap leading-7 text-zinc-500">{item.summary}</p>}{item.href && <ProjectLink href={item.href} />}</div>
    </article>)}</div> : <div className="border bg-white px-6 py-16 text-center"><h2 className="text-2xl font-black">ยังไม่มีผลงานที่เผยแพร่</h2><p className="mt-3 text-zinc-500">ผลงานและโครงการใหม่จะแสดงในหน้านี้</p></div>}
  </section></main>;
}
