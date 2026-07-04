import { getDictionary, type Locale } from "@/lib/i18n";
import { allMenuSections } from "@/lib/menu";
import { getPool } from "@/lib/db";
import {
  getOrderMenu,
  parsePriceToCents,
  slugify,
  type OrderMenuItem,
  type OrderMenuOption,
} from "@/lib/order-menu";

export type DashboardMenuOption = OrderMenuOption & {
  sortOrder: number;
  isAvailable: boolean;
};

export type DashboardMenuItem = {
  id: string;
  sectionId: string;
  sectionTitle: string;
  name: string;
  description?: string;
  imageUrl?: string;
  imageKey?: string;
  sortOrder: number;
  isAvailable: boolean;
  options: DashboardMenuOption[];
};

export type UpdateMenuItemInput = {
  name: string;
  description?: string;
  isAvailable: boolean;
  options: {
    id: string;
    label: string;
    priceLabel: string;
    priceCents: number;
    isAvailable: boolean;
  }[];
};

let schemaReady: Promise<void> | undefined;

export async function ensureMenuSchema() {
  const db = getPool();

  if (!db) {
    return;
  }

  schemaReady ??= db.query(`
    create table if not exists menu_sections (
      id text primary key,
      title text not null,
      note text,
      sort_order integer not null,
      is_active boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists menu_items (
      id text primary key,
      section_id text not null references menu_sections(id) on delete cascade,
      name text not null,
      description text,
      image_url text,
      image_key text,
      sort_order integer not null,
      is_available boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists menu_item_options (
      id text primary key,
      item_id text not null references menu_items(id) on delete cascade,
      label text not null,
      price_label text not null,
      price_cents integer not null check (price_cents >= 0),
      sort_order integer not null,
      is_available boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create index if not exists menu_sections_sort_order_idx
      on menu_sections (sort_order);

    create index if not exists menu_items_section_sort_order_idx
      on menu_items (section_id, sort_order);

    create index if not exists menu_item_options_item_sort_order_idx
      on menu_item_options (item_id, sort_order);

    alter table menu_items
      add column if not exists image_url text,
      add column if not exists image_key text;
  `).then(() => undefined);

  await schemaReady;
}

function getSeedItemId(sectionId: string, itemName: string, index: number) {
  return `${sectionId}-${slugify(itemName)}-${index}`;
}

function getSeedOptions(itemId: string, item: (typeof allMenuSections)[number]["items"][number]) {
  return item.prices?.length
    ? item.prices.map((price, index) => ({
        id: `${itemId}-${slugify(price.label)}`,
        label: price.label,
        priceLabel: price.value,
        priceCents: parsePriceToCents(price.value),
        sortOrder: index,
      }))
    : [
        {
          id: `${itemId}-regular`,
          label: "Regular",
          priceLabel: item.price ?? "",
          priceCents: parsePriceToCents(item.price ?? "0"),
          sortOrder: 0,
        },
      ];
}

