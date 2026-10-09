import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, createNonce } from "@/lib/security/csp";
import { HSTS_VALUE, permissionsPolicyFor } from "@/lib/security/headers";
import { isLocalHttp as isLocalHttpUrl } from "@/lib/security/local-http";
import { AUTH_COOKIE_OPTIONS, hasAuthCookie } from "@/lib/supabase/cookies";

/** Rutas que exigen sesión (comprobación optimista; cada página vuelve a verificar). */
const PROTECTED_PREFIXES = ["/ajustes", "/progreso", "/admin"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function isLocalHttp(request: NextRequest) {
  // Protocolo y host reales de la petición. En Vercel x-forwarded-proto es siempre https.
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto ? `${forwardedProto}:` : request.nextUrl.protocol;
  const host = (request.headers.get("host") ?? request.nextUrl.host).replace(/:\d+$/, "");
  return isLocalHttpUrl(protocol, host);
}

function withHsts(response: NextResponse, request: NextRequest) {
  if (!isLocalHttp(request)) response.headers.set("Strict-Transport-Security", HSTS_VALUE);
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API: sus cabeceras (CSP restrictiva, no-store) vienen de next.config.ts; aquí solo HSTS.
  if (pathname.startsWith("/api/")) return withHsts(NextResponse.next(), request);

  const nonce = createNonce();
  const csp = buildCsp({
    nonce,
    isDev: process.env.NODE_ENV === "development",
    isLocalHttp: isLocalHttp(request),
  });

  // Next.js lee el nonce de la cabecera CSP de la petición y lo aplica a sus scripts.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  let response = NextResponse.next({ request: { headers: requestHeaders } });
  let signedIn = false;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  // Solo hablamos con Supabase si hay cookie de sesión: los visitantes anónimos no pagan latencia.
  if (supabaseUrl && supabaseKey && hasAuthCookie(request.cookies.getAll().map((c) => c.name))) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookieOptions: AUTH_COOKIE_OPTIONS,
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request: { headers: requestHeaders } });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, { ...options, ...AUTH_COOKIE_OPTIONS, name });
          }
        },
      },
    });
    // getClaims verifica la firma del JWT y refresca la sesión si ha caducado.
    const { data } = await supabase.auth.getClaims();
    signedIn = Boolean(data?.claims?.sub);
  }

  if (!signedIn && isProtected(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return withHsts(NextResponse.redirect(loginUrl), request);
  }

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("Permissions-Policy", permissionsPolicyFor(pathname));
  if (signedIn || isProtected(pathname)) {
    // Contenido personal: nunca en cachés compartidas.
    response.headers.set("Cache-Control", "private, no-store");
  }
  return withHsts(response, request);
}

export const config = {
  matcher: [
    {
      // Todo salvo estáticos e iconos.
      source:
        "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|manifest.webmanifest|sw.js).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
