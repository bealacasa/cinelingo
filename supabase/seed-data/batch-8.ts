import type { SeedQuote } from "../../src/lib/quotes/schema";

// Breaking Bad. Pendientes de verificación (reviewed_at = null).
export const batch8: SeedQuote[] = [
  {
    slug: "i-am-the-danger",
    text: "I am not in danger, Skyler. I am the danger.",
    work: { title: "Breaking Bad", type: "series", year: 2008 },
    character: "Walter White",
    season: 4,
    episode: 6,
    sceneContextEs:
      "Su mujer le suplica que acuda a la policía porque cree que corre peligro; él le revela quién es en realidad.",
    translationEs: "No estoy en peligro, Skyler. El peligro soy yo.",
    culturalNoteEs:
      "El giro funciona por el paralelismo: misma estructura, un solo cambio que lo invierte todo.",
    variety: "us",
    tags: ["retorica", "estrategia"],
    expressions: [
      {
        surface: "in danger",
        phrase: "be in danger",
        type: "collocation",
        register: "neutral",
        meaningEn: "Be at risk of being harmed.",
        meaningEs: "Estar en peligro.",
        noteEs: "Contrasta con 'be a danger (to someone)' = ser un peligro para alguien.",
      },
    ],
  },
  {
    slug: "i-was-good-at-it",
    text: "I liked it. I was good at it.",
    work: { title: "Breaking Bad", type: "series", year: 2008 },
    character: "Walter White",
    season: 5,
    episode: 16,
    sceneContextEs:
      "Al final de la serie, el protagonista deja de justificarse y admite por qué hizo todo lo que hizo.",
    translationEs: "Me gustaba. Se me daba bien.",
    culturalNoteEs: "Frases cortas y sin adornos: la sencillez es lo que da fuerza a la confesión.",
    variety: "us",
    tags: ["trabajo"],
    expressions: [
      {
        surface: "good at",
        phrase: "be good at + noun/-ing",
        type: "collocation",
        register: "neutral",
        meaningEn: "Have skill or talent for something.",
        meaningEs: "Dársele bien algo a alguien.",
        noteEs: "Preposición 'at', no 'in': 'I'm good at languages', 'good at cooking'.",
      },
    ],
  },
  {
    slug: "better-call-saul",
    text: "Better call Saul!",
    work: { title: "Breaking Bad", type: "series", year: 2008 },
    character: "Saul Goodman",
    season: 2,
    episode: 8,
    sceneContextEs: "El eslogan del anuncio televisivo de un abogado sin demasiados escrúpulos.",
    translationEs: "¡Más te vale llamar a Saul!",
    culturalNoteEs: "Dio nombre a la serie derivada. En el habla rápida se omite 'You'd'.",
    variety: "us",
    tags: ["trabajo", "humor"],
    expressions: [
      {
        surface: "Better call",
        phrase: "(you'd) better + infinitive",
        type: "grammar",
        register: "informal",
        meaningEn: "Strong advice or warning: 'you should, or there will be problems'.",
        meaningEs: "'Más te vale…': consejo fuerte o advertencia.",
        noteEs: "Va con infinitivo sin 'to': 'You'd better go', nunca 'better to go'.",
      },
    ],
  },
];
