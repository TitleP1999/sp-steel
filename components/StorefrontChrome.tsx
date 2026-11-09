"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function StorefrontChrome({ children, top, bottom }: { children: ReactNode; top: ReactNode; bottom: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;
  return <>{top}{children}{bottom}</>;
}
