"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Check, Copy, Send } from "lucide-react";
import { submitQuoteRequest, type QuoteFormState } from "./actions";

const initialState: QuoteFormState = { success: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="mt-4 inline-flex min-h-12 items-center gap-2 bg-[#8b352d] px-4 py-3 font-black text-white disabled:cursor-wait disabled:opacity-60 sm:px-6">{pending ? "กำลังส่ง…" : "ส่งคำขอ"} <Send size={16} /></button>;
}

export default function QuoteForm() {
  const [state, action] = useFormState(submitQuoteRequest, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const [copyMessage, setCopyMessage] = useState("");
  async function copyDetails() {
    const value = detailsRef.current?.value.trim() || "";
    if (!value) { setCopyMessage("ยังไม่มีข้อความให้คัดลอก"); return; }
    try { await navigator.clipboard.writeText(value); setCopyMessage("คัดลอกแล้ว"); }
    catch { detailsRef.current?.select(); document.execCommand("copy"); setCopyMessage("คัดลอกแล้ว"); }
    window.setTimeout(() => setCopyMessage(""), 2000);
  }
  useEffect(() => { if (state.success) formRef.current?.reset(); }, [state.success, state.submittedAt]);
  return <form ref={formRef} action={action}>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <label className="sr-only" htmlFor="quote-name">ชื่อ / บริษัท</label><input id="quote-name" name="name" required minLength={2} maxLength={100} className="min-w-0 w-full bg-white px-4 py-3 text-base text-black" autoComplete="organization" placeholder="ชื่อ / บริษัท" />
      <label className="sr-only" htmlFor="quote-phone">เบอร์โทร</label><input id="quote-phone" name="phone" required maxLength={30} className="min-w-0 w-full bg-white px-4 py-3 text-base text-black" type="tel" inputMode="tel" autoComplete="tel" placeholder="เบอร์โทร" />
      <label className="sr-only" htmlFor="quote-product">สินค้าที่สนใจ</label><input id="quote-product" name="product" required minLength={2} maxLength={200} className="min-w-0 w-full bg-white px-4 py-3 text-base text-black sm:col-span-2" placeholder="สินค้าที่สนใจ" />
      <div className="relative sm:col-span-2"><label className="sr-only" htmlFor="quote-details">รายละเอียดเพิ่มเติม</label><textarea ref={detailsRef} id="quote-details" name="details" maxLength={2000} className="min-h-28 min-w-0 w-full bg-white px-4 py-3 pr-14 text-base text-black" placeholder="รายละเอียดเพิ่มเติม" /><button type="button" onClick={() => void copyDetails()} aria-label="คัดลอกรายละเอียดเพิ่มเติม" title="คัดลอกข้อความ" className="absolute right-3 top-3 grid h-10 w-10 place-items-center border border-zinc-200 bg-white text-[#8b352d] shadow-sm hover:bg-zinc-50">{copyMessage === "คัดลอกแล้ว" ? <Check size={18}/> : <Copy size={18}/>}</button>{copyMessage && <span role="status" className="absolute bottom-3 right-3 rounded bg-[#202124] px-2 py-1 text-xs font-bold text-white">{copyMessage}</span>}</div>
      <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="quote-website">เว็บไซต์</label><input id="quote-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    </div>
    <p className="mt-3 text-xs leading-5 text-zinc-400">เมื่อส่งคำขอ บริษัทจะใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับสินค้าและใบเสนอราคา</p>
    {state.message && <p role={state.success ? "status" : "alert"} className={`mt-4 text-sm font-bold ${state.success ? "text-green-400" : "text-red-400"}`}>{state.message}</p>}
    <SubmitButton />
  </form>;
}
