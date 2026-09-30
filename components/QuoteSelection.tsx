"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronUp, Minus, Plus, Trash2, X } from "lucide-react";
import type { Product } from "../data/products";

export type QuoteSelectionItem = {
  key: string;
  slug: string;
  name: string;
  code: string;
  size: string;
  quantity: number;
};

type QuoteSelectionContextValue = {
  items: QuoteSelectionItem[];
  add: (item: Omit<QuoteSelectionItem, "key">) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "suparerk-quote-selection";
const QuoteSelectionContext = createContext<QuoteSelectionContextValue | null>(null);

export function useQuoteSelection() {
  const context = useContext(QuoteSelectionContext);
  if (!context) throw new Error("useQuoteSelection must be used inside QuoteSelectionProvider");
  return context;
}

export function QuoteSelectionProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteSelectionItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartExpanded, setCartExpanded] = useState(false);
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setItems(saved.filter((item): item is QuoteSelectionItem =>
        item && typeof item.key === "string" && typeof item.slug === "string" &&
        typeof item.name === "string" && typeof item.code === "string" &&
        typeof item.size === "string" && Number.isInteger(item.quantity) && item.quantity > 0
      ));
    } catch { /* Ignore invalid browser storage and start with an empty selection. */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<QuoteSelectionContextValue>(() => ({
    items,
    add: item => setItems(current => {
      const key = `${item.slug}:${item.size}`;
      const existing = current.find(entry => entry.key === key);
      return existing
        ? current.map(entry => entry.key === key ? { ...entry, quantity: entry.quantity + item.quantity } : entry)
        : [...current, { ...item, key }];
    }),
    remove: key => setItems(current => current.filter(item => item.key !== key)),
    setQuantity: (key, quantity) => setItems(current => current.map(item => item.key === key ? { ...item, quantity: Math.max(1, Math.min(9999, quantity)) } : item)),
    clear: () => setItems([]),
  }), [items]);

  return <QuoteSelectionContext.Provider value={value}>
    {children}
    {items.length > 0 && <div className="fixed inset-x-0 bottom-0 z-[55] mx-auto w-full max-w-3xl border border-zinc-200 bg-white p-3 shadow-xl sm:px-5">
      {cartExpanded && <div className="mb-3 max-h-[40vh] space-y-2 overflow-y-auto border-b border-zinc-200 pb-3">
        <p className="sticky top-0 bg-white pb-1 text-sm font-black text-zinc-900">รายการสินค้าที่เลือก {items.length} รายการ</p>
        {items.map(item => <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 px-3 py-2">
          <div className="min-w-0"><p className="break-words text-sm font-bold text-zinc-900">{item.name} {item.size}</p><p className="text-xs text-zinc-500">{item.code}</p></div>
          <span className="shrink-0 rounded-full bg-[#8b352d] px-2 py-1 text-xs font-bold text-white">{item.quantity} ชิ้น</span>
        </div>)}
      </div>}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-nowrap sm:gap-5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="min-w-0 flex-1"><p className="font-black text-zinc-900">เลือกแล้ว {items.length} รายการ · {totalQuantity} ชิ้น</p><button type="button" onClick={() => setCartExpanded(expanded => !expanded)} aria-expanded={cartExpanded} className="inline-flex items-center gap-1 text-xs font-bold text-[#8b352d] underline underline-offset-2">{cartExpanded ? "ซ่อนรายการ" : "ดูรายการทั้งหมด"}{cartExpanded ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}</button></div>
          <button type="button" onClick={() => { setItems([]); setCartExpanded(false); }} aria-label="ล้างรายการสินค้าที่เลือกทั้งหมด" title="ล้างรายการ" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50"><Trash2 size={16}/></button>
        </div>
        <Link href="/contact#quote-request" className="inline-flex min-h-11 shrink-0 items-center gap-2 bg-[#8b352d] px-4 py-2 text-sm font-black text-white transition hover:bg-[#67251f]">ขอใบเสนอราคา <ArrowRight size={16}/></Link>
      </div>
    </div>}
  </QuoteSelectionContext.Provider>;
}

