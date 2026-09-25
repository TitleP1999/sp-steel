"use client";
import Image from "next/image";
import {motion} from "framer-motion";
import {MapPin,ArrowUpRight} from "lucide-react";
const branches=[
 {name:"สาขาสุพรรณบุรี",en:"SUPHAN BURI",logo:"/suparerk-logo-suphanburi.jpg",map:"https://maps.app.goo.gl/tddg4Y9Gv5Dd25cX8?g_st=il",side:-45},
 {name:"สาขากาญจนบุรี",en:"KANCHANABURI",logo:"/suparerk-logo-kanchanaburi.jpg",map:"https://maps.app.goo.gl/jTfe5Rd5fkLsmCnz8?g_st=il",side:45}
];
export default function Branches(){
 return <section className="overflow-hidden bg-[#f1f0ed]"><div className="mx-auto max-w-7xl px-6 py-24">
  <div className="max-w-3xl"><p className="font-black tracking-[.18em] text-[#8b352d]">OUR BRANCHES</p><h2 className="mt-3 text-4xl font-black sm:text-5xl">พร้อมให้บริการ 2 สาขา</h2><p className="mt-5 text-lg leading-8 text-zinc-600">เลือกสาขาที่สะดวก และเปิดเส้นทางผ่าน Google Maps ได้ทันที</p></div>
  <div className="mt-12 grid gap-6 lg:grid-cols-2">{branches.map((b,i)=>
   <motion.article key={b.en} initial={{opacity:0,x:b.side}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} transition={{duration:.75,delay:i*.08,ease:[.22,1,.36,1]}} whileHover={{y:-7}} className="group overflow-hidden border bg-white shadow-sm">
    <div className="relative aspect-square overflow-hidden bg-white p-5 sm:p-7"><Image src={b.logo} alt={`SUPARERK STEEL ${b.name}`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain transition duration-700 group-hover:scale-[1.025]"/></div>
    <div className="p-7 sm:p-8"><p className="text-xs font-black tracking-[.2em] text-[#8b352d]">{b.en}</p><h3 className="mt-2 text-3xl font-black">{b.name}</h3><div className="mt-7 flex flex-wrap gap-3"><a href={b.map} target="_blank" rel="noreferrer" className="group/link inline-flex items-center gap-2 bg-[#8b352d] px-5 py-3 font-black text-white"><MapPin size={17}/> ดูเส้นทาง <ArrowUpRight size={16} className="transition group-hover/link:translate-x-1 group-hover/link:-translate-y-1"/></a></div></div>
   </motion.article>)}</div>
 </div></section>
}