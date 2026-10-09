/**
 * Valida el parámetro `next` tras iniciar sesión para evitar open redirects:
 * solo rutas relativas del propio sitio ("/algo"), nunca "//host", "/\\host" ni URLs absolutas.
 */
export function safeNextPath(value: unknown, fallback = "/"): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 512) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  // Rechaza caracteres de control (incl. saltos de línea y tabuladores que los navegadores ignoran).
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return fallback;
  }
  try {
    const url = new URL(value, "https://cinelingo.invalid");
    if (url.origin !== "https://cinelingo.invalid") return fallback;
    return `${url.pathname}${url.search}`;
  } catch {
    return fallback;
  }
}
