import type { Metadata } from "next";
import Link from "next/link";
import { otpTypeSchema, tokenHashSchema } from "@/lib/validation/auth";
import { ConfirmForm } from "./ConfirmForm";

export const metadata: Metadata = { title: "Confirmar acceso", robots: { index: false } };

/**
 * El enlace del email NO inicia sesión con un GET: muestra un botón que hace POST.
 * Así los escáneres de correo no consumen el token y se evita el login-CSRF.
 */
export default async function ConfirmPage({ searchParams }: PageProps<"/auth/confirm">) {
  const params = await searchParams;
  const tokenHash = tokenHashSchema.safeParse(params.token_hash);
  const type = otpTypeSchema.safeParse(params.type);

  return (
    <div className="mx-auto max-w-sm py-6">
      <h1 className="font-serif text-3xl">Confirmar acceso</h1>
      {tokenHash.success && type.success ? (
        <>
          <p className="mt-2 text-muted">Pulsa el botón para terminar de entrar en CineLingo.</p>
          <ConfirmForm tokenHash={tokenHash.data} type={type.data} />
        </>
      ) : (
        <p className="mt-4">
          Este enlace no es válido.{" "}
          <Link href="/login" className="text-accent underline">
            Pide uno nuevo
          </Link>
          .
        </p>
      )}
    </div>
  );
}
