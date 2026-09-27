import HomeContent from "../components/HomeContent";
import { getCatalog } from "../lib/prices";
import { getHomeProjects } from "../lib/home-projects";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [{ products }, projects] = await Promise.all([getCatalog(), getHomeProjects()]);
  return <HomeContent products={products} projects={projects.items.filter(item => item.published)} />;
}
