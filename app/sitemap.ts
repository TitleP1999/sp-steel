import type { MetadataRoute } from "next";
import { products } from "../data/products";
import { siteUrl } from "../lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/products", "/steel-prices", "/news", "/contact", "/reviews", "/services"];
  return [
    ...staticPages.map((path) => ({ url: `${siteUrl}${path}`, changeFrequency: path === "/steel-prices" ? "daily" as const : "weekly" as const, priority: path === "" ? 1 : path === "/products" ? 0.9 : 0.7 })),
    ...products.map((product) => ({ url: `${siteUrl}/products/${product.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
