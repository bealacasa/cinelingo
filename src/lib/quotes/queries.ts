import "server-only";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { createPublicClient } from "@/lib/supabase/public";
import { dayInTimeZone, pickDailyId } from "./daily";
import { demoQuotes, isDemoMode } from "./demo";
import type { QuoteView } from "./schema";

const REVALIDATE_SECONDS = 3600;
export const QUOTES_CACHE_TAG = "quotes";

const uuid = z.uuid();

const QUOTE_SELECT = `
  id, text, character_name, season, episode, scene_context_es, translation_es,
  cultural_note_es, level, variety,
  works ( title, type, year ),
  quote_expressions ( start_offset, end_offset, expressions ( id, phrase, type, register, meaning_en, meaning_es, note_es ) ),
  quote_tags ( tags ( slug, name_es ) )
`;

type QuoteRow = {
  id: string;
  text: string;
  character_name: string;
  season: number | null;
  episode: number | null;
  scene_context_es: string;
  translation_es: string;
  cultural_note_es: string | null;
  level: QuoteView["level"];
  variety: QuoteView["variety"];
  works: { title: string; type: QuoteView["work"]["type"]; year: number } | null;
  quote_expressions: {
    start_offset: number;
    end_offset: number;
    expressions: {
      id: string;
      phrase: string;
      type: QuoteView["expressions"][number]["type"];
      register: QuoteView["expressions"][number]["register"];
      meaning_en: string;
      meaning_es: string;
      note_es: string | null;
    } | null;
  }[];
  quote_tags: { tags: { slug: string; name_es: string } | null }[];
};

function toView(row: QuoteRow): QuoteView | null {
  if (!row.works) return null;
  return {
    id: row.id,
    text: row.text,
    character: row.character_name,
    season: row.season,
    episode: row.episode,
    sceneContextEs: row.scene_context_es,
    translationEs: row.translation_es,
    culturalNoteEs: row.cultural_note_es,
    level: row.level,
    variety: row.variety,
    work: row.works,
    tags: row.quote_tags.flatMap((t) =>
      t.tags ? [{ slug: t.tags.slug, nameEs: t.tags.name_es }] : [],
    ),
    expressions: row.quote_expressions
      .flatMap((qe) =>
        qe.expressions
          ? [
              {
                id: qe.expressions.id,
                phrase: qe.expressions.phrase,
                type: qe.expressions.type,
                register: qe.expressions.register,
                meaningEn: qe.expressions.meaning_en,
                meaningEs: qe.expressions.meaning_es,
                noteEs: qe.expressions.note_es,
                start: qe.start_offset,
                end: qe.end_offset,
              },
            ]
          : [],
      )
      .sort((a, b) => a.start - b.start),
  };
}

const fetchQuote = unstable_cache(
  async (id: string): Promise<QuoteView | null> => {
    const { data, error } = await createPublicClient()
      .from("quotes")
      .select(QUOTE_SELECT)
      .eq("id", id)
      .eq("status", "published")
      .maybeSingle()
      .overrideTypes<QuoteRow, { merge: false }>();
    if (error) {
      logger.error("quotes.fetch_failed", { code: error.code });
      throw new Error("quotes.fetch_failed");
    }
    return data ? toView(data) : null;
  },
  ["quote-by-id"],
  { revalidate: REVALIDATE_SECONDS, tags: [QUOTES_CACHE_TAG] },
);

const fetchDailyQuoteId = unstable_cache(
  async (day: string): Promise<string | null> => {
    const supabase = createPublicClient();
    const scheduled = await supabase
      .from("daily_quotes")
      .select("quote_id")
      .eq("day", day)
      .maybeSingle();
    if (scheduled.data) return scheduled.data.quote_id;

    const { data, error } = await supabase
      .from("quotes")
      .select("id")
      .eq("status", "published")
      .order("created_at")
      .order("id");
    if (error) {
      logger.error("quotes.list_failed", { code: error.code });
      throw new Error("quotes.list_failed");
    }
    return pickDailyId(
      data.map((q) => q.id),
      day,
    );
  },
  ["daily-quote-id"],
  { revalidate: REVALIDATE_SECONDS, tags: [QUOTES_CACHE_TAG] },
);

/** Cita publicada por id, o null si no existe / no es un UUID válido. */
export async function getQuote(id: string): Promise<QuoteView | null> {
  if (!uuid.safeParse(id).success) return null;
  if (isDemoMode()) return demoQuotes().find((q) => q.id === id) ?? null;
  return fetchQuote(id);
}

/** Cita del día (programada o rotación determinista), según la fecha de Madrid. */
export async function getDailyQuote(now = new Date()): Promise<QuoteView | null> {
  const day = dayInTimeZone(now);
  if (isDemoMode()) {
    const quotes = demoQuotes();
    const id = pickDailyId(
      quotes.map((q) => q.id),
      day,
    );
    return quotes.find((q) => q.id === id) ?? null;
  }
  const id = await fetchDailyQuoteId(day);
  return id ? fetchQuote(id) : null;
}

const fetchAllQuotes = unstable_cache(
  async (): Promise<QuoteView[]> => {
    const { data, error } = await createPublicClient()
      .from("quotes")
      .select(QUOTE_SELECT)
      .eq("status", "published")
      .order("created_at")
      .order("id")
      .limit(500)
      .overrideTypes<QuoteRow[], { merge: false }>();
    if (error) {
      logger.error("quotes.all_failed", { code: error.code });
      throw new Error("quotes.all_failed");
    }
    return data.flatMap((row) => toView(row) ?? []);
  },
  ["all-quotes"],
  { revalidate: REVALIDATE_SECONDS, tags: [QUOTES_CACHE_TAG] },
);

/** Todas las citas publicadas (catálogo pequeño; paginar cuando supere unos cientos). */
export async function getAllQuotes(): Promise<QuoteView[]> {
  return isDemoMode() ? demoQuotes() : fetchAllQuotes();
}

/** Otras citas para seguir explorando, que cambian cada día. */
export async function getMoreQuotes(excludeId: string, limit = 3): Promise<QuoteView[]> {
  const others = (await getAllQuotes()).filter((q) => q.id !== excludeId);
  if (others.length <= limit) return others;
  const offset = Math.floor(Date.now() / 86_400_000) % others.length;
  return [...others.slice(offset), ...others.slice(0, offset)].slice(0, limit);
}
