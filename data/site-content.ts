const branches = [
 {id:"branch-suphanburi",name:"สาขาสุพรรณบุรี (สำนักงานใหญ่)",shortName:"สุพรรณบุรี",en:"SUPHAN BURI (HEADQUARTER)",logo:"/suparerk-logo-suphanburi.jpg",image:"/branch-kanchanaburi-store.png",warehouseImage:"/warehouse-branch-1-v1.png",address:"สำนักงานใหญ่ เลขที่ 232/9 หมู่ที่ 4 ตำบลสนามชัย อำเภอเมืองสุพรรณบุรี จังหวัดสุพรรณบุรี 72000",phone:"086-321-5445",backupPhone:"091-696-4747",facebook:"https://www.facebook.com/SuparerkSteelSuphanburi",map:"https://maps.app.goo.gl/b3791ua5LVAZ9zrS9",embed:"https://www.google.com/maps?q=14.4815163%2C100.1318772&z=17&output=embed"},
 {id:"branch-kanchanaburi",name:"สาขากาญจนบุรี",shortName:"กาญจนบุรี",en:"KANCHANABURI",logo:"/suparerk-logo-kanchanaburi.jpg",image:"/branch-suphanburi-store.png",warehouseImage:"/warehouse-branch-2-v1.png",address:"สำนักงานสาขา 00001 เลขที่ 1089 หมู่ที่ 4 ตำบลท่าม่วง อำเภอท่าม่วง จังหวัดกาญจนบุรี 71110",phone:"080-373-2231",backupPhone:"091-696-4747",facebook:"https://www.facebook.com/SuparerkSteelKanchanaburi",map:"https://maps.app.goo.gl/jTfe5Rd5fkLsmCnz8?g_st=il",embed:"https://www.google.com/maps?q=Suparerk+Steel+1089+Moo+4+Tha+Muang+Tha+Muang+Kanchanaburi+71110&z=16&output=embed"}
];

export const defaultSiteContent = {
  home: {
    heading: "ร้านเหล็ก",
    subheading: "ครบทุกเรื่องเหล็ก",
    description: "ศูนย์จำหน่ายเหล็กก่อสร้างและเหล็กโครงสร้าง เหล็กเส้น เหล็กกล่อง เหล็กตัวซี H-Beam ท่อเหล็ก เหล็กแผ่น พร้อมสต๊อกสินค้าและบริการจัดส่งทั่วสุพรรณบุรีและกาญจนบุรี",
    image: "/steel-warehouse-background.jpg",
    productButton: "ดูสินค้าทั้งหมด",
    quoteButton: "ขอใบเสนอราคาผ่าน LINE",
  },
  contact: {
    title: "ติดต่อเรา",
    description: "ติดต่อฝ่ายขาย สอบถามสินค้า ขอใบเสนอราคา หรือเลือกสาขาที่สะดวกสำหรับการเดินทาง",
    image: "/steel-warehouse-background.jpg",
    line: "https://lin.ee/Yurg5Hy",
    phone: "035-569-333",
    social: "https://linktr.ee/suparerksteel",
  },
  branches,
};

export type SiteContent = typeof defaultSiteContent;
export type SiteBranch = SiteContent["branches"][number];
export const siteImageMaxLength = 450_000;

export function phoneHref(phone: string) {
  return "tel:" + phone.replace(/[^+\d]/g, "");
}
