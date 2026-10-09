import "server-only";
import { seedQuotes, seedTags, seedUuid } from "../../../supabase/seed-data/index.ts";
import { seedQuoteSchema, type QuoteView } from "./schema";

/**
 * MODO DEMO: sin Supabase configurado, lee las citas del seed para poder ver la interfaz
 * antes de crear el proyecto. Se activa en desarrollo, o en un build de producción solo
 * con CINELINGO_DEMO=1 (tests e2e). Si existe SUPABASE_URL nunca se activa.
 */
export function isDemoMode(): boolean {
  if (process.env.SUPABASE_URL) return false;
  return process.env.NODE_ENV !== "production" || process.env.CINELINGO_DEMO === "1";
}

let cache: QuoteView[] | undefined;

export function demoQuotes(): QuoteView[] {
  cache ??= seedQuotes.map((raw) => {
    const q = seedQuoteSchema.parse(raw);
    return {
      id: seedUuid("quote", q.slug),
      text: q.text,
      character: q.character,
      season: q.season ?? null,
      episode: q.episode ?? null,
      sceneContextEs: q.sceneContextEs,
      translationEs: q.translationEs,
      culturalNoteEs: q.culturalNoteEs ?? null,
      level: q.level,
      variety: q.variety,
      work: q.work,
      tags: q.tags.map((slug) => ({ slug, nameEs: seedTags[slug] ?? slug })),
      rewrite: q.rewrite ?? null,
      expressions: q.expressions.map((e) => {
        const start = q.text.indexOf(e.surface);
        return {
          id: seedUuid("expression", e.phrase),
          phrase: e.phrase,
          type: e.type,
          register: e.register,
          meaningEn: e.meaningEn,
          meaningEs: e.meaningEs,
          noteEs: e.noteEs ?? null,
          start,
          end: start + e.surface.length,
        };
      }),
    };
  });
  return cache;
}
