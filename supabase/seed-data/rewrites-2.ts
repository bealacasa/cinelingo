import type { RewritePayload } from "../../src/lib/quotes/schema";

export const rewrites2: Record<string, RewritePayload> = {
  "live-together-die-alone": {
    direction: "to_formal",
    modelAnswer: "Unless we are able to cooperate, we will each perish alone.",
    tipsEs: [
      "'If… can't' → 'Unless… are able to'.",
      "'gonna' → 'will'.",
      "'die' → 'perish' es más literario.",
    ],
  },
  "life-moves-fast": {
    direction: "to_formal",
    modelAnswer:
      "Life passes rather quickly. If one does not pause to look around occasionally, one may miss it.",
    tipsEs: [
      "'pretty' → 'rather' o 'quite'.",
      "'once in a while' → 'occasionally'.",
      "'you' impersonal → 'one' (muy formal).",
    ],
  },
  "sucking-diesel": {
    direction: "to_formal",
    modelAnswer: "We are now making excellent progress.",
    tipsEs: ["El slang 'sucking diesel' → 'making excellent progress'.", "Sin exclamación."],
  },
  "had-me-at-hello": {
    direction: "to_formal",
    modelAnswer: "You had already convinced me the moment you greeted me.",
    tipsEs: [
      "'You had me' (coloquial) → 'You had convinced me'.",
      "'at hello' → 'the moment you greeted me'.",
    ],
  },
  "what-i-cant-do": {
    direction: "to_formal",
    modelAnswer: "Please do not tell me what I am unable to do.",
    tipsEs: [
      "Sin contracciones: 'do not', 'am unable to'.",
      "Añade 'Please' para rebajar la agresividad.",
    ],
  },
  "how-you-doin": {
    direction: "to_formal",
    modelAnswer: "Good evening. How are you?",
    tipsEs: [
      "Recupera el auxiliar: 'How are you…?'.",
      "Un saludo ('Good evening') marca el registro formal.",
    ],
  },
  "dwell-on-dreams": {
    direction: "to_informal",
    modelAnswer: "Don't get so caught up in your dreams that you forget to actually live.",
    tipsEs: [
      "'It does not do to' → 'Don't'.",
      "'dwell on' → 'get caught up in' o 'keep thinking about'.",
      "Contracciones y 'actually' dan naturalidad.",
    ],
  },
  "our-choices": {
    direction: "to_informal",
    modelAnswer: "What really shows who you are is the choices you make, not what you're good at.",
    tipsEs: [
      "Cambia la estructura enfática 'It is… that' por 'What… is…'.",
      "'abilities' → 'what you're good at'.",
      "'we' → 'you' genérico, más cercano.",
    ],
  },
};
