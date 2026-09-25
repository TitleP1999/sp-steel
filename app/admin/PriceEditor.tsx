"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import type { Product } from "../../data/products";
import { categories } from "../../data/products";
import { updatePrices } from "./actions";

export default function PriceEditor({ products, revision: initialRevision }: { products: Product[]; revision: string }) {
  const initial = Object.fromEntries(products.map(p => [p.slug, p.options.map(o => String(o.price))]));
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
  const visible = products.filter(p => (!category || p.category === category) && `${p.name} ${p.en} ${p.code}`.toLowerCase().includes(query.toLowerCase().trim()));

  async function save(product: Product) {
    const current = values[product.slug];
    if (current.some(v => !/^\d+(\.\d{1,2})?$/.test(v) || Number(v) > 100000000)) {
      setMessage({ slug: product.slug, text: "กรุณากรอกราคาทุกขนาดให้ถูกต้อง (ทศนิยมไม่เกิน 2 ตำแหน่ง)", error: true }); return;
    }
    setPending(product.slug); setMessage(null);
    try {
      const result = await updatePrices(product.slug, current.map(Number), revision);
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
    <div className="my-8 grid gap-4 rounded-lg border bg-white p-5 sm:grid-cols-2"><label className="text-sm font-bold">ค้นหาสินค้า<input value={query} onChange={e => setQuery(e.target.value)} placeholder="ชื่อสินค้า / รหัสสินค้า" className="mt-2 w-full rounded border p-3 font-normal" /></label><label className="text-sm font-bold">หมวดสินค้า<select value={category} onChange={e => setCategory(e.target.value)} className="mt-2 w-full rounded border bg-white p-3 font-normal"><option value="">ทุกหมวดสินค้า</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label></div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-zinc-600">{visible.length} สินค้า · {products.reduce((n, p) => n + p.options.length, 0)} ขนาดทั้งหมด{hasChanges && " · มีราคาที่ยังไม่บันทึก"}</p><button disabled={!!pending} onClick={() => { if (!hasChanges || window.confirm("มีราคาที่ยังไม่บันทึก ต้องการละทิ้งและโหลดข้อมูลล่าสุดหรือไม่?")) window.location.reload(); }} className="text-sm underline">โหลดข้อมูลล่าสุด</button></div>
    {!visible.length && <p className="rounded border p-8 text-center">ไม่พบสินค้าที่ค้นหา</p>}
    <div className="space-y-6">{visible.map(product => <form key={product.slug} onSubmit={e => { e.preventDefault(); void save(product); }} className="rounded-lg border bg-white p-5 sm:p-7">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-zinc-500">{product.category} · {product.code}</p><h2 className="mt-1 text-xl font-bold">{product.name}</h2></div><Link href={`/products/${product.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#8b352d] underline">ดูสินค้า ↗</Link></div>
      <fieldset disabled={!!pending} className="space-y-3"><legend className="sr-only">ราคาของ {product.name}</legend>{product.options.map((option, index) => <label key={option.size} className="grid items-center gap-2 border-t pt-3 sm:grid-cols-[1fr_220px]"><span className="text-sm">{option.size}</span><span className="flex items-center gap-3"><input aria-label={`${product.name} ${option.size} ราคา (บาท)`} type="number" inputMode="decimal" min="0" max="100000000" step="0.01" required value={values[product.slug][index]} onChange={e => { const value = e.target.value; setValues(previous => ({ ...previous, [product.slug]: previous[product.slug].map((v, i) => i === index ? value : v) })); setMessage(null); }} className="min-w-0 w-full rounded border p-3 text-right font-bold" /><span className="text-sm text-zinc-500">บาท</span></span></label>)}</fieldset>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3"><div aria-live="polite">{message?.slug === product.slug && <p role={message.error ? "alert" : "status"} className={`text-sm ${message.error ? "text-red-700" : "text-green-700"}`}>{message.text}</p>}</div><button disabled={!!pending || !dirty(product.slug)} className="rounded bg-[#8b352d] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{pending === product.slug ? "กำลังบันทึก…" : "บันทึกราคาสินค้านี้"}</button></div>
    </form>)}</div>
  </>;
}
