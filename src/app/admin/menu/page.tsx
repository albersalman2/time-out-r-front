import type { Metadata } from "next";
import { MenuDashboard } from "@/components/menu-dashboard";
import { requireAdminSession } from "@/lib/auth";
import { listDashboardMenu } from "@/lib/menu-store";

export const metadata: Metadata = {
  title: "Menu Dashboard | Time Out",
  description: "Staff dashboard for Time Out menu management.",
};

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  await requireAdminSession();
  const items = await listDashboardMenu("nl");

  return <MenuDashboard initialItems={items} />;
}
