import type { SeedQuote } from "../../src/lib/quotes/schema";

export const batch3: SeedQuote[] = [
  {
    slug: "come-at-the-king",
    text: "You come at the king, you best not miss.",
    work: { title: "The Wire", type: "series", year: 2002 },
    character: "Omar Little",
    season: 1,
    episode: 8,
    sceneContextEs:
      "Un atracador advierte a quien ha intentado acabar con él de que el fallo tendrá consecuencias.",
    translationEs: "Si vas a por el rey, más te vale no fallar.",
    culturalNoteEs:
      "Gramática no estándar propia del inglés de Baltimore: se omite 'if' y 'had' en 'you'd best'.",
    variety: "us",
    tags: ["estrategia", "jerga"],
    expressions: [
      {
        surface: "come at",
        phrase: "come at someone",
        type: "phrasal_verb",
        register: "informal",
        meaningEn: "Attack or challenge someone.",
        meaningEs: "Ir a por alguien, atacarle.",
      },
      {
        surface: "best not",
        phrase: "(had) best not",
        type: "grammar",
        register: "informal",
        meaningEn: "It would be wise not to; a strong warning.",
        meaningEs: "Más te vale no…",
        noteEs: "Forma estándar: 'you'd better not' o 'you had best not'.",
      },
    ],
  },
  {
    slug: "whole-ass-one-thing",
    text: "Never half-ass two things. Whole-ass one thing.",
    work: { title: "Parks and Recreation", type: "series", year: 2009 },
    character: "Ron Swanson",
    sceneContextEs: "Un jefe de pocas palabras da un consejo sobre centrarse en una sola tarea.",
    translationEs: "Nunca hagas dos cosas a medias. Haz una sola a conciencia.",
    culturalNoteEs: "Juego de palabras: invierte el slang 'half-ass' creando 'whole-ass'.",
    variety: "us",
    tags: ["jerga", "trabajo", "humor"],
    expressions: [
      {
        surface: "half-ass",
        phrase: "half-ass",
        type: "slang",
        register: "slang",
        meaningEn: "Do something badly or with little effort.",
        meaningEs: "Hacer algo a medias, de mala manera.",
        noteEs: "Vulgar suave: evítalo en contextos formales.",
      },
    ],
  },
  {
    slug: "on-a-break",
    text: "We were on a break!",
    work: { title: "Friends", type: "series", year: 1994 },
    character: "Ross Geller",
    season: 3,
    sceneContextEs:
      "Ross se defiende de una acusación de infidelidad alegando que la pareja estaba 'dándose un tiempo'.",
    translationEs: "¡Nos estábamos dando un tiempo!",
    culturalNoteEs:
      "Una de las discusiones más famosas de la televisión; se repite en temporadas posteriores.",
    variety: "us",
    tags: ["amor", "humor"],
    expressions: [
      {
        surface: "on a break",
        phrase: "be on a break",
        type: "collocation",
        register: "informal",
        meaningEn: "Temporarily separated in a relationship.",
        meaningEs: "Darse un tiempo en una relación.",
      },
    ],
  },
  {
    slug: "high-functioning-sociopath",
    text: "I'm not a psychopath, Anderson. I'm a high-functioning sociopath.",
    work: { title: "Sherlock", type: "series", year: 2010 },
    character: "Sherlock Holmes",
    season: 1,
    episode: 1,
    sceneContextEs:
      "En la escena del crimen, un forense le llama psicópata y Sherlock le corrige con desdén.",
    translationEs: "No soy un psicópata, Anderson. Soy un sociópata altamente funcional.",
    culturalNoteEs:
      "Corrige a otro con precisión casi médica: el tono arrogante es típico del personaje.",
    variety: "uk",
    tags: ["sarcasmo", "britanico"],
    expressions: [
      {
        surface: "high-functioning",
        phrase: "high-functioning",
        type: "collocation",
        register: "formal",
        meaningEn: "Able to live and work normally despite a condition.",
        meaningEs: "Altamente funcional.",
      },
    ],
  },
  {
    slug: "tis-but-a-scratch",
    text: "'Tis but a scratch.",
    work: { title: "Monty Python and the Holy Grail", type: "film", year: 1975 },
    character: "The Black Knight",
    sceneContextEs: "Un caballero que acaba de perder un brazo insiste en que no es nada.",
    translationEs: "No es más que un rasguño.",
    culturalNoteEs:
      "Ejemplo extremo del understatement británico: quitar importancia a algo grave.",
    variety: "uk",
    tags: ["britanico", "humor", "sarcasmo"],
    expressions: [
      {
        surface: "'Tis but",
        phrase: "'tis but",
        type: "grammar",
        register: "formal",
        meaningEn: "Archaic for 'it is only'.",
        meaningEs: "Arcaico: 'no es más que'.",
        noteEs: "'But' con el sentido de 'only' sobrevive en usos formales: 'She was but a child'.",
      },
    ],
  },
  {
    slug: "dont-mention-the-war",
    text: "Don't mention the war!",
    work: { title: "Fawlty Towers", type: "series", year: 1975 },
    character: "Basil Fawlty",
    season: 1,
    episode: 6,
    sceneContextEs:
      "El dueño de un hotel pide a todos que no saquen un tema delicado delante de unos huéspedes alemanes… y él mismo no para de hacerlo.",
    translationEs: "¡No mencionéis la guerra!",
    culturalNoteEs: "Se usa para avisar de un tema tabú que conviene evitar en una conversación.",
    variety: "uk",
    tags: ["britanico", "humor"],
    expressions: [
      {
        surface: "Don't mention",
        phrase: "don't mention the war",
        type: "idiom",
        register: "informal",
        meaningEn: "Avoid a sensitive subject that could cause embarrassment.",
        meaningEs: "Evita sacar un tema delicado.",
      },
    ],
  },
];
