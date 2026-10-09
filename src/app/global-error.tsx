"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <main>
          <h1>Algo ha fallado</h1>
          <p>Inténtalo de nuevo en unos segundos.</p>
          <button type="button" onClick={reset}>
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
