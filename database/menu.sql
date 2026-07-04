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
