import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว",
  description: "ข้อมูลเกี่ยวกับการใช้ข้อมูลส่วนบุคคลบนเว็บไซต์ศุภฤกษ์ สตีล",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#f8f7f5] px-5 py-16 sm:py-24">
      <article className="mx-auto max-w-4xl rounded-3xl border border-zinc-200 bg-white px-6 py-10 shadow-sm sm:px-12 sm:py-14">
        <p className="text-sm font-black tracking-[0.2em] text-[#8b352d]">PRIVACY POLICY</p>
        <h1 className="mt-4 text-3xl font-black leading-relaxed text-zinc-900 sm:text-4xl">นโยบายความเป็นส่วนตัว</h1>
        <div className="mt-8 space-y-8 text-base leading-8 text-zinc-700">
          <p>บริษัท ศุภฤกษ์ สตีล จำกัด ให้ความสำคัญกับข้อมูลส่วนบุคคลของผู้ใช้เว็บไซต์ หน้านี้อธิบายข้อมูลที่เกี่ยวข้องกับการใช้เว็บไซต์และช่องทางติดต่อของบริษัท</p>
          <section><h2 className="text-xl font-bold text-zinc-900">ข้อมูลที่เกี่ยวข้องกับการใช้งาน</h2><p className="mt-2">เมื่อท่านติดต่อหรือขอใบเสนอราคา ท่านอาจให้ข้อมูล เช่น ชื่อ เบอร์โทรศัพท์ ที่อยู่ รายการสินค้าที่สนใจ และรายละเอียดที่ต้องการให้ฝ่ายขายติดต่อกลับ ทั้งนี้ขึ้นอยู่กับข้อมูลที่ท่านเลือกส่งให้บริษัท</p></section>
          <section><h2 className="text-xl font-bold text-zinc-900">การใช้ข้อมูล</h2><p className="mt-2">บริษัทใช้ข้อมูลที่ท่านส่งมาเพื่อตอบคำถาม ติดต่อกลับ จัดทำใบเสนอราคา และดำเนินการเกี่ยวกับสินค้าและบริการตามที่ท่านติดต่อเข้ามา</p></section>
          <section><h2 className="text-xl font-bold text-zinc-900">ระยะเวลาเก็บข้อมูล</h2><p className="mt-2">ข้อมูลสำหรับการสอบถามและขอใบเสนอราคาที่ไม่ได้เกิดการซื้อขาย เก็บไว้ไม่เกิน 1 ปีนับจากการติดต่อครั้งล่าสุด เว้นแต่มีเหตุจำเป็นตามกฎหมายหรือเพื่อดำเนินการเกี่ยวกับสิทธิเรียกร้อง สำหรับข้อมูลที่เป็นส่วนหนึ่งของเอกสารบัญชีหรือภาษี บริษัทเก็บรักษาตามระยะเวลาที่กฎหมายกำหนด เมื่อพ้นระยะเวลาและหมดความจำเป็น บริษัทจะลบหรือทำลายข้อมูลตามความเหมาะสม</p></section>
          <section><h2 className="text-xl font-bold text-zinc-900">การใช้งานเว็บไซต์และบริการภายนอก</h2><p className="mt-2">เว็บไซต์ใช้ Google Analytics เพื่อวัดการเข้าชมและการใช้งานเว็บไซต์ และอาจใช้คุกกี้หรือเทคโนโลยีที่คล้ายกัน รายการสินค้าที่ท่านเลือกขอราคาอาจถูกเก็บไว้ในพื้นที่จัดเก็บของเบราว์เซอร์บนอุปกรณ์ของท่าน</p><p className="mt-3">เว็บไซต์มีลิงก์หรือแสดงเนื้อหาจากบริการภายนอก เช่น Google Maps, Google Reviews, Facebook และ LINE เมื่อท่านใช้บริการเหล่านั้น การประมวลผลข้อมูลของบริการดังกล่าวอยู่ภายใต้นโยบายของผู้ให้บริการแต่ละราย</p></section>
          <section><h2 className="text-xl font-bold text-zinc-900">ข้อมูลจาก Google Business Profile</h2><p className="mt-2">เว็บไซต์เชื่อมต่อบัญชี Google Business Profile ของบริษัทที่ได้รับอนุญาต เพื่อดึงและแสดงรีวิวของสาขา ผู้ดูแลบัญชีสามารถจัดการหรือยกเลิกสิทธิ์ที่ให้แอปเข้าถึงบัญชีผ่านการตั้งค่าบัญชี Google ได้</p></section>
          <section><h2 className="text-xl font-bold text-zinc-900">การติดต่อเกี่ยวกับข้อมูลส่วนบุคคล</h2><p className="mt-2">หากมีคำถามหรือต้องการติดต่อบริษัทเกี่ยวกับข้อมูลส่วนบุคคล โปรดติดต่อ <a className="font-bold text-[#8b352d] underline" href="tel:0916964747">091-696-4747</a> หรือผ่าน <Link className="font-bold text-[#8b352d] underline" href="/contact">หน้าติดต่อเรา</Link></p></section>
        </div>
      </article>
    </main>
  );
}
