import HomeContent from "../components/HomeContent";
import { getCatalog } from "../lib/prices";
export const dynamic = "force-dynamic";
export default async function Home() { const { products } = await getCatalog(); return <HomeContent products={products} />; }
