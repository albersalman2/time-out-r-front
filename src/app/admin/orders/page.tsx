import type { Metadata } from "next";
import { OrderDashboard } from "@/components/order-dashboard";
import { requireAdminSession } from "@/lib/auth";
import { listOrders } from "@/lib/order-store";

export const metadata: Metadata = {
  title: "Orders Dashboard | Time Out",
  description: "Staff dashboard for Time Out online orders.",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdminSession();
  const orders = await listOrders();

  return <OrderDashboard initialOrders={orders} />;
}
