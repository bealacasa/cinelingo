"use client";

/** Mensaje genérico: nunca mostramos detalles internos. El digest permite cruzarlo con los logs. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center" role="alert">
      <h1 className="font-serif text-3xl">Algo ha fallado</h1>
      <p className="mt-3 text-muted">Inténtalo de nuevo en unos segundos.</p>
      {error.digest && <p className="mt-2 text-xs text-muted">Referencia: {error.digest}</p>}
      <button
        type="button"
        onClick={reset}
        className="mt-6 min-h-11 rounded-lg bg-accent px-5 font-medium text-accent-contrast"
      >
        Reintentar
      </button>
    </div>
  );
}
