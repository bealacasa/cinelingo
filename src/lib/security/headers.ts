/** Rutas que pueden usar el micrófono (Fase 4: shadowing). Navegar a ellas con <a>, no <Link>. */
export const MICROPHONE_PATHS = ["/practicar/shadowing"] as const;

const DENIED_FEATURES = [
  "accelerometer",
  "autoplay",
  "browsing-topics",
  "camera",
  "display-capture",
  "geolocation",
  "gyroscope",
  "hid",
  "magnetometer",
  "payment",
  "serial",
  "usb",
];

/** Permissions-Policy por ruta: micrófono solo en la pantalla de shadowing. */
export function permissionsPolicyFor(pathname: string): string {
  const allowMicrophone = MICROPHONE_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const parts = DENIED_FEATURES.map((feature) => `${feature}=()`);
  parts.push(allowMicrophone ? "microphone=(self)" : "microphone=()");
  // Passkeys (WebAuthn) solo en el propio origen.
  parts.push("publickey-credentials-get=(self)", "publickey-credentials-create=(self)");
  return parts.join(", ");
}

/**
 * HSTS (2 años, subdominios, preload). La envía src/proxy.ts en tiempo de ejecución para
 * poder omitirla en http://localhost: WebKit la aplica incluso ahí y rompe el desarrollo.
 */
export const HSTS_VALUE = "max-age=63072000; includeSubDomains; preload";

/**
 * Cabeceras de seguridad comunes a todas las respuestas (páginas, API y estáticos).
 * CSP, Permissions-Policy y HSTS dependen de la petición y las añade src/proxy.ts.
 */
export const STATIC_SECURITY_HEADERS: ReadonlyArray<{ key: string; value: string }> = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

/** CSP mínima para respuestas que no son HTML (API JSON, descargas). */
export const API_CSP = "default-src 'none'; frame-ancestors 'none'; base-uri 'none'";
