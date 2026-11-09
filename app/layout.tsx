import { phoneHref, type SiteContent } from "../data/site-content";
import { getSiteContent } from "../lib/site-content";
import type { Metadata } from "next";
import "./globals.css"; import Header from "../components/Header"; import Footer from "../components/Footer"; import FloatingContact from "../components/FloatingContact";
import { QuoteSelectionProvider } from "../components/QuoteSelection";
import { LanguageProvider } from "../components/LanguageProvider";
import GoogleAnalytics from "../components/GoogleAnalytics";
import StorefrontChrome from "../components/StorefrontChrome";
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

function structuredData({ branches, contact }: Pick<SiteContent, "branches" | "contact">) {
  const [suphan, kanchan] = branches;
  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": `${siteUrl}/#organization`,
      name: "บริษัท ศุภฤกษ์ สตีล จำกัด", alternateName: "SUPARERK STEEL CO., LTD.", url: siteUrl,
      logo: { "@type": "ImageObject", url: `${siteUrl}/suparerk-logo-transparent.png`, width: 1774, height: 887 },
      taxID: "0725563001575",
      contactPoint: [{ "@type": "ContactPoint", telephone: phoneHref(contact.phone).slice(4), contactType: "sales", areaServed: "TH", availableLanguage: ["th"] }],
      sameAs: branches.map(branch => branch.facebook),
      department: [{ "@id": `${siteUrl}/#suphanburi` }, { "@id": `${siteUrl}/#kanchanaburi` }],
    },
    {
      "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl,
      name: "ศุภฤกษ์ สตีล", alternateName: "SUPARERK STEEL", inLanguage: "th-TH",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": ["Store", "LocalBusiness"], "@id": `${siteUrl}/#suphanburi`,
      name: "ศุภฤกษ์ สตีล " + suphan.name, url: `${siteUrl}/contact#branch-suphanburi`,
      image: `${siteUrl}/suparerk-logo-suphanburi.jpg`, telephone: phoneHref(suphan.phone).slice(4), priceRange: "฿฿",
      parentOrganization: { "@id": `${siteUrl}/#organization` },
      address: { "@type": "PostalAddress", streetAddress: suphan.address, addressCountry: "TH" },
      hasMap: suphan.map, areaServed: { "@type": "AdministrativeArea", name: "จังหวัดสุพรรณบุรี" },
      sameAs: [suphan.facebook],
    },
    {
      "@type": ["Store", "LocalBusiness"], "@id": `${siteUrl}/#kanchanaburi`,
      name: "ศุภฤกษ์ สตีล " + kanchan.name, url: `${siteUrl}/contact#branch-kanchanaburi`,
      image: `${siteUrl}/suparerk-logo-kanchanaburi.jpg`, telephone: phoneHref(kanchan.phone).slice(4), priceRange: "฿฿",
      parentOrganization: { "@id": `${siteUrl}/#organization` },
      address: { "@type": "PostalAddress", streetAddress: kanchan.address, addressCountry: "TH" },
      hasMap: "https://maps.app.goo.gl/jTfe5Rd5fkLsmCnz8", areaServed: { "@type": "AdministrativeArea", name: "จังหวัดกาญจนบุรี" },
      sameAs: [kanchan.facebook],
    },
  ],
  };
}

export default async function Layout({children}:{children:React.ReactNode}){
  const { content: { branches, contact } } = await getSiteContent();
  const floatingBranches = branches.map(({ id, shortName, facebook, phone }) => ({ id, shortName, facebook, phone }));
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-YPD392Y20D";
  return <html lang="th"><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData({ branches, contact })).replace(/</g,"\\u003c")}}/><LanguageProvider><QuoteSelectionProvider><StorefrontChrome top={<Header line={contact.line}/>} bottom={<><Footer branches={branches} contact={contact}/><FloatingContact line={contact.line} branches={floatingBranches}/></>}>{children}</StorefrontChrome></QuoteSelectionProvider></LanguageProvider>{measurementId ? <GoogleAnalytics measurementId={measurementId} /> : null}</body></html>;
}
