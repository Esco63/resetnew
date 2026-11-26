import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { DEFAULT_PRICING_SETTINGS, type PricingSettings } from "@/lib/pricing";
import { verifyAdminSession, ADMIN_COOKIE } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ settings: DEFAULT_PRICING_SETTINGS });
  }

  const { data, error } = await supabase
    .from("pricing_settings")
    .select("settings")
    .eq("id", "default")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    settings: {
      ...DEFAULT_PRICING_SETTINGS,
      ...(data?.settings as PricingSettings | undefined),
    },
  });
}

export async function PUT(req: Request) {
  const cookie = req.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE}=`))
    ?.split("=")[1];

  if (!(await verifyAdminSession(cookie))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase admin client is not configured." }, { status: 500 });
  }

  const body = (await req.json()) as Partial<PricingSettings>;
  const settings: PricingSettings = {
    ...DEFAULT_PRICING_SETTINGS,
    ...body,
  };

  const { error } = await supabase
    .from("pricing_settings")
    .upsert({
      id: "default",
      settings,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, settings });
}
