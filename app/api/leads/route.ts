import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * POST /api/leads — accept a lead from the LP form.
 *
 * If Supabase is configured, insert into `leads`. Otherwise log the
 * payload server-side and return success so the LP keeps working in
 * dev / before the DB is hooked up.
 */
const schema = z.object({
  customer_name: z.string().min(2).max(80),
  phone: z.string().min(9).max(15),
  fc_name: z.string().max(80).optional().nullable(),
  qty_tier: z.string().max(20).optional().nullable(),
  selected_product_slug: z.string().max(120).optional().nullable(),
  message: z.string().max(2000).optional().nullable(),
  source: z.string().max(60).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY,
  );

  if (!hasSupabase) {
    console.warn(
      "[/api/leads] Supabase not configured — logging payload instead",
      parsed.data,
    );
    return NextResponse.json({ ok: true, persisted: false });
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("leads").insert({
    customer_name: parsed.data.customer_name,
    phone: parsed.data.phone,
    fc_name: parsed.data.fc_name ?? null,
    qty_tier: parsed.data.qty_tier ?? null,
    selected_product_slug: parsed.data.selected_product_slug ?? null,
    message: parsed.data.message ?? null,
    source: parsed.data.source ?? "landing",
    metadata: parsed.data.metadata ?? {},
    status: "new",
  });

  if (error) {
    console.error("[/api/leads] insert failed", error);
    return NextResponse.json(
      { error: "Lưu lead thất bại — anh thử lại hoặc nhắn Zalo trực tiếp giúp em" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, persisted: true });
}
