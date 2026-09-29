import Image from "next/image";
import { ExternalLink, MapPin, Phone } from "lucide-react";

const branches = [
  { name: "สาขาสุพรรณบุรี (สำนักงานใหญ่)", address: "สำนักงานใหญ่ เลขที่ 232/9 หมู่ที่ 4 ตำบลสนามชัย อำเภอเมืองสุพรรณบุรี จังหวัดสุพรรณบุรี", phone: "086-321-5445", backupPhone: "091-696-4747", image: "/branch-kanchanaburi-store.png", map: "https://maps.app.goo.gl/tddg4Y9Gv5Dd25cX8?g_st=il" },
  { name: "สาขากาญจนบุรี", address: "สำนักงานสาขา 00001 เลขที่ 1089 หมู่ที่ 4 ตำบลท่าม่วง อำเภอท่าม่วง จังหวัดกาญจนบุรี", phone: "080-373-2231", backupPhone: "091-696-4747", image: "/branch-suphanburi-store.png", map: "https://maps.app.goo.gl/jTfe5Rd5fkLsmCnz8?g_st=il" },
];

export default function HomeBranches() {
  return <section className="bg-[#202124] py-12 text-white sm:py-16">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <p className="text-xs font-black tracking-[.18em] text-[#e08a7f]">OUR BRANCHES</p>
      <h2 className="mt-2 text-3xl font-black sm:text-4xl">2 สาขาใกล้คุณ พร้อมบริการ</h2>
      <div className="mt-7 grid gap-4 lg:grid-cols-2">
        {branches.map(branch => <article key={branch.name} className="relative min-h-[360px] overflow-hidden rounded-2xl border border-white/15 shadow-xl sm:min-h-[390px]">
          <Image src={branch.image} alt={`หน้าร้าน${branch.name}`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/15"/>
          <div className="relative flex min-h-[360px] flex-col justify-end p-5 sm:min-h-[390px] sm:p-7">
            <h3 className="text-2xl font-black sm:text-3xl">{branch.name}</h3>
            <div className="mt-3 flex gap-2 text-sm leading-6 text-white/85"><MapPin className="mt-0.5 shrink-0 text-[#e47b6e]" size={18}/><p>{branch.address}</p></div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`tel:${branch.phone.replace(/-/g, "")}`} aria-label={`โทร ${branch.phone}`} className="flex min-w-0 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 transition hover:bg-white/20"><Phone className="shrink-0" size={18}/><span className="min-w-0"><strong className="block whitespace-nowrap text-xs sm:text-sm">{branch.phone}</strong><small className="block text-[10px] font-bold text-white/65">แตะเพื่อโทร</small></span></a>
              <a href={`tel:${branch.backupPhone.replace(/-/g, "")}`} aria-label={`โทรเบอร์สำรอง ${branch.backupPhone}`} className="flex min-w-0 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 transition hover:bg-white/20"><Phone className="shrink-0" size={18}/><span className="min-w-0"><strong className="block whitespace-nowrap text-xs sm:text-sm">สำรอง {branch.backupPhone}</strong><small className="block text-[10px] font-bold text-white/65">แตะเพื่อโทร</small></span></a>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a href={branch.map} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#8b352d] px-4 py-3 text-sm font-black transition hover:bg-[#a34238]"><MapPin size={17}/> ดูเส้นทาง</a>
              <a href="https://lin.ee/Yurg5Hy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#06C755] px-4 py-3 text-sm font-black transition hover:bg-[#05b34a]"><Image src="/line-logo.svg" alt="" width={20} height={20}/> ติดต่อผ่าน LINE <ExternalLink size={14}/></a>
            </div>
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
