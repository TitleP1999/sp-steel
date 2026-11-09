"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import type { Product } from "../../data/products";
import { categories } from "../../data/products";
import { getProductSpecifications } from "../../lib/product-specifications";
import { updatePrices } from "./actions";

export default function PriceEditor({ products, revision: initialRevision }: { products: Product[]; revision: string }) {
  const initial = Object.fromEntries(products.map(p => [p.slug, p.options.map(o => o.price === null ? "" : String(o.price))]));
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [revision, setRevision] = useState(initialRevision);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [message, setMessage] = useState<{ slug: string; text: string; error: boolean } | null>(null);
  const dirty = (slug: string) => values[slug].some((v, i) => v !== saved[slug][i]);
  const hasChanges = products.some(p => dirty(p.slug));
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
    if (hasChanges) window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasChanges]);
  const term = query.trim().toLowerCase();
  const visible = products.filter(p => (!category || p.category === category) &&
    [p.name, p.en, p.code, ...p.options.map(option => option.size)].some(value => value.toLowerCase().includes(term)));

  async function save(product: Product) {
    const current = values[product.slug];
    if (current.some(v => v !== "" && (!/^(?:\d+(?:\.\d{1,2})?|\.\d{1,2})$/.test(v) || Number(v) > 100000000))) {
      setMessage({ slug: product.slug, text: "ราคาต้องอยู่ระหว่าง 0–100,000,000 บาท และมีทศนิยมไม่เกิน 2 ตำแหน่ง", error: true }); return;
    }
    setPending(product.slug); setMessage(null);
    try {
      const result = await updatePrices(product.slug, current.map(value => value === "" ? null : Number(value)), revision);
      if (result.error) setMessage({ slug: product.slug, text: result.error, error: true });
      else if (result.revision) {
        setRevision(result.revision);
        setSaved(previous => ({ ...previous, [product.slug]: [...current] }));
        setMessage({ slug: product.slug, text: "บันทึกแล้ว ราคาหน้าร้านอัปเดตเรียบร้อย", error: false });
      }
    } catch { setMessage({ slug: product.slug, text: "บันทึกไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อหรือเข้าสู่ระบบใหม่", error: true }); }
    finally { setPending(null); }
  }

  return <>
    <div className="my-5 grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-[2fr_1fr]">
      <label className="text-sm font-bold">ค้นหาสินค้า
        <span className="relative mt-2 block">
          <Search size={17} className="pointer-events-none absolute left-3 top-3.5 text-zinc-500" aria-hidden="true" />
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="ชื่อ รหัส หรือขนาดสินค้า" className="min-h-11 w-full rounded-lg border border-zinc-300 py-2 pl-9 pr-3 font-normal" />
        </span>
      </label>
      <label className="text-sm font-bold">หมวดสินค้า
        <select value={category} onChange={e => setCategory(e.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-zinc-300 bg-white p-2 font-normal">
          <option value="">ทุกหมวดสินค้า</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </label>
    </div>
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p className="text-zinc-600">{visible.length} จาก {products.length} สินค้า · {visible.reduce((n, p) => n + p.options.length, 0)} ขนาด{hasChanges && " · มีราคาที่ยังไม่บันทึก"}</p>
      <button type="button" disabled={!!pending} onClick={() => {
        if (!hasChanges || window.confirm("มีราคาที่ยังไม่บันทึก ต้องการละทิ้งและโหลดข้อมูลล่าสุดหรือไม่?")) window.location.reload();
      }} className="min-h-10 font-bold text-[#8b352d] underline disabled:opacity-40">โหลดข้อมูลล่าสุด</button>
    </div>
    {!visible.length && <p className="rounded-xl border bg-white p-8 text-center">ไม่พบสินค้าที่ค้นหา</p>}
    <div className="space-y-2">
      {visible.map(product => {
        const specs = getProductSpecifications(product);
        const pricedCount = saved[product.slug].filter(value => value !== "").length;
        return <details key={product.slug} className="group rounded-xl border border-zinc-200 bg-white">
          <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 marker:hidden sm:px-5">
            <span className="min-w-0 flex-1">
              <span className="block text-xs text-zinc-500">{product.code} · {product.category}</span>
              <span className="mt-1 block font-bold">{product.name}</span>
            </span>
            <span className="text-right text-xs text-zinc-600">
              {dirty(product.slug) && <span className="mb-1 block font-bold text-[#8b352d]">ยังไม่บันทึก</span>}
              ตั้งราคา {pricedCount}/{product.options.length} ขนาด
            </span>
            <ChevronDown size={18} className="shrink-0 text-zinc-500 group-open:rotate-180" aria-hidden="true" />
          </summary>
          <form onSubmit={e => { e.preventDefault(); void save(product); }} className="border-t px-4 py-4 sm:px-5">
            <Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="mb-3 inline-block text-sm font-bold text-[#8b352d] underline">ดูหน้าสินค้า ↗</Link>
            <fieldset disabled={!!pending}>
              <legend className="sr-only">ราคาของ {product.name}</legend>
              {product.options.map((option, index) => {
                const unit = product.slug === "tiscon-superlinks" ? "กก." : specs[index]?.saleUnit ?? "หน่วย";
                return <label key={option.size} className="grid items-center gap-2 border-t py-3 sm:grid-cols-[1fr_240px]">
                  <span className="text-sm">{option.size}</span>
                  <span className="flex items-center gap-2">
                    <input aria-label={`${product.name} ${option.size} ราคา`} type="number" inputMode="decimal" min="0" max="100000000" step="0.01"
                      placeholder="สอบถามราคา" value={values[product.slug][index]} onChange={e => {
                        const value = e.target.value;
                        setValues(previous => ({ ...previous, [product.slug]: previous[product.slug].map((v, i) => i === index ? value : v) }));
                        setMessage(null);
                      }} className="min-w-0 flex-1 rounded-lg border border-zinc-300 p-2.5 text-right font-bold placeholder:font-normal" />
                    <span className="shrink-0 text-xs text-zinc-500">บาท/{unit}</span>
                  </span>
                </label>;
              })}
            </fieldset>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div aria-live="polite">{message?.slug === product.slug && <p role={message.error ? "alert" : "status"} className={`text-sm ${message.error ? "text-red-700" : "text-green-700"}`}>{message.text}</p>}</div>
              <button type="submit" disabled={!!pending || !dirty(product.slug)} className="!rounded-lg bg-[#8b352d] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">
                {pending === product.slug ? "กำลังบันทึก…" : "บันทึกราคาสินค้านี้"}
              </button>
            </div>
          </form>
        </details>;
      })}
    </div>
  </>;
}
