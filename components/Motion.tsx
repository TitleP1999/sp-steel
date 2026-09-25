"use client";
import {motion, useScroll, useTransform} from "framer-motion";
import {ReactNode, useRef} from "react";

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
 const y=useTransform(scrollYProgress,[0,1],[45,-45]);
 return <div ref={ref} className="relative min-h-[300px] sm:min-h-[410px] overflow-hidden border border-white/10 bg-[#202124]">
  <motion.div style={{y}} className="steel absolute -inset-16"/>
  <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/25 to-[#8b352d]/35"/>
  <motion.div initial={{opacity:0,scale:.92}} animate={{opacity:1,scale:1}} transition={{duration:1,delay:.35}} className="absolute inset-0 grid place-items-center p-5 text-center sm:p-10">
   <div><div className="mx-auto h-28 w-28 border border-[#c46b60]/60 p-3"><div className="grid h-full place-items-center bg-black/30 text-3xl sm:text-4xl font-black text-[#d28a80]">SS</div></div><p className="mt-7 text-2xl font-black tracking-wide">STEEL FOR EVERY STRUCTURE</p><p className="mt-2 text-sm text-zinc-400">SUPARERK STEEL • EST. 2020</p></div>
  </motion.div>
 </div>
}
