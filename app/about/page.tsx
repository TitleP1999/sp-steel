import {
  ArrowUpRight,
  Banknote,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  MapPinned,
  Target,
  Truck,
  Warehouse,
} from "lucide-react";
import PageHero from "../../components/PageHero";
import Executives from "../../components/Executives";
import HomeWhySections from "../../components/HomeWhySections";
import { getExecutives } from "../../lib/executives";

export const dynamic = "force-dynamic";

const milestones = [
  {
    date: "2 ตุลาคม 2563",
    title: "เริ่มต้นศุภฤกษ์ สตีล",
    description:
      "จดทะเบียนก่อตั้งบริษัทด้วยทุนเริ่มต้น 1,000,000 บาท ตั้งสำนักงานใหญ่ในจังหวัดสุพรรณบุรี เพื่อจำหน่ายเหล็กและผลิตภัณฑ์โลหะสำหรับงานก่อสร้างและอุตสาหกรรม",
    icon: Building2,
  },
  {
    date: "ช่วงขยายกิจการ",
    title: "เพิ่มศักยภาพสินค้าและคลัง",
    description:
      "เพิ่มทุนจดทะเบียนเป็น 5,000,000 บาท พร้อมพัฒนาความหลากหลายของสินค้า ระบบสต๊อก พื้นที่จัดเก็บ และการขนส่ง เพื่อรองรับลูกค้าหลายกลุ่ม",
    icon: Warehouse,
  },
  {
    date: "พ.ศ. 2567",
    title: "เติบโตสู่รายได้รวมกว่า 216 ล้านบาท",
    description:
      "รายได้รวมอยู่ที่ประมาณ 216.6 ล้านบาท สะท้อนการขยายฐานลูกค้าและปริมาณการจำหน่าย โดยข้อมูลผลประกอบการในเอกสารครอบคลุมถึงปี 2567",
    icon: ChartNoAxesCombined,
  },
  {
    date: "พ.ศ. 2568",
    title: "ยกระดับการดำเนินงาน",
    description:
      "พัฒนาระบบบริหารต้นทุน สินค้าคงคลัง การขนส่ง และช่องทางการขาย เพื่อเพิ่มประสิทธิภาพและรองรับการเติบโตในระยะยาว",
    icon: ClipboardCheck,
  },
  {
    date: "ปัจจุบัน",
    title: "ขยายพื้นที่ให้บริการ",
    description:
      "ดำเนินงานในพื้นที่สุพรรณบุรีและท่าม่วง จังหวัดกาญจนบุรี พร้อมพัฒนาระบบโลจิสติกส์เพื่อจัดส่งสินค้าให้ลูกค้าในพื้นที่ต่าง ๆ",
    icon: MapPinned,
  },
  {
    date: "ก้าวต่อไป",
    title: "ผู้จัดจำหน่ายเหล็กครบวงจร",
    description:
      "ต่อยอดสินค้า สต๊อก การขนส่ง และระบบบริหารภายใน เพื่อรองรับลูกค้ารายย่อย ร้านค้า ผู้รับเหมา และลูกค้าโครงการ พร้อมสร้างความเชื่อมั่นในระยะยาว",
    icon: Target,
  },
];

