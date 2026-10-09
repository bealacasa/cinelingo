export const APP_TIME_ZONE = "Europe/Madrid";

/** Fecha "YYYY-MM-DD" en la zona horaria indicada (el día cambia a medianoche de Madrid). */
export function dayInTimeZone(date: Date, timeZone: string = APP_TIME_ZONE): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/**
 * Elige de forma determinista la cita de un día cuando no hay ninguna programada:
 * todos los usuarios ven la misma y va rotando por la lista ordenada.
 */
export function pickDailyId(ids: readonly string[], day: string): string | null {
  if (ids.length === 0) return null;
  const dayNumber = Math.floor(Date.parse(`${day}T00:00:00Z`) / 86_400_000);
  if (!Number.isFinite(dayNumber)) return null;
  const index = ((dayNumber % ids.length) + ids.length) % ids.length;
  return ids[index] ?? null;
}
