import { z } from "zod";

export const cefrLevel = z.enum(["B2", "C1", "C2"]);
export const englishVariety = z.enum(["us", "uk", "au", "ie", "ca", "other"]);
export const expressionType = z.enum([
  "phrasal_verb",
  "idiom",
  "collocation",
  "slang",
  "discourse_marker",
  "grammar",
  "other",
]);
export const register = z.enum(["formal", "neutral", "informal", "slang"]);
export const workType = z.enum(["film", "series"]);

/** Expresión asociada a una cita en los ficheros de seed. `surface` es el texto tal y como aparece. */
export const seedExpressionSchema = z.object({
  surface: z.string().min(1).max(120),
  phrase: z.string().min(1).max(120),
  type: expressionType,
  register,
  meaningEn: z.string().min(1).max(500),
  meaningEs: z.string().min(1).max(500),
  noteEs: z.string().max(1000).optional(),
});

export const seedQuoteSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    text: z.string().min(1).max(280),
    work: z.object({
      title: z.string().min(1).max(200),
      type: workType,
      year: z.number().int().min(1888).max(2100),
    }),
    character: z.string().min(1).max(120),
    season: z.number().int().min(1).max(99).optional(),
    episode: z.number().int().min(1).max(999).optional(),
    sceneContextEs: z.string().min(1).max(1000),
    translationEs: z.string().min(1).max(500),
    culturalNoteEs: z.string().max(1000).optional(),
    level: cefrLevel.default("C1"),
    variety: englishVariety,
    tags: z.array(z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)).max(6),
    expressions: z.array(seedExpressionSchema).min(1).max(5),
  })
  .refine((q) => q.episode === undefined || q.season !== undefined, {
    message: "episode requiere season",
  })
  .refine((q) => q.expressions.every((e) => q.text.includes(e.surface)), {
    message: "cada expresión debe aparecer literalmente en la cita",
  });

export type SeedQuote = z.input<typeof seedQuoteSchema>;

/** Forma de una cita lista para mostrar (venga de la BD o del modo demo). */
export type QuoteView = {
  id: string;
  text: string;
  character: string;
  season: number | null;
  episode: number | null;
  sceneContextEs: string;
  translationEs: string;
  culturalNoteEs: string | null;
  level: z.infer<typeof cefrLevel>;
  variety: z.infer<typeof englishVariety>;
  work: { title: string; type: z.infer<typeof workType>; year: number };
  tags: { slug: string; nameEs: string }[];
  expressions: {
    id: string;
    phrase: string;
    type: z.infer<typeof expressionType>;
    register: z.infer<typeof register>;
    meaningEn: string;
    meaningEs: string;
    noteEs: string | null;
    start: number;
    end: number;
  }[];
};
