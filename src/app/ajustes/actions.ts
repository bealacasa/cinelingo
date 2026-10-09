"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { AUTH_COOKIE_OPTIONS } from "@/lib/supabase/cookies";
import { createClient } from "@/lib/supabase/server";
import { challengeIdSchema, webauthnCredentialSchema } from "@/lib/validation/auth";

type Result = { ok: true } | { ok: false; error: string };

async function clearAuthCookies() {
  const store = await cookies();
  const name = AUTH_COOKIE_OPTIONS.name ?? "";
  for (const c of store.getAll())
    if (c.name === name || c.name.startsWith(`${name}.`)) store.delete(c.name);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await clearAuthCookies();
  redirect("/");
}

export async function deleteAccount(
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (formData.get("confirm") !== "BORRAR")
    return { error: "Escribe BORRAR en mayúsculas para confirmar." };
  if (!(await checkRateLimit("accountByUser", user.id))) return { error: "Demasiados intentos." };

  // Borrado en cascada: auth.users → profiles (y futuras tablas con on delete cascade).
  const { error } = await createAdminClient().auth.admin.deleteUser(user.id);
  if (error) {
    logger.error("account.delete_failed", { code: error.code });
    return { error: "No se pudo borrar la cuenta. Inténtalo más tarde." };
  }
  logger.info("account.deleted");
  await clearAuthCookies();
  redirect("/?cuenta=borrada");
}

export async function startPasskeyRegistration(): Promise<
  { ok: true; challengeId: string; options: unknown } | { ok: false; error: string }
> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sesión caducada." };
  if (!(await checkRateLimit("accountByUser", user.id)))
    return { ok: false, error: "Demasiados intentos." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.passkey.startRegistration();
  if (error || !data) {
    logger.warn("passkey.register_start_failed", { code: error?.code });
    return { ok: false, error: "No se pudo iniciar el registro de la passkey." };
  }
  return { ok: true, challengeId: data.challenge_id, options: data.options };
}

export async function finishPasskeyRegistration(
  challengeId: unknown,
  credential: unknown,
): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sesión caducada." };
  const id = challengeIdSchema.safeParse(challengeId);
  const cred = webauthnCredentialSchema.safeParse(credential);
  if (!id.success || !cred.success) return { ok: false, error: "Passkey no válida." };
  const supabase = await createClient();
  const { error } = await supabase.auth.passkey.verifyRegistration({
    challengeId: id.data,
    credential: cred.data as never,
  });
  if (error) {
    logger.warn("passkey.register_failed", { code: "code" in error ? error.code : undefined });
    return { ok: false, error: "No se pudo guardar la passkey." };
  }
  revalidatePath("/ajustes");
  return { ok: true };
}

export async function deletePasskey(passkeyId: unknown): Promise<Result> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sesión caducada." };
  const id = z.uuid().safeParse(passkeyId);
  if (!id.success) return { ok: false, error: "Passkey no válida." };
  const supabase = await createClient();
  const { error } = await supabase.auth.passkey.delete({ passkeyId: id.data });
  if (error) return { ok: false, error: "No se pudo borrar la passkey." };
  revalidatePath("/ajustes");
  return { ok: true };
}
