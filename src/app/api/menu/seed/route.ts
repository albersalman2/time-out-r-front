import { requireAdminApiSession } from "@/lib/auth";
import { seedCurrentMenu } from "@/lib/menu-store";

export const runtime = "nodejs";

export async function POST() {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const result = await seedCurrentMenu();

  return Response.json({ result });
}
