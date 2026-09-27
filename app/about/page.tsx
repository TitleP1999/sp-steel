import {
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  Building2,
  ChartNoAxesCombined,
  ClipboardCheck,
  MapPinned,
  PackageCheck,
  Target,
  Truck,
  Warehouse,
} from "lucide-react";
import PageHero from "../../components/PageHero";
import Executives from "../../components/Executives";
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
    date: "พ.ศ. 2568 เป็นต้นไป",
    title: "ยกระดับประสิทธิภาพการดำเนินงาน",
    description:
      "หลังรายได้ปรับลดลงในปี 2568 บริษัทมุ่งพัฒนาการบริหารต้นทุน สินค้าคงคลัง การขนส่ง และช่องทางการขาย เพื่อรองรับการเติบโตในระยะยาว",
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

const productGroups = [
  {
    title: "เหล็กเส้น",
    items: "เหล็กเส้นกลม (RB) · เหล็กข้ออ้อย (DB)",
  },
  {
    title: "เหล็กรูปพรรณและท่อ",
    items: "เหล็กกล่อง · ท่อดำ · ท่อชุบสังกะสี · เหล็กตัวซี · เหล็กฉาก",
  },
  {
    title: "เหล็กโครงสร้าง",
    items: "H-Beam · I-Beam · Wide Flange · เหล็กแผ่น",
  },
  {
    title: "สินค้าและอุปกรณ์ก่อสร้าง",
    items: "Wire Mesh และสินค้าเกี่ยวข้องกับงานเหล็กและงานก่อสร้าง",
  },
];

const principles = [
  {
    icon: BadgeCheck,
    title: "คุณภาพและมาตรฐาน",
    description: "คัดเลือกสินค้าและตรวจสอบให้ได้คุณภาพตามความต้องการใช้งาน",
  },
  {
    icon: ClipboardCheck,
    title: "สเปกถูกต้อง",
    description: "ให้ข้อมูลและตรวจสอบรายละเอียดก่อนส่งมอบ เพื่อให้ตรงตามความต้องการ",
  },
  {
    icon: Boxes,
    title: "สินค้าและสต๊อกพร้อม",
    description: "บริหารสินค้าให้หลากหลาย รองรับทั้งงานทั่วไปและงานโครงการ",
  },
  {
    icon: Truck,
    title: "บริการจัดส่ง",
    description: "ดูแลตั้งแต่เสนอราคา จัดเตรียมสินค้า จนถึงจัดส่งถึงพื้นที่ลูกค้า",
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
      />

      <section className="bg-[#f7f5f2]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-12 lg:py-20">
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

          <div className="relative overflow-hidden rounded-[24px] bg-[#202124] p-6 text-white shadow-xl sm:p-8">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
            <p className="relative text-xs font-black tracking-[.2em] text-[#d28a80]">SUPARERK STEEL</p>
            <div className="relative mt-6 grid grid-cols-2 gap-5">
              <div className="border-t border-white/15 pt-4">
                <p className="text-3xl font-black sm:text-4xl">2563</p>
                <p className="mt-2 text-sm text-zinc-400">ปีที่ก่อตั้ง</p>
              </div>
              <div className="border-t border-white/15 pt-4">
                <p className="whitespace-nowrap text-xl font-black sm:text-2xl lg:text-3xl xl:text-4xl">5,000,000 บาท</p>
                <p className="mt-2 text-sm text-zinc-400">ทุนจดทะเบียนปัจจุบัน</p>
              </div>
              <div className="col-span-2 border-t border-white/15 pt-4">
                <p className="text-3xl font-black sm:text-4xl">2 สาขา</p>
                <p className="mt-2 text-sm text-zinc-400">สุพรรณบุรี • กาญจนบุรี</p>
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

      <section className="bg-[#202124] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-black tracking-[.2em] text-[#d28a80]">STEEL & MATERIALS</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">สินค้าเหล็กสำหรับงานหลากหลาย</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              คัดเลือกสินค้าให้มีคุณภาพ ได้มาตรฐาน และมีสเปกถูกต้อง
              เพื่อให้ลูกค้ามั่นใจเมื่อนำไปใช้งาน
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productGroups.map((group) => (
              <div key={group.title} className="rounded-[24px] border border-white/10 bg-white/[.04] p-5 sm:p-6">
                <PackageCheck size={24} className="text-[#d28a80]" />
                <h3 className="mt-5 text-lg font-black">{group.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{group.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-black tracking-[.2em] text-[#8b352d]">HOW WE WORK</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">ครบตั้งแต่เลือกสินค้า ถึงส่งถึงหน้างาน</h2>
            <p className="mt-5 leading-8 text-zinc-600">
              เราบริหารคลังและสต๊อกให้รองรับสินค้าหลากหลาย
              สนับสนุนการซื้อหน้าร้านและการสั่งซื้อจากลูกค้าธุรกิจ
              พร้อมเอกสารทางการค้า ใบกำกับภาษี และระบบขนส่งที่ช่วยให้การจัดซื้อสะดวกขึ้น
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-[24px] border border-zinc-200 bg-[#f7f5f2] p-5 sm:p-6">
                <Icon size={26} className="text-[#8b352d]" />
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#8b352d] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black tracking-[.2em] text-white/70">OUR DIRECTION</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">เติบโตอย่างเป็นระบบ และเป็นที่ไว้วางใจ</h2>
            <p className="mt-4 max-w-3xl leading-8 text-white/85">
              เรามุ่งสู่การเป็นผู้จัดจำหน่ายเหล็กและวัสดุก่อสร้างแบบครบวงจร
              พัฒนาบุคลากร ระบบสต๊อก การขาย การบัญชี และโลจิสติกส์
              เพื่อให้บริการได้อย่างมีประสิทธิภาพและสร้างความเชื่อมั่นแก่ลูกค้าในระยะยาว
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-[24px] border border-white/20 bg-white/10 p-5">
            <Truck size={28} />
            <p className="text-sm font-bold leading-6">สินค้าได้มาตรฐาน<br />สเปกถูกต้อง · จัดส่งรวดเร็ว</p>
          </div>
        </div>
      </section>
    </main>
  );
}
