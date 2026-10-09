import type { NextConfig } from "next";
import { API_CSP, STATIC_SECURITY_HEADERS, permissionsPolicyFor } from "./src/lib/security/headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // El botón flotante de desarrollo tapa la barra de pestañas en el móvil.
  devIndicators: false,
  // Solo en `npm run dev`: IPs de la red local desde las que probar en el móvil
  // (p. ej. DEV_ORIGINS=192.168.1.143). Next las bloquea por defecto.
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(",").filter(Boolean) ?? [],
  async headers() {
    return [
      { source: "/:path*", headers: [...STATIC_SECURITY_HEADERS] },
      {
        source: "/api/:path*",
        headers: [
          { key: "Content-Security-Policy", value: API_CSP },
          { key: "Permissions-Policy", value: permissionsPolicyFor("/api") },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
