const PRIVATE_IPV4 = /^(10\.\d+|192\.168|172\.(1[6-9]|2\d|3[01]))\.\d+\.\d+$/;

/**
 * ¿Petición por http a localhost o a una IP privada de la red local (probar en el móvil)?
 * En ese caso no enviamos HSTS ni upgrade-insecure-requests, que romperían la carga.
 * En producción (Vercel) todo llega por https, así que nunca aplica.
 */
export function isLocalHttp(protocol: string, hostname: string): boolean {
  if (protocol !== "http:") return false;
  return hostname === "localhost" || hostname === "127.0.0.1" || PRIVATE_IPV4.test(hostname);
}
