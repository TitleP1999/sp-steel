"use client";
import { Fragment } from "react";
import { phoneHref, type SiteContent } from "../../data/site-content";
import Image from "next/image"; import PageHero from "../../components/PageHero"; import {MapPin,Phone,ExternalLink} from "lucide-react"; import {motion} from "framer-motion"; import QuoteForm from "./QuoteForm";
export default function ContactContent({ branches, contact }: Pick<SiteContent, "branches" | "contact">) { return <main><PageHero eyebrow="CONTACT US" title={contact.title} desc={contact.description} backgroundImage={contact.image}/>
<section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20"><div className="grid gap-0">
{branches.map((b,i)=><Fragment key={b.id}><motion.article id={b.id} tabIndex={-1} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}} className="scroll-mt-24 grid overflow-hidden border bg-white lg:grid-cols-[.9fr_1.1fr]">
  <div className="p-5 sm:p-7 lg:p-9">
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-28 shrink-0 sm:h-24 sm:w-36"><Image src={b.logo} alt={b.name} fill sizes="(max-width: 1024px) 112px, 144px" className="object-contain"/></div>
      <div><p className="text-xs font-black tracking-[.2em] text-[#8b352d]">{b.en}</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">{b.name}</h2></div>
    </div>
    <div className="mt-5 flex gap-3 border-y border-zinc-200 py-5">
      <MapPin size={24} className="mt-1 shrink-0 fill-[#8b352d] text-[#8b352d]"/><p className="text-sm leading-7 text-zinc-700">{b.address}</p>
    </div>
    <div className="mt-4 grid min-h-20 gap-4 text-left text-zinc-800 sm:grid-cols-[1fr_1px_1fr] sm:items-center">
      <div className="flex min-w-0 items-center justify-center gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#8b352d]/10"><Phone size={25} className="fill-[#a02f2b] text-[#a02f2b]"/></span><span className="min-w-0"><small className="whitespace-nowrap font-bold text-zinc-600">เบอร์โทรศัพท์</small><a href={phoneHref(b.phone)} className="mt-1 block whitespace-nowrap text-lg font-black tracking-normal text-[#a02f2b] sm:text-xl xl:text-2xl">{b.phone}</a></span></div>
      <span aria-hidden="true" className="hidden h-14 bg-zinc-300 sm:block"/>
      <div className="border-t border-zinc-200 pt-3 text-center sm:border-0 sm:pt-0"><small className="font-bold text-zinc-600">สำรอง</small><a href={phoneHref(b.backupPhone)} className="mt-1 block whitespace-nowrap text-lg font-black tracking-normal text-[#a02f2b] sm:text-xl">{b.backupPhone}</a></div>
    </div>
    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
      <a href={contact.line} target="_blank" rel="noopener noreferrer" className="flex min-h-16 items-center justify-center gap-2 bg-[#06C755] p-2 text-center text-xs font-black text-white shadow-md transition hover:bg-[#05b34a]"><Image src="/line-logo.svg" alt="" width={22} height={22}/><span>LINE</span></a>
      <a href={b.facebook} target="_blank" rel="noopener noreferrer" className="flex min-h-16 items-center justify-center gap-2 bg-[#1877F2] p-2 text-center text-xs font-black text-white shadow-md transition hover:bg-[#1668d4]"><Image src="/facebook-icon.png" alt="" width={22} height={22}/><span>Facebook<small className="block font-normal text-white/80">สาขา{b.shortName}</small></span></a>
      <a href={phoneHref(b.phone)} className="col-span-2 flex min-h-16 items-center justify-center gap-2 border border-zinc-200 bg-white p-2 text-center text-xs font-black text-zinc-800 shadow-sm transition-colors duration-200 hover:bg-zinc-200 sm:col-span-1"><Phone size={20}/><span>โทรเลย</span></a>
    </div>
  </div>
  <div className="flex flex-col border-t border-zinc-200 bg-zinc-100 p-3 sm:p-5 lg:border-l lg:border-t-0">
    <div className="min-h-64 flex-1 overflow-hidden border bg-white sm:min-h-80"><iframe title={`Google Maps ${b.name}`} src={b.embed} width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block min-h-64 sm:min-h-80"/></div>
    <a href={b.map} target="_blank" rel="noreferrer" className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 bg-[#8b352d] px-5 py-3 text-sm font-black text-white"><MapPin size={17}/> เปิดเส้นทางใน Google Maps <ExternalLink size={15}/></a>
  </div>
</motion.article>{i < branches.length - 1 && <div aria-hidden="true" className="my-6 border-t border-zinc-300"/>}</Fragment>)}
</div>
<div className="mt-12 grid gap-8 bg-[#202124] p-5 sm:p-8 text-white lg:grid-cols-[.8fr_1.2fr] lg:p-12"><div><p className="text-xs font-black tracking-[.2em] text-[#c46b60]">SALES & SOCIAL</p><h2 className="mt-3 text-3xl font-black">ช่องทางติดต่อทั้งหมด</h2><p className="mt-5 leading-7 text-zinc-300">Facebook, LINE Official Account, TikTok และช่องทางบริษัท</p><div className="mt-7 space-y-3"><a href={phoneHref(contact.phone)} className="flex items-center gap-3 font-black"><Phone size={18} className="text-[#c46b60]"/> {contact.phone}</a><a href={contact.social} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#8b352d] px-5 py-3 font-black">เปิดช่องทางติดต่อ <ExternalLink size={16}/></a></div></div>
<div className="border border-white/10 bg-white/5 p-5 sm:p-7"><h3 className="text-2xl font-black">ขอใบเสนอราคา</h3><p className="mt-2 text-sm text-zinc-400">กรอกรายละเอียดเบื้องต้นเพื่อเตรียมข้อมูลสำหรับติดต่อฝ่ายขาย</p><QuoteForm line={contact.line} /></div></div></section></main>}