export async function seedCurrentMenu() {
  const db = getPool();

  if (!db) {
    return { sections: 0, items: 0, options: 0 };
  }

  await ensureMenuSchema();

  const client = await db.connect();
  let sections = 0;
  let items = 0;
  let options = 0;

  try {
    await client.query("begin");

    for (const [sectionIndex, section] of allMenuSections.entries()) {
      await client.query(
        `
          insert into menu_sections (id, title, note, sort_order, is_active, updated_at)
          values ($1, $2, $3, $4, true, now())
          on conflict (id) do update set
            title = excluded.title,
            note = excluded.note,
            sort_order = excluded.sort_order,
            updated_at = now()
        `,
        [section.id, section.title, section.note ?? null, sectionIndex],
      );
      sections += 1;

      for (const [itemIndex, item] of section.items.entries()) {
        const itemId = getSeedItemId(section.id, item.name, itemIndex);

        await client.query(
          `
            insert into menu_items (id, section_id, name, description, sort_order, is_available, updated_at)
            values ($1, $2, $3, $4, $5, true, now())
            on conflict (id) do update set
              section_id = excluded.section_id,
              name = excluded.name,
              description = excluded.description,
              sort_order = excluded.sort_order,
              updated_at = now()
          `,
          [itemId, section.id, item.name, item.description ?? null, itemIndex],
        );
        items += 1;

        for (const option of getSeedOptions(itemId, item)) {
          await client.query(
            `
              insert into menu_item_options (
                id, item_id, label, price_label, price_cents, sort_order, is_available, updated_at
              )
              values ($1, $2, $3, $4, $5, $6, true, now())
              on conflict (id) do update set
                item_id = excluded.item_id,
                label = excluded.label,
                price_label = excluded.price_label,
                price_cents = excluded.price_cents,
                sort_order = excluded.sort_order,
                updated_at = now()
            `,
            [option.id, itemId, option.label, option.priceLabel, option.priceCents, option.sortOrder],
          );
          options += 1;
        }
      }
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  return { sections, items, options };
}

type MenuRow = {
  item_id: string;
  section_id: string;
  section_title: string;
  item_name: string;
  item_description: string | null;
  item_image_url: string | null;
  item_image_key: string | null;
  item_sort_order: number;
  item_is_available: boolean;
  option_id: string;
  option_label: string;
  option_price_label: string;
  option_price_cents: number;
  option_sort_order: number;
  option_is_available: boolean;
};

function localizePriceLabel(locale: Locale, label: string) {
  const t = getDictionary(locale);
  const labels: Record<string, string> = {
    Klein: t.labels.small,
    Groot: t.labels.large,
    Normaal: t.labels.normal,
    MEGA: t.labels.mega,
    M: t.labels.medium,
    L: t.labels.pizzaLarge,
    Regular: "Regular",
  };

  return labels[label] ?? label;
}

function mapRows(rows: MenuRow[], locale: Locale, includeUnavailable: boolean): DashboardMenuItem[] {
  const sections = getDictionary(locale).sections;
  const items = new Map<string, DashboardMenuItem>();

  for (const row of rows) {
    if (!includeUnavailable && (!row.item_is_available || !row.option_is_available)) {
      continue;
    }

    const translatedSection = sections[row.section_id as keyof typeof sections] as
      | { title?: string }
      | undefined;

    if (!items.has(row.item_id)) {
      items.set(row.item_id, {
        id: row.item_id,
        sectionId: row.section_id,
        sectionTitle: translatedSection?.title ?? row.section_title,
        name: row.item_name,
        description: row.item_description ?? undefined,
        imageUrl: row.item_image_url ?? undefined,
        imageKey: row.item_image_key ?? undefined,
        sortOrder: row.item_sort_order,
        isAvailable: row.item_is_available,
        options: [],
      });
    }

    items.get(row.item_id)?.options.push({
      id: row.option_id,
      label: localizePriceLabel(locale, row.option_label),
      priceLabel: row.option_price_label,
      priceCents: row.option_price_cents,
      sortOrder: row.option_sort_order,
      isAvailable: row.option_is_available,
    });
  }

  return Array.from(items.values()).map((item) => ({
    ...item,
    options: item.options.sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}

export async function listDashboardMenu(locale: Locale = "nl"): Promise<DashboardMenuItem[]> {
  const db = getPool();

  if (!db) {
    return getOrderMenu(locale).map((item, index) => ({
      ...item,
      sortOrder: index,
      isAvailable: true,
      options: item.options.map((option, optionIndex) => ({
        ...option,
        sortOrder: optionIndex,
        isAvailable: true,
      })),
    }));
  }

  await ensureMenuSchema();
  const result = await db.query<MenuRow>(`
    select
      i.id as item_id,
      s.id as section_id,
      s.title as section_title,
      i.name as item_name,
      i.description as item_description,
      i.image_url as item_image_url,
      i.image_key as item_image_key,
      i.sort_order as item_sort_order,
      i.is_available as item_is_available,
      o.id as option_id,
      o.label as option_label,
      o.price_label as option_price_label,
      o.price_cents as option_price_cents,
      o.sort_order as option_sort_order,
      o.is_available as option_is_available
    from menu_sections s
    join menu_items i on i.section_id = s.id
    join menu_item_options o on o.item_id = i.id
    where s.is_active = true
    order by s.sort_order, i.sort_order, o.sort_order
  `);

  if (!result.rows.length) {
    return [];
  }

  return mapRows(result.rows, locale, true);
}

export async function listOrderMenuFromDatabase(locale: Locale): Promise<OrderMenuItem[]> {
  const db = getPool();

  if (!db) {
    return getOrderMenu(locale);
  }

  await ensureMenuSchema();
  const result = await db.query<MenuRow>(`
    select
      i.id as item_id,
      s.id as section_id,
      s.title as section_title,
      i.name as item_name,
      i.description as item_description,
      i.image_url as item_image_url,
      i.image_key as item_image_key,
      i.sort_order as item_sort_order,
      i.is_available as item_is_available,
      o.id as option_id,
      o.label as option_label,
      o.price_label as option_price_label,
      o.price_cents as option_price_cents,
      o.sort_order as option_sort_order,
      o.is_available as option_is_available
    from menu_sections s
    join menu_items i on i.section_id = s.id
    join menu_item_options o on o.item_id = i.id
    where s.is_active = true and i.is_available = true and o.is_available = true
    order by s.sort_order, i.sort_order, o.sort_order
  `);

  if (!result.rows.length) {
    return getOrderMenu(locale);
  }

  return mapRows(result.rows, locale, false);
}

export async function updateMenuItem(id: string, input: UpdateMenuItemInput) {
  const db = getPool();

  if (!db) {
    throw new Error("Database connection is required to edit menu items.");
  }

  await ensureMenuSchema();

  const client = await db.connect();

  try {
    await client.query("begin");
    const itemResult = await client.query(
      `
        update menu_items
        set name = $2,
            description = $3,
            is_available = $4,
            updated_at = now()
        where id = $1
        returning id
      `,
      [id, input.name.trim(), input.description?.trim() || null, input.isAvailable],
    );

    if (!itemResult.rows.length) {
      throw new Error("Menu item not found.");
    }

    for (const option of input.options) {
      await client.query(
        `
          update menu_item_options
          set label = $2,
              price_label = $3,
              price_cents = $4,
              is_available = $5,
              updated_at = now()
          where id = $1 and item_id = $6
        `,
        [
          option.id,
          option.label.trim(),
          option.priceLabel.trim(),
          Math.max(0, Number(option.priceCents) || 0),
          option.isAvailable,
          id,
        ],
      );
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  return listDashboardMenu("nl");
}

export async function updateMenuItemImage(id: string, imageUrl: string, imageKey: string) {
  const db = getPool();

  if (!db) {
    throw new Error("Database connection is required to edit menu item images.");
  }

  await ensureMenuSchema();
  const result = await db.query(
    `
      update menu_items
      set image_url = $2,
          image_key = $3,
          updated_at = now()
      where id = $1
      returning id
    `,
    [id, imageUrl, imageKey],
  );

  if (!result.rows.length) {
    throw new Error("Menu item not found.");
  }

  return listDashboardMenu("nl");
}
