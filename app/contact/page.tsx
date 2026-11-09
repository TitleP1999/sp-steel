import { getSiteContent } from "../../lib/site-content";
import ContactContent from "./ContactContent";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { content } = await getSiteContent();
  return <ContactContent branches={content.branches} contact={content.contact} />;
}
