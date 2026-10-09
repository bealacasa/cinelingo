import type { CookieOptionsWithName } from "@supabase/ssr";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Opciones de las cookies de sesión. HttpOnly es posible porque Supabase solo se usa
 * desde el servidor (no existe cliente de navegador). En producción usamos el prefijo
 * `__Host-`, que obliga a Secure + Path=/ y prohíbe Domain (no se comparte con subdominios).
 * maxAge actúa como caducidad por inactividad: se renueva en cada refresco de sesión.
 */
export const AUTH_COOKIE_OPTIONS: CookieOptionsWithName = {
  name: isProduction ? "__Host-cl-auth" : "cl-auth",
  path: "/",
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 14,
};

/** ¿Trae la petición alguna cookie de sesión? Evita llamadas a Supabase para visitantes anónimos. */
export function hasAuthCookie(cookieNames: Iterable<string>): boolean {
  const name = AUTH_COOKIE_OPTIONS.name ?? "";
  for (const cookie of cookieNames) {
    if (cookie === name || cookie.startsWith(`${name}.`)) return true;
  }
  return false;
}
