import Link from "next/link";
import Image from "next/image";
import PageHero from "../../components/PageHero";
import { categories } from "../../data/products";
import { getCatalog } from "../../lib/prices";
import { ArrowRight } from "lucide-react";
import { Stagger, Item } from "../../components/Motion";

export const dynamic = "force-dynamic";

export default async function Products() {
  const { products } = await getCatalog();
  return <main>
    <PageHero eyebrow="PRODUCT CATALOG" title="สินค้าทั้งหมด" desc="เลือกหมวดสินค้าและดูข้อมูลสินค้าแต่ละประเภท พร้อมภาพประกอบ สเปก และรายละเอียดการใช้งาน"/>
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      {categories.map(category => <div key={category} className="mb-20">
        <div className="mb-8 flex items-center gap-5"><h2 className="text-3xl font-black">{category}</h2><div className="h-px flex-1 bg-zinc-200"/></div>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {products.filter(product => product.category === category).map(product => <Item key={product.slug}>
            <article className="h-full overflow-hidden border bg-white text-[#202124] shadow-sm transition-shadow hover:shadow-lg">
              <Link href={`/products/${product.slug}`} className="group flex h-full flex-col">
                <div className="relative h-32 shrink-0 overflow-hidden bg-[#c9c9c9] sm:h-36"><Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw" className="scale-[1.02] object-cover transition duration-500 group-hover:scale-[1.08]"/><span className="absolute bottom-2 left-2 bg-[#a6292e] px-2 py-1 text-[9px] font-black tracking-[.12em] text-white">{product.en.toUpperCase()}</span></div>
                <div className="flex flex-1 flex-col p-3"><h3 className="line-clamp-2 text-base font-black leading-5">{product.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600">{product.short}</p><p className="mt-2 text-sm font-black text-[#8b352d]">สอบถามราคาก่อน</p><p className="mt-0.5 text-[11px] text-zinc-400">มี {product.options.length} ขนาดให้เลือก</p><span className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[#8b352d]">ดูรายละเอียด <ArrowRight size={14} className="transition group-hover:translate-x-1"/></span></div>
              </Link>
            </article>
          </Item>)}
        </Stagger>
      </div>)}
    </section>
  </main>;
}
