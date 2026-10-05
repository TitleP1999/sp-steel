import HomeContent from "../components/HomeContent";
import { getCatalog } from "../lib/prices";
import { getHomeProjects } from "../lib/home-projects";
import { pageMetadata } from "../lib/seo";
export const metadata = pageMetadata("ร้านเหล็กสุพรรณบุรีและกาญจนบุรี | ศุภฤกษ์ สตีล", "ร้านเหล็กสุพรรณบุรีและกาญจนบุรี ศูนย์รวมเหล็กก่อสร้าง เหล็กรูปพรรณ และวัสดุก่อสร้าง พร้อมเช็กราคา ขอใบเสนอราคา และบริการจัดส่ง", "/");
export const dynamic = "force-dynamic";
export default async function Home() {
  const [{ products }, projects] = await Promise.all([getCatalog(), getHomeProjects()]);
  return <HomeContent products={products} projects={projects.items.filter(item => item.published)} />;
}
