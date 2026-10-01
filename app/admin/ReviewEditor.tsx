"use client";

import { useState } from "react";
import type { ReviewItem } from "../../lib/reviews";
import { updateReviews } from "./actions";
import ImageFilePicker from "./ImageFilePicker";

const today = () => new Date().toISOString().slice(0, 10);
const newId = () => globalThis.crypto?.randomUUID?.() || `review-${Date.now()}`;
const blankReview = (): ReviewItem => ({ id: newId(), customerName: "", company: "", message: "", product: "", rating: 5, reviewedAt: today(), imageUrl: "", published: true });
const copyItems = (items: ReviewItem[]) => items.map(item => ({ ...item }));

export default function ReviewEditor({ items: initialItems, revision: initialRevision }: { items: ReviewItem[]; revision: string }) {
  const [items, setItems] = useState(() => copyItems(initialItems));
  const [saved, setSaved] = useState(() => copyItems(initialItems));
  const [revision, setRevision] = useState(initialRevision);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const dirty = JSON.stringify(items) !== JSON.stringify(saved);
  const updateItem = (id: string, key: keyof ReviewItem, value: string | number | boolean) => { setItems(current => current.map(item => item.id === id ? { ...item, [key]: value } : item)); setMessage(null); };
  const removeItem = (id: string) => { if (window.confirm("ต้องการลบรีวิวรายการนี้หรือไม่?")) { setItems(current => current.filter(item => item.id !== id)); setMessage(null); } };
  async function save() {
    setPending(true); setMessage(null);
    try {
      const result = await updateReviews(items, revision);
      if (result.error) setMessage({ text: result.error, error: true });
      else if (result.revision) { setRevision(result.revision); setSaved(copyItems(items)); setMessage({ text: "บันทึกรีวิวแล้ว หน้าเว็บจะแสดงเฉพาะรายการที่เลือกเผยแพร่", error: false }); }
    } catch { setMessage({ text: "บันทึกไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อหรือเข้าสู่ระบบใหม่", error: true }); }
    finally { setPending(false); }
  }
  return <section className="mt-14 border-t pt-10">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">จัดการรีวิวจากลูกค้า</h2><p className="mt-1 text-sm text-zinc-600">เพิ่ม แก้ไข หรือลบรีวิวที่แสดงบนหน้า “รีวิวจากลูกค้า”</p></div><p className="text-sm text-zinc-500">{items.length} รายการ{dirty && " · มีข้อมูลที่ยังไม่บันทึก"}</p></div>
    {!items.length && <p className="rounded-lg border bg-white p-6 text-center text-zinc-600">ยังไม่มีรีวิว กด “เพิ่มรีวิว” เพื่อเริ่มต้น</p>}
    <form onSubmit={event => { event.preventDefault(); void save(); }} className="space-y-5">
      {items.map((item, index) => <article key={item.id} className="rounded-lg border bg-white p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3"><h3 className="font-bold">รีวิวรายการที่ {index + 1}</h3><button type="button" disabled={pending} onClick={() => removeItem(item.id)} className="text-sm text-red-700 underline disabled:opacity-40">ลบรายการนี้</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold">ชื่อลูกค้า<input required maxLength={120} value={item.customerName} onChange={event => updateItem(item.id, "customerName", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="คุณสมชาย" /></label>
          <label className="text-sm font-bold">บริษัท / ร้านค้า <span className="font-normal text-zinc-500">(ไม่บังคับ)</span><input maxLength={160} value={item.company} onChange={event => updateItem(item.id, "company", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="บริษัท ตัวอย่าง จำกัด" /></label>
          <label className="text-sm font-bold sm:col-span-2">ข้อความรีวิว<textarea required maxLength={1500} rows={4} value={item.message} onChange={event => updateItem(item.id, "message", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="ข้อความจากลูกค้า" /></label>
          <label className="text-sm font-bold sm:col-span-2">สินค้า / บริการที่ใช้ <span className="font-normal text-zinc-500">(ไม่บังคับ)</span><input maxLength={160} value={item.product} onChange={event => updateItem(item.id, "product", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="เช่น เหล็กกล่องและบริการจัดส่ง" /></label>
          <label className="text-sm font-bold">คะแนน<select value={item.rating} onChange={event => updateItem(item.id, "rating", Number(event.target.value))} className="mt-2 w-full rounded border bg-white p-3 font-normal">{[5, 4, 3, 2, 1].map(rating => <option key={rating} value={rating}>{rating} ดาว</option>)}</select></label>
          <label className="text-sm font-bold">วันที่รีวิว<input required type="date" value={item.reviewedAt} onChange={event => updateItem(item.id, "reviewedAt", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" /></label>
          <ImageFilePicker label="รูปภาพลูกค้า / ผลงาน" value={item.imageUrl} onChange={value => updateItem(item.id, "imageUrl", value)} disabled={pending} previewClassName="h-40" />
          <label className="flex items-center gap-3 text-sm font-bold sm:col-span-2"><input type="checkbox" checked={item.published} onChange={event => updateItem(item.id, "published", event.target.checked)} className="h-5 w-5 accent-[#8b352d]" />เผยแพร่รายการนี้บนหน้าเว็บ</label>
        </div>
      </article>)}
      <div className="flex flex-wrap items-center justify-between gap-3"><button type="button" disabled={pending} onClick={() => { setItems(current => [...current, blankReview()]); setMessage(null); }} className="rounded border border-[#8b352d] px-5 py-3 text-sm font-bold text-[#8b352d] disabled:opacity-40">+ เพิ่มรีวิว</button><div className="flex flex-wrap items-center gap-4"><div aria-live="polite">{message && <p role={message.error ? "alert" : "status"} className={`text-sm ${message.error ? "text-red-700" : "text-green-700"}`}>{message.text}</p>}</div><button type="submit" disabled={pending || !dirty} className="rounded bg-[#8b352d] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{pending ? "กำลังบันทึก…" : "บันทึกรีวิว"}</button></div></div>
    </form>
  </section>;
}
