import type { Metadata } from "next";
import "./globals.css"; import Header from "../components/Header"; import Footer from "../components/Footer"; import FloatingContact from "../components/FloatingContact";
import { QuoteSelectionProvider } from "../components/QuoteSelection";
import { defaultDescription, defaultOgImage, siteName, siteUrl } from "../lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteName, template: "%s | SUPARERK STEEL" },
  description: defaultDescription,
  keywords: ["ร้านเหล็กสุพรรณบุรี", "ร้านเหล็กกาญจนบุรี", "ร้านเหล็ก", "ราคาเหล็ก", "เหล็กสุพรรณบุรี", "เหล็กกาญจนบุรี", "วัสดุก่อสร้าง", "ศุภฤกษ์ สตีล"],
  openGraph: { title: siteName, description: defaultDescription, siteName, locale: "th_TH", type: "website", images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }] },
  twitter: { card: "summary_large_image", title: siteName, description: defaultDescription, images: [defaultOgImage] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/icon.png",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "512x512" }],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "บริษัท ศุภฤกษ์ สตีล จำกัด",
  alternateName: "SUPARERK STEEL CO., LTD.",
  url: siteUrl,
  logo: `${siteUrl}/suparerk-logo-transparent.png`,
  taxID: "0725563001575",
  contactPoint: [{ "@type": "ContactPoint", telephone: "+66-91-696-4747", contactType: "sales", availableLanguage: ["th"] }],
  sameAs: ["https://www.facebook.com/SuparerkSteelSuphanburi", "https://www.facebook.com/SuparerkSteelKanchanaburi"],
  department: [
    { "@type": "LocalBusiness", name: "ศุภฤกษ์ สตีล สาขาสุพรรณบุรี", telephone: "+66-86-321-5445", address: { "@type": "PostalAddress", streetAddress: "232/9 หมู่ 4 ตำบลสนามชัย", addressLocality: "อำเภอเมืองสุพรรณบุรี", addressRegion: "สุพรรณบุรี", postalCode: "72000", addressCountry: "TH" } },
    { "@type": "LocalBusiness", name: "ศุภฤกษ์ สตีล สาขากาญจนบุรี", telephone: "+66-80-373-2231", address: { "@type": "PostalAddress", streetAddress: "1089 หมู่ 4 ตำบลท่าม่วง", addressLocality: "อำเภอท่าม่วง", addressRegion: "กาญจนบุรี", postalCode: "71110", addressCountry: "TH" } },
  ],
};

export default function Layout({children}:{children:React.ReactNode}){return <html lang="th"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organizationJsonLd).replace(/</g,"\\u003c")}}/><QuoteSelectionProvider><Header/>{children}<Footer/><FloatingContact/></QuoteSelectionProvider></body></html>}
