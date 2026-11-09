import Image from "next/image";
import { ExternalLink, MapPin, Phone } from "lucide-react";

import { phoneHref, type SiteBranch } from "../data/site-content";

export default function HomeBranches({ branches, line }: { branches: SiteBranch[]; line: string }) {
  return <section className="bg-[#202124] py-12 text-white sm:py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="text-xs font-black tracking-[.18em] text-[#e08a7f]">OUR BRANCHES</p>
      <h2 className="mt-2 text-3xl font-black sm:text-4xl">2 สาขาใกล้คุณ พร้อมบริการ</h2>
      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {branches.map(branch => <article key={branch.id} className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/15 shadow-xl sm:min-h-[390px]">
          <Image src={branch.image} alt={`หน้าร้าน${branch.name}`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="!rounded-none object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/15"/>
          <div className="relative flex min-h-[360px] flex-col justify-end p-5 sm:min-h-[390px] sm:p-7">
            <h3 className="text-2xl font-black sm:text-3xl">{branch.name}</h3>
            <div className="mt-3 flex gap-2 text-sm leading-6 text-white/85"><MapPin className="mt-0.5 shrink-0 text-[#e47b6e]" size={18}/><p>{branch.address}</p></div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={phoneHref(branch.phone)} aria-label={`โทร ${branch.phone}`} className="flex min-w-0 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2 py-2.5 transition hover:bg-white/20 sm:gap-2 sm:px-3"><Phone className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]"/><span className="min-w-0"><strong className="block whitespace-nowrap text-[11px] sm:text-sm">{branch.phone}</strong><small className="block whitespace-nowrap text-[9px] font-bold text-white/65 sm:text-[10px]">เบอร์หลัก · แตะเพื่อโทร</small></span></a>
              <a href={phoneHref(branch.backupPhone)} aria-label={`โทรเบอร์สำรอง ${branch.backupPhone}`} className="flex min-w-0 items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-2 py-2.5 transition hover:bg-white/20 sm:gap-2 sm:px-3"><Phone className="h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px]"/><span className="min-w-0"><strong className="block whitespace-nowrap text-[11px] sm:text-sm">{branch.backupPhone}</strong><small className="block whitespace-nowrap text-[9px] font-bold text-white/65 sm:text-[10px]">เบอร์สำรอง · แตะเพื่อโทร</small></span></a>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a href={branch.map} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#8b352d] px-4 py-3 text-sm font-black transition hover:bg-[#a34238]"><MapPin size={17}/> ดูเส้นทาง</a>
              <a href={line} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#06C755] px-4 py-3 text-sm font-black transition hover:bg-[#05b34a]"><Image src="/line-logo.svg" alt="" width={20} height={20}/> ติดต่อผ่าน LINE <ExternalLink size={14}/></a>
            </div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
