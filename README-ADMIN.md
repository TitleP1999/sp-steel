# ระบบจัดการราคา SP Steel

## โครงสร้างเดิมและการเชื่อมต่อ

- Next.js 14 App Router, React 18, TypeScript และ Tailwind CSS
- `data/products.ts` เก็บแค็ตตาล็อก ขนาด และราคาตัวอย่างเริ่มต้น
- `lib/prices.ts` ใช้ Neon PostgreSQL เมื่อมี `DATABASE_URL` และใช้ไฟล์ local เมื่อไม่มี โดยคำนวณราคาเริ่มต้นจากราคาต่ำสุดของทุกขนาด
- `/`, `/products` และ `/products/[slug]` อ่านราคาฝั่งเซิร์ฟเวอร์ทุกครั้งที่เปิดหรือโหลดหน้าใหม่ ไม่ต้อง build ใหม่เมื่อแก้ราคา
- `/admin/login` และ `/admin` เป็นหน้าล็อกอินและแก้ราคาสินค้า ค้นหาหรือกรองหมวดได้ บันทึกทีละสินค้า
  - `/admin` จัดการข่าวสารได้ เพิ่ม แก้ไข ลบ เลือกรูปภาพ และเลือกเผยแพร่รายการข่าวสาร ซึ่งจะแสดงใน `/news`
  - ฟอร์มขอใบเสนอราคาที่ `/contact` บันทึกในตาราง `sp_quote_requests` และแสดงรายการล่าสุดใน `/admin`
- หน้าเว็บที่ลูกค้าเปิดค้างไว้ต้องโหลดใหม่เพื่อเห็นราคาใหม่ ไม่มีระบบ push แบบเรียลไทม์

## เริ่มใช้งาน

```powershell
cd D:\sp-steel
npm run admin:setup
npm run dev
```

คำสั่ง setup สร้างบัญชี `admin` พร้อมรหัสผ่านสุ่ม แสดงรหัสผ่านครั้งเดียว ให้เก็บใน password manager รหัสผ่านใน `.env.local` ถูกเก็บเป็น scrypt hash ไม่ใช่ข้อความธรรมดา สามารถเลือกชื่อผู้ใช้ด้วย `npm run admin:setup -- yourname` หลังตั้งค่าต้องรีสตาร์ต Next.js

เปิด `http://localhost:3000/admin` ล็อกอิน แก้ราคาแต่ละขนาดแล้วกด **บันทึกราคาสินค้านี้** ตรวจผลผ่านลิงก์ดูสินค้า ราคาเป็นบาท รองรับ 0–100,000,000 และทศนิยมไม่เกิน 2 ตำแหน่ง ราคา 0 จะแสดงเป็น 0 บาท ไม่มีความหมายว่าขอใบเสนอราคา

สินค้าที่ยังไม่ได้แก้ไขใช้ราคาตัวอย่างเดิม 10/20/30/40 บาท ต้องตรวจสอบทุกรายการก่อนเปิดใช้งานจริง

## การจัดเก็บบน Neon และ Vercel

เชื่อม Neon จาก Vercel Marketplace โดยใช้ Custom Prefix เป็น `DATABASE` เพื่อให้ได้ตัวแปร `DATABASE_URL` แล้วตั้งตัวแปรแอดมิน `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` และ `ADMIN_SESSION_SECRET` ใน Vercel สำหรับ Production/Preview ตามที่ต้องการ จากนั้น Redeploy

เมื่อแอปเชื่อมฐานข้อมูลครั้งแรก ระบบสร้างตาราง `sp_price_state` และ `sp_product_prices` อัตโนมัติ และใส่ราคาตั้งต้นจาก `data/price-seed.json` เฉพาะตอนที่สินค้านั้นยังไม่มีข้อมูล การ deploy ครั้งต่อไปจะไม่เขียนทับราคาที่แอดมินบันทึกไว้

สามารถตรวจข้อมูลผ่าน Neon SQL Editor:

```sql
SELECT product_slug, prices, updated_at
FROM sp_product_prices
ORDER BY product_slug;

SELECT customer_name, phone, product, details, status, created_at
FROM sp_quote_requests
ORDER BY created_at DESC;
```

## การจัดเก็บบนเซิร์ฟเวอร์ทั่วไปหรือ local

