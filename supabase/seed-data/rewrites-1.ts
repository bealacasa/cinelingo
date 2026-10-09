import type { RewritePayload } from "../../src/lib/quotes/schema";

// Reformulaciones de registro (respuesta modelo + claves). Indexadas por slug de la cita.
export const rewrites1: Record<string, RewritePayload> = {
  "offer-he-cant-refuse": {
    direction: "to_formal",
    modelAnswer: "I intend to make him a proposal that he will be unable to decline.",
    tipsEs: [
      "'gonna' → 'intend to' o 'am going to'.",
      "'offer' → 'proposal' suena más institucional.",
      "'can't refuse' → 'will be unable to decline'.",
    ],
  },
  "make-fetch-happen": {
    direction: "to_formal",
    modelAnswer: "Please stop trying to popularise the word 'fetch'; it is unlikely to catch on.",
    tipsEs: [
      "Añade cortesía: 'Please…'.",
      "'It's not going to happen' → 'it is unlikely to catch on'.",
      "Sin contracciones: 'it is', no 'it's'.",
    ],
  },
  "just-your-opinion": {
    direction: "to_formal",
    modelAnswer: "With respect, that is merely your opinion.",
    tipsEs: [
      "Elimina las muletillas: 'well', 'you know', 'like', 'man'.",
      "'just' → 'merely' o 'simply'.",
      "'With respect' suaviza el desacuerdo en registro formal.",
    ],
  },
  "on-a-break": {
    direction: "to_formal",
    modelAnswer: "At that time, we had agreed to spend some time apart.",
    tipsEs: [
      "'be on a break' → 'agree to spend some time apart'.",
      "El pluscuamperfecto ('had agreed') sitúa el acuerdo antes de los hechos.",
    ],
  },
  "whole-ass-one-thing": {
    direction: "to_formal",
    modelAnswer: "It is better to do one thing thoroughly than to do two things poorly.",
    tipsEs: [
      "Evita el vulgarismo 'half-ass': usa 'do something poorly'.",
      "Estructura comparativa: 'It is better to… than to…'.",
      "'whole-ass' → 'thoroughly' o 'wholeheartedly'.",
    ],
  },
  "come-at-the-king": {
    direction: "to_formal",
    modelAnswer: "If you decide to challenge someone powerful, you had better not fail.",
    tipsEs: [
      "Recupera el 'if' que la frase original omite.",
      "'come at' → 'challenge' o 'confront'.",
      "'best not' → 'had better not'.",
    ],
  },
  "them-apples": {
    direction: "to_formal",
    modelAnswer: "And what do you make of that?",
    tipsEs: [
      "'them apples' es incorrecto a propósito; en formal, 'that'.",
      "'What do you make of…?' = ¿Qué opinas de…?",
    ],
  },
  "better-call-saul": {
    direction: "to_formal",
    modelAnswer: "You would be well advised to contact Saul.",
    tipsEs: [
      "'(You'd) better' → 'You would be well advised to'.",
      "'call' → 'contact' en un contexto profesional.",
    ],
  },
};
