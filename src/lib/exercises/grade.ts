/** Normaliza una respuesta escrita: minúsculas, apóstrofos rectos, sin puntuación ni espacios extra. */
export function normalizeAnswer(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[^\p{L}\p{N}' -]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Distancia de edición (Levenshtein) con límite de memoria O(n). */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min((prev[j] ?? 0) + 1, (curr[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
    }
    prev = curr;
  }
  return prev[b.length] ?? 0;
}

export type TextGrade = { correct: boolean; almost: boolean };

/**
 * Corrige un hueco: exacto tras normalizar = correcto; con una errata pequeña
 * (≈1 letra cada 10) también cuenta, pero se avisa de la ortografía.
 */
export function gradeText(answer: string, expected: string): TextGrade {
  const a = normalizeAnswer(answer);
  const e = normalizeAnswer(expected);
  if (!a) return { correct: false, almost: false };
  if (a === e) return { correct: true, almost: false };
  const tolerance = Math.max(1, Math.floor(e.length / 10));
  const almost = levenshtein(a, e) <= tolerance;
  return { correct: almost, almost };
}

/** Pista visual: primera letra de cada palabra y guiones bajos ("b_ a__ m____"). */
export function letterPattern(expected: string): string {
  return expected
    .split(/\s+/)
    .map((word) => word.replace(/(?<!^)[\p{L}\p{N}]/gu, "_"))
    .join(" ");
}

const INFORMAL_MARKERS: { pattern: RegExp; tipEs: string }[] = [
  {
    pattern: /\b\w+'(s|re|ve|ll|d|t|m)\b/i,
    tipEs: "Has usado contracciones ('it's', 'don't'…): en registro formal, escríbelas completas.",
  },
  {
    pattern: /\b(gonna|wanna|gotta|kinda|sorta|ain't|y'all|guys)\b/i,
    tipEs:
      "Hay formas muy coloquiales ('gonna', 'wanna', 'guys'…) que no encajan en registro formal.",
  },
  { pattern: /!/, tipEs: "En registro formal se evitan las exclamaciones." },
];

/** Comentarios automáticos (orientativos) sobre una reformulación hacia registro formal. */
export function formalityTips(attempt: string): string[] {
  return INFORMAL_MARKERS.filter(({ pattern }) => pattern.test(attempt)).map(({ tipEs }) => tipEs);
}
