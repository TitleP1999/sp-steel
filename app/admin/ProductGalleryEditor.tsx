"use client";

import { useState } from "react";
import type { Product } from "../../data/products";
import type { ProductGalleryItem } from "../../lib/product-gallery";
import { updateProductGallery } from "./actions";

const newId = () => globalThis.crypto?.randomUUID?.() || `gallery-${Date.now()}`;
const copy = (items: ProductGalleryItem[]) => items.map(item => ({ ...item }));

async function optimizeImage(file: File) {
  if (!/^image\/(jpeg|png)$/i.test(file.type)) throw new Error("รองรับเฉพาะไฟล์ JPEG และ PNG");
  if (file.size > 12 * 1024 * 1024) throw new Error("ไฟล์ต้นฉบับต้องมีขนาดไม่เกิน 12 MB");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / bitmap.width, 1200 / bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", .78);
}

export default function ProductGalleryEditor({ products, items: initialItems, revision: initialRevision }: { products: Product[]; items: ProductGalleryItem[]; revision: string }) {
  const [items, setItems] = useState(() => copy(initialItems));
  const [saved, setSaved] = useState(() => copy(initialItems));
  const [revision, setRevision] = useState(initialRevision);
  const [productSlug, setProductSlug] = useState(products[0]?.slug || "");
  const [pending, setPending] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const dirty = JSON.stringify(items) !== JSON.stringify(saved);
  const visible = items.filter(item => item.productSlug === productSlug);
  const update = (id: string, key: keyof ProductGalleryItem, value: string | boolean) => { setItems(current => current.map(item => item.id === id ? { ...item, [key]: value } : item)); setMessage(null); };
  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setProcessing(true); setMessage(null);
    try {
      const next: ProductGalleryItem[] = [];
      for (const file of Array.from(files)) next.push({ id: newId(), productSlug, title: file.name.replace(/\.[^.]+$/, ""), imageUrl: await optimizeImage(file), published: true });
      setItems(current => [...current, ...next]);
    } catch (error) { setMessage({ text: error instanceof Error ? error.message : "อ่านไฟล์รูปไม่สำเร็จ", error: true }); }
    finally { setProcessing(false); }
  }
  async function save() {
    setPending(true); setMessage(null);
    try {
      const result = await updateProductGallery(items, revision);
      if (result.error) setMessage({ text: result.error, error: true });
      else if (result.revision) { setRevision(result.revision); setSaved(copy(items)); setMessage({ text: "บันทึกภาพสินค้าแล้ว", error: false }); }
    } catch { setMessage({ text: "บันทึกไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อ", error: true }); }
    finally { setPending(false); }
  }
  return <section id="product-gallery" className="mt-14 scroll-mt-24 border-t pt-10">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-black">จัดการภาพสินค้าจริง</h2><p className="mt-1 text-sm text-zinc-600">เลือกรูป JPEG/PNG และใส่คำบรรยายสำหรับสินค้าแต่ละชนิด</p></div><label className="text-sm font-bold">เลือกสินค้า<select value={productSlug} onChange={event => setProductSlug(event.target.value)} className="ml-3 rounded border bg-white p-3 font-normal">{products.map(product => <option key={product.slug} value={product.slug}>{product.name}</option>)}</select></label></div>
    <div className="mt-5 rounded-lg border border-dashed border-[#8b352d] bg-white p-5"><label className="inline-flex cursor-pointer items-center rounded bg-[#8b352d] px-5 py-3 text-sm font-bold text-white"><input type="file" accept="image/jpeg,image/png" multiple className="sr-only" disabled={processing || pending} onChange={event => { void addFiles(event.target.files); event.currentTarget.value = ""; }}/>{processing ? "กำลังย่อรูป…" : "+ Browse JPEG / PNG"}</label><p className="mt-2 text-xs text-zinc-500">เลือกได้หลายรูป ระบบจะย่อภาพให้เหมาะกับหน้าเว็บอัตโนมัติ</p></div>
    {!visible.length && <p className="mt-5 rounded-lg border bg-white p-6 text-center text-zinc-500">สินค้านี้ยังไม่มีรูปที่เพิ่มจาก Admin</p>}
    <div className="mt-5 grid gap-5 sm:grid-cols-2">{visible.map(item => <article key={item.id} className="rounded-lg border bg-white p-4"><img src={item.imageUrl} alt="" className="aspect-[4/3] w-full rounded object-cover"/><label className="mt-4 block text-sm font-bold">คำบรรยายสั้น ๆ<input required maxLength={160} value={item.title} onChange={event => update(item.id, "title", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="เช่น เหล็กพร้อมส่งจากคลัง"/></label><div className="mt-4 flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={item.published} onChange={event => update(item.id, "published", event.target.checked)} className="h-5 w-5 accent-[#8b352d]"/>เผยแพร่</label><button type="button" onClick={() => { if (window.confirm("ลบรูปนี้หรือไม่?")) setItems(current => current.filter(value => value.id !== item.id)); }} className="text-sm font-bold text-red-700 underline">ลบรูป</button></div></article>)}</div>
    <div className="mt-5 flex flex-wrap items-center justify-end gap-4"><div aria-live="polite">{message && <p className={`text-sm ${message.error ? "text-red-700" : "text-green-700"}`}>{message.text}</p>}</div><button type="button" onClick={() => void save()} disabled={pending || processing || !dirty} className="rounded bg-[#8b352d] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{pending ? "กำลังบันทึก…" : "บันทึกภาพสินค้า"}</button></div>
  </section>;
}
