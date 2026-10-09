import type { QuoteView } from "./schema";

type Expression = QuoteView["expressions"][number];

export const EXPRESSION_TYPE_LABEL: Record<Expression["type"], string> = {
  phrasal_verb: "Phrasal verb",
  idiom: "Idiom",
  collocation: "Colocación",
  slang: "Slang",
  discourse_marker: "Marcador del discurso",
  grammar: "Gramática",
  other: "Vocabulario",
};

/** Color por tipo de expresión (contraste AA en claro y oscuro). */
export const EXPRESSION_TYPE_STYLE: Record<Expression["type"], string> = {
  phrasal_verb: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
  idiom: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  collocation: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200",
  slang: "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
  discourse_marker: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  grammar: "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-200",
  other: "bg-stone-200 text-stone-900 dark:bg-stone-800 dark:text-stone-200",
};

/** Barra lateral de la tarjeta, del mismo color que el tipo. */
export const EXPRESSION_TYPE_BAR: Record<Expression["type"], string> = {
  phrasal_verb: "bg-violet-500",
  idiom: "bg-amber-500",
  collocation: "bg-sky-500",
  slang: "bg-rose-500",
  discourse_marker: "bg-emerald-500",
  grammar: "bg-indigo-500",
  other: "bg-stone-400",
};

/** Posición en la escala de registro (1 = slang … 4 = formal) para el indicador visual. */
export const REGISTER_LEVEL: Record<Expression["register"], number> = {
  slang: 1,
  informal: 2,
  neutral: 3,
  formal: 4,
};

export const REGISTER_LABEL: Record<Expression["register"], string> = {
  formal: "Formal",
  neutral: "Neutro",
  informal: "Informal",
  slang: "Slang",
};

export const VARIETY_SHORT: Record<QuoteView["variety"], string> = {
  us: "EE. UU.",
  uk: "Reino Unido",
  au: "Australia",
  ie: "Irlanda",
  ca: "Canadá",
  other: "Otra",
};

export const VARIETY_LABEL: Record<QuoteView["variety"], string> = {
  us: "Inglés americano",
  uk: "Inglés británico",
  au: "Inglés australiano",
  ie: "Inglés irlandés",
  ca: "Inglés canadiense",
  other: "Otra variedad",
};

/** "The Wire (2002) · T1 E8" */
export function sourceLabel(q: Pick<QuoteView, "work" | "season" | "episode">): string {
  const parts = [`${q.work.title} (${q.work.year})`];
  if (q.season) parts.push(q.episode ? `T${q.season} E${q.episode}` : `Temporada ${q.season}`);
  return parts.join(" · ");
}

/**
 * Saga u obra a la que pertenece un título, para agrupar en los filtros:
 * "Harry Potter and the Chamber of Secrets" → "Harry Potter", "The Godfather Part II" → "The Godfather".
 */
export function franchiseOf(title: string): string {
  return title.split(/:| and the | Part /)[0]?.trim() || title;
}

/** Slug estable para URLs: "Harry Potter" → "harry-potter". */
export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
