import { describe, expect, it } from "vitest";
import { seedQuoteSchema } from "../../src/lib/quotes/schema";
import { seedQuotes, seedTags, seedUuid } from "./index.ts";

describe("seed de citas", () => {
  it("tiene unas 30 citas válidas según el esquema", () => {
    expect(seedQuotes.length).toBeGreaterThanOrEqual(30);
    for (const quote of seedQuotes) {
      const result = seedQuoteSchema.safeParse(quote);
      expect(result.success, `${quote.slug}: ${result.error?.message}`).toBe(true);
    }
  });

  it("son citas breves: máximo dos frases y 280 caracteres", () => {
    for (const q of seedQuotes) {
      expect(q.text.length, q.slug).toBeLessThanOrEqual(280);
      // Frases terminadas en . o ! (preguntas encadenadas como "Florals? For spring?" cuentan como una).
      const sentences = q.text.split(/(?<=[.!])\s+/).filter(Boolean);
      expect(sentences.length, q.slug).toBeLessThanOrEqual(2);
    }
  });

  it("slugs únicos y etiquetas definidas", () => {
    expect(new Set(seedQuotes.map((q) => q.slug)).size).toBe(seedQuotes.length);
    for (const q of seedQuotes)
      for (const t of q.tags) expect(seedTags[t], `${q.slug}: ${t}`).toBeDefined();
  });

  it("una misma frase de expresión tiene siempre la misma definición", () => {
    const seen = new Map<string, string>();
    for (const q of seedQuotes)
      for (const e of q.expressions) {
        const prev = seen.get(e.phrase);
        if (prev) expect(prev, e.phrase).toBe(e.meaningEn);
        seen.set(e.phrase, e.meaningEn);
      }
  });

  it("genera UUIDs deterministas con formato válido", () => {
    const id = seedUuid("quote", "x");
    expect(id).toBe(seedUuid("quote", "x"));
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});

describe("reformulaciones del seed", () => {
  it("cada reformulación apunta a una cita existente", async () => {
    const { rewriteSlugs } = await import("./index.ts");
    const slugs = new Set(seedQuotes.map((q) => q.slug));
    for (const slug of rewriteSlugs) expect(slugs.has(slug), slug).toBe(true);
    expect(rewriteSlugs.length).toBeGreaterThanOrEqual(15);
  });
});
