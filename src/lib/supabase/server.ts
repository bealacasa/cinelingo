import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getEnv } from "@/lib/env";
import { AUTH_COOKIE_OPTIONS } from "./cookies";
import type { Database } from "./database.types";

/**
 * Cliente con la sesión del usuario (RLS aplicada). Crear uno nuevo por petición.
 * En Server Components no se pueden escribir cookies; el refresco lo hace src/proxy.ts.
 */
export async function createClient() {
  const env = getEnv();
  const cookieStore = await cookies();
  return createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookieOptions: AUTH_COOKIE_OPTIONS,
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, { ...options, ...AUTH_COOKIE_OPTIONS, name });
          }
        } catch {
          // Llamado desde un Server Component: el proxy ya refresca la sesión.
        }
      },
    },
  });
}
