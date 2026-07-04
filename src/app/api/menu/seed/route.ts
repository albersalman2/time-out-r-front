import { seedCurrentMenu } from "@/lib/menu-store";

export const runtime = "nodejs";

export async function POST() {
  const result = await seedCurrentMenu();

  return Response.json({ result });
}
