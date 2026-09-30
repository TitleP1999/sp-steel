import {notFound} from "next/navigation";
import {getCatalog} from "../../../lib/prices";
import ProductMotion from "../../../components/ProductMotion";
import { getProductGallery } from "../../../lib/product-gallery";
export const dynamic = "force-dynamic";
export default async function ProductPage({params}:{params:{slug:string}}){const [{products},gallery]=await Promise.all([getCatalog(),getProductGallery()]);const p=products.find(product=>product.slug===params.slug);if(!p)return notFound();return <main><ProductMotion product={p} gallery={gallery.items.filter(item=>item.productSlug===p.slug&&item.published)}/></main>}
