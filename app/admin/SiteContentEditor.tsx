"use client";

import { useEffect, useState, type ReactNode } from "react";
import { siteImageMaxLength, type SiteBranch, type SiteContent } from "../../data/site-content";
import { updateSiteContent } from "./actions";
import ImageFilePicker from "./ImageFilePicker";

const tabs = [
  ["banner", "แบนเนอร์หน้าแรก"],
  ["branches", "ข้อมูลสาขา"],
  ["contact", "หน้าติดต่อเรา"],
  ["projects", "ผลงานของเรา"],
] as const;

function Field({ label, value, onChange, maxLength = 200, multiline = false }: {
  label: string; value: string; onChange: (value: string) => void; maxLength?: number; multiline?: boolean;
}) {
  const props = {
    value, maxLength, required: true,
    className: "mt-2 w-full rounded-lg border border-zinc-300 p-3 font-normal",
  };
  return <label className={`block text-sm font-bold ${multiline ? "sm:col-span-2" : ""}`}>
    {label}
    {multiline
      ? <textarea {...props} rows={3} onChange={event => onChange(event.target.value)} />
      : <input {...props} onChange={event => onChange(event.target.value)} />}
  </label>;
}

const branchFields = [
  ["name", "ชื่อสาขา", 120], ["shortName", "ชื่อสาขาแบบสั้น", 50],
  ["en", "ชื่อสาขาภาษาอังกฤษ", 100], ["address", "ที่อยู่", 500],
  ["phone", "เบอร์โทรหลัก", 30], ["backupPhone", "เบอร์สำรอง", 30],
  ["facebook", "ลิงก์ Facebook", 2000], ["map", "ลิงก์เปิดเส้นทาง", 2000],
  ["embed", "URL ฝัง Google Maps (คัดลอกเฉพาะค่า src)", 2000],
] as const;

const card = "grid gap-4 rounded-xl border bg-white p-4 sm:grid-cols-2 sm:p-6";
const preview = "h-48 max-w-md bg-zinc-50 !object-contain";

