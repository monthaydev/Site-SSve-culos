import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path : "";
  const visitorId = typeof body?.visitorId === "string" ? body.visitorId : "";

  if (!path.startsWith("/") || path.startsWith("/admin") || path.length > 200) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!UUID_RE.test(visitorId)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const supabase = await createClient();
  await supabase.from("visitas").insert({ path, visitor_id: visitorId });

  return NextResponse.json({ ok: true });
}
