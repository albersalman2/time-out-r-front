import { listDashboardMenu } from "@/lib/menu-store";

export const runtime = "nodejs";

export async function GET() {
  const items = await listDashboardMenu("nl");

  return Response.json({ items });
}
