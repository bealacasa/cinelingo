import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  SITE_URL: z.url().transform((url) => url.replace(/\/$/, "")),
  SUPABASE_URL: z.url(),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(20),
  SUPABASE_SECRET_KEY: z.string().min(20),
  RATE_LIMIT_SECRET: z.string().min(32),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

/**
 * Variables de entorno del servidor, validadas de forma perezosa (en la primera
 * petición, no en el build). Si falta alguna, el error no incluye sus valores.
 */
export function getEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const keys = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Variables de entorno ausentes o no válidas: ${keys}`);
  }
  cached = parsed.data;
  return cached;
}

/** true si Supabase está configurado (permite arrancar páginas estáticas sin BD en tests). */
export function hasSupabaseEnv(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}
