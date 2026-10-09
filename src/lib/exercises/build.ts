import { franchiseOf } from "@/lib/quotes/labels";
import type { QuoteView } from "@/lib/quotes/schema";
import { letterPattern } from "./grade";
import { seededShuffle } from "./random";

type Expression = QuoteView["expressions"][number];

/*
 * Ejercicios en versión "pública": lo que se envía al navegador. Nunca incluyen la
 * respuesta correcta marcada; la corrección se hace en el servidor (app/practicar/actions.ts).
 */
export type WhoSaidItExercise = { kind: "who_said_it"; text: string; options: string[] };
export type MeaningExercise = {
  kind: "meaning_mcq";
  expressionId: string;
  phrase: string;
  options: string[];
};
export type GapFillExercise = {
  kind: "gap_fill";
  expressionId: string;
  before: string;
  after: string;
  pattern: string;
  hintEs: string;
};
export type RewriteExercise = {
  kind: "register_rewrite";
  direction: "to_formal" | "to_informal";
  text: string;
};
export type Exercise = WhoSaidItExercise | MeaningExercise | GapFillExercise | RewriteExercise;

/** Etiqueta de atribución para "¿Quién lo dijo?". */
export function speakerLabel(q: Pick<QuoteView, "character" | "work">): string {
  return `${q.character} — ${q.work.title}`;
}

const wordCount = (text: string) => text.trim().split(/\s+/).length;

/** Expresión para el hueco: corta (≤ 4 palabras), preferiblemente no gramatical. */
export function pickGapExpression(quote: QuoteView): Expression | null {
  const candidates = quote.expressions.filter((e) => {
    const surface = quote.text.slice(e.start, e.end);
    return e.end > e.start && wordCount(surface) <= 4 && surface.length < quote.text.length;
  });
  return candidates.find((e) => e.type !== "grammar") ?? candidates[0] ?? null;
}

/** Expresión para el significado: distinta del hueco si se puede, para cubrir más vocabulario. */
export function pickMeaningExpression(quote: QuoteView, gap: Expression | null): Expression | null {
  const others = quote.expressions.filter((e) => e.id !== gap?.id);
  return others.find((e) => e.type !== "grammar") ?? others[0] ?? gap ?? null;
}

function whoSaidIt(quote: QuoteView, all: QuoteView[]): WhoSaidItExercise | null {
  const correct = speakerLabel(quote);
  const franchise = franchiseOf(quote.work.title);
  const others = all.filter((q) => q.id !== quote.id && q.character !== quote.character);
  // Distractores más difíciles primero: misma saga, luego mismo tipo de obra, luego el resto.
  const ranked = [
    ...seededShuffle(
      others.filter((q) => franchiseOf(q.work.title) === franchise),
      `${quote.id}:same`,
    ),
    ...seededShuffle(
      others.filter(
        (q) => franchiseOf(q.work.title) !== franchise && q.work.type === quote.work.type,
      ),
      `${quote.id}:type`,
    ),
    ...seededShuffle(
      others.filter((q) => q.work.type !== quote.work.type),
      `${quote.id}:rest`,
    ),
  ];
  const distractors = [...new Set(ranked.map(speakerLabel))]
    .filter((l) => l !== correct)
    .slice(0, 3);
  if (distractors.length === 0) return null;
  return {
    kind: "who_said_it",
    text: quote.text,
    options: seededShuffle([correct, ...distractors], `${quote.id}:who`),
  };
}

function meaning(quote: QuoteView, expr: Expression, all: QuoteView[]): MeaningExercise | null {
  const pool = new Map<string, Expression>();
  for (const q of all)
    for (const e of q.expressions) if (e.meaningEs !== expr.meaningEs) pool.set(e.meaningEs, e);
  const candidates = [...pool.values()];
  const ranked = [
    ...seededShuffle(
      candidates.filter((e) => e.type === expr.type),
      `${expr.id}:same`,
    ),
    ...seededShuffle(
      candidates.filter((e) => e.type !== expr.type),
      `${expr.id}:other`,
    ),
  ];
  const distractors = ranked.slice(0, 3).map((e) => e.meaningEs);
  if (distractors.length === 0) return null;
  return {
    kind: "meaning_mcq",
    expressionId: expr.id,
    phrase: expr.phrase,
    options: seededShuffle([expr.meaningEs, ...distractors], `${quote.id}:${expr.id}:meaning`),
  };
}

function gapFill(quote: QuoteView, expr: Expression): GapFillExercise {
  return {
    kind: "gap_fill",
    expressionId: expr.id,
    before: quote.text.slice(0, expr.start),
    after: quote.text.slice(expr.end),
    pattern: letterPattern(quote.text.slice(expr.start, expr.end)),
    hintEs: expr.meaningEs,
  };
}

/** Sesión de práctica de una cita: ¿Quién lo dijo? → significado → hueco → reformulación. */
export function buildPractice(quote: QuoteView, all: QuoteView[]): Exercise[] {
  const gap = pickGapExpression(quote);
  const meaningExpr = pickMeaningExpression(quote, gap);
  const exercises: (Exercise | null)[] = [
    whoSaidIt(quote, all),
    meaningExpr ? meaning(quote, meaningExpr, all) : null,
    gap ? gapFill(quote, gap) : null,
    quote.rewrite
      ? { kind: "register_rewrite", direction: quote.rewrite.direction, text: quote.text }
      : null,
  ];
  return exercises.filter((e): e is Exercise => e !== null);
}
