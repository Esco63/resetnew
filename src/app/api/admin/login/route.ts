import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminSessionMaxAge,
  createAdminSession,
  normalizeAdminEmail,
  normalizeAdminPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    email?: string;
    password?: string;
  };

  const adminEmail = normalizeAdminEmail(process.env.ADMIN_EMAIL);
  const adminPassword = normalizeAdminPassword(process.env.ADMIN_PASSWORD);
  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: "Admin login is not configured." }, { status: 500 });
  }

  const email = normalizeAdminEmail(body.email);
  const password = normalizeAdminPassword(body.password);
  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Ungültige Zugangsdaten." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: await createAdminSession(email),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: adminSessionMaxAge,
  });

  return res;
}
