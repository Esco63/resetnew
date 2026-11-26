import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "reset_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "dev-only-admin-session-secret";
}

/** E-Mail ohne Leerzeichen/Zeilenumbrüche und ohne Groß-/Kleinschreibung vergleichen. */
export function normalizeAdminEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/** Passwort aus Vercel ohne versehentliche Leerzeichen/Zeilenumbrüche am Rand. */
export function normalizeAdminPassword(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getAdminEmail() {
  return normalizeAdminEmail(process.env.ADMIN_EMAIL);
}

async function hmac(input: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function encodePayload(payload: { email: string; exp: number }) {
  return btoa(JSON.stringify(payload))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodePayload(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return JSON.parse(atob(padded)) as { email: string; exp: number };
}

export async function createAdminSession(email: string) {
  const payload = encodePayload({
    email,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });
  return `${payload}.${await hmac(payload)}`;
}

export async function verifyAdminSession(token?: string | null) {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if ((await hmac(payload)) !== signature) return false;

  try {
    const data = decodePayload(payload);
    return normalizeAdminEmail(data.email) === getAdminEmail() && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminRequest(req: NextRequest) {
  return verifyAdminSession(req.cookies.get(ADMIN_COOKIE)?.value);
}

export const adminSessionMaxAge = SESSION_MAX_AGE_SECONDS;
