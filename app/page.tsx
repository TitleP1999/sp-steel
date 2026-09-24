"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Truck,
} from "lucide-react";

import { products } from "../data/products";
import Branches from "../components/Branches";
import {
  Reveal,
  Stagger,
  Item,
  ParallaxPanel,
} from "../components/Motion";

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#202124] text-white">
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="absolute left-[10%] top-0 h-full w-px bg-white" />
          <div className="absolute left-[30%] top-0 h-full w-px bg-white" />
          <div className="absolute left-[50%] top-0 h-full w-px bg-white" />
          <div className="absolute left-[70%] top-0 h-full w-px bg-white" />
          <div className="absolute left-[90%] top-0 h-full w-px bg-white" />
        </div>

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-black tracking-[.2em] text-[#c46b60]"
            >
              SUPARERK STEEL CO., LTD.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-5 text-5xl font-black leading-[.95] sm:text-6xl lg:text-7xl"
            >
              BUILT FOR
              <br />
              <span className="text-[#c46b60]">STRENGTH.</span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-4 text-3xl font-black sm:text-4xl"
            >
              DELIVERED WITH TRUST.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-7 max-w-xl text-lg leading-8 text-zinc-300"
            >
              จำหน่ายเหล็กและผลิตภัณฑ์โลหะสำหรับงานก่อสร้าง
              งานโครงสร้าง และงานอุตสาหกรรม
              พร้อมบริการตั้งแต่การเสนอราคาจนถึงการจัดส่ง
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                href="/products"
                className="group flex items-center gap-2 bg-[#8b352d] px-7 py-4 font-black"
              >
                ดูสินค้าทั้งหมด
                <ArrowRight
                  className="transition group-hover:translate-x-1"
                  size={18}
                />
              </Link>

              <Link
                href="/contact"
                className="border border-white/20 bg-white/5 px-7 py-4 font-black transition hover:bg-white hover:text-black"
              >
                ขอใบเสนอราคา
              </Link>
            </motion.div>
          </div>

          <ParallaxPanel />
        </div>
      </section>

      {/* PRODUCT MARQUEE */}
      <section className="overflow-hidden border-y border-black/5 bg-[#8b352d] py-4 text-white">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex w-max"
        >
          {[...products, ...products].map((product, index) => (
            <span
              key={`${product.slug}-${index}`}
              className="mx-8 whitespace-nowrap text-xs font-black tracking-wider"
            >
              {product.name}
              <b className="ml-12 opacity-40">◆</b>
            </span>
          ))}
        </motion.div>
      </section>

      {/* PRODUCTS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Reveal>
          <p className="font-black tracking-[.18em] text-[#8b352d]">
            PRODUCT RANGE
          </p>

          <div className="mt-3 flex items-end justify-between gap-6">
            <h2 className="text-4xl font-black sm:text-5xl">
              สินค้าเหล็กสำหรับทุกโครงสร้าง
            </h2>

            <Link
              href="/products"
              className="hidden shrink-0 font-black text-[#8b352d] sm:block"
            >
              VIEW ALL →
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
          {products.slice(0, 6).map((product, index) => (
            <Item key={product.slug}>
              <Link
                href={`/products/${product.slug}`}
                className="block h-full"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="group relative h-full overflow-hidden border bg-white p-7"
                >
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-[#8b352d]"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.07,
                      duration: 0.7,
                    }}
                  />

                  <div className="grid h-16 w-16 place-items-center bg-[#202124] font-black text-[#c46b60] transition duration-300 group-hover:bg-[#8b352d] group-hover:text-white">
                    {product.code}
                  </div>

                  <h3 className="mt-6 text-xl font-black">
                    {product.name}
                  </h3>

                  <p className="mt-3 leading-7 text-zinc-600">
                    {product.short}
                  </p>

                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#8b352d]">
                    รายละเอียด
                    <ArrowRight
                      size={15}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </motion.div>
              </Link>
            </Item>
          ))}
        </Stagger>

        <div className="mt-8 sm:hidden">
          <Link href="/products" className="font-black text-[#8b352d]">
            ดูสินค้าทั้งหมด →
          </Link>
        </div>
      </section>

      {/* WHY SUPARERK */}
      <section className="bg-[#efeeea]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <Reveal>
            <p className="font-black tracking-[.18em] text-[#8b352d]">
              WHY SUPARERK STEEL
            </p>

            <h2 className="mt-3 max-w-3xl text-4xl font-black sm:text-5xl">
              มากกว่าการขายเหล็ก
              <br />
              คือความพร้อมในทุกขั้นตอน
            </h2>
          </Reveal>

          <Stagger className="mt-14 grid gap-8 md:grid-cols-3">
            <Item>
              <div className="border-t border-zinc-300 pt-7">
                <ShieldCheck size={34} className="text-[#8b352d]" />

                <p className="mt-8 text-xs font-black tracking-[.2em] text-zinc-400">
                  QUALITY
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  สเปกถูกต้อง
                </h3>

                <p className="mt-3 leading-7 text-zinc-600">
                  ให้ความสำคัญกับมาตรฐานและคุณภาพสินค้า
                </p>
              </div>
            </Item>

            <Item>
              <div className="border-t border-zinc-300 pt-7">
                <PackageCheck size={34} className="text-[#8b352d]" />

                <p className="mt-8 text-xs font-black tracking-[.2em] text-zinc-400">
                  STOCK
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  สินค้าหลากหลาย
                </h3>

                <p className="mt-3 leading-7 text-zinc-600">
                  รองรับลูกค้ารายย่อย ผู้รับเหมา ร้านค้า และโครงการ
                </p>
              </div>
            </Item>

            <Item>
              <div className="border-t border-zinc-300 pt-7">
                <Truck size={34} className="text-[#8b352d]" />

                <p className="mt-8 text-xs font-black tracking-[.2em] text-zinc-400">
                  DELIVERY
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  พร้อมจัดส่ง
                </h3>

                <p className="mt-3 leading-7 text-zinc-600">
                  สนับสนุนตั้งแต่เสนอราคาจนถึงจัดส่งสินค้า
                </p>
              </div>
            </Item>
          </Stagger>
        </div>
      </section>

      {/* BRANCHES */}
      <Branches />

      {/* COMPANY */}
      <section className="bg-[#202124] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="font-black tracking-[.18em] text-[#c46b60]">
              SUPARERK STEEL
            </p>

            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
              เหล็กที่ดี
              <br />
              เริ่มต้นจากความพร้อม
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-zinc-300">
              เรามุ่งพัฒนาการบริหารสินค้า คลังสินค้า การขาย
              และการจัดส่ง เพื่อรองรับความต้องการของลูกค้า
              ตั้งแต่งานขนาดเล็กจนถึงงานโครงการ
            </p>

            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 font-black text-[#c46b60]"
            >
              รู้จักเราเพิ่มเติม
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-2 gap-px bg-white/10">
              <div className="bg-[#272728] p-8">
                <p className="text-4xl font-black text-[#c46b60]">2</p>
                <p className="mt-2 text-sm font-bold text-zinc-300">
                  สาขาให้บริการ
                </p>
              </div>

              <div className="bg-[#272728] p-8">
                <p className="text-4xl font-black text-[#c46b60]">
                  2020
                </p>
                <p className="mt-2 text-sm font-bold text-zinc-300">
                  ก่อตั้งบริษัท
                </p>
              </div>

              <div className="col-span-2 bg-[#272728] p-8">
                <p className="text-xs font-black tracking-[.2em] text-[#c46b60]">
                  SERVICE AREA
                </p>

                <p className="mt-3 text-2xl font-black">
                  สุพรรณบุรี • กาญจนบุรี
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="overflow-hidden bg-[#8b352d] text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-20 lg:flex-row lg:items-center"
        >
          <div>
            <p className="text-xs font-black tracking-[.2em] text-white/60">
              LET&apos;S BUILD TOGETHER
            </p>

            <h2 className="mt-3 text-4xl font-black sm:text-5xl">
              ต้องการสอบถามสินค้า
              <br />
              หรือขอใบเสนอราคา?
            </h2>
          </div>

          <Link
            href="/contact"
            className="group inline-flex w-fit items-center gap-3 bg-white px-7 py-4 font-black text-[#8b352d]"
          >
            ติดต่อเรา
            <ArrowRight
              size={18}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}