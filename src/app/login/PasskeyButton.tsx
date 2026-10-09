"use client";

import { useState, useSyncExternalStore } from "react";
import { credentialToJSON, parseRequestOptions } from "@/lib/webauthn/encoding";
import { finishPasskeyLogin, startPasskeyLogin } from "./actions";

const noopSubscribe = () => () => {};

export function PasskeyButton({ next }: { next: string }) {
  // En el servidor no hay WebAuthn: el botón aparece solo tras hidratar en un navegador compatible.
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => "PublicKeyCredential" in window,
    () => false,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!supported) return null;

  async function signIn() {
    setBusy(true);
    setError(null);
    try {
      const start = await startPasskeyLogin();
      if (!start.ok) return setError(start.error);
      const credential = (await navigator.credentials.get({
        publicKey: parseRequestOptions(start.options as PublicKeyCredentialRequestOptionsJSON),
      })) as PublicKeyCredential | null;
      if (!credential) return setError("Operación cancelada.");
      const result = await finishPasskeyLogin(
        start.challengeId,
        credentialToJSON(credential),
        next,
      );
      if (!result.ok) return setError(result.error);
      window.location.assign(result.redirectTo);
    } catch {
      setError("Operación cancelada o no disponible en este dispositivo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={signIn}
        disabled={busy}
        className="min-h-12 w-full rounded-xl border border-border bg-surface px-5 font-semibold disabled:opacity-60"
      >
        {busy ? "Esperando a la passkey…" : "Entrar con passkey (Face ID / huella)"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
