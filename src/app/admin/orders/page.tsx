import type { Metadata } from "next";
import { OrderDashboard } from "@/components/order-dashboard";
<<<<<<< HEAD
=======
import { requireAdminSession } from "@/lib/auth";
>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
import { listOrders } from "@/lib/order-store";

export const metadata: Metadata = {
  title: "Orders Dashboard | Time Out",
  description: "Staff dashboard for Time Out online orders.",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
<<<<<<< HEAD
=======
  await requireAdminSession();
>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
  const orders = await listOrders();

  return <OrderDashboard initialOrders={orders} />;
}
