"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authConfigured, checkCredentials, createSession, SESSION_COOKIE, SESSION_SECONDS } from "../../lib/admin-auth";
import { requireAdmin } from "../../lib/admin-session";
import { PriceError, savePrices } from "../../lib/prices";

export async function login(_previous: { error: string }, form: FormData) {
  if (!authConfigured()) return { error: "ยังไม่ได้ตั้งค่าบัญชีแอดมิน กรุณารัน npm run admin:setup บนเซิร์ฟเวอร์" };
  const result = await checkCredentials(String(form.get("username") || ""), String(form.get("password") || ""));
  if (result !== "ok") return { error: result === "limited" ? "พยายามเข้าสู่ระบบหลายครั้งเกินไป กรุณารอ 15 นาที" : "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" };
  cookies().set(SESSION_COOKIE, createSession(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
  redirect("/admin");
}

export async function logout() {
  cookies().delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function updatePrices(slug: string, prices: unknown, revision: string): Promise<{ error?: string; revision?: string }> {
  requireAdmin();
  let nextRevision: string;
  try { nextRevision = await savePrices(slug, prices, revision); }
  catch (error) {
    if (error instanceof PriceError) return { error: error.message };
    console.error("Price storage write failed", error);
    return { error: "บันทึกไม่สำเร็จ กรุณาลองใหม่ หรือติดต่อผู้ดูแลเซิร์ฟเวอร์" };
  }
  revalidatePath("/", "layout");
  return { revision: nextRevision };
}
