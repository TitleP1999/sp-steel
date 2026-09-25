"use client";

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

function pluginUrl(url: string) {
  const params = new URLSearchParams({
    href: url,
    tabs: "timeline",
    width: "500",
    height: "620",
    small_header: "false",
    adapt_container_width: "true",
    hide_cover: "false",
    show_facepile: "false",
  });
  return `https://www.facebook.com/plugins/page.php?${params.toString()}`;
}

export default function FacebookFeeds() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="font-black tracking-[.18em] text-[#8b352d]">NEWS &amp; UPDATES</p>
          <h2 className="mt-3 text-4xl font-black sm:text-5xl">ติดตามความเคลื่อนไหวของเรา</h2>
          <p className="mt-4 leading-7 text-zinc-600">ข่าวสาร สินค้า และกิจกรรมล่าสุดจาก SUPARERK STEEL ทั้งสองสาขา</p>
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {pages.map((page) => (
            <article key={page.branch} className="overflow-hidden border border-zinc-200 bg-[#faf9f7] shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-xs font-black tracking-[.16em] text-[#8b352d]">FACEBOOK</p>
                  <h3 className="mt-1 text-xl font-black">สาขา{page.branch}</h3>
                </div>
                <a href={page.url} target="_blank" rel="noreferrer" className="shrink-0 bg-[#8b352d] px-4 py-2 text-sm font-black text-white transition hover:bg-[#67251f]">เปิด Facebook ↗</a>
              </div>

              <div className="flex min-h-[620px] justify-center overflow-hidden bg-white py-3">
                <iframe
                  title={page.label}
                  src={pluginUrl(page.url)}
                  width="500"
                  height="620"
                  style={{ border: "none", overflow: "hidden", width: "100%", maxWidth: 500 }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
