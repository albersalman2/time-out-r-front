import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

export type FulfillmentType = "pickup" | "delivery";
export type PaymentMethod = "pay_at_pickup" | "pay_on_delivery" | "card_terminal";
export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled";

export type OrderLine = {
  menuItemId: string;
  optionId: string;
  name: string;
  optionLabel: string;
  unitPriceCents: number;
  quantity: number;
  notes?: string;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  email?: string;
  address?: string;
};

export type StoredOrder = {
  id: string;
  reference: string;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  requestedTime: string;
  paymentMethod: PaymentMethod;
  customer: OrderCustomer;
  items: OrderLine[];
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = {
  fulfillmentType: FulfillmentType;
  requestedTime: string;
  paymentMethod: PaymentMethod;
  customer: OrderCustomer;
  items: OrderLine[];
  notes?: string;
};

const orderStatuses: OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "completed",
  "cancelled",
];

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

function getDatabaseUrl() {
  return process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
}

function getPool() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    return undefined;
  }

  pool ??= new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require")
      ? { rejectUnauthorized: false }
      : undefined,
  });

  return pool;
}

async function ensureSchema() {
  const db = getPool();

  if (!db) {
    return;
  }

  schemaReady ??= db.query(`
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
      updated_at timestamptz not null
    );

    create index if not exists orders_status_created_at_idx
      on orders (status, created_at desc);
  `).then(() => undefined);

  await schemaReady;
}

function getFilePath() {
  return path.join(process.cwd(), ".data", "orders.json");
}

async function readFileOrders() {
  const filePath = getFilePath();

  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as StoredOrder[];
  } catch {
    return [];
  }
}

async function writeFileOrders(orders: StoredOrder[]) {
  const filePath = getFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(orders, null, 2), "utf8");
}

function makeReference() {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const shortId = crypto.randomUUID().slice(0, 8).toUpperCase();

  return `TO-${date}-${shortId}`;
}

function normalizeLine(line: OrderLine): OrderLine {
  return {
    menuItemId: String(line.menuItemId ?? ""),
    optionId: String(line.optionId ?? ""),
    name: String(line.name ?? "").trim(),
    optionLabel: String(line.optionLabel ?? "").trim(),
    unitPriceCents: Number(line.unitPriceCents) || 0,
    quantity: Math.max(1, Math.min(99, Number(line.quantity) || 1)),
    notes: line.notes ? String(line.notes).trim() : undefined,
  };
}

export function isOrderStatus(value: string): value is OrderStatus {
  return orderStatuses.includes(value as OrderStatus);
}

export function validateCreateOrder(input: CreateOrderInput) {
  const items = Array.isArray(input.items) ? input.items.map(normalizeLine) : [];
  const customer = input.customer ?? {};

  if (!["pickup", "delivery"].includes(input.fulfillmentType)) {
    throw new Error("Choose pickup or delivery.");
  }

  if (!["pay_at_pickup", "pay_on_delivery", "card_terminal"].includes(input.paymentMethod)) {
    throw new Error("Choose a valid payment method.");
  }

  if (!items.length) {
    throw new Error("Add at least one item to the order.");
  }

  if (!String(customer.name ?? "").trim()) {
    throw new Error("Customer name is required.");
  }

  if (!String(customer.phone ?? "").trim()) {
    throw new Error("Phone number is required.");
  }

  if (input.fulfillmentType === "delivery" && !String(customer.address ?? "").trim()) {
    throw new Error("Delivery address is required.");
  }

  return {
    ...input,
    customer: {
      name: String(customer.name).trim(),
      phone: String(customer.phone).trim(),
      email: customer.email ? String(customer.email).trim() : undefined,
      address: customer.address ? String(customer.address).trim() : undefined,
    },
    requestedTime: String(input.requestedTime ?? "").trim() || "ASAP",
    notes: input.notes ? String(input.notes).trim() : undefined,
    items,
  };
}

function calculateTotals(input: CreateOrderInput) {
  const subtotalCents = input.items.reduce(
    (total, item) => total + item.unitPriceCents * item.quantity,
    0,
  );
  const deliveryFeeCents = input.fulfillmentType === "delivery" ? 300 : 0;

  return {
    subtotalCents,
    deliveryFeeCents,
    totalCents: subtotalCents + deliveryFeeCents,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<StoredOrder> {
  const validInput = validateCreateOrder(input);
  const now = new Date().toISOString();
  const totals = calculateTotals(validInput);
  const order: StoredOrder = {
    id: crypto.randomUUID(),
    reference: makeReference(),
    status: "pending",
    fulfillmentType: validInput.fulfillmentType,
    requestedTime: validInput.requestedTime,
    paymentMethod: validInput.paymentMethod,
    customer: validInput.customer,
    items: validInput.items,
    ...totals,
    notes: validInput.notes,
    createdAt: now,
    updatedAt: now,
  };
  const db = getPool();

  if (db) {
    await ensureSchema();
    await db.query(
      `
        insert into orders (
          id, reference, status, fulfillment_type, requested_time, payment_method,
          customer, items, subtotal_cents, delivery_fee_cents, total_cents,
          notes, created_at, updated_at
        )
        values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb, $9, $10, $11, $12, $13, $14)
      `,
      [
        order.id,
        order.reference,
        order.status,
        order.fulfillmentType,
        order.requestedTime,
        order.paymentMethod,
        JSON.stringify(order.customer),
        JSON.stringify(order.items),
        order.subtotalCents,
        order.deliveryFeeCents,
        order.totalCents,
        order.notes,
        order.createdAt,
        order.updatedAt,
      ],
    );

    return order;
  }

  const orders = await readFileOrders();
  orders.unshift(order);
  await writeFileOrders(orders);

  return order;
}

function mapDatabaseOrder(row: Record<string, unknown>): StoredOrder {
  return {
    id: String(row.id),
    reference: String(row.reference),
    status: row.status as OrderStatus,
    fulfillmentType: row.fulfillment_type as FulfillmentType,
    requestedTime: String(row.requested_time),
    paymentMethod: row.payment_method as PaymentMethod,
    customer: row.customer as OrderCustomer,
    items: row.items as OrderLine[],
    subtotalCents: Number(row.subtotal_cents),
    deliveryFeeCents: Number(row.delivery_fee_cents),
    totalCents: Number(row.total_cents),
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
  };
}

export async function listOrders(): Promise<StoredOrder[]> {
  const db = getPool();

  if (db) {
    await ensureSchema();
    const result = await db.query("select * from orders order by created_at desc limit 100");
    return result.rows.map(mapDatabaseOrder);
  }

  return readFileOrders();
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<StoredOrder | undefined> {
  const updatedAt = new Date().toISOString();
  const db = getPool();

  if (db) {
    await ensureSchema();
    const result = await db.query(
      `
        update orders
        set status = $2, updated_at = $3
        where id = $1
        returning *
      `,
      [id, status, updatedAt],
    );

    return result.rows[0] ? mapDatabaseOrder(result.rows[0]) : undefined;
  }

  const orders = await readFileOrders();
  const index = orders.findIndex((order) => order.id === id);

  if (index === -1) {
    return undefined;
  }

  orders[index] = { ...orders[index], status, updatedAt };
  await writeFileOrders(orders);

  return orders[index];
}
