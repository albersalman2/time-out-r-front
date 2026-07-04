import { allMenuSections, menuSourcePages, type MenuSection } from "@/lib/menu";
import { getDictionary, type Locale } from "@/lib/i18n";

const labelKeys: Record<string, keyof ReturnType<typeof getDictionary>["labels"]> = {
  Klein: "small",
  Groot: "large",
  Normaal: "normal",
  MEGA: "mega",
  M: "medium",
  L: "pizzaLarge",
};

export function getLocalizedMenuSections(locale: Locale): MenuSection[] {
  const t = getDictionary(locale);

  return allMenuSections.map((section) => {
    const translated = t.sections[section.id as keyof typeof t.sections] as
      | { title?: string; note?: string }
      | undefined;

    return {
      ...section,
      title: translated?.title ?? section.title,
      note: translated?.note ?? section.note,
      items: section.items.map((item) => ({
        ...item,
        prices: item.prices?.map((price) => {
          const labelKey = labelKeys[price.label];
          return {
            ...price,
            label: labelKey ? t.labels[labelKey] : price.label,
          };
        }),
      })),
    };
  });
}

export function getFeaturedSections(locale: Locale) {
  return getLocalizedMenuSections(locale)
    .filter((section) => ["broodjes", "pastas", "schotels"].includes(section.id))
    .map((section) => ({ ...section, items: section.items.slice(0, 5) }));
}

export function getLocalizedMenuSourcePages(locale: Locale) {
  const t = getDictionary(locale);
  const alts = [
    `${t.meta.title} cover`,
    t.home.previewAltKebab,
    `${t.menuPage.sourceTitle} snacks`,
    t.home.previewAltPizza,
  ];

  return menuSourcePages.map((page, index) => ({
    ...page,
    alt: alts[index] ?? page.alt,
  }));
}
