"use server";

import { createQuoteRequest, QuoteRequestError, validateQuoteRequest } from "../../lib/quote-requests";

export type QuoteFormState = { success: boolean; message: string; submittedAt?: number };

export async function submitQuoteRequest(_previous: QuoteFormState, form: FormData): Promise<QuoteFormState> {
  // Hidden honeypot: real visitors never fill this field.
  if (String(form.get("website") || "")) return { success: true, message: "ส่งคำขอเรียบร้อยแล้ว", submittedAt: Date.now() };
  try {
    const input = validateQuoteRequest(form);
    await createQuoteRequest(input);
    return { success: true, message: "ส่งคำขอเรียบร้อยแล้ว ฝ่ายขายจะติดต่อกลับโดยเร็ว", submittedAt: Date.now() };
  } catch (error) {
    if (error instanceof QuoteRequestError) return { success: false, message: error.message };
    console.error("Quote request submission failed", error);
    return { success: false, message: "ส่งคำขอไม่สำเร็จ กรุณาลองใหม่หรือติดต่อฝ่ายขายโดยตรง" };
  }
}
