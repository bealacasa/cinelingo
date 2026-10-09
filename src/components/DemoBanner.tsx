import { isDemoMode } from "@/lib/quotes/demo";

export function DemoBanner() {
  if (!isDemoMode()) return null;
  return (
    <p role="note" className="mb-4 flex items-center gap-2 text-xs text-muted">
      <span className="size-2 rounded-full bg-amber-500" aria-hidden="true" />
      Vista previa: citas de ejemplo (sin base de datos conectada).
    </p>
  );
}
