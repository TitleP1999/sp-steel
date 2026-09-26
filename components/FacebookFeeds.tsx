"use client";
import { useEffect, useRef, useState } from "react";

const pages = [
  {
    branch: "สุพรรณบุรี",
    label: "SUPARERK STEEL สุพรรณบุรี",
    url: "https://www.facebook.com/SuparerkSteelSuphanburi",
  },
  {
    branch: "กาญจนบุรี",
    label: "SUPARERK STEEL กาญจนบุรี",
    url: "https://www.facebook.com/SuparerkSteelKanchanaburi",
  },
];

function pluginUrl(url: string, width: number) {
  const params = new URLSearchParams({
    href: url,
    tabs: "timeline",
    width: String(width),
    height: "620",
    small_header: "false",
    adapt_container_width: "true",
    hide_cover: "false",
    show_facepile: "false",
  });
  return `https://www.facebook.com/plugins/page.php?${params.toString()}`;
}

export default function FacebookFeeds() {
  const feed = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!feed.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.min(500, Math.floor(entry.contentRect.width)));
    });
    observer.observe(feed.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-black tracking-[.18em] text-[#8b352d]">NEWS &amp; UPDATES</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">ติดตามความเคลื่อนไหวของเรา</h2>
          <p className="mt-4 leading-7 text-zinc-600">ข่าวสาร สินค้า และกิจกรรมล่าสุดจาก SUPARERK STEEL ทั้งสองสาขา</p>
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {pages.map((page, index) => (
            <article key={page.branch} className="overflow-hidden rounded-3xl border border-zinc-200 bg-[#faf9f7] shadow-sm">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center border-b border-zinc-200 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-xs font-black tracking-[.16em] text-[#8b352d]">FACEBOOK</p>
                  <h3 className="mt-1 text-xl font-black">สาขา{page.branch}</h3>
                </div>
                <a href={page.url} target="_blank" rel="noreferrer" className="shrink-0 rounded-3xl bg-[#8b352d] px-4 py-3 text-sm font-black text-white transition hover:bg-[#67251f]">เปิด Facebook ↗</a>
              </div>

              <div ref={index === 0 ? feed : undefined} className="flex min-h-[620px] justify-center overflow-hidden bg-white py-3">
                {width > 0 && <iframe
                  title={page.label}
                  src={pluginUrl(page.url, width)}
                  width={width}
                  height="620"
                  style={{ border: "none", overflow: "hidden", width: "100%", maxWidth: 500 }}
                  scrolling="no"
                  loading="lazy"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
