import { getLocalizedMenuSections } from "@/lib/localized-menu";
import type { Locale } from "@/lib/i18n";

export type OrderMenuOption = {
  id: string;
  label: string;
  priceLabel: string;
  priceCents: number;
};

export type OrderMenuItem = {
  id: string;
  sectionId: string;
  sectionTitle: string;
  name: string;
  description?: string;
  imageUrl?: string;
  options: OrderMenuOption[];
};

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parsePriceToCents(value: string) {
  const match = value.match(/(\d+)(?:[,.](\d{1,2}))?/);

  if (!match) {
    return 0;
  }

  const euros = Number.parseInt(match[1], 10);
  const cents = Number.parseInt((match[2] ?? "0").padEnd(2, "0"), 10);

  return euros * 100 + cents;
}

export function formatEuro(cents: number) {
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function getOrderMenu(locale: Locale): OrderMenuItem[] {
  return getLocalizedMenuSections(locale).flatMap((section) =>
    section.items.map((item, index) => {
      const itemId = `${section.id}-${slugify(item.name)}-${index}`;
      const options = item.prices?.length
        ? item.prices.map((price) => ({
            id: `${itemId}-${slugify(price.label)}`,
            label: price.label,
            priceLabel: price.value,
            priceCents: parsePriceToCents(price.value),
          }))
        : [
            {
              id: `${itemId}-regular`,
              label: "Regular",
              priceLabel: item.price ?? "",
              priceCents: parsePriceToCents(item.price ?? "0"),
            },
          ];

      return {
        id: itemId,
        sectionId: section.id,
        sectionTitle: section.title,
        name: item.name,
        description: item.description,
        options,
      };
    }),
  );
}
