"use client";

import { useState } from "react";
import { credentialToJSON, parseCreationOptions } from "@/lib/webauthn/encoding";
import { deletePasskey, finishPasskeyRegistration, startPasskeyRegistration } from "./actions";

type Passkey = { id: string; name: string; createdAt: string };

export function PasskeyManager({ passkeys }: { passkeys: Passkey[] }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function add() {
    setBusy(true);
    setMessage(null);
    try {
      const start = await startPasskeyRegistration();
      if (!start.ok) return setMessage(start.error);
      const credential = (await navigator.credentials.create({
        publicKey: parseCreationOptions(start.options as PublicKeyCredentialCreationOptionsJSON),
      })) as PublicKeyCredential | null;
      if (!credential) return setMessage("Operación cancelada.");
      const result = await finishPasskeyRegistration(
        start.challengeId,
        credentialToJSON(credential),
      );
      setMessage(result.ok ? "Passkey guardada." : result.error);
    } catch {
      setMessage("Operación cancelada o no disponible en este dispositivo.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    setBusy(true);
    const result = await deletePasskey(id);
    setMessage(result.ok ? "Passkey eliminada." : result.error);
    setBusy(false);
  }

  return (
    <div>
      {passkeys.length > 0 ? (
        <ul className="mb-3 divide-y divide-border rounded-xl border border-border bg-surface">
          {passkeys.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 p-3">
              <span>
                <span className="block font-medium">{p.name}</span>
                <span className="block text-xs text-muted">Creada el {p.createdAt}</span>
              </span>
              <button
                type="button"
                disabled={busy}
                onClick={() => remove(p.id)}
                className="min-h-11 rounded-lg px-3 text-sm text-accent"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-3 text-sm text-muted">
          Aún no tienes passkeys. Con una, entrarás con Face ID o tu huella.
        </p>
      )}
      <button
        type="button"
        onClick={add}
        disabled={busy}
        className="min-h-11 rounded-xl border border-border bg-surface px-4 font-medium disabled:opacity-60"
      >
        Añadir passkey
      </button>
      {message && (
        <p role="status" className="mt-2 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}
