import { createHash } from "node:crypto";
import { batch1 } from "./batch-1.ts";
import { batch2 } from "./batch-2.ts";
import { batch3 } from "./batch-3.ts";
import { batch4 } from "./batch-4.ts";
import { batch5 } from "./batch-5.ts";
import { batch6 } from "./batch-6.ts";
import { batch7 } from "./batch-7.ts";
import { batch8 } from "./batch-8.ts";
import { rewrites1 } from "./rewrites-1.ts";
import { rewrites2 } from "./rewrites-2.ts";

const rewrites = { ...rewrites1, ...rewrites2 };

/** Todas las citas del seed, con su reformulación si la tienen. */
export const seedQuotes = [
  ...batch1,
  ...batch2,
  ...batch3,
  ...batch4,
  ...batch5,
  ...batch6,
  ...batch7,
  ...batch8,
].map((q) => ({ ...q, rewrite: rewrites[q.slug] }));

/** Slugs con reformulación (el test comprueba que todos existen). */
export const rewriteSlugs = Object.keys(rewrites);

export const seedTags: Record<string, string> = {
  amor: "Amor y relaciones",
  britanico: "Humor británico",
  clasicos: "Clásicos del cine",
  educacion: "Educación",
  estrategia: "Estrategia y poder",
  humor: "Humor",
  jerga: "Jerga y slang",
  lenguaje: "Sobre el lenguaje",
  matices: "Matices y cortesía",
  motivacion: "Motivación",
  negociacion: "Negociación",
  pronunciacion: "Pronunciación",
  retorica: "Retórica y discursos",
  sarcasmo: "Sarcasmo",
  trabajo: "Trabajo y oficina",
};

/** UUID determinista (formato v5-like) a partir de un nombre: mismo id en el seed y en el modo demo. */
export function seedUuid(namespace: string, name: string): string {
  const hex = createHash("sha1").update(`cinelingo:${namespace}:${name}`).digest("hex");
  const variant = ((parseInt(hex[16] ?? "0", 16) & 0x3) | 0x8).toString(16);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-${variant}${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
