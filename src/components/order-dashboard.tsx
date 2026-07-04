"use client";

import { useMemo, useState } from "react";
import { formatEuro } from "@/lib/order-menu";
import type { OrderStatus, StoredOrder } from "@/lib/order-store";

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function statusLabel(status: OrderStatus) {
  return statuses.find((item) => item.value === status)?.label ?? status;
}

function paymentLabel(value: StoredOrder["paymentMethod"]) {
  switch (value) {
    case "pay_at_pickup":
      return "Pay at pickup";
    case "pay_on_delivery":
      return "Pay on delivery";
    case "card_terminal":
      return "Card terminal";
    default:
      return value;
  }
}

export function OrderDashboard({ initialOrders }: { initialOrders: StoredOrder[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [activeStatus, setActiveStatus] = useState<OrderStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");

  const filteredOrders = useMemo(
    () => orders.filter((order) => activeStatus === "all" || order.status === activeStatus),
    [activeStatus, orders],
  );

  const counts = useMemo(() => {
    return statuses.reduce(
      (acc, status) => ({
        ...acc,
        [status.value]: orders.filter((order) => order.status === status.value).length,
      }),
      {} as Record<OrderStatus, number>,
    );
  }, [orders]);

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdatingId(id);
    setMessage("");

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Status could not be updated.");
      }

      setOrders((current) =>
        current.map((order) => (order.id === id ? payload.order : order)),
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Status could not be updated.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <section className="bg-[#f7f2e8] px-4 py-10 text-[#10100f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#f25a1d]">Backend dashboard</p>
            <h1 className="mt-2 text-4xl font-black">Online orders</h1>
            <p className="mt-2 text-sm font-semibold text-[#6c6255]">
              Track incoming pickup and delivery orders from the online menu.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-4">
          <button
            type="button"
            onClick={() => setActiveStatus("all")}
            className={`rounded-md border p-4 text-left ${
              activeStatus === "all" ? "border-[#10100f] bg-[#10100f] text-white" : "border-[#eadfcb] bg-white"
            }`}
          >
            <p className="text-xs font-black uppercase">All orders</p>
            <p className="mt-2 text-3xl font-black">{orders.length}</p>
          </button>
          {statuses.slice(0, 3).map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => setActiveStatus(status.value)}
              className={`rounded-md border p-4 text-left ${
                activeStatus === status.value ? "border-[#10100f] bg-[#10100f] text-white" : "border-[#eadfcb] bg-white"
              }`}
            >
              <p className="text-xs font-black uppercase">{status.label}</p>
              <p className="mt-2 text-3xl font-black">{counts[status.value]}</p>
            </button>
          ))}
        </div>

        {message ? (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-900">
            {message}
          </div>
        ) : null}

        <div className="grid gap-4">
          {filteredOrders.length ? (
            filteredOrders.map((order) => (
              <article key={order.id} className="rounded-md border border-[#eadfcb] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-black">{order.reference}</h2>
                      <span className="rounded-md bg-[#ffcf8c] px-2 py-1 text-xs font-black uppercase">
                        {statusLabel(order.status)}
                      </span>
                      <span className="rounded-md bg-[#e8f1ef] px-2 py-1 text-xs font-black uppercase">
                        {order.fulfillmentType}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-[#6c6255]">
                      {new Date(order.createdAt).toLocaleString("nl-BE")} - requested {order.requestedTime}
                    </p>
                    <p className="mt-3 font-black">{order.customer.name}</p>
                    <p className="text-sm font-semibold text-[#6c6255]">{order.customer.phone}</p>
                    {order.customer.address ? (
                      <p className="mt-1 text-sm font-semibold text-[#6c6255]">{order.customer.address}</p>
                    ) : null}
                    <p className="mt-1 text-sm font-semibold text-[#6c6255]">
                      {paymentLabel(order.paymentMethod)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status.value}
                        type="button"
                        disabled={updatingId === order.id || status.value === order.status}
                        onClick={() => updateStatus(order.id, status.value)}
                        className="h-9 rounded-md border border-[#eadfcb] px-3 text-xs font-black transition hover:border-[#f25a1d] disabled:cursor-not-allowed disabled:bg-[#f0ece4] disabled:text-[#6c6255]"
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[620px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-[#eadfcb] text-left text-xs uppercase text-[#6c6255]">
                        <th className="py-2 font-black">Item</th>
                        <th className="py-2 font-black">Option</th>
                        <th className="py-2 text-right font-black">Qty</th>
                        <th className="py-2 text-right font-black">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={`${item.menuItemId}-${item.optionId}`} className="border-b border-[#f3eadf]">
                          <td className="py-3 font-black">{item.name}</td>
                          <td className="py-3 text-[#6c6255]">{item.optionLabel}</td>
                          <td className="py-3 text-right">{item.quantity}</td>
                          <td className="py-3 text-right font-black">
                            {formatEuro(item.unitPriceCents * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-col gap-2 text-sm font-semibold sm:items-end">
                  {order.notes ? <p className="w-full text-[#6c6255]">Notes: {order.notes}</p> : null}
                  <p>Subtotal: {formatEuro(order.subtotalCents)}</p>
                  <p>Delivery: {formatEuro(order.deliveryFeeCents)}</p>
                  <p className="text-lg font-black">Total: {formatEuro(order.totalCents)}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-md border border-[#eadfcb] bg-white p-8 text-sm font-semibold text-[#6c6255]">
              No orders in this view.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
