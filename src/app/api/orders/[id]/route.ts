import { requireAdminApiSession } from "@/lib/auth";
import { isOrderStatus, updateOrderStatus } from "@/lib/order-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  const { id } = await context.params;
  const body = await request.json();
  const status = String(body.status ?? "");

  if (!isOrderStatus(status)) {
    return Response.json({ error: "Choose a valid order status." }, { status: 400 });
  }

  const order = await updateOrderStatus(id, status);

  if (!order) {
    return Response.json({ error: "Order not found." }, { status: 404 });
  }

  return Response.json({ order });
}
