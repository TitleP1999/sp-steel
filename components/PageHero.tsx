"use client";

import { motion } from "framer-motion";

export default function PageHero({ eyebrow, title, desc, backgroundImage }: { eyebrow: string; title: string; desc: string; backgroundImage?: string }) {
  return (
    <section
      className="gridbg relative flex min-h-[340px] items-center overflow-hidden bg-[#202124] text-white sm:min-h-[380px] lg:min-h-[420px]"
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(90deg, rgba(20,20,20,.82), rgba(20,20,20,.55)), url("${backgroundImage}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      } : undefined}
    >
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }} className="absolute right-0 top-0 h-full w-2 bg-[#8b352d]" />
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="font-black tracking-[.2em] text-[#c46b60]">{eyebrow}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75, delay: .08, ease: [.22, 1, .36, 1] }} className="mt-6 text-3xl font-black leading-[1.3] sm:text-5xl lg:text-6xl">{title}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .18 }} className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{desc}</motion.p>
      </div>
    </section>
  );
}
