import { describe, expect, it } from "vitest";
import { demoQuotes } from "@/lib/quotes/demo";
import { buildPractice, pickGapExpression, speakerLabel } from "./build";
import { formalityTips, gradeText, letterPattern, levenshtein, normalizeAnswer } from "./grade";
import { hashString, seededShuffle } from "./random";

describe("seededShuffle", () => {
  it("es determinista y conserva los elementos", () => {
    const items = ["a", "b", "c", "d", "e"];
    expect(seededShuffle(items, "x")).toEqual(seededShuffle(items, "x"));
    expect([...seededShuffle(items, "x")].sort()).toEqual(items);
    expect(hashString("a")).not.toBe(hashString("b"));
  });
});

describe("corrección de huecos", () => {
  it("normaliza mayúsculas, apóstrofos curvos y puntuación", () => {
    expect(normalizeAnswer("  By ALL means! ")).toBe("by all means");
    expect(normalizeAnswer("can’t")).toBe("can't");
  });

  it("acepta la respuesta exacta y una errata pequeña (avisando)", () => {
    expect(gradeText("by all means", "By all means")).toEqual({ correct: true, almost: false });
    expect(gradeText("by all meens", "By all means")).toEqual({ correct: true, almost: true });
  });

  it("rechaza respuestas vacías o distintas", () => {
    expect(gradeText("", "dwell on").correct).toBe(false);
    expect(gradeText("think about", "dwell on").correct).toBe(false);
  });

  it("levenshtein", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
    expect(levenshtein("", "abc")).toBe(3);
  });

  it("la pista muestra solo la primera letra de cada palabra", () => {
    expect(letterPattern("By all means")).toBe("B_ a__ m____");
    expect(letterPattern("half-ass")).toBe("h___-___");
  });
});

describe("formalityTips", () => {
  it("detecta contracciones, coloquialismos y exclamaciones", () => {
    expect(formalityTips("I'm gonna do it!")).toHaveLength(3);
    expect(formalityTips("I intend to do so.")).toEqual([]);
  });
});

describe("buildPractice", () => {
  const all = demoQuotes();

  it("genera ejercicios para todas las citas sin filtrar la respuesta", () => {
    for (const quote of all) {
      const exercises = buildPractice(quote, all);
      expect(exercises.length, quote.text).toBeGreaterThanOrEqual(2);
      const json = JSON.stringify(exercises);
      // Ningún campo del navegador lleva la marca de la respuesta correcta.
      expect(json).not.toMatch(/correct|answer/i);
      for (const ex of exercises) {
        if (ex.kind === "who_said_it" || ex.kind === "meaning_mcq") {
          expect(new Set(ex.options).size, quote.text).toBe(ex.options.length);
          expect(ex.options.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it("'¿Quién lo dijo?' incluye la atribución correcta entre las opciones", () => {
    const quote = all[0]!;
    const who = buildPractice(quote, all).find((e) => e.kind === "who_said_it");
    expect(who?.kind === "who_said_it" && who.options).toContain(speakerLabel(quote));
  });

  it("el hueco reconstruye la cita original", () => {
    for (const quote of all) {
      const gap = buildPractice(quote, all).find((e) => e.kind === "gap_fill");
      const expr = pickGapExpression(quote);
      if (gap?.kind !== "gap_fill" || !expr) continue;
      expect(gap.before + quote.text.slice(expr.start, expr.end) + gap.after).toBe(quote.text);
    }
  });

  it("las citas con respuesta modelo tienen ejercicio de reformulación", () => {
    const withRewrite = all.filter((q) => q.rewrite);
    expect(withRewrite.length).toBeGreaterThanOrEqual(15);
    for (const q of withRewrite) {
      expect(buildPractice(q, all).some((e) => e.kind === "register_rewrite")).toBe(true);
    }
  });
});
