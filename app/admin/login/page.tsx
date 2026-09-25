import { redirect } from "next/navigation";
import { isAdmin } from "../../../lib/admin-session";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  if (isAdmin()) redirect("/admin");
  return <main className="mx-auto max-w-md px-4 py-16"><p className="text-sm font-bold tracking-widest text-[#8b352d]">SUPARERK STEEL · ADMIN</p><h1 className="mt-3 text-3xl font-black">เข้าสู่ระบบแอดมิน</h1><p className="mt-3 text-zinc-600">จัดการราคาเหล็กที่แสดงบนหน้าร้าน</p><LoginForm /></main>;
}
