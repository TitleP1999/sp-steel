import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.suparerksteel.com").replace(/\/$/, "");

export const siteName = "ศุภฤกษ์ สตีล | ร้านเหล็กสุพรรณบุรีและกาญจนบุรี";
export const defaultDescription = "ร้านเหล็กสุพรรณบุรีและกาญจนบุรี จำหน่ายเหล็กก่อสร้าง เหล็กรูปพรรณ และวัสดุก่อสร้างครบวงจร พร้อมสต๊อกสินค้า บริการจัดส่ง และขอใบเสนอราคา";
export const defaultOgImage = "/steel-warehouse-background.jpg";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = path === "/" ? "/" : path.replace(/\/$/, "");
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: "th_TH",
      type: "website",
      images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: { card: "summary_large_image", title, description, images: [defaultOgImage] },
  };
}
