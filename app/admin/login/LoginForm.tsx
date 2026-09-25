"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "../actions";

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="w-full bg-[#8b352d] px-5 py-3 font-bold text-white disabled:opacity-50">{pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}</button>;
}
export default function LoginForm() {
  const [state, action] = useFormState(login, { error: "" });
  return <form action={action} className="mt-8 space-y-5 rounded-lg border bg-white p-6">
    <label className="block font-bold">ชื่อผู้ใช้<input name="username" autoComplete="username" required maxLength={100} className="mt-2 w-full rounded border px-3 py-3 font-normal" /></label>
    <label className="block font-bold">รหัสผ่าน<input name="password" type="password" autoComplete="current-password" required maxLength={1024} className="mt-2 w-full rounded border px-3 py-3 font-normal" /></label>
    {state.error && <p role="alert" className="text-sm text-red-700">{state.error}</p>}
    <Submit />
  </form>;
}
