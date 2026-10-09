import type { Metadata } from "next";
import "./globals.css"; import Header from "../components/Header"; import Footer from "../components/Footer"; import FloatingContact from "../components/FloatingContact";
import { QuoteSelectionProvider } from "../components/QuoteSelection";
import { LanguageProvider } from "../components/LanguageProvider";
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
    icon: [{ url: "/favicon-v2.png", type: "image/png", sizes: "1024x1024" }],
    shortcut: "/favicon-v2.png",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "1024x1024" }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": `${siteUrl}/#organization`,
      name: "บริษัท ศุภฤกษ์ สตีล จำกัด", alternateName: "SUPARERK STEEL CO., LTD.", url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/suparerk-logo-transparent.png`, width: 1774, height: 887 },
      taxID: "0725563001575",
      contactPoint: [{ "@type": "ContactPoint", telephone: "+66-91-696-4747", contactType: "sales", areaServed: "TH", availableLanguage: ["th"] }],
      sameAs: ["https://www.facebook.com/SuparerkSteelSuphanburi", "https://www.facebook.com/SuparerkSteelKanchanaburi"],
      department: [{ "@id": `${siteUrl}/#suphanburi` }, { "@id": `${siteUrl}/#kanchanaburi` }],
    },
    {
      "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl,
      name: "ศุภฤกษ์ สตีล", alternateName: "SUPARERK STEEL", inLanguage: "th-TH",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": ["Store", "LocalBusiness"], "@id": `${siteUrl}/#suphanburi`,
      name: "ศุภฤกษ์ สตีล สาขาสุพรรณบุรี", url: `${siteUrl}/contact#branch-suphanburi`,
      image: `${siteUrl}/suparerk-logo-suphanburi.jpg`, telephone: "+66-86-321-5445", priceRange: "฿฿",
      parentOrganization: { "@id": `${siteUrl}/#organization` },
      address: { "@type": "PostalAddress", streetAddress: "232/9 หมู่ 4 ตำบลสนามชัย", addressLocality: "อำเภอเมืองสุพรรณบุรี", addressRegion: "สุพรรณบุรี", postalCode: "72000", addressCountry: "TH" },
      geo: { "@type": "GeoCoordinates", latitude: 14.473345, longitude: 100.1346707 },
      hasMap: "https://maps.app.goo.gl/tddg4Y9Gv5Dd25cX8", areaServed: { "@type": "AdministrativeArea", name: "จังหวัดสุพรรณบุรี" },
      sameAs: ["https://www.facebook.com/SuparerkSteelSuphanburi"],
    },
    {
      "@type": ["Store", "LocalBusiness"], "@id": `${siteUrl}/#kanchanaburi`,
      name: "ศุภฤกษ์ สตีล สาขากาญจนบุรี", url: `${siteUrl}/contact#branch-kanchanaburi`,
      image: `${siteUrl}/suparerk-logo-kanchanaburi.jpg`, telephone: "+66-80-373-2231", priceRange: "฿฿",
      parentOrganization: { "@id": `${siteUrl}/#organization` },
      address: { "@type": "PostalAddress", streetAddress: "1089 หมู่ 4 ตำบลท่าม่วง", addressLocality: "อำเภอท่าม่วง", addressRegion: "กาญจนบุรี", postalCode: "71110", addressCountry: "TH" },
      hasMap: "https://maps.app.goo.gl/jTfe5Rd5fkLsmCnz8", areaServed: { "@type": "AdministrativeArea", name: "จังหวัดกาญจนบุรี" },
      sameAs: ["https://www.facebook.com/SuparerkSteelKanchanaburi"],
    },
  ],
};

export default function Layout({children}:{children:React.ReactNode}){return <html lang="th"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,"\\u003c")}}/><LanguageProvider><QuoteSelectionProvider><Header/>{children}<Footer/><FloatingContact/></QuoteSelectionProvider></LanguageProvider></body></html>}
