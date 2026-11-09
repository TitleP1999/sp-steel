"use client";

import { Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { readQuoteRequest, removeQuoteRequest } from "./actions";

export default function QuoteRequestActions({ id, isNew }: { id: string; isNew: boolean }) {
  const [pending, setPending] = useState<"read" | "delete" | null>(null);
  const [error, setError] = useState("");

  async function update(action: "read" | "delete") {
    if (action === "delete" && !window.confirm("ลบคำขอใบเสนอราคานี้ถาวรหรือไม่?")) return;
    setPending(action);
    setError("");
    try {
      const result = await (action === "read" ? readQuoteRequest(id) : removeQuoteRequest(id));
      if (result.error) setError(result.error);
    } catch {
      setError("จัดการคำขอไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setPending(null);
    }
  }

  return <div className="text-right">
    <div className="flex flex-wrap justify-end gap-2">
      {isNew && <button type="button" disabled={!!pending} onClick={() => void update("read")} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-green-200 px-3 text-sm font-bold text-green-800 hover:bg-green-50 disabled:opacity-50">
        <Check size={15} aria-hidden="true" />{pending === "read" ? "กำลังบันทึก…" : "ทำเครื่องหมายว่าดูแล้ว"}
      </button>}
      <button type="button" disabled={!!pending} onClick={() => void update("delete")} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
        <Trash2 size={15} aria-hidden="true" />{pending === "delete" ? "กำลังลบ…" : "ลบคำขอ"}
      </button>
    </div>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
}