export default function SiteContentEditor({ content, revision: initialRevision, projects }: {
  content: SiteContent; revision: string; projects: ReactNode;
}) {
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("banner");
  const [draft, setDraft] = useState(content);
  const [saved, setSaved] = useState(content);
  const [revision, setRevision] = useState(initialRevision);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean }>();
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  function update(section: "home" | "contact", field: string, value: string) {
    setDraft(current => ({ ...current, [section]: { ...current[section], [field]: value } }));
    setMessage(undefined);
  }

  function updateBranch(id: string, field: Exclude<keyof SiteBranch, "id">, value: string) {
    setDraft(current => ({
      ...current,
      branches: current.branches.map(branch => branch.id === id ? { ...branch, [field]: value } : branch),
    }));
    setMessage(undefined);
  }

  async function save() {
    setPending(true);
    setMessage(undefined);
    try {
      const result = await updateSiteContent(draft, revision);
      if (result.error) setMessage({ text: result.error, error: true });
      else if (result.revision) {
        setRevision(result.revision);
        setSaved(draft);
        setMessage({ text: "บันทึกแล้ว ข้อมูลบนหน้าแรกและหน้าติดต่อเราอัปเดตแล้ว", error: false });
      }
    } catch {
      setMessage({ text: "บันทึกไม่สำเร็จ กรุณาลองใหม่", error: true });
    } finally {
      setPending(false);
    }
  }

  return <section>
    <nav aria-label="ส่วนที่แก้ไขได้" className="mb-5 flex gap-2 overflow-x-auto pb-2">
      {tabs.map(([id, label]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}
        className={`min-h-11 shrink-0 !rounded-lg border px-4 text-sm font-bold ${tab === id ? "border-[#8b352d] bg-[#8b352d] text-white" : "bg-white"}`}>
        {label}
      </button>)}
    </nav>
    <div hidden={tab !== "projects"} className="[&>section]:mt-0 [&>section]:border-0 [&>section]:pt-0">{projects}</div>
    {tab !== "projects" && <form noValidate onSubmit={event => { event.preventDefault(); void save(); }}>
      <fieldset disabled={pending} className="space-y-4">
        {tab === "banner" && <div className={card}>
          <Field label="หัวข้อหลัก" value={draft.home.heading} maxLength={50} onChange={value => update("home", "heading", value)} />
          <Field label="หัวข้อรอง" value={draft.home.subheading} maxLength={70} onChange={value => update("home", "subheading", value)} />
          <Field label="คำอธิบาย" multiline value={draft.home.description} maxLength={500} onChange={value => update("home", "description", value)} />
          <Field label="ข้อความบนปุ่มสินค้า" value={draft.home.productButton} maxLength={60} onChange={value => update("home", "productButton", value)} />
          <Field label="ข้อความบนปุ่ม LINE" value={draft.home.quoteButton} maxLength={60} onChange={value => update("home", "quoteButton", value)} />
          <ImageFilePicker required label="รูปพื้นหลังหน้าแรก" value={draft.home.image} onChange={value => update("home", "image", value)} previewClassName={preview} maxDataLength={siteImageMaxLength} disabled={pending} />
          {draft.branches.map(branch => <ImageFilePicker key={branch.id} required label={`รูปโกดัง ${branch.shortName}`} value={branch.warehouseImage} onChange={value => updateBranch(branch.id, "warehouseImage", value)} previewClassName={preview} maxDataLength={siteImageMaxLength} disabled={pending} />)}
        </div>}
        {tab === "branches" && draft.branches.map(branch => <div key={branch.id} className={card}>
          <h2 className="font-black sm:col-span-2">{branch.name}</h2>
          {branchFields.map(([field, label, maxLength]) => <Field key={field} label={label} value={branch[field]} maxLength={maxLength} onChange={value => updateBranch(branch.id, field, value)} multiline={field === "address"} />)}
          <ImageFilePicker required label="รูปหน้าร้านบนหน้าแรก" value={branch.image} onChange={value => updateBranch(branch.id, "image", value)} previewClassName={preview} maxDataLength={siteImageMaxLength} disabled={pending} />
          <ImageFilePicker required label="โลโก้บนหน้าติดต่อเรา" value={branch.logo} onChange={value => updateBranch(branch.id, "logo", value)} previewClassName={preview} maxDataLength={siteImageMaxLength} disabled={pending} />
        </div>)}
        {tab === "contact" && <div className={card}>
          <p className="text-sm text-zinc-600 sm:col-span-2">ชื่อ เบอร์ ที่อยู่ และแผนที่ของแต่ละสาขาแก้ได้ในแถบ “ข้อมูลสาขา”</p>
          <Field label="หัวข้อหน้าติดต่อเรา" value={draft.contact.title} maxLength={100} onChange={value => update("contact", "title", value)} />
          <Field label="เบอร์โทรบริษัท" value={draft.contact.phone} maxLength={30} onChange={value => update("contact", "phone", value)} />
          <Field label="คำอธิบายหน้าติดต่อเรา" multiline value={draft.contact.description} maxLength={500} onChange={value => update("contact", "description", value)} />
          <Field label="ลิงก์ LINE" value={draft.contact.line} maxLength={2000} onChange={value => update("contact", "line", value)} />
          <Field label="ลิงก์รวมช่องทางติดต่อ" value={draft.contact.social} maxLength={2000} onChange={value => update("contact", "social", value)} />
          <ImageFilePicker required label="รูปพื้นหลังหน้าติดต่อเรา" value={draft.contact.image} onChange={value => update("contact", "image", value)} previewClassName={preview} maxDataLength={siteImageMaxLength} disabled={pending} />
        </div>}
      </fieldset>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div aria-live="polite" className="text-sm">
          {message ? <p role={message.error ? "alert" : "status"} className={message.error ? "text-red-700" : "text-green-700"}>{message.text}</p> : dirty && <p>มีข้อมูลที่ยังไม่บันทึก</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a href={tab === "banner" ? "/" : "/contact"} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#8b352d] underline">เปิดหน้าจริง ↗</a>
          <button type="submit" disabled={pending || !dirty} className="!rounded-lg bg-[#8b352d] px-5 py-3 text-sm font-bold text-white disabled:opacity-40">{pending ? "กำลังบันทึก…" : "บันทึกข้อมูลเว็บไซต์"}</button>
        </div>
      </div>
    </form>}
  </section>;
}
