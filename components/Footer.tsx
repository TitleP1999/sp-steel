import Image from "next/image";
import { ExternalLink, MapPin, Phone } from "lucide-react";
import CurrentYear from "./CurrentYear";

const LINE_URL = "https://lin.ee/Yurg5Hy";

export default function Footer() {
  return (
    <footer className="border-t-4 border-[#8b352d] bg-[#151516] text-white">
      <div className="mx-auto grid max-w-6xl gap-0 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:py-5">
        <div className="flex flex-col items-start pb-5 sm:pr-8 lg:pb-0">
          <div className="relative h-36 w-full max-w-64">
            <Image src="/suparerk-logo-transparent.png" alt="SUPARERK STEEL" fill sizes="256px" className="-translate-y-4 object-contain object-left-top" />
          </div>
          <p className="-mt-6 pl-3 text-sm font-black text-white">บริษัท ศุภฤกษ์ สตีล จำกัด</p>
          <p className="mt-1 whitespace-nowrap pl-3 text-xs leading-5 text-zinc-400">เลขประจำตัวผู้เสียภาษี: <span className="font-bold tracking-wide text-zinc-200">0725563001575</span></p>
        </div>

        <div className="grid gap-0 border-t border-white/15 sm:col-span-2 sm:grid-cols-2 lg:contents">
          <div className="py-6 sm:border-r sm:border-white/15 sm:px-8 lg:border-l lg:border-r-0 lg:py-0">
            <p className="flex items-center gap-2 whitespace-nowrap text-xs font-black text-white xl:text-sm"><MapPin size={17} className="shrink-0 text-red-500"/>สาขาสุพรรณบุรี (สำนักงานใหญ่)</p>
            <p className="mt-2 pl-6 text-xs leading-5 text-zinc-400">232/9 หมู่ 4 ต.สนามชัย อ.เมืองสุพรรณบุรี<br/>จ.สุพรรณบุรี 72000</p>
            <p className="mt-2 flex items-center gap-2 pl-0 text-xs font-bold text-zinc-200"><Phone size={16} className="shrink-0 text-red-500"/><a href="tel:0863215445">086-321-5445</a><span className="text-zinc-600">|</span><a href="tel:0916964747">091-696-4747</a></p>
            <a href="https://maps.app.goo.gl/tddg4Y9Gv5Dd25cX8?g_st=il" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 pl-6 text-xs font-black text-[#d28a80] transition hover:text-[#efa398]">ดูแผนที่ <ExternalLink size={12}/></a>
          </div>
          <div className="border-t border-white/15 py-6 sm:border-t-0 sm:px-8 lg:border-l lg:py-0">
            <p className="flex items-center gap-2 text-sm font-black text-white"><MapPin size={17} className="shrink-0 text-red-500"/>สาขากาญจนบุรี</p>
            <p className="mt-2 pl-6 text-xs leading-5 text-zinc-400">1089 หมู่ 4 ต.ท่าม่วง อ.ท่าม่วง<br/>จ.กาญจนบุรี 71110</p>
            <p className="mt-2 flex items-center gap-2 pl-0 text-xs font-bold text-zinc-200"><Phone size={16} className="shrink-0 text-red-500"/><a href="tel:0803732231">080-373-2231</a><span className="text-zinc-600">|</span><a href="tel:0916964747">091-696-4747</a></p>
            <a href="https://maps.app.goo.gl/jTfe5Rd5fkLsmCnz8?g_st=il" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 pl-6 text-xs font-black text-[#d28a80] transition hover:text-[#efa398]">ดูแผนที่ <ExternalLink size={12}/></a>
          </div>
        </div>

        <div className="border-t border-white/15 pt-6 sm:border-l sm:px-8 lg:border-t-0 lg:border-l lg:pt-0">
          <div>
            <b className="text-sm text-zinc-100">ติดต่อเรา</b>
            <div className="mt-3 flex flex-col items-start gap-3">
              <a href={LINE_URL} target="_blank" rel="noopener noreferrer" aria-label="ติดต่อผ่าน LINE" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#06C755] px-5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#05b34a]"><Image src="/line-logo.svg" alt="" width={26} height={26}/> LINE</a>
              <a href="https://linktr.ee/suparerksteel" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-black text-[#d28a80] transition hover:text-[#efa398]">ช่องทางติดต่อทั้งหมด <ExternalLink size={13}/></a>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl border-t border-white/10 px-4 py-2 text-center text-xs text-zinc-500 sm:px-6">© <CurrentYear /> SUPARERK STEEL CO., LTD.</div>
    </footer>
  );
}
