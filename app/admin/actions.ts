"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authConfigured, checkCredentials, createSession, SESSION_COOKIE, SESSION_SECONDS } from "../../lib/admin-auth";
import { requireAdmin } from "../../lib/admin-session";
import { PriceError, savePrices } from "../../lib/prices";
import { NewsError, saveNews } from "../../lib/news";
import { ReviewError, saveReviews } from "../../lib/reviews";
import { HomeProjectError, saveHomeProjects } from "../../lib/home-projects";
import { ExecutiveError, saveExecutives } from "../../lib/executives";
import { ProductGalleryError, saveProductGallery } from "../../lib/product-gallery";

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

export async function updateReviews(items: unknown, revision: string): Promise<{ error?: string; revision?: string }> {
  requireAdmin();
  try {
    const nextRevision = await saveReviews(items, revision);
    revalidatePath("/reviews");
    revalidatePath("/admin");
    return { revision: nextRevision };
  } catch (error) {
    if (error instanceof ReviewError) return { error: error.message };
    console.error("Review storage write failed", error);
    return { error: "บันทึกรีวิวไม่สำเร็จ กรุณาลองใหม่ หรือติดต่อผู้ดูแลเซิร์ฟเวอร์" };
  }
}

export async function updateHomeProjects(items: unknown, revision: string): Promise<{ error?: string; revision?: string }> {
  requireAdmin();
  try {
    const nextRevision = await saveHomeProjects(items, revision);
    revalidatePath("/");
    revalidatePath("/admin");
    return { revision: nextRevision };
  } catch (error) {
    if (error instanceof HomeProjectError) return { error: error.message };
    console.error("Home project storage write failed", error);
    return { error: "บันทึกโครงการไม่สำเร็จ กรุณาลองใหม่ หรือติดต่อผู้ดูแลเซิร์ฟเวอร์" };
  }
}

export async function updateExecutives(items: unknown, revision: string): Promise<{ error?: string; revision?: string }> {
  requireAdmin();
  try {
    const nextRevision = await saveExecutives(items, revision);
    revalidatePath("/about"); revalidatePath("/admin");
    return { revision: nextRevision };
  } catch (error) {
    if (error instanceof ExecutiveError) return { error: error.message };
    console.error("Executive storage write failed", error);
    return { error: "บันทึกข้อมูลผู้บริหารไม่สำเร็จ กรุณาลองใหม่ หรือติดต่อผู้ดูแลเซิร์ฟเวอร์" };
  }
}

export async function updateProductGallery(items: unknown, revision: string): Promise<{ error?: string; revision?: string }> {
  requireAdmin();
  try {
    const nextRevision = await saveProductGallery(items, revision);
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/admin");
    return { revision: nextRevision };
  } catch (error) {
    if (error instanceof ProductGalleryError) return { error: error.message };
    console.error("Product gallery storage write failed", error);
    return { error: "บันทึกภาพสินค้าไม่สำเร็จ กรุณาลองใหม่ หรือติดต่อผู้ดูแลเซิร์ฟเวอร์" };
  }
}
