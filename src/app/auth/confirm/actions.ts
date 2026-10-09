"use server";

import { redirect } from "next/navigation";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { otpTypeSchema, tokenHashSchema } from "@/lib/validation/auth";

export async function confirmLink(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const tokenHash = tokenHashSchema.safeParse(formData.get("token_hash"));
  const type = otpTypeSchema.safeParse(formData.get("type"));
  if (!tokenHash.success || !type.success) return { error: "Enlace no válido." };
  if (!(await checkRateLimit("loginVerifyByIp", await getClientIp()))) {
    return { error: "Demasiados intentos. Espera unos minutos." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash.data, type: type.data });
  if (error) {
    logger.info("auth.link_verify_failed", { code: error.code });
    return { error: "El enlace ha caducado o ya se ha usado. Pide uno nuevo." };
  }
  redirect("/");
}
