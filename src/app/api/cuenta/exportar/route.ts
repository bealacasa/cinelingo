import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";

/** Exportación RGPD (art. 20): todos los datos del usuario en JSON. Solo lectura y solo los propios. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!(await checkRateLimit("accountByUser", user.id))) {
    return NextResponse.json({ error: "Demasiadas peticiones" }, { status: 429 });
  }

  const supabase = await createClient();
  const [profile, passkeys] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, target_level, timezone, created_at, updated_at")
      .single(),
    supabase.auth.passkey.list(),
  ]);
  if (profile.error) {
    logger.error("account.export_failed", { code: profile.error.code });
    return NextResponse.json({ error: "No se pudo exportar" }, { status: 500 });
  }

  const body = {
    exportedAt: new Date().toISOString(),
    account: {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
      lastSignInAt: user.last_sign_in_at,
    },
    profile: profile.data,
    passkeys: (passkeys.data ?? []).map((p) => ({
      name: p.friendly_name,
      createdAt: p.created_at,
      lastUsedAt: p.last_used_at,
    })),
  };

  return new NextResponse(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cinelingo-mis-datos.json"',
      "Cache-Control": "no-store",
    },
  });
}
