"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { removeQuoteRequest } from "./actions";

export default function DeleteQuoteButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    if (!window.confirm("ลบคำขอใบเสนอราคานี้ถาวรหรือไม่?")) return;
    setPending(true);
    setError("");
    try {
      const result = await removeQuoteRequest(id);
      if (result.error) setError(result.error);
    } catch {
      setError("ลบคำขอไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setPending(false);
    }
  }

  return <div className="text-right">
    <button type="button" disabled={pending} onClick={() => void remove()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">
      <Trash2 size={15} aria-hidden="true" />{pending ? "กำลังลบ…" : "ลบคำขอ"}
    </button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </div>;
}
