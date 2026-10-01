import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://sp-steel-six.vercel.app").replace(/\/$/, "");

export const siteName = "SUPARERK STEEL | ศุภฤกษ์ สตีล";
export const defaultDescription = "จำหน่ายเหล็กและวัสดุก่อสร้างครบวงจร พร้อมจัดส่ง จากศุภฤกษ์ สตีล สาขาสุพรรณบุรีและกาญจนบุรี";
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
