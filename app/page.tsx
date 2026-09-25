"use client";

import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  PackageCheck,
} from "lucide-react";
import { products } from "../data/products";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Reveal,
  Stagger,
  Item,
  ParallaxPanel,
} from "../components/Motion";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <main>
      {/* SCROLL PROGRESS */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: "0%",
        }}
        className="fixed left-0 top-0 z-[70] h-[3px] w-full bg-[#b45145]"
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#19191b] text-white">
        <div className="gridbg absolute inset-0 opacity-80" />

        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          transition={{
            duration: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute right-0 top-0 hidden h-full w-[38%] bg-[#8b352d]/15 lg:block"
        />

        <div className="relative mx-auto grid min-h-[690px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.08fr_.92fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-black tracking-[.22em] text-[#c46b60]"
            >
              SUPARERK STEEL CO., LTD.
            </motion.p>

            <div className="mt-6 overflow-hidden">
              <motion.h1
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.85,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-5xl font-black leading-[.98] tracking-[-.035em] sm:text-7xl xl:text-[82px]"
              >
                BUILT FOR
                <br />
                STRENGTH.
              </motion.h1>
            </div>

            <div className="mt-2 overflow-hidden">
              <motion.h2
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.85,
                  delay: 0.12,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-4xl font-black tracking-[-.03em] text-[#b45145] sm:text-6xl"
              >
                DELIVERED WITH TRUST.
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.38,
                duration: 0.7,
              }}
              className="mt-7 max-w-xl text-lg leading-8 text-zinc-300"
            >
              ศูนย์รวมเหล็กสำหรับงานก่อสร้าง งานโครงสร้าง
              และภาคอุตสาหกรรม พร้อมสต๊อกสินค้าและบริการจัดส่ง
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
          animate={{
            x: ["0%", "-50%"],
          }}
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

      {/* PRODUCT RANGE */}
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

                  <div className="grid h-16 w-16 place-items-center bg-[#202124] px-2 text-center text-xs font-black text-[#c46b60] transition duration-300 group-hover:bg-[#8b352d] group-hover:text-white">
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
          <Link
            href="/products"
            className="font-black text-[#8b352d]"
          >
            ดูสินค้าทั้งหมด →
          </Link>
        </div>
      </section>

      {/* WHY SUPARERK STEEL */}
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
                <ShieldCheck
                  size={34}
                  className="text-[#8b352d]"
                />

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
                <PackageCheck
                  size={34}
                  className="text-[#8b352d]"
                />

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
                <Truck
                  size={34}
                  className="text-[#8b352d]"
                />

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

      {/* COMPANY STORY */}
      <section className="bg-[#202124] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2">
          <Reveal>
            <p className="font-black tracking-[.18em] text-[#c46b60]">
              SINCE 2020
            </p>

            <h2 className="mt-4 text-5xl font-black leading-tight">
              เติบโตด้วยคุณภาพ
              <br />
              และความเชื่อมั่น
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-lg leading-9 text-zinc-300">
              จากจุดเริ่มต้นในจังหวัดสุพรรณบุรี
              บริษัทพัฒนาทั้งประเภทสินค้า พื้นที่คลัง
              ระบบจัดส่ง และพื้นที่ให้บริการ
              เพื่อรองรับลูกค้าที่หลากหลายและการเติบโตในระยะยาว
            </p>

            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-3 font-black text-[#d28a80]"
            >
              เรื่องราวของเรา
              <ArrowRight className="transition group-hover:translate-x-2" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#8b352d] text-white">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -right-24 -top-52 h-96 w-96 rounded-full border border-white/10"
        />

        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-7 px-6 py-16">
          <Reveal>
            <p className="text-sm font-bold text-[#f0d8d4]">
              LET&apos;S BUILD TOGETHER
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              ต้องการสินค้าเหล็ก หรือขอใบเสนอราคา?
            </h2>
          </Reveal>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/contact"
              className="group flex items-center gap-3 bg-white px-8 py-4 font-black text-[#8b352d]"
            >
              ติดต่อฝ่ายขาย
              <ArrowRight className="transition group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}