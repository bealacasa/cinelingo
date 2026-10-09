import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/lib/env";
import type { Database } from "./database.types";

/**
 * Cliente anónimo sin cookies (rol `anon`, RLS aplicada): solo ve contenido publicado.
 * Es el único seguro dentro de `unstable_cache`, porque su resultado no depende del usuario.
 */
export function createPublicClient() {
  const env = getEnv();
  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
