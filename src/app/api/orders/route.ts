import { createOrder, listOrders } from "@/lib/order-store";

export const runtime = "nodejs";

export async function GET() {
  const orders = await listOrders();

  return Response.json({ orders });
}

export async function POST(request: Request) {
  try {
    const order = await createOrder(await request.json());

    return Response.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create order.";

    return Response.json({ error: message }, { status: 400 });
  }
}
