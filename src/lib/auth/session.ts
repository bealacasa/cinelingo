import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { hasSupabaseEnv } from "@/lib/env";
import { hasAuthCookie } from "@/lib/supabase/cookies";
import { createClient } from "@/lib/supabase/server";

/**
 * Usuario actual verificado contra Supabase Auth (getUser valida el token en el
 * servidor de Auth, no solo su firma). Memoizado por petición.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!hasSupabaseEnv()) return null;
  const cookieStore = await cookies();
  if (!hasAuthCookie(cookieStore.getAll().map((c) => c.name))) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
});

/** Exige sesión; si no hay, redirige al login conservando la ruta de vuelta. */
export async function requireUser(nextPath: string): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

/** Exige rol admin verificado en BD. Responde 404 para no revelar que la ruta existe. */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) notFound();
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) notFound();
  return user;
}
