"use client";

import { useState } from "react";
import type { NewsItem } from "../../lib/news";
import { updateNews } from "./actions";
import ImageFilePicker from "./ImageFilePicker";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function newId() {
  return globalThis.crypto?.randomUUID?.() || `news-${Date.now()}`;
}

function blankNews(): NewsItem {
  return { id: newId(), title: "", summary: "", category: "ข่าวสาร", publishedAt: today(), href: "", imageUrl: "", published: true };
}

function copyItems(items: NewsItem[]) {
  return items.map(item => ({ ...item }));
}

export default function NewsEditor({ items: initialItems, revision: initialRevision }: { items: NewsItem[]; revision: string }) {
  const [items, setItems] = useState(() => copyItems(initialItems));
  const [saved, setSaved] = useState(() => copyItems(initialItems));
  const [revision, setRevision] = useState(initialRevision);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const dirty = JSON.stringify(items) !== JSON.stringify(saved);

  function updateItem(id: string, key: keyof NewsItem, value: string | boolean) {
    setItems(current => current.map(item => item.id === id ? { ...item, [key]: value } : item));
    setMessage(null);
  }

  function removeItem(id: string) {
    if (!window.confirm("ต้องการลบข่าวสารรายการนี้หรือไม่?")) return;
    setItems(current => current.filter(item => item.id !== id));
    setMessage(null);
  }

  async function save() {
    setPending(true); setMessage(null);
    try {
      const result = await updateNews(items, revision);
      if (result.error) setMessage({ text: result.error, error: true });
      else if (result.revision) {
        setRevision(result.revision);
        setSaved(copyItems(items));
        setMessage({ text: "บันทึกข่าวสารแล้ว หน้าเว็บจะแสดงเฉพาะรายการที่เลือกเผยแพร่", error: false });
      }
    } catch {
      setMessage({ text: "บันทึกไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อหรือเข้าสู่ระบบใหม่", error: true });
    } finally { setPending(false); }
  }

  return <section className="mt-8">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div><h2 className="text-2xl font-black">จัดการข่าวสาร</h2><p className="mt-1 text-sm text-zinc-600">เพิ่ม แก้ไข หรือลบข่าวสารที่จะแสดงในหน้า “ข่าวสาร”</p></div>
      <p className="text-sm text-zinc-500">{items.length} รายการ{dirty && " · มีข้อมูลที่ยังไม่บันทึก"}</p>
    </div>
    {!items.length && <p className="rounded-lg border bg-white p-6 text-center text-zinc-600">ยังไม่มีข่าวสาร กด “เพิ่มข่าวสาร” เพื่อเริ่มต้น</p>}
    <form onSubmit={event => { event.preventDefault(); void save(); }} className="space-y-5">
      {items.map((item, index) => <article key={item.id} className="rounded-lg border bg-white p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3"><h3 className="font-bold">ข่าวสารรายการที่ {index + 1}</h3><button type="button" disabled={pending} onClick={() => removeItem(item.id)} className="text-sm text-red-700 underline disabled:opacity-40">ลบรายการนี้</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold sm:col-span-2">หัวข้อข่าวสาร<input required maxLength={160} value={item.title} onChange={event => updateItem(item.id, "title", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="เช่น โปรโมชั่นเหล็กราคาพิเศษ" /></label>
          <label className="text-sm font-bold sm:col-span-2">คำโปรย / รายละเอียดสั้น<textarea maxLength={500} rows={3} value={item.summary} onChange={event => updateItem(item.id, "summary", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="รายละเอียดที่ต้องการให้ลูกค้าเห็นในการ์ดข่าวสาร" /></label>
          <label className="text-sm font-bold">หมวดข่าวสาร<input maxLength={60} value={item.category} onChange={event => updateItem(item.id, "category", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="ข่าวสาร / โปรโมชั่น / บทความ" /></label>
          <label className="text-sm font-bold">วันที่<input required type="date" value={item.publishedAt} onChange={event => updateItem(item.id, "publishedAt", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" /></label>
          <label className="text-sm font-bold sm:col-span-2">ลิงก์เพิ่มเติม <span className="font-normal text-zinc-500">(ไม่บังคับ)</span><input maxLength={500} value={item.href} onChange={event => updateItem(item.id, "href", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="/contact หรือ https://example.com" /></label>
          <ImageFilePicker label="รูปภาพข่าวสาร" value={item.imageUrl} onChange={value => updateItem(item.id, "imageUrl", value)} disabled={pending} previewClassName="h-32" />
          <label className="flex items-center gap-3 text-sm font-bold sm:col-span-2"><input type="checkbox" checked={item.published} onChange={event => updateItem(item.id, "published", event.target.checked)} className="h-5 w-5 accent-[#8b352d]" />เผยแพร่รายการนี้บนหน้าเว็บ</label>
        </div>
      </article>)}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" disabled={pending} onClick={() => { setItems(current => [...current, blankNews()]); setMessage(null); }} className="rounded border border-[#8b352d] px-5 py-3 text-sm font-bold text-[#8b352d] disabled:opacity-40">+ เพิ่มข่าวสาร</button>
        <div className="flex flex-wrap items-center gap-4"><div aria-live="polite">{message && <p role={message.error ? "alert" : "status"} className={`text-sm ${message.error ? "text-red-700" : "text-green-700"}`}>{message.text}</p>}</div><button type="submit" disabled={pending || !dirty} className="rounded bg-[#8b352d] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{pending ? "กำลังบันทึก…" : "บันทึกข่าวสาร"}</button></div>
      </div>
    </form>
  </section>;
}
