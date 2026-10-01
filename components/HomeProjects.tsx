"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import type { HomeProjectItem } from "../lib/home-projects";
import { Reveal } from "./Motion";

const sampleProjects: HomeProjectItem[] = [
  {
    id: "steel-warehouse",
    title: "คลังสินค้าเหล็ก",
    summary: "พื้นที่จัดเก็บเหล็กสำหรับงานก่อสร้างและอุตสาหกรรม",
    imageUrl: "/projects/steel-warehouse-project.png",
    href: "",
    published: true,
  },
  {
    id: "suphanburi-warehouse",
    title: "คลังสินค้า สาขาสุพรรณบุรี",
    summary: "พร้อมให้บริการและจัดส่งสินค้าเหล็ก",
    imageUrl: "/warehouse-branch-1-v1.png",
    href: "",
    published: true,
  },
  {
    id: "kanchanaburi-warehouse",
    title: "คลังสินค้า สาขากาญจนบุรี",
    summary: "พร้อมให้บริการและจัดส่งสินค้าเหล็ก",
    imageUrl: "/warehouse-branch-2-v1.png",
    href: "",
    published: true,
  },
];

function scrollToSlide(rail: HTMLDivElement | null, index: number) {
  const slide = rail?.children[index] as HTMLElement | undefined;
  if (!rail || !slide) return;
  const left = slide.getBoundingClientRect().left - rail.getBoundingClientRect().left + rail.scrollLeft - (rail.clientWidth - slide.clientWidth) / 2;
  rail.scrollTo({ left, behavior: "smooth" });
}

export default function HomeProjects({ projects }: { projects: HomeProjectItem[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<HomeProjectItem | null>(null);
  const slides = projects.length ? projects : sampleProjects;

  useEffect(() => {
    if (!selectedProject) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedProject(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setCurrentIndex(index => {
        const next = (index + 1) % slides.length;
        scrollToSlide(rail.current, next);
        return next;
      });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [selectedProject, slides.length]);

  const move = (direction: -1 | 1) => {
    setCurrentIndex(index => {
      const next = (index + direction + slides.length) % slides.length;
      scrollToSlide(rail.current, next);
      return next;
    });
  };

  return <>
  <section className="overflow-hidden bg-[#f7f6f2]">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
      <Reveal>
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="block h-1 w-24 bg-[#b45145]"/>
            <p className="mt-6 font-black tracking-[.18em] text-[#8b352d]">OUR PROJECTS</p>
            <h2 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-zinc-800 sm:text-4xl lg:text-5xl">ผลงานของเรา</h2>
          </div>
        </div>
      </Reveal>

      <div className="relative mt-10 sm:mt-14">
      <button type="button" onClick={() => move(-1)} aria-label="ดูผลงานก่อนหน้า" className="absolute left-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-[#8b352d] shadow-lg backdrop-blur-sm transition hover:bg-[#8b352d] hover:text-white sm:left-4 sm:h-12 sm:w-12"><ArrowLeft size={19}/></button>
      <button type="button" onClick={() => move(1)} aria-label="ดูผลงานถัดไป" className="absolute right-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-[#8b352d] shadow-lg backdrop-blur-sm transition hover:bg-[#8b352d] hover:text-white sm:right-4 sm:h-12 sm:w-12"><ArrowRight size={19}/></button>
      <div ref={rail} onScroll={event => {
        const element = event.currentTarget;
        const center = element.getBoundingClientRect().left + element.clientWidth / 2;
        let nearest = 0;
        let distance = Number.POSITIVE_INFINITY;
        Array.from(element.children).forEach((child, index) => {
          const rect = child.getBoundingClientRect();
          const childDistance = Math.abs(rect.left + rect.width / 2 - center);
          if (childDistance < distance) { distance = childDistance; nearest = index; }
        });
        setCurrentIndex(nearest);
      }} className="project-carousel-track flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 sm:gap-6">
        {slides.map(project => {
          const content = <article className="group">
            <button type="button" onClick={() => setSelectedProject(project)} aria-label={`ดูรูปผลงาน ${project.title} เต็มจอ`} className="block w-full text-left">
              <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-zinc-200">
                <Image src={project.imageUrl} alt={project.title} fill unoptimized={project.imageUrl.startsWith("data:")} sizes="(max-width: 640px) 88vw, (max-width: 1024px) 72vw, 62vw" className="object-cover transition duration-500 group-hover:scale-[1.03]"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"/>
                <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
                  <h3 className="text-xl font-black sm:text-2xl">{project.title}</h3>
                  {project.summary && <p className="mt-2 max-w-xl text-sm leading-6 text-white/85 sm:text-base">{project.summary}</p>}
                </div>
              </div>
            </button>
            {project.href && <div className="mt-3 text-right">{/^https?:\/\//i.test(project.href)
              ? <a href={project.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-[#8b352d] hover:underline">ดูรายละเอียด <ExternalLink size={14}/></a>
              : <Link href={project.href} className="inline-flex items-center gap-1 text-sm font-bold text-[#8b352d] hover:underline">ดูรายละเอียด <ArrowRight size={14}/></Link>}
            </div>}
          </article>;

          const slideClass = "block w-[88%] shrink-0 snap-center sm:w-[72%] lg:w-[62%]";
          return <div key={project.id} className={slideClass}>{content}</div>;
        })}
      </div>
      </div>
      <div className="mt-5 flex justify-center gap-2" aria-label="เลือกผลงาน">
        {slides.map((slide, index) => <button key={slide.id} type="button" aria-label={`ไปยังผลงาน ${index + 1}`} aria-current={currentIndex === index ? "true" : undefined} onClick={() => { setCurrentIndex(index); scrollToSlide(rail.current, index); }} className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? "w-7 bg-[#8b352d]" : "w-2 bg-zinc-300 hover:bg-zinc-500"}`}/>) }
      </div>
    </div>
  </section>
  <AnimatePresence>
    {selectedProject && <motion.div role="dialog" aria-modal="true" aria-label={selectedProject.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8">
      <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 6 }} transition={{ duration: 0.2 }} onClick={event => event.stopPropagation()} className="relative flex h-full max-h-[90dvh] w-full max-w-7xl flex-col items-center justify-center">
        <button type="button" autoFocus onClick={() => setSelectedProject(null)} aria-label="ปิดรูปเต็มจอ" className="absolute right-0 top-0 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/30"><X size={24}/></button>
        <div className="relative min-h-0 w-full flex-1">
          <Image src={selectedProject.imageUrl} alt={selectedProject.title} fill unoptimized={selectedProject.imageUrl.startsWith("data:")} sizes="100vw" className="object-contain" priority/>
        </div>
        <div className="pt-4 text-center text-white"><h3 className="text-xl font-black sm:text-2xl">{selectedProject.title}</h3>{selectedProject.summary && <p className="mt-1 text-sm text-white/75">{selectedProject.summary}</p>}</div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>
  </>;
}
