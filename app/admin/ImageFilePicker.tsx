"use client";

import { useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  previewClassName?: string;
};

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

export default function ImageFilePicker({ label, value, onChange, required = false, disabled = false, previewClassName = "h-52" }: Props) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function choose(file?: File) {
    if (!file) return;
    setProcessing(true); setError("");
    try { onChange(await optimizeImage(file)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "อ่านไฟล์รูปไม่สำเร็จ"); }
    finally { setProcessing(false); }
  }

  return <div className="sm:col-span-2">
    <p className="text-sm font-bold">{label} {!required && <span className="font-normal text-zinc-500">(ไม่บังคับ)</span>}</p>
    <div className="mt-2 flex flex-wrap items-center gap-3">
      <label className="inline-flex cursor-pointer items-center rounded bg-[#8b352d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#702a24]">
        <input type="file" accept="image/jpeg,image/png" className="sr-only" disabled={disabled || processing} onChange={event => { void choose(event.target.files?.[0]); event.currentTarget.value = ""; }} />
        {processing ? "กำลังย่อรูป…" : value ? "เปลี่ยนรูป JPEG / PNG" : "+ Browse JPEG / PNG"}
      </label>
      {value && !required && <button type="button" disabled={disabled || processing} onClick={() => onChange("")} className="text-sm font-bold text-red-700 underline">ลบรูป</button>}
    </div>
    <p className="mt-2 text-xs font-normal text-zinc-500">ระบบจะย่อรูปให้เหมาะกับหน้าเว็บอัตโนมัติ ไฟล์ต้นฉบับไม่เกิน 12 MB</p>
    {error && <p role="alert" className="mt-2 text-sm font-normal text-red-700">{error}</p>}
    {value && <img src={value} alt={`ตัวอย่าง${label}`} className={`mt-3 w-full rounded border object-cover ${previewClassName}`} />}
  </div>;
}
