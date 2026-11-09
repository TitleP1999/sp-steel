import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import CurrentYear from "./CurrentYear";

import { phoneHref, type SiteContent } from "../data/site-content";

export default function Footer({ branches, contact }: Pick<SiteContent, "branches" | "contact">) {
  return (
    <footer className="border-t-4 border-[#8b352d] bg-[#151516] text-white">
      <div className="mx-auto grid max-w-6xl gap-0 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-5">
        <div className="flex flex-col items-start pb-5 sm:pr-8 lg:pb-0">
          <div className="relative h-36 w-full max-w-64">
            <Image src="/suparerk-logo-transparent.png" alt="SUPARERK STEEL" fill sizes="256px" className="-translate-y-4 object-contain object-left-top" />
          </div>
          <p className="-mt-6 pl-3 text-sm font-black text-white">บริษัท ศุภฤกษ์ สตีล จำกัด</p>
          <p className="mt-1 whitespace-nowrap pl-3 text-xs leading-5 text-zinc-400">เลขประจำตัวผู้เสียภาษี: <span className="font-bold tracking-wide text-zinc-200">0725563001575</span></p>
          <a href="https://dbdregistered.dbd.go.th/api/public/shopinfoReg?param=00B11C0DB481DB4F1AB6358B612E7AEEC6AA56E3B28CDB26C9895B29716D6548" target="_blank" rel="noopener noreferrer" aria-label="ตรวจสอบข้อมูล DBD Registered" className="mt-4 inline-block pl-3 transition hover:opacity-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://dbdregistered.dbd.go.th/api/public/bannerreg?param=00B11C0DB481DB4F1AB6358B612E7AEEC6AA56E3B28CDB26C9895B29716D6548" alt="DBD Registered กรมพัฒนาธุรกิจการค้า" loading="lazy" className="h-auto max-h-10 w-auto max-w-[150px]" />
          </a>
        </div>

        <div className="grid gap-0 border-t border-white/15 sm:col-span-2 sm:grid-cols-2 lg:contents">
          {branches.map(branch => <div key={branch.id} className="border-white/15 py-6 sm:px-8 first:sm:border-r last:border-t sm:last:border-t-0 lg:border-l lg:py-0 lg:first:border-r-0">
            <p className="flex items-center gap-2 text-sm font-black text-white"><MapPin size={17} className="shrink-0 text-red-500"/>{branch.name}</p>
            <p className="mt-2 pl-6 text-xs leading-5 text-zinc-400">{branch.address}</p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-zinc-200"><Phone size={16} className="shrink-0 text-red-500"/><a href={phoneHref(branch.phone)}>{branch.phone}</a><span className="text-zinc-600">|</span><a href={phoneHref(branch.backupPhone)}>{branch.backupPhone}</a></p>
            <a href={branch.map} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 pl-6 text-xs font-black text-red-500 transition hover:text-red-400">ดูแผนที่ <ExternalLink size={12}/></a>
          </div>)}
        </div>

        <div className="border-t border-white/15 pt-6 sm:border-l sm:px-8 lg:border-t-0 lg:border-l lg:pt-0">
          <div>
            <b className="text-sm text-zinc-100">ติดต่อเรา</b>
            <div className="mt-3 flex flex-col items-start gap-3">
              <a href={contact.line} target="_blank" rel="noopener noreferrer" aria-label="ติดต่อผ่าน LINE" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#06C755] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#05b34a]"><Image src="/line-logo.svg" alt="" width={26} height={26}/> LINE</a>
              <a href={contact.social} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-black text-red-500 transition hover:text-red-400">ช่องทางติดต่อทั้งหมด <ExternalLink size={13}/></a>
              <Link href="/privacy" className="text-xs font-bold text-zinc-300 underline underline-offset-4 transition hover:text-white">นโยบายความเป็นส่วนตัว</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl border-t border-white/10 px-4 py-2 text-center text-xs text-zinc-500 sm:px-6">© <CurrentYear /> SUPARERK STEEL CO., LTD.</div>
    </footer>
  );
}
