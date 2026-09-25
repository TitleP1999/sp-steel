import {notFound} from "next/navigation";
import {getCatalog} from "../../../lib/prices";
import ProductMotion from "../../../components/ProductMotion";
export const dynamic = "force-dynamic";
export default async function ProductPage({params}:{params:{slug:string}}){const {products}=await getCatalog();const p=products.find(product=>product.slug===params.slug);if(!p)return notFound();return <main><ProductMotion product={p}/></main>}
