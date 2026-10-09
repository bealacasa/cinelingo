// Genera supabase/seed.sql a partir de supabase/seed-data. Uso: npm run db:seed:generate
import { writeFileSync } from "node:fs";
import { seedQuoteSchema } from "../src/lib/quotes/schema.ts";
import { seedQuotes, seedTags, seedUuid } from "../supabase/seed-data/index.ts";

const sql = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number") return String(value);
  return `'${value.replace(/'/g, "''")}'`;
};

const lines: string[] = [
  "-- GENERADO por scripts/generate-seed.ts. No editar a mano.",
  "-- Citas publicadas pero con reviewed_at = null: pendientes de verificar literalidad y atribución.",
  "begin;",
];

for (const [slug, name] of Object.entries(seedTags)) {
  lines.push(
    `insert into public.tags (id, slug, name_es) values (${sql(seedUuid("tag", slug))}, ${sql(slug)}, ${sql(name)}) on conflict (slug) do nothing;`,
  );
}

const works = new Map<string, { title: string; type: string; year: number }>();
const expressions = new Map<
  string,
  ReturnType<typeof seedQuoteSchema.parse>["expressions"][number]
>();

const quotes = seedQuotes.map((raw) => seedQuoteSchema.parse(raw));
for (const q of quotes) {
  works.set(`${q.work.title}|${q.work.year}`, q.work);
  for (const e of q.expressions) if (!expressions.has(e.phrase)) expressions.set(e.phrase, e);
}

for (const [key, w] of works) {
  lines.push(
    `insert into public.works (id, title, type, year) values (${sql(seedUuid("work", key))}, ${sql(w.title)}, ${sql(w.type)}, ${w.year}) on conflict (title, year) do nothing;`,
  );
}

for (const e of expressions.values()) {
  lines.push(
    `insert into public.expressions (id, phrase, type, register, meaning_en, meaning_es, note_es) values (${sql(seedUuid("expression", e.phrase))}, ${sql(e.phrase)}, ${sql(e.type)}, ${sql(e.register)}, ${sql(e.meaningEn)}, ${sql(e.meaningEs)}, ${sql(e.noteEs)}) on conflict (phrase) do nothing;`,
  );
}

for (const q of quotes) {
  const quoteId = seedUuid("quote", q.slug);
  const workId = seedUuid("work", `${q.work.title}|${q.work.year}`);
  lines.push(
    `insert into public.quotes (id, work_id, text, character_name, season, episode, scene_context_es, translation_es, cultural_note_es, level, variety, status) values (${sql(quoteId)}, ${sql(workId)}, ${sql(q.text)}, ${sql(q.character)}, ${sql(q.season)}, ${sql(q.episode)}, ${sql(q.sceneContextEs)}, ${sql(q.translationEs)}, ${sql(q.culturalNoteEs)}, ${sql(q.level)}, ${sql(q.variety)}, 'published') on conflict (id) do nothing;`,
  );
  for (const e of q.expressions) {
    const start = q.text.indexOf(e.surface);
    lines.push(
      `insert into public.quote_expressions (quote_id, expression_id, start_offset, end_offset) values (${sql(quoteId)}, ${sql(seedUuid("expression", e.phrase))}, ${start}, ${start + e.surface.length}) on conflict do nothing;`,
    );
  }
  for (const tag of q.tags) {
    lines.push(
      `insert into public.quote_tags (quote_id, tag_id) values (${sql(quoteId)}, ${sql(seedUuid("tag", tag))}) on conflict do nothing;`,
    );
  }
  if (q.rewrite) {
    lines.push(
      `insert into public.exercises (quote_id, type, payload, status) values (${sql(quoteId)}, 'register_rewrite', ${sql(JSON.stringify(q.rewrite))}::jsonb, 'published') on conflict (quote_id, type) do nothing;`,
    );
  }
}

lines.push("commit;", "");
writeFileSync(new URL("../supabase/seed.sql", import.meta.url), lines.join("\n"));
console.log(
  `seed.sql: ${quotes.length} citas, ${expressions.size} expresiones, ${works.size} obras`,
);
