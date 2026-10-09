@AGENTS.md

# CineLingo

PWA mobile-first para que hispanohablantes consoliden un inglés C1 con citas breves de cine y series.
Interfaz en español; contenido de aprendizaje en inglés. Preparada para B2/C2 (`cefr_level`).

## Comandos

```bash
npm run dev               # desarrollo (sin Supabase → modo demo con las citas del seed)
npm run verify            # lint + typecheck + tests unitarios
npm run build && npm run bundle:check   # build + presupuesto de JS (160 kB gzip por ruta)
npm run test:e2e          # Playwright (iPhone 15 / Pixel 7) contra el build de producción
npm run db:seed:generate  # regenera supabase/seed.sql desde supabase/seed-data/*.ts
npm run db:push           # aplica migraciones al proyecto Supabase enlazado
npm run db:types          # regenera src/lib/supabase/database.types.ts
```

Antes de `npm run typecheck` en limpio, ejecuta `npx next typegen` (tipos `PageProps`/`LayoutProps`).

## Stack y arquitectura

- Next.js 16 (App Router) + TypeScript estricto (`noUncheckedIndexedAccess`) + Tailwind v4.
- **En Next 16, el middleware se llama `src/proxy.ts`.** Lee `node_modules/next/dist/docs/` antes de usar APIs de Next.
- Supabase (Postgres + RLS + Auth) **solo desde el servidor**: no hay cliente de navegador ni variables `NEXT_PUBLIC_`.
  - `lib/supabase/server.ts`: sesión del usuario (RLS). `public.ts`: anónimo sin cookies (único válido en `unstable_cache`).
  - `admin.ts`: clave secreta, **se salta RLS**; solo tras verificar identidad y para lo que el usuario no puede hacer.
- Sin ORM: `supabase-js` (consultas parametrizadas). Migraciones SQL en `supabase/migrations/`.
- Mutaciones con Server Actions + Zod. Route Handlers solo para descargas/API.
- Server Components por defecto; `"use client"` solo para interacción (formularios, WebAuthn).

## Reglas de seguridad (obligatorias)

- CSP con nonce por petición (`proxy.ts`). **Todas las páginas son dinámicas** (`await connection()` en el layout raíz):
  una página estática no lleva nonce y su JS quedaría bloqueado. Hay un e2e que lo comprueba.
- Prohibido: `unsafe-inline`/`unsafe-eval` en producción, `dangerouslySetInnerHTML`, atributos `style` en HTML de páginas
  (la CSP los bloquea; usa clases). Excepción: `apple-icon.tsx` (se renderiza a PNG en el servidor).
- Toda entrada (formularios, params, searchParams, JSON) se valida con Zod. Ids de ruta: `z.uuid()`.
- Redirecciones tras login: siempre `safeNextPath()`.
- Rate limiting (`checkRateLimit`) en login, verificación, passkeys, acciones de cuenta, IA y API pública. Falla en cerrado.
- RLS en todas las tablas, con `grant` explícitos. Admin: `requireAdmin()` en servidor **y** `is_admin()` en RLS.
- Mensajes de error genéricos al usuario; logs con `logger` (redacta emails, tokens, IP). Nunca loguear cuerpos de petición.
- Secretos solo en variables de entorno (`.env.local`, Vercel). `.env.example` documenta las variables.
- Cookies de sesión: HttpOnly, Secure, SameSite=Lax, `__Host-` en producción (`lib/supabase/cookies.ts`).
- Micrófono: `Permissions-Policy` solo lo permite en `/practicar/shadowing`. Enlaza esa ruta con `<a>` (navegación completa), no con `<Link>`.
- Dependencias: versiones exactas (`.npmrc save-exact`), mínimas, con al menos 14 días de antigüedad salvo parches de seguridad.

## Contenido y derechos de autor

- Las citas viven en la BD. `supabase/seed-data/` es solo el origen del seed (y del modo demo en desarrollo).
- Citas de una o dos frases, siempre atribuidas (obra, año, personaje, T/E) y con comentario educativo.
- Nada de transcripciones largas, subtítulos, pósters, fotogramas, audio original ni logos. Sin scraping.
- Las expresiones se resaltan por offsets (`quote_expressions`), nunca con HTML.
- Escribe el seed en lotes pequeños (≤ 6 citas por fichero).

## Accesibilidad e iOS

WCAG 2.2 AA: objetivos táctiles ≥ 44px (`min-h-11`), inputs ≥ 16px, foco visible, `lang="en"` en el texto en inglés,
`prefers-reduced-motion`, safe areas con `env(safe-area-inset-*)`. Paleta en `globals.css` (tokens claro/oscuro).

## Cierre de cada fase

1. `npm run verify`, build, `bundle:check` y `test:e2e` en verde.
2. Revisión de seguridad del código nuevo: riesgos encontrados y mitigaciones.
3. Resumen breve y cómo probarlo en iPhone.
