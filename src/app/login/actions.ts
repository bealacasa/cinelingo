"use server";

import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import { safeNextPath } from "@/lib/security/redirect";
import { createClient } from "@/lib/supabase/server";
import {
  challengeIdSchema,
  emailSchema,
  otpSchema,
  webauthnCredentialSchema,
} from "@/lib/validation/auth";

export type LoginState =
  | { step: "email"; error?: string }
  | { step: "code"; email: string; error?: string; info?: string };

const GENERIC_SENT =
  "Si el email es válido, te hemos enviado un código y un enlace. Revisa también la carpeta de spam.";
const TOO_MANY = "Demasiados intentos. Espera unos minutos y vuelve a probar.";
const NOT_CONFIGURED = "El inicio de sesión aún no está disponible.";

export async function requestCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!hasSupabaseEnv()) return { step: "email", error: NOT_CONFIGURED };
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { step: "email", error: "Escribe un email válido." };
  const email = parsed.data;

  const ip = await getClientIp();
  const allowed =
    (await checkRateLimit("loginRequestByIp", ip)) &&
    (await checkRateLimit("loginRequestByEmail", email));
  if (!allowed) return { step: "email", error: TOO_MANY };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  // Respuesta idéntica tanto si falla como si no: no revelamos si la cuenta existe.
  if (error) logger.warn("auth.otp_request_failed", { code: error.code, status: error.status });
  return { step: "code", email, info: GENERIC_SENT };
}

export async function verifyCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!hasSupabaseEnv()) return { step: "email", error: NOT_CONFIGURED };
  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { step: "email", error: "Escribe un email válido." };
  const token = otpSchema.safeParse(formData.get("code"));
  if (!token.success)
    return { step: "code", email: email.data, error: "Revisa el código: son solo dígitos." };

  const ip = await getClientIp();
  const allowed =
    (await checkRateLimit("loginVerifyByIp", ip)) &&
    (await checkRateLimit("loginVerifyByEmail", email.data));
  if (!allowed) return { step: "code", email: email.data, error: TOO_MANY };

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    email: email.data,
    token: token.data,
    type: "email",
  });
  if (error) {
    logger.info("auth.otp_verify_failed", { code: error.code });
    return { step: "code", email: email.data, error: "Código no válido o caducado." };
  }
  redirect(safeNextPath(formData.get("next")));
}

export type PasskeyStart =
  { ok: true; challengeId: string; options: unknown } | { ok: false; error: string };

export async function startPasskeyLogin(): Promise<PasskeyStart> {
  if (!hasSupabaseEnv()) return { ok: false, error: NOT_CONFIGURED };
  if (!(await checkRateLimit("passkeyByIp", await getClientIp())))
    return { ok: false, error: TOO_MANY };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.passkey.startAuthentication();
  if (error || !data) {
    logger.warn("auth.passkey_start_failed", { code: error?.code });
    return { ok: false, error: "No se pudo iniciar el acceso con passkey." };
  }
  return { ok: true, challengeId: data.challenge_id, options: data.options };
}

export async function finishPasskeyLogin(
  challengeId: unknown,
  credential: unknown,
  next: unknown,
): Promise<{ ok: false; error: string } | { ok: true; redirectTo: string }> {
  const id = challengeIdSchema.safeParse(challengeId);
  const cred = webauthnCredentialSchema.safeParse(credential);
  if (!id.success || !cred.success) return { ok: false, error: "Passkey no válida." };
  if (!(await checkRateLimit("passkeyByIp", await getClientIp())))
    return { ok: false, error: TOO_MANY };

  const supabase = await createClient();
  const { error } = await supabase.auth.passkey.verifyAuthentication({
    challengeId: id.data,
    // Supabase valida firma, origen y challenge.
    credential: cred.data as never,
  });
  if (error) {
    logger.info("auth.passkey_verify_failed", { code: "code" in error ? error.code : undefined });
    return { ok: false, error: "No se pudo verificar la passkey." };
  }
  return { ok: true, redirectTo: safeNextPath(next) };
}
