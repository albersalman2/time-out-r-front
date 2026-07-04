import { requireAdminApiSession } from "@/lib/auth";
import { updateMenuItem } from "@/lib/menu-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { id } = await context.params;
    const items = await updateMenuItem(id, await request.json());

    return Response.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Menu item could not be updated.";

    return Response.json({ error: message }, { status: 400 });
  }
}
