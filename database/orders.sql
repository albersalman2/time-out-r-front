create table if not exists orders (
  id text primary key,
  reference text not null unique,
  status text not null,
  fulfillment_type text not null,
  requested_time text not null,
  payment_method text not null,
  customer jsonb not null,
  items jsonb not null,
  subtotal_cents integer not null,
  delivery_fee_cents integer not null,
  total_cents integer not null,
  notes text,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  constraint orders_status_check check (
    status in (
      'pending',
      'accepted',
      'preparing',
      'ready',
      'out_for_delivery',
      'completed',
      'cancelled'
    )
  ),
  constraint orders_fulfillment_type_check check (
    fulfillment_type in ('pickup', 'delivery')
  ),
  constraint orders_payment_method_check check (
    payment_method in ('pay_at_pickup', 'pay_on_delivery', 'card_terminal')
  ),
  constraint orders_subtotal_non_negative check (subtotal_cents >= 0),
  constraint orders_delivery_fee_non_negative check (delivery_fee_cents >= 0),
  constraint orders_total_non_negative check (total_cents >= 0),
  constraint orders_customer_object_check check (jsonb_typeof(customer) = 'object'),
  constraint orders_items_array_check check (jsonb_typeof(items) = 'array')
);

create index if not exists orders_status_created_at_idx
  on orders (status, created_at desc);

create index if not exists orders_fulfillment_status_idx
  on orders (fulfillment_type, status);

create index if not exists orders_created_at_idx
  on orders (created_at desc);

create index if not exists orders_customer_phone_idx
  on orders ((customer ->> 'phone'));
