import { NextResponse } from "next/server";

export const runtime = "edge"; // schnell und ausreichend

export async function POST() {
  // Hier könntest du optional eine Suppression-Liste pflegen.
  return NextResponse.json({ ok: true });
}

export async function GET() {
  // Auch GET kann 200 liefern (manche Provider rufen per GET).
  return NextResponse.json({ ok: true });
}
