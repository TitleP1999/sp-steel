"use client";

import { useLanguage, translateContent } from "./LanguageProvider";

export default function LocalizedText({ text }: { text: string }) {
  const { locale } = useLanguage();
  return <>{translateContent(text, locale)}</>;
}
