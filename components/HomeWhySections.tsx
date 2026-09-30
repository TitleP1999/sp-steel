"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ReceiptText, ShieldCheck, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Item, Reveal, Stagger } from "./Motion";

export default function HomeWhySections() {
  return <>
    <section className="bg-[#efeeea]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <Reveal>
          <p className="text-xs font-black tracking-[.18em] text-[#8b352d] sm:text-base">WHY SUPARERK STEEL</p>
          <h2 className="mt-2 max-w-3xl text-2xl font-black leading-tight sm:mt-3 sm:text-4xl lg:text-5xl">มากกว่าการขายเหล็ก<br />คือความพร้อมในทุกขั้นตอน</h2>
        </Reveal>
        <Stagger className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {[[ShieldCheck, "QUALITY", "สเปกถูกต้อง", "ให้ความสำคัญกับมาตรฐานและคุณภาพสินค้า"], [ReceiptText, "TAX INVOICE", "ออกใบกำกับภาษีได้", "ออกเอกสารครบถ้วน รองรับลูกค้าทั่วไปและนิติบุคคล"], [Truck, "DELIVERY", "พร้อมจัดส่ง", "สนับสนุนตั้งแต่เสนอราคาจนถึงจัดส่งสินค้า"]].map(([Icon, eyebrow, title, description]: any) =>
            <Item key={title}>
              <div className="flex h-full items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:block sm:rounded-none sm:border-x-0 sm:border-b-0 sm:bg-transparent sm:p-0 sm:pt-7 sm:shadow-none">
                <Icon size={30} className="mt-1 shrink-0 text-[#8b352d] sm:mt-0 sm:h-[34px] sm:w-[34px]" />
                <div className="min-w-0">
                  <p className="text-[10px] font-black tracking-[.18em] text-zinc-400 sm:mt-7 sm:text-xs sm:tracking-[.2em]">{eyebrow}</p>
                  <h3 className="mt-1 text-xl font-black sm:mt-2 sm:text-2xl">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-zinc-600 sm:mt-3 sm:text-base sm:leading-7">{description}</p>
                </div>
              </div>
            </Item>)}
        </Stagger>
      </div>
    </section>

    <section className="bg-[#202124] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-9 sm:gap-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:py-24">
        <Reveal><p className="text-sm font-black tracking-[.18em] text-[#c46b60] sm:text-base">SINCE 2020</p><h2 className="mt-3 text-3xl font-black leading-tight sm:mt-4 sm:text-5xl">เติบโตด้วยคุณภาพ<br />และความเชื่อมั่น</h2></Reveal>
        <Reveal delay={.12}><p className="text-base leading-7 text-zinc-300 sm:text-lg sm:leading-9">จากจุดเริ่มต้นในจังหวัดสุพรรณบุรี บริษัทพัฒนาทั้งประเภทสินค้า พื้นที่คลัง ระบบจัดส่ง และพื้นที่ให้บริการ เพื่อรองรับลูกค้าที่หลากหลายและการเติบโตในระยะยาว</p><Link href="/about" className="group mt-5 inline-flex items-center gap-3 font-black text-[#d28a80] sm:mt-8">เรื่องราวของเรา <ArrowRight className="transition group-hover:translate-x-2" /></Link></Reveal>
      </div>
    </section>

    <section className="relative overflow-hidden bg-[#202124] text-white">
      <Image src="/cta-steel-photo.png" alt="" fill sizes="100vw" className="object-cover object-[50%_62%] sm:object-[50%_54%]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="absolute -right-24 -top-52 h-96 w-96 rounded-full border border-white/15" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-4 py-9 sm:gap-7 sm:px-6 sm:py-16">
        <Reveal><p className="text-xs font-bold text-white/80 sm:text-sm">LET&apos;S BUILD TOGETHER</p><h2 className="mt-2 text-2xl font-black text-white sm:text-4xl">ต้องการสินค้าเหล็ก หรือขอใบเสนอราคา?</h2></Reveal>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: .98 }}><Link href="/contact" className="group flex items-center gap-3 bg-white px-6 py-3 font-black text-[#8b352d] sm:px-8 sm:py-4">ติดต่อฝ่ายขาย <ArrowRight className="transition group-hover:translate-x-1" /></Link></motion.div>
      </div>
    </section>
  </>;
}
