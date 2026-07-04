import { requireAdminApiSession } from "@/lib/auth";
import { storeMenuImage } from "@/lib/image-storage";
import { updateMenuItemImage } from "@/lib/menu-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return Response.json({ error: "Image file is required." }, { status: 400 });
    }

    const storedImage = await storeMenuImage(file, id);
    const items = await updateMenuItemImage(id, storedImage.url, storedImage.key);

    return Response.json({ image: storedImage, items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Image could not be uploaded.";

    return Response.json({ error: message }, { status: 400 });
  }
}
