"use client";
import Link from "next/link"; import Image from "next/image"; import {ArrowRight} from "lucide-react"; import type {Product} from "../data/products"; import type {HomeProjectItem} from "../lib/home-projects"; import {motion,useScroll,useTransform} from "framer-motion"; import {ParallaxPanel} from "./Motion"; import BrandMarquee from "./BrandMarquee"; import FacebookFeeds from "./FacebookFeeds"; import HomeProjects from "./HomeProjects"; import HomeProductStrip from "./HomeProductStrip"; import HomeBranches from "./HomeBranches"; import HomeWhySections from "./HomeWhySections";
export default function HomeContent({products,projects}:{products:Product[];projects:HomeProjectItem[]}){
 const {scrollYProgress}=useScroll(); const scaleX=useTransform(scrollYProgress,[0,1],[0,1]);
 return <main>
 <motion.div style={{scaleX,transformOrigin:"0%"}} className="fixed left-0 top-0 z-[70] h-[3px] w-full bg-[#b45145]"/>
 <section className="relative overflow-hidden bg-[#19191b] text-white"><Image src="/steel-warehouse-background.jpg" alt="" fill priority sizes="100vw" className="home-hero-background object-cover object-center"/><div className="absolute inset-0 bg-gradient-to-r from-[#19191b]/90 via-[#19191b]/75 to-[#19191b]/60"/><div className="gridbg absolute inset-0 opacity-40"/><motion.div initial={{x:"100%"}} animate={{x:0}} transition={{duration:1.1,ease:[.22,1,.36,1]}} className="absolute right-0 top-0 hidden h-full w-[38%] bg-[#8b352d]/15 lg:block"/>
 <div className="relative z-10 mx-auto grid lg:min-h-[690px] max-w-7xl items-center gap-8 lg:gap-14 px-4 sm:px-6 py-12 sm:py-16 lg:py-20 lg:grid-cols-[1.08fr_.92fr]">
 <div><motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="font-black tracking-[.22em] text-[#c46b60]">SUPARERK STEEL CO., LTD.</motion.p>
 <div className="mt-6 pt-[.3em]"><motion.h1 initial={{y:"110%"}} animate={{y:0}} transition={{duration:.85,ease:[.16,1,.3,1]}} className="text-[clamp(2.5rem,9vw,4.5rem)] font-bold leading-[1.3] tracking-normal sm:text-7xl xl:text-[78px]">ครบเครื่อง</motion.h1></div>
 <div className="pt-[.12em]"><motion.h2 initial={{y:"110%"}} animate={{y:0}} transition={{duration:.85,delay:.12,ease:[.16,1,.3,1]}} className="text-3xl font-bold leading-[1.3] tracking-normal text-[#b45145] sm:text-6xl">เรื่องเหล็ก</motion.h2></div>
 <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.38,duration:.7}} className="mt-7 max-w-xl text-lg leading-8 text-zinc-300">ศูนย์รวมเหล็กสำหรับงานก่อสร้าง งานโครงสร้าง และภาคอุตสาหกรรม พร้อมสต๊อกสินค้าและบริการจัดส่ง</motion.p>
 <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.5}} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Link href="/products" className="group flex items-center justify-center gap-2 bg-[#8b352d] px-7 py-4 font-black">ดูสินค้าทั้งหมด <ArrowRight className="transition group-hover:translate-x-1" size={18}/></Link><a href="https://lin.ee/Yurg5Hy" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#06C755] px-7 py-4 font-black text-white shadow-md transition hover:bg-[#05b34a]"><Image src="/line-logo.svg" alt="" width={22} height={22}/>ขอใบเสนอราคาผ่าน LINE</a></motion.div></div>
 <ParallaxPanel/></div></section>
 <section aria-label="เลือกโกดัง" className="border-b border-zinc-200 bg-white">
  <div className="mx-auto flex max-w-7xl items-center gap-5 px-4 py-5 sm:px-6">
   <p className="hidden shrink-0 text-sm font-bold text-zinc-600 sm:block">เลือกสาขาใกล้คุณ</p>
   <div className="grid w-full max-w-lg grid-cols-2 gap-3">
    <Link href="/contact#branch-suphanburi" className="group flex min-h-14 items-center justify-center gap-2 border border-[#8b352d]/25 bg-[#8b352d]/5 px-3 py-2 text-sm font-black text-[#8b352d] transition hover:bg-[#8b352d] hover:text-white">
     <span>สาขาสุพรรณบุรี</span><ArrowRight size={16} className="transition group-hover:translate-x-1"/>
    </Link>
    <Link href="/contact#branch-kanchanaburi" className="group flex min-h-14 items-center justify-center gap-2 border border-[#8b352d]/25 bg-[#8b352d]/5 px-3 py-2 text-sm font-black text-[#8b352d] transition hover:bg-[#8b352d] hover:text-white">
     <span>สาขากาญจนบุรี</span><ArrowRight size={16} className="transition group-hover:translate-x-1"/>
    </Link>
   </div>
  </div>
 </section>
 <HomeProductStrip products={products}/>
 <BrandMarquee/>
 <HomeBranches/>
 <HomeProjects projects={projects}/>
 <FacebookFeeds/>
 <HomeWhySections/>
 </main>
}