export function QuoteProductButton({ product, size, className = "" }: { product: Product; size: string; className?: string }) {
  const { items, add, remove, setQuantity } = useQuoteSelection();
  const selected = items.find(item => item.slug === product.slug && item.size === size);
  if (selected) return <div className={`inline-flex min-h-11 w-full items-center justify-between gap-1 rounded-lg border border-[#8b352d] px-2 py-1 text-[#8b352d] ${className}`}>
    <button type="button" aria-label={`ลดจำนวน ${product.name} ${size}`} onClick={() => selected.quantity === 1 ? remove(selected.key) : setQuantity(selected.key, selected.quantity - 1)} className="grid h-8 w-8 shrink-0 place-items-center rounded transition hover:bg-[#8b352d] hover:text-white"><Minus size={16}/></button>
    <input type="number" min={1} max={9999} aria-label={`จำนวน ${product.name} ${size}`} value={selected.quantity} onChange={event => setQuantity(selected.key, Number(event.target.value))} className="w-12 min-w-0 bg-transparent text-center text-sm font-black outline-none"/>
    <button type="button" aria-label={`เพิ่มจำนวน ${product.name} ${size}`} onClick={() => setQuantity(selected.key, selected.quantity + 1)} className="grid h-8 w-8 shrink-0 place-items-center rounded transition hover:bg-[#8b352d] hover:text-white"><Plus size={16}/></button>
  </div>;
  return <button type="button" onClick={() => add({ slug: product.slug, name: product.name, code: product.code, size, quantity: 1 })} className={`inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#8b352d] px-4 py-2 text-sm font-black text-[#8b352d] transition hover:bg-[#8b352d] hover:text-white ${className}`}>
    <Plus size={17}/> เพิ่มในรายการขอราคา
  </button>;
}

export function SelectedQuoteProducts() {
  const { items, remove, setQuantity } = useQuoteSelection();
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
  return <div className="sm:col-span-2">
    <p className="mb-2 text-sm font-bold text-white">สินค้าที่เลือก {items.length > 0 && `(${totalQuantity} รายการ)`}</p>
    {items.length === 0
      ? <p className="border border-white/15 bg-white/5 px-4 py-3 text-sm text-zinc-300">ยังไม่ได้เลือกสินค้า — เลือกได้จากหน้ารวมสินค้าหรือหน้ารายละเอียดสินค้า</p>
      : <div className="space-y-2">
        {items.map(item => <div key={item.key} className="flex flex-wrap items-center justify-between gap-3 bg-white px-3 py-2 text-sm text-zinc-800">
          <div className="min-w-0 flex-1"><p className="font-bold">{item.name} {item.size} <span className="ml-1 inline-flex rounded-full bg-[#8b352d] px-2 py-0.5 text-xs font-bold text-white">{item.quantity} ชิ้น</span></p><p className="text-xs text-zinc-500">{item.code}</p></div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label={`ลดจำนวน ${item.name}`} onClick={() => setQuantity(item.key, item.quantity - 1)} className="grid h-8 w-8 place-items-center border border-zinc-200 text-zinc-700 hover:bg-zinc-100"><Minus size={14}/></button>
            <span className="min-w-8 text-center font-bold">{item.quantity}</span>
            <button type="button" aria-label={`เพิ่มจำนวน ${item.name}`} onClick={() => setQuantity(item.key, item.quantity + 1)} className="grid h-8 w-8 place-items-center border border-zinc-200 text-zinc-700 hover:bg-zinc-100"><Plus size={14}/></button>
            <button type="button" aria-label={`นำ ${item.name} ออกจากรายการ`} onClick={() => remove(item.key)} className="ml-1 grid h-8 w-8 place-items-center text-zinc-500 hover:bg-red-50 hover:text-red-600"><X size={17}/></button>
          </div>
        </div>)}
      </div>}
  </div>;
}
