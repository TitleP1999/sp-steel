"use client";

import Image from "next/image";
import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LINE = "https://lin.ee/Yurg5Hy";
const branches = {
  suphanburi: { label: "สุพรรณบุรี", facebook: "https://www.facebook.com/SuparerkSteelSuphanburi", phone: "tel:0863215445" },
  kanchanaburi: { label: "กาญจนบุรี", facebook: "https://www.facebook.com/SuparerkSteelKanchanaburi", phone: "tel:0803732231" },
};

type Submenu = "facebook" | "phone" | null;

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<Submenu>(null);
  const reduceMotion = useReducedMotion();
  const branchList = Object.values(branches);
  const toggleMenu = () => {
    setOpen(value => !value);
    setSubmenu(null);
  };

  return <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] flex flex-col items-end gap-3">
    <AnimatePresence>
      {open && <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : .92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : .95 }}
        transition={{ duration: reduceMotion ? 0 : .22 }}
        className="flex flex-col items-end gap-3"
      >
        <a href={LINE} target="_blank" rel="noreferrer" aria-label="ติดต่อผ่าน LINE" className="group relative grid h-14 w-14 place-items-center rounded-full shadow-xl transition hover:-translate-y-1 hover:scale-105"><span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-[#202124] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">ติดต่อผ่าน LINE</span><Image src="/line-logo.svg" alt="" width={56} height={56}/></a>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {submenu === "facebook" && <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex gap-2">
              {branchList.map(branch => <a key={branch.label} href={branch.facebook} target="_blank" rel="noreferrer" className="flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#1877F2] px-3 text-xs font-black text-white shadow-xl transition hover:bg-[#1668d4]"><Image src="/facebook-icon.png" alt="" width={20} height={20}/>{branch.label}</a>)}
            </motion.div>}
          </AnimatePresence>
          <button type="button" onClick={() => setSubmenu(value => value === "facebook" ? null : "facebook")} aria-expanded={submenu === "facebook"} aria-label="เลือก Facebook ของแต่ละสาขา" className={`group relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#1877F2] text-white shadow-xl transition hover:-translate-y-1 hover:scale-105 ${submenu === "facebook" ? "ring-4 ring-[#1877F2]/25" : ""}`}><span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-[#202124] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">Facebook</span><Image src="/facebook-icon.png" alt="" width={38} height={38}/></button>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {submenu === "phone" && <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex gap-2">
              {branchList.map(branch => <a key={branch.label} href={branch.phone} className="flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#8b352d] px-3 text-xs font-black text-white shadow-xl transition hover:bg-[#67251f]"><Phone size={16}/>{branch.label}</a>)}
            </motion.div>}
          </AnimatePresence>
          <button type="button" onClick={() => setSubmenu(value => value === "phone" ? null : "phone")} aria-expanded={submenu === "phone"} aria-label="เลือกเบอร์โทรศัพท์ของแต่ละสาขา" className={`group relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#8b352d] text-white shadow-xl transition hover:-translate-y-1 hover:scale-105 ${submenu === "phone" ? "ring-4 ring-[#8b352d]/25" : ""}`}><span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-[#202124] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">โทรศัพท์</span><Phone size={24}/></button>
        </div>
      </motion.div>}
    </AnimatePresence>

    <motion.button type="button" onClick={toggleMenu} aria-expanded={open} aria-label={open ? "ปิดช่องทางติดต่อ" : "เปิดช่องทางติดต่อ"} animate={reduceMotion ? undefined : { y: open ? 0 : [0, -3, 0] }} transition={{ y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } }} whileHover={reduceMotion ? undefined : { scale: 1.08 }} whileTap={reduceMotion ? undefined : { scale: .92 }} className="group relative grid h-12 w-12 place-items-center rounded-full bg-[#202124] text-white shadow-xl transition-colors hover:bg-[#8b352d]">
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-xl bg-[#202124] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">{open ? "ปิดช่องทางติดต่อ" : "ช่องทางติดต่อ"}</span>
      <motion.span aria-hidden="true" animate={reduceMotion ? undefined : { rotate: open ? 90 : 0 }} transition={{ type: "spring", stiffness: 360, damping: 22 }}>{open ? <X/> : <MessageCircle/>}</motion.span>
    </motion.button>
  </div>;
}
