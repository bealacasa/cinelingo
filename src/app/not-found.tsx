import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="font-serif text-3xl">Escena no encontrada</h1>
      <p className="mt-3 text-muted">La página que buscas no existe o ya no está disponible.</p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-medium text-accent-contrast"
      >
        Volver a la cita del día
      </Link>
    </div>
  );
}