export default async function About() {
  const executives = await getExecutives();
  return (
    <main>
      <PageHero
        eyebrow="ABOUT US"
        title="เกี่ยวกับ ศุภฤกษ์ สตีล"
        desc="รู้จักเส้นทางการเติบโตของบริษัท ศุภฤกษ์ สตีล จำกัด จากจุดเริ่มต้นในสุพรรณบุรี สู่ผู้จัดจำหน่ายเหล็กที่พร้อมดูแลลูกค้าหลากหลายกลุ่ม"
        backgroundImage="/steel-warehouse-background.jpg"
      />

      <section className="bg-[#f7f5f2]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:gap-12 lg:py-20">
          <div>
            <p className="text-xs font-black tracking-[.2em] text-[#8b352d]">OUR STORY</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              ศูนย์รวมเหล็กที่เติบโตไปพร้อมกับลูกค้า
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-zinc-600 sm:text-lg">
              <p>
                บริษัท ศุภฤกษ์ สตีล จำกัด (SUPARERK STEEL CO., LTD.)
                ก่อตั้งและจดทะเบียนเมื่อวันที่ 2 ตุลาคม พ.ศ. 2563
                ด้วยทุนจดทะเบียนเริ่มต้น 1,000,000 บาท ก่อนเพิ่มทุนเป็น 5,000,000 บาท
                โดยมีสำนักงานใหญ่ตั้งอยู่ในจังหวัดสุพรรณบุรี
              </p>
              <p>
                เราจำหน่ายเหล็ก เหล็กกล้า และผลิตภัณฑ์โลหะสำหรับงานก่อสร้าง งานโครงสร้าง
                และภาคอุตสาหกรรม รองรับตั้งแต่ลูกค้ารายย่อย ช่าง ผู้รับเหมา
                ร้านวัสดุก่อสร้าง ผู้ประกอบการ ไปจนถึงลูกค้าโครงการ
              </p>
              <p>
                เป้าหมายของเราคือเป็นแหล่งจัดหาสินค้าเหล็กที่หลากหลายและครบถ้วนในที่เดียว
                พร้อมดูแลตั้งแต่การเลือกสินค้า เสนอราคาและเอกสารทางการค้า
                จัดเตรียมสินค้า ไปจนถึงการจัดส่ง
              </p>
            </div>
          </div>

          <div className="rounded-[24px] bg-white p-5 sm:p-7">
            <p className="inline-flex items-center gap-2 text-xs font-black tracking-[.2em] text-[#8b352d]"><Building2 aria-hidden="true" size={16} />SUPARERK STEEL</p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="relative flex min-h-48 flex-col items-center rounded-2xl border border-white/15 bg-[#a6292e] px-3 py-6 text-center text-white shadow-[0_12px_28px_rgba(166,41,46,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(166,41,46,0.25)]">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/15 ring-1 ring-white/20"><CalendarDays aria-hidden="true" size={30} /></span>
                <p className="mt-3 flex min-h-10 items-center justify-center text-sm font-bold leading-tight text-white/80">ก่อตั้งบริษัท</p>
                <p className="flex min-h-8 items-center text-2xl font-black leading-tight">2 ตุลาคม 2563</p>
                <p className="min-h-5 text-xs">&nbsp;</p>
              </div>
              <div className="relative flex min-h-48 flex-col items-center rounded-2xl border border-white/15 bg-[#a6292e] px-3 py-6 text-center text-white shadow-[0_12px_28px_rgba(166,41,46,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(166,41,46,0.25)]">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/15 ring-1 ring-white/20"><Banknote aria-hidden="true" size={30} /></span>
                <p className="mt-3 flex min-h-10 items-center justify-center text-sm font-bold leading-tight text-white/80">ทุนจดทะเบียนปัจจุบัน</p>
                <p className="flex min-h-8 items-center text-2xl font-black leading-tight">5 ล้านบาท</p>
                <p className="min-h-5 text-xs">&nbsp;</p>
              </div>
              <div className="relative flex min-h-48 flex-col items-center rounded-2xl border border-white/15 bg-[#a6292e] px-3 py-6 text-center text-white shadow-[0_12px_28px_rgba(166,41,46,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(166,41,46,0.25)]">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/15 ring-1 ring-white/20"><MapPinned aria-hidden="true" size={30} /></span>
                <p className="mt-3 flex min-h-10 items-center justify-center text-sm font-bold leading-tight text-white/80">จำนวนสาขา</p>
                <p className="flex min-h-8 items-center text-2xl font-black leading-tight">2 สาขา</p>
                <p className="min-h-5 text-xs font-medium leading-5 text-white/75 sm:text-[11px]">สุพรรณบุรี และ กาญจนบุรี</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Executives items={executives.items.filter(item => item.published)} />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black tracking-[.2em] text-[#8b352d]">OUR JOURNEY</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">เส้นทางการเติบโต</h2>
          <p className="mt-4 leading-7 text-zinc-600">
            จากวันแรกจนถึงวันนี้ เราพัฒนาสินค้า ระบบคลัง และการให้บริการอย่างต่อเนื่อง
          </p>
        </div>

        <div className="relative mx-auto mt-12 max-w-5xl sm:mt-16">
          <div
            aria-hidden="true"
            className="absolute bottom-5 left-[13px] top-5 w-px bg-gradient-to-b from-[#8b352d] via-[#d7b1ac] to-transparent md:left-1/2 md:-translate-x-1/2"
          />
          <ol className="space-y-6 sm:space-y-8">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const left = index % 2 === 0;
              return (
                <li key={milestone.date} className="relative grid gap-4 pl-12 md:grid-cols-2 md:gap-10 md:pl-0">
                  <span className="absolute left-0 top-6 z-10 grid h-7 w-7 place-items-center rounded-full border-4 border-white bg-[#8b352d] text-white shadow md:left-1/2 md:-translate-x-1/2">
                    <Icon size={12} strokeWidth={2.5} />
                  </span>
                  <article
                    className={`rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-7 ${
                      left ? "md:col-start-1 md:text-right" : "md:col-start-2"
                    }`}
                  >
                    <div className={`flex items-center gap-3 ${left ? "md:flex-row-reverse" : ""}`}>
                      <span className="rounded-full bg-[#8b352d]/10 px-3 py-1.5 text-xs font-black tracking-wide text-[#8b352d]">
                        {milestone.date}
                      </span>
                      <ArrowUpRight size={16} className="text-[#8b352d]" />
                    </div>
                    <h3 className="mt-4 text-xl font-black sm:text-2xl">{milestone.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">{milestone.description}</p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <HomeWhySections />
    </main>
  );
}
