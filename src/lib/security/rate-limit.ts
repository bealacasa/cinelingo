import "server-only";
import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";

export type RateLimitRule = { limit: number; windowSeconds: number };

/** Límites por acción. Supabase Auth aplica además sus propios límites por IP. */
export const RATE_LIMITS = {
  loginRequestByIp: { limit: 10, windowSeconds: 15 * 60 },
  loginRequestByEmail: { limit: 3, windowSeconds: 15 * 60 },
  loginVerifyByIp: { limit: 20, windowSeconds: 15 * 60 },
  loginVerifyByEmail: { limit: 5, windowSeconds: 15 * 60 },
  passkeyByIp: { limit: 20, windowSeconds: 15 * 60 },
  accountByUser: { limit: 10, windowSeconds: 60 * 60 },
} as const satisfies Record<string, RateLimitRule>;

/** Clave opaca: HMAC del bucket + identificador. No se guardan IPs ni emails en claro. */
export function rateLimitKey(secret: string, bucket: string, identifier: string): string {
  return createHmac("sha256", secret).update(`${bucket}:${identifier}`).digest("base64url");
}

/** IP del cliente según el proxy de Vercel (x-forwarded-for la fija la plataforma). */
export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || h.get("x-real-ip") || "unknown";
}

/**
 * Devuelve true si se permite la acción. Falla en cerrado: si la BD no responde,
 * se deniega (preferimos un login fallido a un endpoint sin límite).
 */
export async function checkRateLimit(
  bucket: keyof typeof RATE_LIMITS,
  identifier: string,
): Promise<boolean> {
  const rule = RATE_LIMITS[bucket];
  const key = rateLimitKey(getEnv().RATE_LIMIT_SECRET, bucket, identifier);
  const { data, error } = await createAdminClient().rpc("check_rate_limit", {
    p_key: key,
    p_limit: rule.limit,
    p_window_seconds: rule.windowSeconds,
  });
  if (error) {
    logger.error("rate_limit.error", { bucket, code: error.code });
    return false;
  }
  return data === true;
}
