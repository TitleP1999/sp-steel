"use client";
import { useEffect, useRef, useState } from "react";

const pages = [
  {
    branch: "สุพรรณบุรี",
    label: "SUPARERK STEEL สุพรรณบุรี",
    url: "https://www.facebook.com/SuparerkSteelSuphanburi",
    posts: [
      { url: "https://www.facebook.com/SuparerkSteelSuphanburi/posts/pfbid029FsKT4mRdarfoGYswui5nnkeKgLUyaW5UvQKuQVpmSqFCo8BdhGYNThdTbJBKnYbl", height: 425 },
      { url: "https://www.facebook.com/SuparerkSteelSuphanburi/posts/pfbid023YCPsZdtB9Mnywx5PFXSMW7RSccm27msW9FVJxwgVPNon8SfgqvCJ7Ju2G4QNoxxl", height: 648 },
      { url: "https://www.facebook.com/SuparerkSteelSuphanburi/posts/pfbid0B6tt4uJisKXFCTuojNq8shkYDxRLcUhqgJgkxJychnnmWei2MP2fZw3bYPZE5nkal", height: 737 },
      { url: "https://www.facebook.com/SuparerkSteelSuphanburi/posts/pfbid0aNJ614p1oVTAuQPQdZduxhjEH83LiViAU1fLPpswNgFeRzSTLAuTarJChsADpDE7l", height: 591 },
    ],
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

function postPluginUrl(url: string, width: number) {
  const params = new URLSearchParams({
    href: url,
    show_text: "true",
    width: String(width),
  });
  return `https://www.facebook.com/plugins/post.php?${params.toString()}`;
}

export default function FacebookFeeds({ showIntro = true, stacked = false }: { showIntro?: boolean; stacked?: boolean }) {
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
        {showIntro && <div className="max-w-3xl">
          <p className="font-black tracking-[.18em] text-[#8b352d]">NEWS &amp; UPDATES</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">ติดตามความเคลื่อนไหวของเรา</h2>
          <p className="mt-4 leading-7 text-zinc-600">ข่าวสาร สินค้า และกิจกรรมล่าสุดจาก SUPARERK STEEL ทั้งสองสาขา</p>
        </div>}

        <div className={`${showIntro ? "mt-12" : ""} grid gap-7 ${stacked ? "grid-cols-1" : "lg:grid-cols-2"}`}>
          {pages.map((page, index) => (
            <article key={page.branch} className={`overflow-hidden rounded-3xl border border-zinc-200 bg-[#faf9f7] shadow-sm ${stacked ? "lg:grid lg:grid-cols-[500px_minmax(260px,1fr)]" : ""}`}>
              <div className={`flex flex-col items-start justify-between gap-4 px-5 py-4 sm:px-6 ${stacked ? "border-b border-zinc-200 lg:order-2 lg:justify-center lg:border-b-0 lg:border-l lg:px-10" : "border-b border-zinc-200 sm:flex-row sm:items-center"}`}>
                <div>
                  <p className="text-xs font-black tracking-[.16em] text-[#8b352d]">FACEBOOK</p>
                  <h3 className="mt-1 text-xl font-black">สาขา{page.branch}</h3>
                </div>
                <a href={page.url} target="_blank" rel="noreferrer" className="shrink-0 rounded-3xl bg-[#1877F2] px-4 py-3 text-sm font-black text-white transition hover:bg-[#1668d4]">เปิด Facebook ↗</a>
              </div>

              <div ref={index === 0 ? feed : undefined} className={`${index === 0 ? "max-h-[620px] overflow-y-auto" : "min-h-[620px] overflow-hidden"} bg-white py-3 ${stacked ? "lg:order-1 lg:min-w-[500px]" : ""}`}>
                {width > 0 && (index === 0 ? (
                  <>
                    <p className="sticky top-0 z-10 bg-white px-4 pb-2 text-center text-xs font-semibold text-zinc-500">เลื่อนเพื่อดูโพสต์เพิ่มเติม</p>
                    <div className="mx-3 mb-3 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                      <div className="relative h-36 overflow-hidden bg-[#8b352d]">
                        <img src="/cta-steel-red.png" alt="" className="h-full w-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" />
                        <span className="absolute bottom-3 left-4 text-lg font-black tracking-wide text-white drop-shadow">SUPARERK STEEL</span>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="relative -mt-8 flex items-end gap-3">
                          <img src="/suparerk-logo-suphanburi.jpg" alt="โลโก้ศุภฤกษ์ สตีล สุพรรณบุรี" className="h-[72px] w-[72px] rounded-full border-4 border-white bg-white object-cover shadow-sm" />
                          <div className="pb-1">
                            <h4 className="text-base font-black leading-tight text-zinc-900">ศุภฤกษ์ สตีล สุพรรณบุรี</h4>
                            <p className="mt-1 text-xs text-zinc-500">Building materials</p>
                          </div>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-zinc-700">ร้านเหล็กและวัสดุก่อสร้าง สาขาสุพรรณบุรี พร้อมบริการจัดส่ง</p>
                        <a href={page.url} target="_blank" rel="noreferrer" className="mt-4 flex min-h-11 items-center justify-center rounded-lg bg-[#1877F2] px-4 text-sm font-black text-white transition hover:bg-[#1668d4]">ติดตามเพจ Facebook</a>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      {page.posts!.map((post, postIndex) => <iframe
                        key={post.url}
                        title={`${page.label} โพสต์ที่ ${postIndex + 1}`}
                        src={postPluginUrl(post.url, width)}
                        width={width}
                        height={post.height}
                        style={{ border: "none", overflow: "hidden", width: "100%", maxWidth: 500 }}
                        scrolling="no"
                        loading="lazy"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      />)}
                    </div>
                  </>
                ) : <div className="flex justify-center"><iframe
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
                /></div>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
