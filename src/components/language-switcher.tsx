"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeNames, locales, type Locale } from "@/lib/i18n";

function switchLocale(pathname: string, locale: Locale) {
  const parts = pathname.split("/");

  if (locales.includes(parts[1] as Locale)) {
    parts[1] = locale;
    return parts.join("/") || `/${locale}`;
  }

  return `/${locale}${pathname === "/" ? "" : pathname}`;
}

export function LanguageSwitcher({
  currentLocale,
  label,
}: {
  currentLocale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <div aria-label={label} className="flex items-center gap-1">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={switchLocale(pathname, locale)}
          className={`rounded-md px-2 py-2 text-xs font-black transition ${
            locale === currentLocale
              ? "bg-[#ffcf8c] text-[#10100f]"
              : "border border-white/15 text-white/70 hover:bg-white/10 hover:text-white"
          }`}
        >
          {localeNames[locale]}
        </Link>
      ))}
    </div>
  );
}
