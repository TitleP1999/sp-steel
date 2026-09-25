"use client";

import { useState } from "react";
import type { ProjectItem } from "../../lib/projects";
import { updateProjects } from "./actions";

const today = () => new Date().toISOString().slice(0, 10);
const newId = () => globalThis.crypto?.randomUUID?.() || `project-${Date.now()}`;
const blankProject = (): ProjectItem => ({ id: newId(), title: "", summary: "", location: "", completedAt: today(), href: "", imageUrl: "", published: true });
const copyItems = (items: ProjectItem[]) => items.map(item => ({ ...item }));

export default function ProjectEditor({ items: initialItems, revision: initialRevision }: { items: ProjectItem[]; revision: string }) {
  const [items, setItems] = useState(() => copyItems(initialItems));
  const [saved, setSaved] = useState(() => copyItems(initialItems));
  const [revision, setRevision] = useState(initialRevision);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);
  const dirty = JSON.stringify(items) !== JSON.stringify(saved);
  const updateItem = (id: string, key: keyof ProjectItem, value: string | boolean) => { setItems(current => current.map(item => item.id === id ? { ...item, [key]: value } : item)); setMessage(null); };
  const removeItem = (id: string) => { if (window.confirm("ต้องการลบผลงานรายการนี้หรือไม่?")) { setItems(current => current.filter(item => item.id !== id)); setMessage(null); } };
  async function save() {
    setPending(true); setMessage(null);
    try {
      const result = await updateProjects(items, revision);
      if (result.error) setMessage({ text: result.error, error: true });
      else if (result.revision) { setRevision(result.revision); setSaved(copyItems(items)); setMessage({ text: "บันทึกผลงานแล้ว หน้าเว็บจะแสดงเฉพาะรายการที่เลือกเผยแพร่", error: false }); }
    } catch { setMessage({ text: "บันทึกไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อหรือเข้าสู่ระบบใหม่", error: true }); }
    finally { setPending(false); }
  }
  return <section className="mt-14 border-t pt-10">
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-black">จัดการผลงานและโครงการ</h2><p className="mt-1 text-sm text-zinc-600">เพิ่ม แก้ไข หรือลบรายการที่แสดงในหน้า “ผลงานและโครงการ”</p></div><p className="text-sm text-zinc-500">{items.length} รายการ{dirty && " · มีข้อมูลที่ยังไม่บันทึก"}</p></div>
    {!items.length && <p className="rounded-lg border bg-white p-6 text-center text-zinc-600">ยังไม่มีผลงาน กด “เพิ่มผลงาน” เพื่อเริ่มต้น</p>}
    <form onSubmit={event => { event.preventDefault(); void save(); }} className="space-y-5">
      {items.map((item, index) => <article key={item.id} className="rounded-lg border bg-white p-5 sm:p-7">
        <div className="mb-5 flex items-center justify-between gap-3"><h3 className="font-bold">ผลงานรายการที่ {index + 1}</h3><button type="button" disabled={pending} onClick={() => removeItem(item.id)} className="text-sm text-red-700 underline disabled:opacity-40">ลบรายการนี้</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold sm:col-span-2">ชื่อผลงาน / โครงการ<input required maxLength={160} value={item.title} onChange={event => updateItem(item.id, "title", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="เช่น จัดส่งเหล็กโครงสร้างอาคารคลังสินค้า" /></label>
          <label className="text-sm font-bold sm:col-span-2">รายละเอียด<textarea maxLength={1000} rows={4} value={item.summary} onChange={event => updateItem(item.id, "summary", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="รายละเอียดงาน สินค้าที่ใช้ หรือขอบเขตการจัดส่ง" /></label>
          <label className="text-sm font-bold">สถานที่ <span className="font-normal text-zinc-500">(ไม่บังคับ)</span><input maxLength={120} value={item.location} onChange={event => updateItem(item.id, "location", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="สุพรรณบุรี" /></label>
          <label className="text-sm font-bold">วันที่ผลงาน<input required type="date" value={item.completedAt} onChange={event => updateItem(item.id, "completedAt", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" /></label>
          <label className="text-sm font-bold sm:col-span-2">ลิงก์เพิ่มเติม <span className="font-normal text-zinc-500">(ไม่บังคับ)</span><input maxLength={500} value={item.href} onChange={event => updateItem(item.id, "href", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="/contact หรือ https://example.com" /></label>
          <label className="text-sm font-bold sm:col-span-2">รูปภาพผลงาน <span className="font-normal text-zinc-500">(ไม่บังคับ)</span><input maxLength={1000} value={item.imageUrl} onChange={event => updateItem(item.id, "imageUrl", event.target.value)} className="mt-2 w-full rounded border p-3 font-normal" placeholder="/projects/project-1.jpg หรือ https://example.com/photo.jpg" /><span className="mt-1 block font-normal text-zinc-500">ใส่ URL รูปภาพ หรือ path ของรูปที่อยู่ในโฟลเดอร์ public</span>{item.imageUrl && <img src={item.imageUrl} alt="ตัวอย่างรูปภาพผลงาน" className="mt-3 h-40 w-full rounded border object-cover" />}</label>
          <label className="flex items-center gap-3 text-sm font-bold sm:col-span-2"><input type="checkbox" checked={item.published} onChange={event => updateItem(item.id, "published", event.target.checked)} className="h-5 w-5 accent-[#8b352d]" />เผยแพร่รายการนี้บนหน้าเว็บ</label>
        </div>
      </article>)}
      <div className="flex flex-wrap items-center justify-between gap-3"><button type="button" disabled={pending} onClick={() => { setItems(current => [...current, blankProject()]); setMessage(null); }} className="rounded border border-[#8b352d] px-5 py-3 text-sm font-bold text-[#8b352d] disabled:opacity-40">+ เพิ่มผลงาน</button><div className="flex flex-wrap items-center gap-4"><div aria-live="polite">{message && <p role={message.error ? "alert" : "status"} className={`text-sm ${message.error ? "text-red-700" : "text-green-700"}`}>{message.text}</p>}</div><button type="submit" disabled={pending || !dirty} className="rounded bg-[#8b352d] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{pending ? "กำลังบันทึก…" : "บันทึกผลงาน"}</button></div></div>
    </form>
  </section>;
}
