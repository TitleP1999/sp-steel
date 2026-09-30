"use client";

import { useRef, useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { SelectedQuoteProducts, useQuoteSelection } from "../../components/QuoteSelection";

export default function QuoteForm() {
  const detailsRef = useRef<HTMLTextAreaElement>(null);
  const productRef = useRef<HTMLInputElement>(null);
  const [quoteCopyMessage, setQuoteCopyMessage] = useState("");
  const { items } = useQuoteSelection();
  const selectedProductText = items.map(item => `${item.name} (${item.code}) - ${item.size} x ${item.quantity}`).join("; ");

  function buildQuoteMessage() {
    const productLines = (selectedProductText || productRef.current?.value || "")
      .split(";")
      .map(item => item.trim())
      .filter(Boolean);
    return [
      "ขอใบเสนอราคา",
      "รายการสินค้า:",
      ...productLines.map((item, index) => `${index + 1}. ${item}`),
      detailsRef.current?.value.trim() ? `รายละเอียดเพิ่มเติม: ${detailsRef.current.value.trim()}` : "",
    ].filter(Boolean).join("\n");
  }

  async function copyQuoteMessage() {
    const quoteMessage = buildQuoteMessage();
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
    setQuoteCopyMessage("คัดลอกแล้ว");
    window.setTimeout(() => setQuoteCopyMessage(""), 2000);
  }

  return <form id="quote-request" onSubmit={event => event.preventDefault()}>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <SelectedQuoteProducts />
      {items.length > 0
        ? <input type="hidden" name="product" value={selectedProductText} />
        : <><label className="sr-only" htmlFor="quote-product">สินค้าที่สนใจ</label><input ref={productRef} id="quote-product" name="product" minLength={2} maxLength={5000} className="min-w-0 w-full bg-white px-4 py-3 text-base text-black sm:col-span-2" placeholder="สินค้าที่สนใจ หรือเลือกจากหน้าสินค้า" /></>}
      <div className="sm:col-span-2"><label className="sr-only" htmlFor="quote-details">รายละเอียดเพิ่มเติม</label><textarea ref={detailsRef} id="quote-details" name="details" maxLength={2000} className="min-h-28 min-w-0 w-full bg-white px-4 py-3 text-base text-black" placeholder="รายละเอียดเพิ่มเติมเช่น ที่อยู่, เบอร์โทรติดต่อกลับ" /></div>
    </div>
    <p className="mt-3 text-xs leading-5 text-zinc-400">คัดลอกข้อความ แล้วเปิด LINE เพื่อส่งรายการสินค้าให้ฝ่ายขายได้ทันที</p>
    <div className="mt-4 flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
      <button type="button" onClick={() => void copyQuoteMessage()} className="inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-4 py-3 text-sm font-black text-[#202124] transition hover:bg-zinc-100 sm:w-auto sm:px-6 sm:text-base"><Copy className="h-[18px] w-[18px] shrink-0"/><span>{quoteCopyMessage || "คัดลอกข้อความสำหรับส่ง LINE"}</span></button>
      <a href="https://lin.ee/Yurg5Hy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#06C755] px-4 py-3 text-sm font-black text-white transition hover:bg-[#05b34a] sm:w-auto sm:px-6 sm:text-base">เปิด LINE <ExternalLink className="h-[17px] w-[17px]"/></a>
    </div>
  </form>;
}
