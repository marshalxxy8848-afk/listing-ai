import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    
    if (authErr) return NextResponse.json({ debug: "auth error", error: authErr.message }, { status: 500 });
    if (!user) return NextResponse.json({ debug: "no user" }, { status: 401 });

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (profileErr) return NextResponse.json({ debug: "profile error", error: profileErr.message, userId: user.id }, { status: 500 });

    return NextResponse.json({ credits: profile?.credits ?? 0, debug: "ok" });
  } catch (error: any) {
    return NextResponse.json({ debug: "catch", error: error?.message || String(error) }, { status: 500 });
  }
}
