import { findAdminUser, setAdminSession, verifyPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await findAdminUser(email);

  if (!user || !user.is_active || !verifyPassword(password, user.password_hash)) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await setAdminSession(user);

  return Response.json({ ok: true });
}
