import Image from "next/image";
import type { ExecutiveItem } from "../lib/executives";

export default function Executives({ items }: { items: ExecutiveItem[] }) {
  if (!items.length) return null;
  return <section className="bg-[#f3f6f8]">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl text-center"><p className="text-xs font-black tracking-[.2em] text-[#8b352d]">BOARD &amp; MANAGEMENT</p><h2 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">คณะกรรมการและผู้บริหาร</h2></div>
      <div className="mx-auto mt-10 grid max-w-6xl gap-7 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">{items.map(item => <article key={item.id} className="overflow-hidden rounded-[28px] bg-white ring-1 ring-zinc-200/70 shadow-[0_0_26px_rgba(24,24,27,0.10)] transition duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-zinc-400/40"><div className="relative aspect-[4/5] overflow-hidden rounded-t-[28px] bg-zinc-200"><Image src={item.imageUrl} alt={item.name} fill unoptimized={item.imageUrl.startsWith("data:")} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="scale-[1.04] object-cover object-top"/></div><div className="p-6 text-center sm:p-7"><h3 className="text-xl font-black">{item.name}</h3><p className="mt-3 whitespace-pre-line leading-7 text-zinc-500">{item.position}</p></div></article>)}</div>
    </div>
  </section>;
}
