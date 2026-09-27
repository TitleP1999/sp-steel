import Image from "next/image";
import Link from "next/link";
import type { HomeProjectItem } from "../lib/home-projects";
import { Reveal, Stagger, Item } from "./Motion";

function ProjectCard({ project }: { project: HomeProjectItem }) {
  const content = <article className="group">
    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
      <Image src={project.imageUrl} alt={project.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
    </div>
    <h3 className="mt-5 text-center text-lg font-black text-zinc-800">{project.title}</h3>
    {project.summary && <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-zinc-600">{project.summary}</p>}
  </article>;
  if (!project.href) return content;
  if (/^https?:\/\//i.test(project.href)) return <a href={project.href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>;
  return <Link href={project.href} className="block">{content}</Link>;
}

export default function HomeProjects({ projects }: { projects: HomeProjectItem[] }) {
  if (!projects.length) return null;
  return <section className="bg-[#f7f6f2]">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <Reveal><div className="text-center"><span className="mx-auto block h-1 w-24 bg-[#b45145]"/><p className="mt-6 font-black tracking-[.18em] text-[#8b352d]">OUR PROJECTS</p><h2 className="mx-auto mt-3 max-w-4xl text-3xl font-black leading-tight text-zinc-800 sm:text-4xl lg:text-5xl">โครงการที่เราเป็นส่วนหนึ่งในความสำเร็จ</h2></div></Reveal>
      <Stagger className="mt-10 grid gap-x-6 gap-y-10 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">{projects.map(project => <Item key={project.id}><ProjectCard project={project}/></Item>)}</Stagger>
    </div>
  </section>;
}
