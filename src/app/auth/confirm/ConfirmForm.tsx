"use client";

import Link from "next/link";
import { useActionState } from "react";
import { confirmLink } from "./actions";

export function ConfirmForm({ tokenHash, type }: { tokenHash: string; type: string }) {
  const [state, action, pending] = useActionState(confirmLink, {});
  return (
    <form action={action} className="mt-8">
      <input type="hidden" name="token_hash" value={tokenHash} />
      <input type="hidden" name="type" value={type} />
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full rounded-xl bg-accent px-5 font-semibold text-accent-contrast disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Confirmar y entrar"}
      </button>
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-accent">
          {state.error}{" "}
          <Link href="/login" className="underline">
            Volver a entrar
          </Link>
        </p>
      )}
    </form>
  );
}
