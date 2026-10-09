# CineLingo

Aplicación web (PWA) para consolidar un nivel **C1 de inglés** a partir de citas breves de películas y series:
expresiones, matices, registro, pronunciación y repetición espaciada. Interfaz en español.

## Puesta en marcha

Requisitos: Node.js 24 (`.nvmrc`).

```bash
npm ci
npm run dev
```

Sin variables de Supabase la app arranca en **modo demo** (solo en desarrollo): muestra las citas del seed y
el inicio de sesión queda desactivado.

### Conectar Supabase

1. Crea un proyecto en Supabase (región **Frankfurt / eu-central-1**).
2. Copia `.env.example` a `.env.local` y rellena las claves (Project Settings → API Keys).
3. Enlaza y aplica migraciones y seed:
   ```bash
   npx supabase login
   npx supabase link --project-ref <ref>
   npx supabase db push --include-seed
   ```
4. En Authentication → URL Configuration, pon tu `SITE_URL` y añade `<SITE_URL>/auth/confirm` a las redirecciones.
5. En Authentication → Email Templates (Magic Link), pega `supabase/templates/magic_link.html`.
6. Activa Passkeys en Authentication → Providers e indica tu dominio como Relying Party.
7. Configura un SMTP propio (p. ej. Resend): el de Supabase está muy limitado.
8. Para hacerte admin: `update public.profiles set role = 'admin' where id = '<tu user id>';` desde el SQL editor.

## Scripts

| Comando                                  | Qué hace                                    |
| ---------------------------------------- | ------------------------------------------- |
| `npm run verify`                         | Lint + typecheck + tests unitarios          |
| `npm run build` / `npm run bundle:check` | Build y presupuesto de JS inicial           |
| `npm run test:e2e`                       | Playwright con perfiles iPhone 15 y Pixel 7 |
| `npm run db:seed:generate`               | Regenera `supabase/seed.sql`                |

## Contenido

Las citas son breves (una o dos frases), están atribuidas y llevan comentario educativo, al amparo del derecho de
cita con fines docentes. No se incluyen imágenes, audio ni logos de las obras.
