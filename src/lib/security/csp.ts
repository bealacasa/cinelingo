export type CspOptions = {
  nonce: string;
  isDev: boolean;
  /** Omite upgrade-insecure-requests al servir por http://localhost (tests e2e). */
  isLocalHttp: boolean;
};

/** Nonce criptográficamente aleatorio de 128 bits, en base64. */
export function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

/**
 * CSP estricta basada en nonce. Sin 'unsafe-inline' ni 'unsafe-eval' en producción
 * (en desarrollo React necesita eval para sus trazas y Next inyecta estilos inline).
 * Todo el tráfico a Supabase sale del servidor, así que connect-src es 'self'.
 */
export function buildCsp({ nonce, isDev, isLocalHttp }: CspOptions): string {
  const directives: string[] = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    "img-src 'self' blob: data:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self' blob:",
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'none'",
  ];
  if (!isDev && !isLocalHttp) directives.push("upgrade-insecure-requests");
  return directives.join("; ");
}
