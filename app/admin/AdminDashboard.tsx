"use client";

import Link from "next/link";
import { ArrowUpRight, ClipboardList, Image, LayoutDashboard, LogOut, Newspaper, Star, Tag, Users, Warehouse } from "lucide-react";
import { useState, type ReactNode } from "react";
import { logout } from "./actions";

const menu = [
  { id: "overview", label: "ภาพรวม", icon: LayoutDashboard, description: "ดูภาพรวมและเลือกงานที่ต้องการจัดการ" },
  { id: "prices", label: "ราคาเหล็ก", icon: Tag, description: "จัดการราคาเหล็กทุกขนาดในแค็ตตาล็อก" },
  { id: "quotes", label: "คำขอใบเสนอราคา", icon: ClipboardList, description: "ดูคำขอและข้อมูลติดต่อของลูกค้า" },
  { id: "product-gallery", label: "ภาพสินค้า", icon: Image, description: "จัดการภาพในหน้ารายละเอียดสินค้า" },
  { id: "news", label: "ข่าวสาร", icon: Newspaper, description: "จัดการข่าวสารและกิจกรรม" },
  { id: "reviews", label: "รีวิวลูกค้า", icon: Star, description: "จัดการรีวิวที่แสดงบนเว็บไซต์" },
  { id: "home-projects", label: "โครงการหน้าแรก", icon: Warehouse, description: "จัดการภาพโครงการและผลงาน" },
  { id: "executives", label: "ผู้บริหาร", icon: Users, description: "จัดการข้อมูลคณะกรรมการและผู้บริหาร" },
] as const;

type Panel = Exclude<(typeof menu)[number]["id"], "overview">;

export default function AdminDashboard({ panels, counts }: { panels: Record<Panel, ReactNode>; counts: Partial<Record<Panel, number>> }) {
  const [active, setActive] = useState<(typeof menu)[number]["id"]>("overview");
  const current = menu.find(item => item.id === active)!;

  function select(id: typeof active) {
    setActive(id);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return <div className="min-h-dvh bg-[#f5f4ef] lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
    <aside className="sticky top-0 z-20 self-start bg-[#202124] text-white lg:flex lg:h-dvh lg:flex-col lg:overflow-y-auto">
      <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:px-6 lg:py-7">
        <div>
          <p className="text-[10px] font-bold tracking-[.2em] text-[#edada3]">SUPARERK STEEL</p>
          <p className="mt-1 text-lg font-black">จัดการเว็บไซต์</p>
        </div>
        <form action={logout} className="lg:hidden">
          <button className="p-2 text-sm text-zinc-200">ออกจากระบบ</button>
        </form>
      </div>
      <nav aria-label="เมนูแอดมิน" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:grid">
        {menu.map(({ id, icon: Icon, label }) => <button key={id} type="button" onClick={() => select(id)} aria-current={active === id ? "true" : undefined} aria-controls={`admin-${id}`} className={`flex min-h-11 shrink-0 items-center gap-2.5 !rounded-lg px-3 text-left text-sm font-bold lg:w-full ${active === id ? "bg-[#57342f] text-[#ffe0d8]" : "text-zinc-200 hover:bg-white/10"}`}>
          <Icon size={17} aria-hidden="true" />{label}
        </button>)}
      </nav>
      <div className="mt-auto hidden border-t border-white/10 p-4 lg:block">
        <form action={logout}>
          <button className="flex min-h-11 w-full items-center gap-2 px-3 text-sm text-zinc-200 hover:text-white"><LogOut size={17} aria-hidden="true" />ออกจากระบบ</button>
        </form>
      </div>
    </aside>
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 lg:py-10">
      <div className="mb-7 flex flex-wrap items-start justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <p className="text-xs font-bold tracking-[.18em] text-[#8b352d]">SUPARERK STEEL ADMIN</p>
          <h1 className="mt-2 text-3xl font-black">{active === "prices" ? "จัดการราคาเหล็ก" : current.label}</h1>
          <p className="mt-2 text-sm text-zinc-600">{current.description}</p>
        </div>
        <Link href={active === "prices" ? "/steel-prices" : "/"} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-bold !rounded-lg">
          {active === "prices" ? "ดูราคาหน้าร้าน" : "เปิดเว็บไซต์"} <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div id="admin-overview" hidden={active !== "overview"}>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {menu.slice(1).map(({ id, icon: Icon, label, description }) => {
            if (id === "overview") return null;
            return <button key={id} type="button" onClick={() => select(id)} className="group border border-zinc-200 bg-white p-5 text-left !rounded-xl hover:border-[#8b352d]">
              <span className="flex items-center justify-between text-[#8b352d]"><Icon size={21} aria-hidden="true" /><ArrowUpRight size={16} aria-hidden="true" /></span>
              <span className="mt-4 block font-bold">{label}</span>
              <span className="mt-1 block text-2xl font-black tabular-nums">{counts[id] ?? 0}</span>
              <span className="mt-2 block text-sm text-zinc-600">{description}</span>
            </button>;
          })}
        </div>
      </div>
      {Object.entries(panels).map(([id, panel]) => <div key={id} id={`admin-${id}`} hidden={active !== id} className="[&>section]:mt-0 [&>section]:border-t-0 [&>section]:pt-0">{panel}</div>)}
    </main>
  </div>;
}
