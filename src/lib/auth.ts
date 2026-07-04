import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/db";

export type AdminSession = {
  userId: string;
  email: string;
  name: string;
  expiresAt: number;
};

type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  is_active: boolean;
};

const cookieName = "timeout_admin_session";
const sessionMaxAgeSeconds = 60 * 60 * 12;
let authSchemaReady: Promise<void> | undefined;

function getSecret() {
  return process.env.AUTH_SECRET ?? "local-development-change-this-secret";
}

function base64url(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function timingSafeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export async function ensureAuthSchema() {
  const db = getPool();

  if (!db) {
    throw new Error("Database connection is required for admin login.");
  }

  authSchemaReady ??= db.query(`
    create table if not exists admin_users (
      id text primary key,
      email text not null unique,
      name text not null,
      password_hash text not null,
      is_active boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create index if not exists admin_users_email_idx
      on admin_users (lower(email));
  `).then(() => undefined);

  await authSchemaReady;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("base64url");
  const iterations = 210000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");

  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterationsRaw, salt, expected] = storedHash.split("$");

  if (algorithm !== "pbkdf2" || !iterationsRaw || !salt || !expected) {
    return false;
  }

  const iterations = Number.parseInt(iterationsRaw, 10);
  const actual = crypto.pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("base64url");

  return timingSafeEqual(actual, expected);
}

export async function findAdminUser(email: string) {
  const db = getPool();

  if (!db) {
    throw new Error("Database connection is required for admin login.");
  }

  await ensureAuthSchema();
  const result = await db.query<AdminUserRow>(
    `
      select id, email, name, password_hash, is_active
      from admin_users
      where lower(email) = lower($1)
      limit 1
    `,
    [email],
  );

  return result.rows[0];
}

export function createSessionToken(session: AdminSession) {
  const payload = base64url(JSON.stringify(session));
  const signature = sign(payload);

  return `${payload}.${signature}`;
}

export function parseSessionToken(token: string | undefined): AdminSession | undefined {
  if (!token) {
    return undefined;
  }

  const [payload, signature] = token.split(".");

  if (!payload || !signature || !timingSafeEqual(sign(payload), signature)) {
    return undefined;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;

    if (!session.userId || !session.email || session.expiresAt < Date.now()) {
      return undefined;
    }

    return session;
  } catch {
    return undefined;
  }
}

export async function setAdminSession(user: Pick<AdminUserRow, "id" | "email" | "name">) {
  const cookieStore = await cookies();
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;
  const token = createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
    expiresAt,
  });

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: sessionMaxAgeSeconds,
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getAdminSession() {
  const cookieStore = await cookies();

  return parseSessionToken(cookieStore.get(cookieName)?.value);
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireAdminApiSession() {
  const session = await getAdminSession();

  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  return undefined;
}
