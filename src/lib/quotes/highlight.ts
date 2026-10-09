export type Range = { start: number; end: number; id: string };
export type Segment = { text: string; id: string | null };

/**
 * Divide el texto en tramos normales y resaltados a partir de offsets.
 * Ignora rangos inválidos o solapados (el primero gana) para no romper el render
 * si un admin guarda offsets erróneos. Devuelve texto plano: React lo escapa.
 */
export function segmentText(text: string, ranges: Range[]): Segment[] {
  const valid = ranges
    .filter((r) => Number.isInteger(r.start) && Number.isInteger(r.end))
    .filter((r) => r.start >= 0 && r.end > r.start && r.end <= text.length)
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const segments: Segment[] = [];
  let cursor = 0;
  for (const range of valid) {
    if (range.start < cursor) continue;
    if (range.start > cursor) segments.push({ text: text.slice(cursor, range.start), id: null });
    segments.push({ text: text.slice(range.start, range.end), id: range.id });
    cursor = range.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), id: null });
  return segments;
}
