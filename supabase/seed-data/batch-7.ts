import type { SeedQuote } from "../../src/lib/quotes/schema";

// Friends y Dexter. Pendientes de verificación (reviewed_at = null).
export const batch7: SeedQuote[] = [
  {
    slug: "how-you-doin",
    text: "How you doin'?",
    work: { title: "Friends", type: "series", year: 1994 },
    character: "Joey Tribbiani",
    sceneContextEs: "La frase con la que Joey intenta ligar, repetida a lo largo de toda la serie.",
    translationEs: "¿Qué tal te va? (en tono de ligoteo)",
    culturalNoteEs:
      "Lo que cuenta es la entonación: alargada y con mirada intensa, deja de ser un saludo para ser un intento de ligar.",
    variety: "us",
    tags: ["amor", "jerga", "pronunciacion"],
    expressions: [
      {
        surface: "How you doin'?",
        phrase: "how you doin'",
        type: "slang",
        register: "slang",
        meaningEn: "Very casual 'How are you doing?', dropping 'are' and the final 'g'.",
        meaningEs: "'¿Qué tal?' muy coloquial: se omite 'are' y la 'g' final.",
        noteEs:
          "El apóstrofo de 'doin'' indica la 'g' que no se pronuncia, típico del habla rápida.",
      },
    ],
  },
  {
    slug: "they-know-we-know",
    text: "They don't know that we know they know we know!",
    work: { title: "Friends", type: "series", year: 1994 },
    character: "Phoebe Buffay",
    season: 5,
    episode: 14,
    sceneContextEs:
      "Dos parejas intentan averiguar quién sabe qué de su relación secreta, y el lío de quién sabe qué se complica.",
    translationEs: "¡Ellos no saben que nosotros sabemos que ellos saben que nosotros sabemos!",
    variety: "us",
    tags: ["humor", "lenguaje"],
    expressions: [
      {
        surface: "that we know they know we know",
        phrase: "nested clauses (that omitted)",
        type: "grammar",
        register: "neutral",
        meaningEn: "Clauses inside clauses; 'that' is often dropped after verbs like 'know'.",
        meaningEs: "Oraciones subordinadas encadenadas; tras 'know' se suele omitir 'that'.",
        noteEs: "'I think (that) she knows' es igual de correcto con o sin 'that'.",
      },
    ],
  },
  {
    slug: "any-more-clothes",
    text: "Could I BE wearing any more clothes?",
    work: { title: "Friends", type: "series", year: 1994 },
    character: "Joey Tribbiani",
    season: 3,
    episode: 2,
    sceneContextEs:
      "Joey se pone toda la ropa de Chandler a la vez y se burla de su forma sarcástica de hablar.",
    translationEs: "¿Se puede llevar más ropa puesta que yo?",
    culturalNoteEs:
      "Imita el estilo de Chandler, que acentúa el verbo 'be' en preguntas sarcásticas: 'Could this BE any more…?'.",
    variety: "us",
    tags: ["sarcasmo", "humor", "pronunciacion"],
    expressions: [
      {
        surface: "Could I BE wearing any more",
        phrase: "could X be any more + adjective/noun?",
        type: "grammar",
        register: "informal",
        meaningEn: "Sarcastic question meaning 'this is extremely…'.",
        meaningEs: "Pregunta sarcástica: '¿se puede ser más…?', o sea, 'es lo más… del mundo'.",
        noteEs: "'Could this day BE any longer?' = este día no se acaba nunca.",
      },
    ],
  },
  {
    slug: "tonights-the-night",
    text: "Tonight's the night.",
    work: { title: "Dexter", type: "series", year: 2006 },
    character: "Dexter Morgan",
    season: 1,
    episode: 1,
    sceneContextEs:
      "En el arranque de la serie, el narrador anuncia en voz en off que esta noche hará lo que lleva tiempo planeando.",
    translationEs: "Esta es la noche.",
    culturalNoteEs:
      "La voz en off del protagonista es clave en la serie: su tono tranquilo contrasta con lo inquietante de lo que cuenta.",
    variety: "us",
    tags: ["retorica"],
    expressions: [
      {
        surface: "Tonight's the night",
        phrase: "tonight's the night",
        type: "idiom",
        register: "neutral",
        meaningEn: "The important, long-awaited moment has finally arrived.",
        meaningEs: "Ha llegado el gran momento.",
        noteEs: "Se usa también en contextos alegres: una cita, un estreno, una pedida de mano.",
      },
    ],
  },
];
