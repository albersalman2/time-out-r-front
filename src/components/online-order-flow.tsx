"use client";

import { FormEvent, useMemo, useState } from "react";
import { formatEuro, type OrderMenuItem, type OrderMenuOption } from "@/lib/order-menu";
import type { FulfillmentType, OrderLine, PaymentMethod, StoredOrder } from "@/lib/order-store";
import type { Locale } from "@/lib/i18n";

type CartLine = OrderLine & {
  lineId: string;
};

type CheckoutState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  requestedTime: string;
  notes: string;
  fulfillmentType: FulfillmentType;
  paymentMethod: PaymentMethod;
};

const initialCheckout: CheckoutState = {
  name: "",
  phone: "",
  email: "",
  address: "",
  requestedTime: "ASAP",
  notes: "",
  fulfillmentType: "pickup",
  paymentMethod: "pay_at_pickup",
};

const fulfillmentLabels: Record<FulfillmentType, string> = {
  pickup: "Pickup",
  delivery: "Delivery",
};

function makeLineId(menuItemId: string, optionId: string) {
  return `${menuItemId}:${optionId}`;
}

function Button({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-md border px-3 text-sm font-black transition ${
        active
          ? "border-[#10100f] bg-[#10100f] text-white"
          : "border-[#eadfcb] bg-white text-[#10100f] hover:border-[#f25a1d]"
      }`}
    >
      {children}
    </button>
  );
}

export function OnlineOrderFlow({
  locale,
  items,
}: {
  locale: Locale;
  items: OrderMenuItem[];
}) {
  const [activeSection, setActiveSection] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [checkout, setCheckout] = useState<CheckoutState>(initialCheckout);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [createdOrder, setCreatedOrder] = useState<StoredOrder | null>(null);

  const sections = useMemo(() => {
    const seen = new Map<string, string>();

    items.forEach((item) => seen.set(item.sectionId, item.sectionTitle));

    return Array.from(seen, ([id, title]) => ({ id, title }));
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSection = activeSection === "all" || item.sectionId === activeSection;
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.sectionTitle.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query);

      return matchesSection && matchesSearch;
    });
  }, [activeSection, items, search]);

  const subtotalCents = cart.reduce((total, line) => total + line.unitPriceCents * line.quantity, 0);
  const deliveryFeeCents = checkout.fulfillmentType === "delivery" ? 300 : 0;
  const totalCents = subtotalCents + deliveryFeeCents;
  const itemCount = cart.reduce((total, line) => total + line.quantity, 0);

  function addItem(item: OrderMenuItem, option: OrderMenuOption) {
    const lineId = makeLineId(item.id, option.id);

    setMessage("");
    setCreatedOrder(null);
    setCart((current) => {
      const existing = current.find((line) => line.lineId === lineId);

      if (existing) {
        return current.map((line) =>
          line.lineId === lineId ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }

      return [
        ...current,
        {
          lineId,
          menuItemId: item.id,
          optionId: option.id,
          name: item.name,
          optionLabel: option.label,
          unitPriceCents: option.priceCents,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(lineId: string, quantity: number) {
    if (quantity < 1) {
      setCart((current) => current.filter((line) => line.lineId !== lineId));
      return;
    }

    setCart((current) =>
      current.map((line) => (line.lineId === lineId ? { ...line, quantity } : line)),
    );
  }

  function updateCheckout<K extends keyof CheckoutState>(key: K, value: CheckoutState[K]) {
    setCheckout((current) => {
      if (key === "fulfillmentType") {
        return {
          ...current,
          fulfillmentType: value as FulfillmentType,
          paymentMethod: value === "delivery" ? "pay_on_delivery" : "pay_at_pickup",
        };
      }

      return { ...current, [key]: value };
    });
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentType: checkout.fulfillmentType,
          requestedTime: checkout.requestedTime,
          paymentMethod: checkout.paymentMethod,
          notes: checkout.notes,
          customer: {
            name: checkout.name,
            phone: checkout.phone,
            email: checkout.email,
            address: checkout.address,
          },
          items: cart.map((line) => ({
            menuItemId: line.menuItemId,
            optionId: line.optionId,
            name: line.name,
            optionLabel: line.optionLabel,
            unitPriceCents: line.unitPriceCents,
            quantity: line.quantity,
            notes: line.notes,
          })),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Order could not be placed.");
      }

      setCreatedOrder(payload.order);
      setCart([]);
      setCheckout(initialCheckout);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Order could not be placed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-[#f7f2e8] px-4 py-10 text-[#10100f] sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1fr_390px]">
        <div className="min-w-0">
          <div className="mb-5 flex flex-col gap-4 rounded-md border border-[#eadfcb] bg-white p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black uppercase text-[#f25a1d]">Online ordering</p>
              <h2 className="mt-1 text-3xl font-black">Choose dishes and place your order</h2>
            </div>
            <label className="min-w-0 sm:w-72">
              <span className="sr-only">Search menu</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search menu"
                className="h-11 w-full rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none transition focus:border-[#f25a1d]"
              />
            </label>
          </div>

          <div className="mobile-scrollbar sticky top-[77px] z-30 mb-5 flex gap-2 overflow-x-auto bg-[#f7f2e8] py-2">
            <Button active={activeSection === "all"} onClick={() => setActiveSection("all")}>
              All
            </Button>
            {sections.map((section) => (
              <Button
                key={section.id}
                active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                {section.title}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredItems.map((item) => (
              <article key={item.id} className="rounded-md border border-[#eadfcb] bg-white p-4 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-[112px_1fr]">
                  <div className="aspect-square overflow-hidden rounded-md border border-[#eadfcb] bg-[#f7f2e8]">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
                    ) : (
                      <div className="grid size-full place-items-center bg-[linear-gradient(145deg,#ffffff,#f1e4cf)] text-2xl font-black text-[#f25a1d]">
                        {item.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex min-h-24 flex-col justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase text-[#6c6255]">{item.sectionTitle}</p>
                    <h3 className="mt-1 text-xl font-black">{item.name}</h3>
                    {item.description ? (
                      <p className="mt-2 text-sm leading-6 text-[#6c6255]">{item.description}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => addItem(item, option)}
                        className="rounded-md bg-[#f25a1d] px-3 py-2 text-sm font-black text-[#10100f] transition hover:bg-[#ffcf8c]"
                      >
                        Add {option.label !== "Regular" ? `${option.label} ` : ""}
                        {formatEuro(option.priceCents)}
                      </button>
                    ))}
                  </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <form onSubmit={submitOrder} className="rounded-md border border-[#eadfcb] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-[#f25a1d]">Cart</p>
                <h2 className="mt-1 text-2xl font-black">{itemCount} items</h2>
              </div>
              <a href={`/${locale}/menu#checkout`} className="text-sm font-black text-[#6c6255]">
                Checkout
              </a>
            </div>

            {createdOrder ? (
              <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-900">
                Order received: <span className="font-black">{createdOrder.reference}</span>
              </div>
            ) : null}

            {message ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-900">
                {message}
              </div>
            ) : null}

            <div className="mt-4 divide-y divide-[#eadfcb]">
              {cart.length ? (
                cart.map((line) => (
                  <div key={line.lineId} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">{line.name}</p>
                        <p className="mt-1 text-xs font-semibold uppercase text-[#6c6255]">
                          {line.optionLabel} - {formatEuro(line.unitPriceCents)}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-black">
                        {formatEuro(line.unitPriceCents * line.quantity)}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                        className="grid size-8 place-items-center rounded-md border border-[#eadfcb] text-lg font-black"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-black">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                        className="grid size-8 place-items-center rounded-md border border-[#eadfcb] text-lg font-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-sm font-semibold text-[#6c6255]">Add menu items to start an order.</p>
              )}
            </div>

            <div id="checkout" className="mt-5 border-t border-[#eadfcb] pt-5">
              <div className="grid grid-cols-2 gap-2">
                {(["pickup", "delivery"] as FulfillmentType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateCheckout("fulfillmentType", type)}
                    className={`h-11 rounded-md border text-sm font-black ${
                      checkout.fulfillmentType === type
                        ? "border-[#10100f] bg-[#10100f] text-white"
                        : "border-[#eadfcb] bg-white text-[#10100f]"
                    }`}
                  >
                    {fulfillmentLabels[type]}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3">
                <input
                  required
                  value={checkout.name}
                  onChange={(event) => updateCheckout("name", event.target.value)}
                  placeholder="Name"
                  className="h-11 rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                />
                <input
                  required
                  value={checkout.phone}
                  onChange={(event) => updateCheckout("phone", event.target.value)}
                  placeholder="Phone"
                  className="h-11 rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                />
                <input
                  type="email"
                  value={checkout.email}
                  onChange={(event) => updateCheckout("email", event.target.value)}
                  placeholder="Email optional"
                  className="h-11 rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                />
                {checkout.fulfillmentType === "delivery" ? (
                  <input
                    required
                    value={checkout.address}
                    onChange={(event) => updateCheckout("address", event.target.value)}
                    placeholder="Delivery address"
                    className="h-11 rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                  />
                ) : null}
                <input
                  value={checkout.requestedTime}
                  onChange={(event) => updateCheckout("requestedTime", event.target.value)}
                  placeholder="Pickup/delivery time"
                  className="h-11 rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                />
                <select
                  value={checkout.paymentMethod}
                  onChange={(event) => updateCheckout("paymentMethod", event.target.value as PaymentMethod)}
                  className="h-11 rounded-md border border-[#eadfcb] bg-white px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                >
                  {checkout.fulfillmentType === "pickup" ? (
                    <option value="pay_at_pickup">Pay at pickup</option>
                  ) : (
                    <option value="pay_on_delivery">Pay on delivery</option>
                  )}
                  <option value="card_terminal">Card terminal</option>
                </select>
                <textarea
                  value={checkout.notes}
                  onChange={(event) => updateCheckout("notes", event.target.value)}
                  placeholder="Order notes"
                  rows={3}
                  className="resize-none rounded-md border border-[#eadfcb] px-3 py-2 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                />
              </div>

              <div className="mt-5 space-y-2 border-t border-[#eadfcb] pt-4 text-sm font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatEuro(subtotalCents)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>{formatEuro(deliveryFeeCents)}</span>
                </div>
                <div className="flex justify-between text-lg font-black">
                  <span>Total</span>
                  <span>{formatEuro(totalCents)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !cart.length}
                className="mt-5 h-12 w-full rounded-md bg-[#10100f] text-sm font-black text-white transition hover:bg-[#2b2a28] disabled:cursor-not-allowed disabled:bg-[#a8a19a]"
              >
                {isSubmitting ? "Sending order..." : "Place order"}
              </button>
            </div>
          </form>
        </aside>
      </div>
    </section>
  );
}
