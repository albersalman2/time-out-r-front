<<<<<<< HEAD
=======
import { requireAdminApiSession } from "@/lib/auth";
>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
import { seedCurrentMenu } from "@/lib/menu-store";

export const runtime = "nodejs";

export async function POST() {
<<<<<<< HEAD
=======
  const unauthorized = await requireAdminApiSession();

  if (unauthorized) {
    return unauthorized;
  }

>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
  const result = await seedCurrentMenu();

  return Response.json({ result });
}
