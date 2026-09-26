"use client";
import {motion, useScroll, useTransform} from "framer-motion";
import {ReactNode, useRef} from "react";
import Image from "next/image";

export function Reveal({children,delay=0,className=""}:{children:ReactNode,delay?:number,className?:string}){
 return <motion.div className={className} initial={{opacity:0,y:34}} whileInView={{opacity:1,y:0}}
 viewport={{once:true,amount:.18}} transition={{duration:.72,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>
}
export function Stagger({children,className=""}:{children:ReactNode,className?:string}){
 return <motion.div className={className} initial="hidden" whileInView="show" viewport={{once:true,amount:.12}}
 variants={{hidden:{},show:{transition:{staggerChildren:.09}}}}>{children}</motion.div>
}
export function Item({children,className=""}:{children:ReactNode,className?:string}){
 return <motion.div className={className} variants={{hidden:{opacity:0,y:28},show:{opacity:1,y:0,transition:{duration:.6,ease:[.22,1,.36,1]}}}}>{children}</motion.div>
}
export function ParallaxPanel(){
 const ref=useRef<HTMLDivElement>(null); const {scrollYProgress}=useScroll({target:ref,offset:["start end","end start"]});
 const y=useTransform(scrollYProgress,[0,1],[24,-24]);
 return <div ref={ref} className="relative min-h-[300px] overflow-hidden rounded-3xl border border-white/10 bg-[#202124] sm:min-h-[410px]">
  <motion.div style={{y}} className="absolute -inset-y-8 inset-x-0">
   <div className="absolute inset-0 [clip-path:polygon(0_0,62%_0,48%_100%,0_100%)]">
    <Image src="/warehouse-branch-1-v1.png" alt="ภาพตัวอย่างโกดังเหล็กสาขาที่ 1" fill priority quality={95} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover"/>
   </div>
   <div className="absolute inset-0 [clip-path:polygon(62%_0,100%_0,100%_100%,48%_100%)]">
    <Image src="/warehouse-branch-2-v1.png" alt="ภาพตัวอย่างโกดังเหล็กสาขาที่ 2" fill priority quality={95} sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover"/>
   </div>
  </motion.div>
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/15"/>
  <div className="pointer-events-none absolute inset-y-0 left-[55%] w-px -skew-x-[12deg] bg-white/50 shadow-[0_0_20px_rgba(0,0,0,.7)]"/>
  <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.35}} className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
   <div><p className="text-[10px] font-black tracking-[.2em] text-[#e8a49b]">WAREHOUSE 01</p><p className="mt-1 text-lg font-black sm:text-2xl">โกดังสาขาที่ 1</p></div>
   <div className="text-right"><p className="text-[10px] font-black tracking-[.2em] text-[#e8a49b]">WAREHOUSE 02</p><p className="mt-1 text-lg font-black sm:text-2xl">โกดังสาขาที่ 2</p></div>
  </motion.div>
 </div>
}
