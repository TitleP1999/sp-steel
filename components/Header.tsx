"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categories, products } from "../data/products";

const basic = [["/", "หน้าแรก"], ["/about", "เกี่ยวกับเรา"], ["/news", "ข่าวสาร"]];
const LINE_URL = "https://lin.ee/Yurg5Hy";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const catalogToggle = useRef<HTMLAnchorElement>(null);
  const header = useRef<HTMLElement>(null);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    setMega(true);
  };
  const scheduleMegaClose = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    megaCloseTimer.current = setTimeout(() => setMega(false), 180);
  };

  useEffect(() => { setOpen(false); setMega(false); }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const reset = () => { setOpen(false); setMega(false); };
    media.addEventListener("change", reset);
    return () => media.removeEventListener("change", reset);
  }, []);
  useEffect(() => {
    if (!open && !mega) return;
    const dismiss = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) { setOpen(false); setMega(false); }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false); setMega(false);
        (open ? toggle : catalogToggle).current?.focus();
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [open, mega]);

  const mobileLink = (href: string, label: string) => (
    <Link key={href} href={href} onClick={event => { event.preventDefault(); router.push(href); setOpen(false); }} aria-current={pathname === href ? "page" : undefined}
      className={`flex min-h-12 items-center rounded-3xl px-3 py-3 text-sm font-bold ${pathname === href ? "bg-[#8b352d]/10 text-[#8b352d]" : "hover:bg-zinc-100"}`}>{label}</Link>
  );

  return <>
    <div className="bg-[#202124] px-4 py-2 text-center text-[9px] font-bold leading-4 tracking-widest text-zinc-400 sm:text-[10px]">SUPARERK STEEL CO., LTD.<span className="hidden sm:inline"> • STEEL FOR CONSTRUCTION & INDUSTRY</span></div>
    <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="mx-4 my-2 flex min-h-11 items-center justify-center gap-2 rounded-3xl bg-[#06C755] px-4 py-2 text-sm font-black text-white shadow-md transition hover:bg-[#05b34a] md:hidden"><Image src="/line-logo.svg" alt="" width={22} height={22} />ขอใบเสนอราคาผ่าน LINE</a>
    <header ref={header} className="sticky top-0 z-[80] border-b border-zinc-200 bg-white text-[#8b352d] shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6">
        <Link href="/" onClick={() => { setOpen(false); setMega(false); }} className="flex min-w-0 items-center">
          <div className="relative h-12 w-24 shrink-0 overflow-hidden rounded-3xl bg-white sm:h-16 sm:w-32 md:h-14 md:w-28 xl:h-16 xl:w-32"><Image src="/suparerk-logo-main.jpg" alt="SUPARERK STEEL" fill sizes="(min-width: 1280px) 128px, (min-width: 768px) 112px, 96px" className="object-cover object-center" /></div>
        </Link>
        <nav aria-label="เมนูหลัก" className="hidden h-full items-center gap-2 md:flex lg:gap-3 xl:gap-5">
          {basic.slice(0, 2).map(([href, label]) => <Nav key={href} href={href} label={label} active={pathname === href} />)}
          <Link ref={catalogToggle} href="/products" aria-haspopup="true" aria-expanded={mega} aria-controls="desktop-catalog" onMouseEnter={openMega} onMouseLeave={scheduleMegaClose} onFocus={openMega} className={`relative flex h-full items-center gap-1 whitespace-nowrap px-2 pt-[3px] text-xs font-black leading-none transition-transform duration-200 hover:-translate-y-0.5 xl:px-3 xl:text-sm after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:origin-left after:scale-x-0 after:bg-[#8b352d] after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 ${mega ? "after:scale-x-100" : ""}`}>สินค้าและบริการ <ChevronDown size={15} className={`transition-transform duration-200 ease-out ${mega ? "rotate-180" : ""}`} /></Link>
          <Nav href="/steel-prices" label="ราคาเหล็กวันนี้" active={pathname === "/steel-prices"} />
          {basic.slice(2).map(([href, label]) => <Nav key={href} href={href} label={label} active={pathname === href} />)}
          <Nav href="/contact" label="ติดต่อเรา" active={pathname === "/contact"} />
          <Nav href="/reviews" label="รีวิวจากลูกค้า" active={pathname === "/reviews"} />
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-3xl bg-[#06C755] px-3 py-2.5 text-[10px] font-black leading-none text-white shadow-sm transition hover:bg-[#05b34a] xl:px-4 xl:py-3 xl:text-xs"><Image src="/line-logo.svg" alt="" width={20} height={20} className="shrink-0" />ขอใบเสนอราคาผ่าน LINE</a>
        </nav>
        <button ref={toggle} type="button" aria-label={open ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="grid h-11 w-11 shrink-0 place-items-center rounded-3xl border border-zinc-200 hover:bg-zinc-100 md:hidden">{open ? <X /> : <Menu />}</button>
      </div>
      <nav id="desktop-catalog" aria-label="สินค้าและบริการ" aria-hidden={!mega} onMouseEnter={openMega} onMouseLeave={scheduleMegaClose} className={`desktop-catalog absolute inset-x-0 top-full hidden max-h-[calc(100dvh-5rem)] overflow-y-auto border-y bg-white text-[#202124] shadow-2xl md:block ${mega ? "desktop-catalog-open" : ""}`}>
        <div className="mx-auto max-w-7xl px-6 py-8" onClick={event => { if ((event.target as HTMLElement).closest("a")) setMega(false); }}>
          <div className="mb-6 flex items-center justify-between border-b pb-5"><h2 className="text-2xl font-black">สินค้าเหล็กครบทุกหมวด</h2><div className="flex gap-6 font-bold text-[#8b352d]"><Link href="/products">สินค้าทั้งหมด →</Link><Link href="/services">บริการ →</Link></div></div>
          <div className="grid grid-cols-3 gap-7 xl:grid-cols-5">{categories.map(category => <div key={category}><b className="text-sm">{category}</b><div className="mt-3">{products.filter(product => product.category === category).map(product => <Link key={product.slug} href={`/products/${product.slug}`} className="group flex min-h-11 items-center gap-2 py-2 text-sm text-zinc-600 hover:text-[#8b352d]"><ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" />{product.name}</Link>)}</div></div>)}</div>
        </div>
      </nav>
      {open && <nav id="mobile-navigation" aria-label="เมนูหลักบนมือถือ" className="mobile-navigation absolute inset-x-0 top-full overflow-y-auto overscroll-contain border-t border-zinc-200 bg-white px-4 py-3 shadow-xl md:hidden">
        <div className="mx-auto max-w-3xl space-y-1">
          {basic.slice(0, 2).map(([href, label]) => mobileLink(href, label))}
          <details>
            <summary className="cursor-pointer px-3 py-4 text-sm font-bold">สินค้าเหล็ก</summary>
            <div className="px-2 pb-2">{mobileLink("/products", "ดูสินค้าทั้งหมด")}{categories.map(category => <details key={category} className="border-t border-zinc-200"><summary className="cursor-pointer px-3 py-4 text-sm text-[#8b352d]">{category}</summary><div className="pl-3">{products.filter(product => product.category === category).map(product => mobileLink(`/products/${product.slug}`, product.name))}</div></details>)}</div>
          </details>
          {mobileLink("/steel-prices", "ราคาเหล็กวันนี้")}
          {mobileLink("/services", "บริการของเรา")}
          {basic.slice(2).map(([href, label]) => mobileLink(href, label))}
          {mobileLink("/contact", "ติดต่อเรา")}
          {mobileLink("/reviews", "รีวิวจากลูกค้า")}
        </div>
      </nav>}
    </header>
  </>;
}

function Nav({ href, label, active }: { href: string; label: string; active: boolean }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={`relative flex h-full items-center whitespace-nowrap px-2 pt-[3px] text-xs font-black leading-none transition-transform duration-200 hover:-translate-y-0.5 xl:px-3 xl:text-sm after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:origin-left after:scale-x-0 after:bg-[#8b352d] after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 ${active ? "text-[#8b352d] after:scale-x-100" : "text-[#8b352d]"}`}>{label}</Link>;
}
