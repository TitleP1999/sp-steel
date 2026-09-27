"use client";

import Image from "next/image";
import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LINE = "https://lin.ee/Yurg5Hy";
const FACEBOOK = "https://www.facebook.com/SuparerkSteelSuphanburi";

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] flex flex-col items-center gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20, scale: reduceMotion ? 1 : 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.95 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
            className="flex flex-col gap-3"
          >
            <motion.a
              href={LINE}
              target="_blank"
              rel="noreferrer"
              aria-label="LINE Official Account"
              initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.06, duration: reduceMotion ? 0 : 0.2 }}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.06 }}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              className="group relative grid h-14 w-14 place-items-center rounded-full shadow-xl"
            >
              <span aria-hidden="true" className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#202124] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                ติดต่อผ่าน LINE
              </span>
              <Image src="/line-logo.svg" alt="" width={56} height={56} />
            </motion.a>
            <motion.a
              href="tel:0863215445"
              aria-label="โทรสาขาสุพรรณบุรี 086-321-5445"
              initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.1, duration: reduceMotion ? 0 : 0.2 }}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.06 }}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#8b352d] text-white shadow-xl"
            >
              <span aria-hidden="true" className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#202124] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                โทรสาขาสุพรรณบุรี
              </span>
              <Phone size={24} className="text-white" />
            </motion.a>
            <motion.a
              href="tel:0803732231"
              aria-label="โทรสาขากาญจนบุรี 080-373-2231"
              initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.14, duration: reduceMotion ? 0 : 0.2 }}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.06 }}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#8b352d] text-white shadow-xl"
            >
              <span aria-hidden="true" className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#202124] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                โทรสาขากาญจนบุรี
              </span>
              <Phone size={24} className="text-[#ffd166]" />
            </motion.a>
            <motion.a
              href={FACEBOOK}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.18, duration: reduceMotion ? 0 : 0.2 }}
              whileHover={reduceMotion ? undefined : { y: -3, scale: 1.06 }}
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#1877F2] text-white shadow-xl"
            >
              <span aria-hidden="true" className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#202124] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                Facebook
              </span>
              <Image src="/facebook-icon.png" alt="" width={40} height={40} />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "ปิดช่องทางติดต่อ" : "เปิดช่องทางติดต่อ"}
        animate={reduceMotion ? undefined : { y: open ? 0 : [0, -3, 0] }}
        transition={{ y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" } }}
        whileHover={reduceMotion ? undefined : { scale: 1.08 }}
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
        className="group relative grid h-12 w-12 place-items-center rounded-full bg-[#202124] text-white shadow-xl transition-colors hover:bg-[#8b352d]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-[#202124] px-3 py-2 text-xs font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
        >
          {open ? "ปิดช่องทางติดต่อ" : "ช่องทางติดต่อ"}
        </span>
        <motion.span
          aria-hidden="true"
          animate={reduceMotion ? undefined : { rotate: open ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 22 }}
        >
          {open ? <X /> : <MessageCircle />}
        </motion.span>
      </motion.button>
    </div>
  );
}
