"use client";

import { useActionState } from "react";
import { deleteAccount } from "./actions";

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState(deleteAccount, {});
  return (
    <form action={action} className="rounded-xl border border-accent p-4">
      <p className="text-sm">
        Se borrarán tu cuenta y todos tus datos de forma permanente. No se puede deshacer.
      </p>
      <label htmlFor="confirm" className="mt-3 block text-sm font-medium">
        Escribe BORRAR para confirmar
      </label>
      <input
        id="confirm"
        name="confirm"
        autoComplete="off"
        autoCapitalize="characters"
        className="mt-1 block min-h-11 w-full rounded-lg border border-border bg-surface px-3"
      />
      {state.error && (
        <p role="alert" className="mt-2 text-sm text-accent">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 min-h-11 rounded-lg bg-accent px-4 font-medium text-accent-contrast disabled:opacity-60"
      >
        {pending ? "Borrando…" : "Borrar mi cuenta"}
      </button>
    </form>
  );
}
