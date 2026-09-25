"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authConfigured, checkCredentials, createSession, SESSION_COOKIE, SESSION_SECONDS } from "../../lib/admin-auth";
import { requireAdmin } from "../../lib/admin-session";
import { PriceError, savePrices } from "../../lib/prices";
import { NewsError, saveNews } from "../../lib/news";
import { ProjectError, saveProjects } from "../../lib/projects";

export async function login(_previous: { error: string }, form: FormData) {
  if (!authConfigured()) return { error: "ยังไม่ได้ตั้งค่าบัญชีแอดมิน กรุณาตั้งค่า ADMIN_USERNAME, ADMIN_PASSWORD_HASH และ ADMIN_SESSION_SECRET บนเซิร์ฟเวอร์" };
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

export async function updateNews(items: unknown, revision: string): Promise<{ error?: string; revision?: string }> {
  requireAdmin();
  let nextRevision: string;
  try { nextRevision = await saveNews(items, revision); }
  catch (error) {
    if (error instanceof NewsError) return { error: error.message };
    console.error("News storage write failed", error);
    return { error: "บันทึกข่าวสารไม่สำเร็จ กรุณาลองใหม่ หรือติดต่อผู้ดูแลเซิร์ฟเวอร์" };
  }
  revalidatePath("/news");
  revalidatePath("/admin");
  return { revision: nextRevision };
}

export async function updateProjects(items: unknown, revision: string): Promise<{ error?: string; revision?: string }> {
  requireAdmin();
  try {
    const nextRevision = await saveProjects(items, revision);
    revalidatePath("/projects");
    revalidatePath("/admin");
    return { revision: nextRevision };
  } catch (error) {
    if (error instanceof ProjectError) return { error: error.message };
    console.error("Project storage write failed", error);
    return { error: "บันทึกผลงานไม่สำเร็จ กรุณาลองใหม่ หรือติดต่อผู้ดูแลเซิร์ฟเวอร์" };
  }
}
