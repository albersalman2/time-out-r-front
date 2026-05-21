"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Locale, getDictionary } from "@/lib/i18n";
import type { MenuSection as MenuSectionType } from "@/lib/menu";
import { restaurant } from "@/lib/menu";

function getItemPrice(item: MenuSectionType["items"][number]) {
  if (item.price) {
    return item.price;
  }

  if (item.prices?.length) {
    return item.prices.map((price) => `${price.label} ${price.value}`).join(" / ");
  }

  return "";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function MobileMenuView({
  locale,
  sections,
  t,
}: {
  locale: Locale;
  sections: MenuSectionType[];
  t: ReturnType<typeof getDictionary>;
}) {
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const activeSection = useMemo(
    () => sections.find((section) => section.id === activeSectionId) ?? sections[0],
    [activeSectionId, sections],
  );

  return (
    <section className="mobile-menu-app min-h-screen bg-white text-[#10100f] lg:hidden">
      <div className="sticky top-0 z-50 border-b border-black/10 bg-white">
        <div className="grid h-20 grid-cols-[48px_1fr_48px] items-center px-4">
          <Link
            href={`/${locale}`}
            aria-label={t.nav.home}
            className="grid size-12 place-items-center text-4xl leading-none"
          >
            ×
          </Link>
          <div className="text-center">
            <p className="text-xl font-black">{restaurant.name}</p>
            <p className="mt-1 text-[11px] font-black uppercase text-[#6c6255]">{t.nav.menu}</p>
          </div>
          <a
            href={`tel:${restaurant.phone.replaceAll(" ", "")}`}
            aria-label={`${t.common.call} ${restaurant.phone}`}
            className="grid size-12 place-items-center text-3xl"
          >
            ⌕
          </a>
        </div>

        <div className="flex items-center gap-3 overflow-hidden border-t border-black/5">
          <button
            type="button"
            aria-label={t.menuPage.eyebrow}
            className="grid h-14 w-16 shrink-0 place-items-center border-r border-black/5 text-2xl"
          >
            ☰
          </button>
          <div className="mobile-scrollbar flex flex-1 snap-x gap-1 overflow-x-auto overscroll-x-contain pr-4">
            {sections.map((section) => (
              <button
                type="button"
                key={section.id}
                onClick={() => setActiveSectionId(section.id)}
                className={`relative h-14 shrink-0 snap-start px-4 text-sm font-black uppercase transition ${
                  activeSection.id === section.id ? "text-[#10100f]" : "text-[#6c6255]"
                }`}
              >
                {section.title}
                {activeSection.id === section.id ? (
                  <span className="absolute inset-x-3 bottom-0 h-1 rounded-t bg-[#f25a1d]" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-[#f25a1d]">{t.menuPage.eyebrow}</p>
            <h1 className="mt-2 text-3xl font-black uppercase leading-tight">{activeSection.title}</h1>
            {activeSection.note ? <p className="mt-2 text-sm font-semibold text-[#6c6255]">{activeSection.note}</p> : null}
          </div>
          <a
            href={`tel:${restaurant.phone.replaceAll(" ", "")}`}
            className="rounded-md bg-[#f25a1d] px-3 py-2 text-xs font-black text-[#10100f]"
          >
            {restaurant.phone}
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8">
          {activeSection.items.map((item, index) => (
            <article key={`${activeSection.id}-${item.name}-${index}`} className="min-w-0">
              <div className="relative aspect-square overflow-hidden rounded-md bg-[#f7f2e8]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,#ffcf8c,transparent_58%),linear-gradient(145deg,#ffffff,#f1e4cf)]" />
                <div className="absolute inset-4 grid place-items-center rounded-md border border-[#eadfcb] bg-white/70 text-5xl font-black text-[#f25a1d]">
                  {getInitials(item.name)}
                </div>
                <button
                  type="button"
                  aria-label={`${item.name} ${getItemPrice(item)}`}
                  className="absolute bottom-2 right-2 grid size-12 place-items-center rounded-full bg-white text-3xl font-semibold shadow-lg"
                >
                  +
                </button>
              </div>
              <h2 className="mt-3 line-clamp-2 text-lg font-black leading-6">{item.name}</h2>
              <p className="mt-1 text-base font-semibold text-[#10100f]">{getItemPrice(item)}</p>
              {item.description ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6c6255]">{item.description}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
