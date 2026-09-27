import "./globals.css"; import Header from "../components/Header"; import Footer from "../components/Footer"; import FloatingContact from "../components/FloatingContact";
import { QuoteSelectionProvider } from "../components/QuoteSelection";

export const metadata={title:"SUPARERK STEEL | ศุภฤกษ์ สตีล",description:"ศูนย์รวมเหล็กและวัสดุก่อสร้าง"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="th"><body><QuoteSelectionProvider><Header/>{children}<Footer/><FloatingContact/></QuoteSelectionProvider></body></html>}
