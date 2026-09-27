"use client";

import { useState } from "react";
import type { HomeProjectItem } from "../../lib/home-projects";
import { updateHomeProjects } from "./actions";

const newId = () => globalThis.crypto?.randomUUID?.() || `project-${Date.now()}`;
const blankProject = (): HomeProjectItem => ({ id: newId(), title: "", summary: "", imageUrl: "", href: "", published: true });
const copyItems = (items: HomeProjectItem[]) => items.map(item => ({ ...item }));

export default function HomeProjectEditor({ items: initialItems, revision: initialRevision }: { items: HomeProjectItem[]; revision: string }) {
  const [items, setItems] = useState(() => copyItems(initialItems));
  const [saved, setSaved] = useState(() => copyItems(initialItems));
  const [revision, setRevision] = useState(initialRevision);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const dirty = JSON.stringify(items) !== JSON.stringify(saved);
  const updateItem = (id: string, key: keyof HomeProjectItem, value: string | boolean) => { setItems(current => current.map(item => item.id === id ? { ...item, [key]: value } : item)); setMessage(null); };
  const removeItem = (id: string) => { if (window.confirm("ต้องการลบโครงการรายการนี้หรือไม่?")) { setItems(current => current.filter(item => item.id !== id)); setMessage(null); } };
  const moveItem = (index: number, direction: -1 | 1) => setItems(current => { const target = index + direction; if (target < 0 || target >= current.length) return current; const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });
  async function save() {
    setPending(true); setMessage(null);
    try {
      const result = await updateHomeProjects(items, revision);
      if (result.error) setMessage({ text: result.error, error: true });
      else if (result.revision) { setRevision(result.revision); setSaved(copyItems(items)); setMessage({ text: "บันทึกโครงการแล้ว หน้าแรกจะแสดงตามลำดับนี้เฉพาะรายการที่เผยแพร่", error: false }); }
    } catch { setMessage({ text: "บันทึกไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อหรือเข้าสู่ระบบใหม่", error: true }); }
    finally { setPending(false); }
  }
  return <section className="mt-14 border-t pt-10" id="home-projects">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">จัดการโครงการหน้าแรก</h2><p className="mt-1 text-sm text-zinc-600">เพิ่มรูป ชื่อ รายละเอียด ลิงก์ และเรียงลำดับโครงการที่แสดงบนหน้าแรก</p></div><p className="text-sm text-zinc-500">{items.length} รายการ{dirty && " · มีข้อมูลที่ยังไม่บันทึก"}</p></div>
    {!items.length && <p className="rounded-lg border bg-white p-6 text-center text-zinc-600">ยังไม่มีโครงการ กด “เพิ่มโครงการ” เพื่อเริ่มต้น</p>}
    <form onSubmit={event => { event.preventDefault(); void save(); }} className="space-y-5">
      {items.map((item, index) => <article key={item.id} className="rounded-lg border bg-white p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold">โครงการรายการที่ {index + 1}</h3><div className="flex items-center gap-4"><button type="button" disabled={pending || index === 0} onClick={() => moveItem(index, -1)} className="text-sm underline disabled:opacity-30">เลื่อนขึ้น</button><button type="button" disabled={pending || index === items.length - 1} onClick={() => moveItem(index, 1)} className="text-sm underline disabled:opacity-30">เลื่อนลง</button><button type="button" disabled={pending} onClick={() => removeItem(item.id)} className="text-sm text-red-700 underline disabled:opacity-40">ลบ</button></div></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold sm:col-span-2">ชื่อโครงการ<input required maxLength={160} value={item.title} onChange={event => updateItem(item.id, "title", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="เช่น โครงการอาคารสำนักงาน" /></label>
          <label className="text-sm font-bold sm:col-span-2">รายละเอียดสั้น <span className="font-normal text-zinc-500">(ไม่บังคับ)</span><textarea maxLength={500} rows={2} value={item.summary} onChange={event => updateItem(item.id, "summary", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="รายละเอียดของโครงการ" /></label>
          <label className="text-sm font-bold sm:col-span-2">URL รูปภาพ<input required maxLength={1000} value={item.imageUrl} onChange={event => updateItem(item.id, "imageUrl", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="/projects/example.jpg หรือ https://example.com/photo.jpg" /><span className="mt-1 block font-normal text-zinc-500">ใช้ URL รูปภาพ หรือ path ของรูปในโฟลเดอร์ public</span>{item.imageUrl && <img src={item.imageUrl} alt="ตัวอย่างรูปโครงการ" className="mt-3 h-52 w-full border object-cover" />}</label>
          <label className="text-sm font-bold sm:col-span-2">ลิงก์เมื่อกดโครงการ <span className="font-normal text-zinc-500">(ไม่บังคับ)</span><input maxLength={1000} value={item.href} onChange={event => updateItem(item.id, "href", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="/contact หรือ https://example.com" /></label>
          <label className="flex items-center gap-3 text-sm font-bold sm:col-span-2"><input type="checkbox" checked={item.published} onChange={event => updateItem(item.id, "published", event.target.checked)} className="h-5 w-5 accent-[#8b352d]" />เผยแพร่รายการนี้บนหน้าแรก</label>
        </div>
      </article>)}
      <div className="flex flex-wrap items-center justify-between gap-3"><button type="button" disabled={pending} onClick={() => { setItems(current => [...current, blankProject()]); setMessage(null); }} className="rounded border border-[#8b352d] px-5 py-3 text-sm font-bold text-[#8b352d] disabled:opacity-40">+ เพิ่มโครงการ</button><div className="flex flex-wrap items-center gap-4"><div aria-live="polite">{message && <p role={message.error ? "alert" : "status"} className={`text-sm ${message.error ? "text-red-700" : "text-green-700"}`}>{message.text}</p>}</div><button type="submit" disabled={pending || !dirty} className="rounded bg-[#8b352d] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{pending ? "กำลังบันทึก…" : "บันทึกโครงการ"}</button></div></div>
    </form>
  </section>;
}
