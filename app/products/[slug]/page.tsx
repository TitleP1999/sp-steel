import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductMotion from "../../../components/ProductMotion";
import { getCatalog } from "../../../lib/prices";
import { getProductGallery } from "../../../lib/product-gallery";
import { siteUrl } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { products } = await getCatalog();
  const product = products.find((item) => item.slug === params.slug);
  if (!product) return { title: "ไม่พบสินค้า", robots: { index: false, follow: false } };
  const path = `/products/${product.slug}`;
  const title = `${product.name} ราคา ขนาด และสเปก | สุพรรณบุรี กาญจนบุรี`;
  const description = `${product.short} จำหน่ายและจัดส่งโดยศุภฤกษ์ สตีล สาขาสุพรรณบุรีและกาญจนบุรี`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "th_TH", images: [{ url: product.image, alt: product.name }] },
    twitter: { card: "summary_large_image", title, description, images: [product.image] },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [{ products }, gallery] = await Promise.all([getCatalog(), getProductGallery()]);
  const product = products.find((item) => item.slug === params.slug);
  if (!product) return notFound();
  const productUrl = `${siteUrl}/products/${product.slug}`;
  const productJsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: product.name,
    description: product.description, image: [`${siteUrl}${product.image}`], sku: product.code, url: productUrl,
    brand: { "@type": "Brand", name: product.brand === "SYS" ? "SIAM YAMATO STEEL" : product.brand === "TATA" || product.slug === "tiscon-superlinks" ? "TATA STEEL" : "SUPARERK STEEL" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "หน้าหลัก", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "สินค้าทั้งหมด", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
    <ProductMotion product={product} gallery={gallery.items.filter((item) => item.productSlug === product.slug && item.published)} />
  </main>;
}
