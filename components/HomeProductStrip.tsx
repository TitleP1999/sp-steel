"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "../data/products";

export default function HomeProductStrip({ products }: { products: Product[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false, lastX: 0, lastTime: 0, velocity: 0 });
  const [progress, setProgress] = useState(0);
  const scroll = (direction: number) => stripRef.current?.scrollBy({ left: direction * 640, behavior: "smooth" });
  const updateProgress = () => {
    const strip = stripRef.current;
    if (!strip) return;
    const maxScroll = strip.scrollWidth - strip.clientWidth;
    setProgress(maxScroll > 0 ? strip.scrollLeft / maxScroll : 0);
  };
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    dragRef.current = { active: true, startX: event.clientX, startScroll: event.currentTarget.scrollLeft, moved: false, lastX: event.clientX, lastTime: performance.now(), velocity: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    event.preventDefault();
    const distance = event.clientX - dragRef.current.startX;
    if (Math.abs(distance) > 5) dragRef.current.moved = true;
    event.currentTarget.scrollLeft = dragRef.current.startScroll - distance;
    const now = performance.now();
    const elapsed = Math.max(1, now - dragRef.current.lastTime);
    dragRef.current.velocity = (event.clientX - dragRef.current.lastX) / elapsed;
    dragRef.current.lastX = event.clientX;
    dragRef.current.lastTime = now;
  };
  const stopDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (dragRef.current.moved) event.currentTarget.scrollBy({ left: -dragRef.current.velocity * 260, behavior: "smooth" });
  };

  return <section className="bg-[#f7f6f3] py-10 sm:py-14">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div><p className="text-xs font-black tracking-[.18em] text-[#8b352d]">PRODUCT RANGE</p><h2 className="mt-2 text-2xl font-black sm:text-4xl">หมวดหมู่สินค้า</h2></div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label="เลื่อนสินค้าไปทางซ้าย" className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300 bg-white text-[#8b352d] transition hover:bg-zinc-100"><ChevronLeft size={19}/></button>
          <button type="button" onClick={() => scroll(1)} aria-label="เลื่อนสินค้าไปทางขวา" className="grid h-10 w-10 place-items-center rounded-full bg-[#8b352d] text-white transition hover:bg-[#67251f]"><ChevronRight size={19}/></button>
          <Link href="/products" className="ml-1 hidden text-sm font-black text-[#8b352d] sm:inline-flex">ดูทั้งหมด →</Link>
        </div>
      </div>
      <div ref={stripRef} onScroll={updateProgress} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onDragStart={event => event.preventDefault()} onClickCapture={event => { if (dragRef.current.moved) { event.preventDefault(); event.stopPropagation(); dragRef.current.moved = false; } }} className="mt-6 flex cursor-grab gap-3 overflow-x-auto pb-2 select-none touch-pan-y [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden sm:gap-4">
        {products.map(product => <Link draggable={false} key={product.slug} href={`/products/${product.slug}`} className="group w-[185px] shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-[220px]">
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200"><Image draggable={false} src={product.image} alt={product.name} fill sizes="220px" className="pointer-events-none object-cover transition duration-300 group-hover:scale-105"/></div>
          <div className="p-3 sm:p-4"><span className="text-[10px] font-black tracking-wide text-[#8b352d]">{product.code}</span><h3 className="mt-1 line-clamp-2 min-h-12 text-base font-black leading-6">{product.name}</h3><span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-zinc-500">ดูสินค้า <ArrowRight size={13} className="transition group-hover:translate-x-1"/></span></div>
        </Link>)}
      </div>
      <div aria-hidden="true" className="relative mx-auto mt-3 h-1.5 w-24 overflow-hidden rounded-full bg-zinc-300"><span className="absolute inset-y-0 w-[28%] rounded-full bg-[#8b352d] transition-[left] duration-150" style={{ left: `${progress * 72}%` }}/></div>
    </div>
  </section>;
}
