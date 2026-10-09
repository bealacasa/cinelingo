import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { DeleteAccountForm } from "./DeleteAccountForm";
import { PasskeyManager } from "./PasskeyManager";

export const metadata: Metadata = { title: "Ajustes", robots: { index: false } };

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeZone: "Europe/Madrid",
});

export default async function SettingsPage() {
  const user = await requireUser("/ajustes");
  const supabase = await createClient();
  const { data: passkeys } = await supabase.auth.passkey.list();

  return (
    <div className="space-y-10">
      <h1 className="font-serif text-3xl">Ajustes</h1>

      <section aria-labelledby="cuenta">
        <h2 id="cuenta" className="text-xs font-semibold uppercase tracking-wider text-muted">
          Cuenta
        </h2>
        <p className="mt-2">{user.email}</p>
        <form action={signOut} className="mt-3">
          <button
            type="submit"
            className="min-h-11 rounded-xl border border-border bg-surface px-4 font-medium"
          >
            Cerrar sesión
          </button>
        </form>
      </section>

      <section aria-labelledby="passkeys">
        <h2
          id="passkeys"
          className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted"
        >
          Passkeys
        </h2>
        <PasskeyManager
          passkeys={(passkeys ?? []).map((p) => ({
            id: p.id,
            name: p.friendly_name ?? "Passkey",
            createdAt: dateFormat.format(new Date(p.created_at)),
          }))}
        />
      </section>

      <section aria-labelledby="datos">
        <h2 id="datos" className="text-xs font-semibold uppercase tracking-wider text-muted">
          Tus datos (RGPD)
        </h2>
        <p className="mt-2 text-sm text-muted">
          Descarga una copia de todo lo que guardamos sobre ti.
        </p>
        {/* Enlace de descarga normal (no <Link>) para que el navegador guarde el fichero. */}
        <a
          href="/api/cuenta/exportar"
          download
          className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-border bg-surface px-4 font-medium"
        >
          Exportar mis datos (JSON)
        </a>
        <div className="mt-6">
          <DeleteAccountForm />
        </div>
      </section>
    </div>
  );
}
