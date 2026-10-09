import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Cliente con la clave secreta: SE SALTA RLS. Úsalo solo para operaciones que el
 * usuario no puede hacer por sí mismo (rate limiting, borrar su cuenta) y siempre
 * tras verificar la identidad en el servidor.
 */
export function createAdminClient() {
  const env = getEnv();
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
