import Link from "next/link";
import Image from "next/image";
import PageHero from "../../components/PageHero";
import { categories } from "../../data/products";
import { getCatalog } from "../../lib/prices";
import { ArrowRight } from "lucide-react";
import { Stagger, Item } from "../../components/Motion";
import { QuoteProductButton } from "../../components/QuoteSelection";

export const dynamic = "force-dynamic";

export default async function Products() {
  const { products } = await getCatalog();
  return <main>
    <PageHero eyebrow="PRODUCT CATALOG" title="สินค้าเหล็ก" desc="เลือกหมวดสินค้าและดูข้อมูลสินค้าแต่ละประเภท พร้อมภาพประกอบ สเปก และรายละเอียดการใช้งาน"/>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      {categories.map(category => <div key={category} className="mb-20">
        <div className="mb-8 flex items-center gap-5"><h2 className="text-3xl font-black">{category}</h2><div className="h-px flex-1 bg-zinc-200"/></div>
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.filter(product => product.category === category).map(product => <Item key={product.slug}>
            <article className="h-full overflow-hidden border bg-white">
              <Link href={`/products/${product.slug}`} className="group block">
                <div className="relative h-56 overflow-hidden bg-[#c9c9c9]"><Image src={product.image} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 33vw" className="scale-[1.02] object-cover transition duration-500 group-hover:scale-[1.08]"/><span className="absolute bottom-4 left-5 bg-white/90 px-2 py-1 text-[10px] font-black tracking-[.15em] text-zinc-500">{product.en.toUpperCase()}</span></div>
                <div className="p-6 pb-0"><h3 className="text-xl font-black">{product.name}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-zinc-600">{product.short}</p><p className="mt-5 text-sm font-bold text-zinc-500">ราคาเริ่มต้น <strong className="ml-1 text-2xl font-black text-[#8b352d]">฿{product.price.toLocaleString("th-TH")}</strong></p><p className="mt-1 text-xs text-zinc-400">มี {product.options.length} ขนาดให้เลือก</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#8b352d]">ดูรายละเอียดและเลือกขนาด <ArrowRight size={15} className="transition group-hover:translate-x-2"/></span></div>
              </Link>
              <div className="p-6 pt-4"><QuoteProductButton product={product} size={product.options[0]?.size || "ขนาดมาตรฐาน"}/></div>
            </article>
          </Item>)}
        </Stagger>
      </div>)}
    </section>
  </main>;
}
