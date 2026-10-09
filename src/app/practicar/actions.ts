"use server";

import { z } from "zod";
import { speakerLabel } from "@/lib/exercises/build";
import { formalityTips, gradeText } from "@/lib/exercises/grade";
import { getQuote } from "@/lib/quotes/queries";

/*
 * Corrección en el servidor. Solo lectura sobre datos públicos y cacheados: no se guarda
 * ni se registra nada de lo que escribe el usuario.
 */

const id = z.uuid();
const choice = z.string().min(1).max(500);
const typed = z.string().max(500);

export type ChoiceResult =
  { ok: true; correct: boolean; answer: string; detail?: string } | { ok: false };

export async function checkWhoSaidIt(quoteId: unknown, picked: unknown): Promise<ChoiceResult> {
  const q = id.safeParse(quoteId);
  const p = choice.safeParse(picked);
  if (!q.success || !p.success) return { ok: false };
  const quote = await getQuote(q.data);
  if (!quote) return { ok: false };
  const answer = speakerLabel(quote);
  return { ok: true, correct: p.data === answer, answer };
}

export async function checkMeaning(
  quoteId: unknown,
  expressionId: unknown,
  picked: unknown,
): Promise<ChoiceResult> {
  const q = id.safeParse(quoteId);
  const e = id.safeParse(expressionId);
  const p = choice.safeParse(picked);
  if (!q.success || !e.success || !p.success) return { ok: false };
  const expr = (await getQuote(q.data))?.expressions.find((x) => x.id === e.data);
  if (!expr) return { ok: false };
  return {
    ok: true,
    correct: p.data === expr.meaningEs,
    answer: expr.meaningEs,
    detail: expr.noteEs ?? expr.meaningEn,
  };
}

export type GapResult =
  { ok: true; correct: boolean; almost: boolean; answer: string; detail: string } | { ok: false };

export async function checkGapFill(
  quoteId: unknown,
  expressionId: unknown,
  written: unknown,
): Promise<GapResult> {
  const q = id.safeParse(quoteId);
  const e = id.safeParse(expressionId);
  const w = typed.safeParse(written);
  if (!q.success || !e.success || !w.success) return { ok: false };
  const quote = await getQuote(q.data);
  const expr = quote?.expressions.find((x) => x.id === e.data);
  if (!quote || !expr) return { ok: false };
  const answer = quote.text.slice(expr.start, expr.end);
  return { ok: true, ...gradeText(w.data, answer), answer, detail: expr.meaningEs };
}

export type RewriteResult =
  { ok: true; modelAnswer: string; tipsEs: string[]; feedbackEs: string[] } | { ok: false };

export async function revealRewrite(quoteId: unknown, attempt: unknown): Promise<RewriteResult> {
  const q = id.safeParse(quoteId);
  const a = typed.safeParse(attempt);
  if (!q.success || !a.success) return { ok: false };
  const rewrite = (await getQuote(q.data))?.rewrite;
  if (!rewrite) return { ok: false };
  const feedbackEs = rewrite.direction === "to_formal" ? formalityTips(a.data) : [];
  return { ok: true, modelAnswer: rewrite.modelAnswer, tipsEs: rewrite.tipsEs, feedbackEs };
}
