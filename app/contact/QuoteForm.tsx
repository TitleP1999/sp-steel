"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Check, Copy, ExternalLink, Send } from "lucide-react";
import { submitQuoteRequest, type QuoteFormState } from "./actions";
import { SelectedQuoteProducts, useQuoteSelection } from "../../components/QuoteSelection";

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
  const [quoteMessage, setQuoteMessage] = useState("");
  const [quoteCopyMessage, setQuoteCopyMessage] = useState("");
  const { items, clear } = useQuoteSelection();
  const selectedProductText = items.map(item => `${item.name} (${item.code}) - ${item.size} x ${item.quantity}`).join("; ");
  async function copyDetails() {
    const value = detailsRef.current?.value.trim() || "";
    if (!value) { setCopyMessage("ยังไม่มีข้อความให้คัดลอก"); return; }
    try { await navigator.clipboard.writeText(value); setCopyMessage("คัดลอกแล้ว"); }
    catch { detailsRef.current?.select(); document.execCommand("copy"); setCopyMessage("คัดลอกแล้ว"); }
    window.setTimeout(() => setCopyMessage(""), 2000);
  }
  useEffect(() => {
    if (!state.success || !formRef.current) return;
    const submitted = new FormData(formRef.current);
    const productLines = String(submitted.get("product") || "").split(";").map(item => item.trim()).filter(Boolean);
    const message = [
      "ขอใบเสนอราคา SUPARERK STEEL",
      "รายการสินค้า:",
      ...productLines.map((item, index) => `${index + 1}. ${item}`),
      String(submitted.get("details") || "").trim() ? `รายละเอียดเพิ่มเติม: ${String(submitted.get("details") || "").trim()}` : "",
    ].filter(Boolean).join("\n");
    setQuoteMessage(message);
    formRef.current.reset();
    clear();
  }, [state.success, state.submittedAt]);
  async function copyQuoteMessage() {
    if (!quoteMessage) return;
    try {
      await navigator.clipboard.writeText(quoteMessage);
    } catch {
      const temporary = document.createElement("textarea");
      temporary.value = quoteMessage;
      temporary.setAttribute("readonly", "");
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.appendChild(temporary);
      temporary.select();
      document.execCommand("copy");
      temporary.remove();
    }
    setQuoteCopyMessage("คัดลอกข้อความแล้ว นำไปวางใน LINE ได้เลย");
  }
  return <form ref={formRef} id="quote-request" action={action}>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <SelectedQuoteProducts />
      {items.length > 0
        ? <input type="hidden" name="product" value={selectedProductText} />
        : <><label className="sr-only" htmlFor="quote-product">สินค้าที่สนใจ</label><input id="quote-product" name="product" required minLength={2} maxLength={5000} className="min-w-0 w-full bg-white px-4 py-3 text-base text-black sm:col-span-2" placeholder="สินค้าที่สนใจ หรือเลือกจากหน้าสินค้า" /></>}
      <div className="relative sm:col-span-2"><label className="sr-only" htmlFor="quote-details">รายละเอียดเพิ่มเติม</label><textarea ref={detailsRef} id="quote-details" name="details" maxLength={2000} className="min-h-28 min-w-0 w-full bg-white px-4 py-3 pr-32 text-base text-black" placeholder="รายละเอียดเพิ่มเติม" /><button type="button" onClick={() => void copyDetails()} aria-label="คัดลอกรายละเอียดเพิ่มเติม" title="คัดลอกข้อความ" className="absolute right-3 top-3 inline-flex h-10 items-center justify-center gap-2 border border-zinc-200 bg-white px-3 text-sm font-bold text-[#8b352d] shadow-sm hover:bg-zinc-50">{copyMessage === "คัดลอกแล้ว" ? <Check size={17}/> : <Copy size={17}/>}<span>{copyMessage === "คัดลอกแล้ว" ? "คัดลอกแล้ว" : "คัดลอก"}</span></button>{copyMessage && copyMessage !== "คัดลอกแล้ว" && <span role="status" className="absolute bottom-3 right-3 rounded bg-[#202124] px-2 py-1 text-xs font-bold text-white">{copyMessage}</span>}</div>
      <div className="absolute -left-[10000px]" aria-hidden="true"><label htmlFor="quote-website">เว็บไซต์</label><input id="quote-website" name="website" tabIndex={-1} autoComplete="off" /></div>
    </div>
    <p className="mt-3 text-xs leading-5 text-zinc-400">เมื่อส่งคำขอแล้ว สามารถคัดลอกข้อความและเปิด LINE เพื่อส่งรายการสินค้าให้ฝ่ายขายได้ทันที</p>
    {state.message && <div role={state.success ? "status" : "alert"} className={`mt-4 text-sm font-bold ${state.success ? "text-green-400" : "text-red-400"}`}>
      <p>{state.message}</p>
      {state.success && quoteMessage && <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => void copyQuoteMessage()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 font-bold text-[#202124] hover:bg-zinc-100"><Copy size={16}/>{quoteCopyMessage || "คัดลอกข้อความสำหรับส่ง LINE"}</button>
        <a href="https://lin.ee/Yurg5Hy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#06C755] px-4 py-2 font-bold text-white hover:bg-[#05b34a]">เปิด LINE <ExternalLink size={16}/></a>
      </div>}
    </div>}
    {!state.success && <SubmitButton />}
  </form>;
}