หากไม่มี `DATABASE_URL` ระบบใช้ **Node.js server หนึ่ง instance พร้อมดิสก์ถาวร** และเก็บข้อมูลนอก public ที่ `storage/prices.json` ซึ่งไม่เข้า Git หากต้องการใช้ไดเรกทอรีอื่นกำหนด `PRICE_DATA_DIR` เป็น absolute path และให้บัญชีที่รันแอปมีสิทธิ์อ่าน/เขียน สำรองไฟล์นี้พร้อมการสำรองข้อมูลของเซิร์ฟเวอร์ ห้ามลบหรือแทนที่ไดเรกทอรีนี้ระหว่าง deploy

ข่าวสารใช้ตาราง `sp_news_config` เมื่อมี `DATABASE_URL` หรือไฟล์ `storage/news.json` เมื่อใช้ local storage หากต้องการแยกไดเรกทอรี local ให้กำหนด `NEWS_DATA_DIR` เป็น absolute path การบันทึกข่าวสารมี revision ป้องกันการเขียนทับข้อมูลจากหน้าต่างอื่น และหน้า `/news` จะแสดงเฉพาะรายการที่เลือกเผยแพร่ รูปภาพใส่เป็น URL หรือ path ใน `public` เช่น `/news/promo.jpg`

การบันทึกใช้ lock และเขียนไฟล์ชั่วคราวแล้ว rename เพื่อลดโอกาสข้อมูลเสีย มี revision ป้องกันการเขียนทับจากข้อมูลเก่า หากเกิดข้อขัดแย้ง ให้โหลดข้อมูลล่าสุดแล้วแก้ใหม่ หาก process หยุดกลางการบันทึกและเหลือ `prices.lock` ให้หยุดเซิร์ฟเวอร์ ตรวจสอบว่าไม่มี process อื่นเขียนข้อมูล แล้วจึงลบเฉพาะ lock ดังกล่าวและเปิดเซิร์ฟเวอร์ใหม่ ระบบจะไม่ย้อนกลับไปแสดงราคาตัวอย่างเงียบ ๆ เมื่อไฟล์ข้อมูลเสีย

Production นอก Vercel ใช้ `npm run build` และ `npm start` หลัง reverse proxy ที่ให้บริการ HTTPS เพราะ session cookie ใช้ Secure ใน production อย่าใช้ static export

## การยืนยันตัวตน

- ตั้งค่า `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` ฝั่งเซิร์ฟเวอร์เท่านั้น ไม่มี default password และไม่ใช้ตัวแปร `NEXT_PUBLIC_*`
- session มีลายเซ็น หมดอายุใน 8 ชั่วโมง ใช้ HttpOnly, SameSite=Strict และ Secure ใน production
- หน้าแอดมินและทุก server action ที่เขียนราคาตรวจ session ฝั่งเซิร์ฟเวอร์ Next.js Server Actions ตรวจ Origin/Host เพื่อป้องกันคำขอข้าม origin
- จำกัดการล็อกอินผิด 10 ครั้งใน 15 นาทีต่อบัญชีภายใน process การรีสตาร์ตจะรีเซ็ตตัวนับ
- ออกจากระบบลบ cookie ของเบราว์เซอร์นั้น token ที่ถูกคัดลอกยังใช้ได้จนหมดอายุ หากสงสัยว่าถูกขโมยให้เปลี่ยน secret เพื่อยกเลิกทุก session
- รีเซ็ตรหัสผ่าน: ลบเฉพาะสามบรรทัด `ADMIN_*` จาก `.env.local`, รัน setup ใหม่ และรีสตาร์ต การเปลี่ยน username/hash/secret ทำให้ session เดิมใช้ไม่ได้

## ตรวจสอบ

```powershell
npm test
npx tsc --noEmit
npm run build
npm run test:http
```

ทดสอบรหัสผ่านผิด การปลอม/หมดอายุ session, throttling, ราคาไม่ถูกต้อง, ค่าศูนย์/ทศนิยม, ราคาเริ่มต้น, การอ่านข้อมูลหลังโหลดโมดูลใหม่, การแก้พร้อมกัน และไฟล์ข้อมูลเสีย โดยใช้ไดเรกทอรีชั่วคราวไม่แตะราคาจริง

`test:http` ต้องรันหลัง build โดยจะเปิด production server ชั่วคราวด้วยบัญชีและที่เก็บข้อมูลแยก ทดสอบล็อกอิน/ออกจากระบบ, cookie, คำขอข้าม origin, การปฏิเสธผู้ไม่มีสิทธิ์, บันทึกและแสดงราคาครบสามหน้า และรีสตาร์ตเซิร์ฟเวอร์ ไม่ใช้บัญชีหรือราคาจริง
