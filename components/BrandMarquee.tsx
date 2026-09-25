"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "./Motion";

const brands = [
  { name: "ZUBB STEEL", image: "/brands/zubb-steel.png" },
  { name: "PACIFIC PIPE", image: "/brands/pacific-pipe.png" },
  { name: "TOA", image: "/brands/toa.png" },
  { name: "TATA TISCON", image: "/brands/tata-tiscon.png" },
  { name: "SYS", image: "/brands/sys.png" },
  { name: "CARCO", image: "/brands/carco.png" },
  { name: "KOBELCO", image: "/brands/kobelco.png" },
];

export default function BrandMarquee() {
  const loop = [...brands, ...brands];
  return (
    <section className="overflow-hidden border-y border-black/5 bg-[#f7f5f2] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="font-black tracking-[.18em] text-[#8b352d]">OUR BRANDS</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">แบรนด์สินค้าที่เราจัดจำหน่าย</h2>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-600">แบรนด์สินค้าเหล็กและวัสดุที่มีให้เลือกสำหรับงานก่อสร้างและงานอุตสาหกรรม</p>
        </Reveal>
      </div>
      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f7f5f2] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f7f5f2] to-transparent sm:w-32" />
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center"
        >
          {loop.map((brand, index) => (
            <div key={`${brand.name}-${index}`} className="mx-3 flex h-36 w-64 shrink-0 items-center justify-center border border-black/10 bg-white p-5 shadow-sm sm:h-40 sm:w-72">
              <div className="relative h-full w-full">
                <Image src={brand.image} alt={brand.name} fill sizes="288px" className="object-contain" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
