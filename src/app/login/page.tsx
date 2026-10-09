import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/env";
import { safeNextPath } from "@/lib/security/redirect";
import { LoginForm } from "./LoginForm";
import { PasskeyButton } from "./PasskeyButton";

export const metadata: Metadata = { title: "Entrar", robots: { index: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const next = safeNextPath((await searchParams).next);
  if (await getCurrentUser()) redirect(next);

  return (
    <div className="mx-auto max-w-sm py-6">
      <h1 className="font-serif text-3xl">Entra en CineLingo</h1>
      <p className="mt-2 text-muted">
        Sin contraseñas: te enviamos un código de un solo uso o usa tu passkey.
      </p>

      {hasSupabaseEnv() ? (
        <div className="mt-8 space-y-6">
          <PasskeyButton next={next} />
          <div className="flex items-center gap-3 text-xs text-muted" aria-hidden="true">
            <span className="h-px flex-1 bg-border" /> o con tu email{" "}
            <span className="h-px flex-1 bg-border" />
          </div>
          <LoginForm next={next} />
        </div>
      ) : (
        <p role="note" className="mt-8 rounded-xl border border-dashed border-accent p-4 text-sm">
          El inicio de sesión se activará cuando conectemos Supabase. Mientras tanto puedes explorar
          las citas.
        </p>
      )}

      <p className="mt-8 text-xs text-muted">
        Al continuar aceptas nuestra{" "}
        <Link href="/privacidad" className="underline">
          política de privacidad
        </Link>
        . Solo usamos cookies técnicas para mantener tu sesión.
      </p>
    </div>
  );
}
