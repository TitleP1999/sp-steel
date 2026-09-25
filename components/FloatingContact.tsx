"use client";
import {useState} from "react"; import {MessageCircle,X,Facebook} from "lucide-react"; import {AnimatePresence,motion} from "framer-motion";
const LINE="https://lin.ee/Yurg5Hy"; const FACEBOOK="https://www.facebook.com/SuparerkSteelSuphanburi";
export default function FloatingContact(){const [open,setOpen]=useState(false);return <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] flex flex-col items-center gap-3">
<AnimatePresence>{open&&<motion.div initial={{opacity:0,y:20,scale:.9}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:15,scale:.9}} className="flex flex-col gap-3">
<a href={LINE} target="_blank" rel="noreferrer" aria-label="LINE Official Account" className="grid h-14 w-14 place-items-center rounded-full bg-[#06C755] text-white shadow-xl transition hover:-translate-y-1"><MessageCircle size={28} fill="currentColor"/></a>
<a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-14 w-14 place-items-center rounded-full bg-[#1877F2] text-white shadow-xl transition hover:-translate-y-1"><Facebook size={27} fill="currentColor"/></a>
</motion.div>}</AnimatePresence>
<button onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?"ปิดช่องทางติดต่อ":"เปิดช่องทางติดต่อ"} className="grid h-12 w-12 place-items-center rounded-full bg-[#202124] text-white shadow-xl transition hover:bg-[#8b352d]">{open?<X/>:<MessageCircle/>}</button></div>}
