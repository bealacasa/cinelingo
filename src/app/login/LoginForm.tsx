"use client";

import { useActionState } from "react";
import { requestCode, verifyCode, type LoginState } from "./actions";

const inputClass =
  "mt-1 block min-h-12 w-full rounded-xl border border-border bg-surface px-4 text-text placeholder:text-muted";
const buttonClass =
  "mt-4 min-h-12 w-full rounded-xl bg-accent px-5 font-semibold text-accent-contrast disabled:opacity-60";

export function LoginForm({ next }: { next: string }) {
  const [emailState, sendCode, sending] = useActionState<LoginState, FormData>(requestCode, {
    step: "email",
  });
  const [codeState, checkCode, checking] = useActionState<LoginState, FormData>(verifyCode, {
    step: "email",
  });

  const email =
    codeState.step === "code"
      ? codeState.email
      : emailState.step === "code"
        ? emailState.email
        : null;

  if (!email) {
    return (
      <form action={sendCode} noValidate>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email webauthn"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={254}
          className={inputClass}
          aria-describedby={emailState.error ? "email-error" : undefined}
        />
        {emailState.error && (
          <p id="email-error" role="alert" className="mt-2 text-sm text-accent">
            {emailState.error}
          </p>
        )}
        <button type="submit" disabled={sending} className={buttonClass}>
          {sending ? "Enviando…" : "Recibir código"}
        </button>
      </form>
    );
  }

  const info =
    codeState.step === "code"
      ? codeState.info
      : emailState.step === "code"
        ? emailState.info
        : undefined;
  return (
    <form action={checkCode} noValidate>
      <p role="status" className="mb-4 rounded-xl bg-mark p-3 text-sm">
        {info ?? "Introduce el código que te hemos enviado."}
      </p>
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="next" value={next} />
      <label htmlFor="code" className="text-sm font-medium">
        Código de acceso
      </label>
      <input
        id="code"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={10}
        required
        className={`${inputClass} tracking-[0.4em]`}
        aria-describedby={codeState.error ? "code-error" : undefined}
      />
      {codeState.error && (
        <p id="code-error" role="alert" className="mt-2 text-sm text-accent">
          {codeState.error}
        </p>
      )}
      <button type="submit" disabled={checking} className={buttonClass}>
        {checking ? "Comprobando…" : "Entrar"}
      </button>
    </form>
  );
}
