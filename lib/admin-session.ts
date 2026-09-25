import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "./admin-auth";

export function isAdmin() { return verifySession(cookies().get(SESSION_COOKIE)?.value); }
export function requireAdmin() { if (!isAdmin()) redirect("/admin/login"); }
