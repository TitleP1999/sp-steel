"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "../data/products";

export default function HomeProductStrip({ products }: { products: Product[] }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number>();
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0, moved: false, lastX: 0, lastTime: 0, velocity: 0 });
  const updateProgress = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const strip = stripRef.current;
      const thumb = progressRef.current;
      if (!strip || !thumb) return;
      const maxScroll = strip.scrollWidth - strip.clientWidth;
      const progress = maxScroll > 0 ? strip.scrollLeft / maxScroll : 0;
      thumb.style.transform = `translate3d(${progress * 69}px, 0, 0)`;
    });
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
        <Link href="/products" className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-[#8b352d] px-4 py-2 text-xs font-black text-white transition hover:bg-[#67251f] sm:px-5 sm:text-sm">ดูสินค้าทั้งหมด <ArrowRight size={15}/></Link>
      </div>
      <div ref={stripRef} onScroll={updateProgress} onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} onDragStart={event => event.preventDefault()} onClickCapture={event => { if (dragRef.current.moved) { event.preventDefault(); event.stopPropagation(); dragRef.current.moved = false; } }} className="mt-6 flex cursor-grab gap-3 overflow-x-auto pb-2 select-none touch-auto overscroll-x-contain [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden sm:gap-4">
        {products.map(product => <Link draggable={false} key={product.slug} href={`/products/${product.slug}`} className="group w-[185px] shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:w-[220px]">
          <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200"><Image draggable={false} src={product.image} alt={product.name} fill sizes="220px" className="pointer-events-none object-cover transition duration-300 group-hover:scale-105"/><span className="absolute bottom-3 left-3 bg-[#a6292e] px-3 py-1.5 text-[10px] font-black tracking-[.12em] text-white shadow-sm">{product.code}</span></div>
          <div className="p-3 sm:p-4"><h3 className="line-clamp-2 min-h-12 text-base font-black leading-6">{product.name}</h3><span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-zinc-500">ดูสินค้า <ArrowRight size={13} className="transition group-hover:translate-x-1"/></span></div>
        </Link>)}
      </div>
      <div aria-hidden="true" className="relative mx-auto mt-3 h-1.5 w-24 overflow-hidden rounded-full bg-zinc-300"><span ref={progressRef} className="absolute inset-y-0 left-0 w-[28%] rounded-full bg-[#8b352d] will-change-transform"/></div>
    </div>
  </section>;
}
