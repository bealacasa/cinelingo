import type { SeedQuote } from "../../src/lib/quotes/schema";

export const batch4: SeedQuote[] = [
  {
    slug: "sucking-diesel",
    text: "Now we're sucking diesel!",
    work: { title: "Line of Duty", type: "series", year: 2012 },
    character: "Ted Hastings",
    sceneContextEs:
      "El jefe de una unidad anticorrupción celebra que la investigación por fin avanza.",
    translationEs: "¡Ahora sí que vamos sobre ruedas!",
    culturalNoteEs:
      "Expresión coloquial de Irlanda del Norte e Irlanda, popularizada por la serie.",
    variety: "ie",
    tags: ["jerga", "trabajo"],
    expressions: [
      {
        surface: "sucking diesel",
        phrase: "be sucking diesel",
        type: "idiom",
        register: "slang",
        meaningEn: "Making good progress; things are going well.",
        meaningEs: "Ir sobre ruedas, avanzar a buen ritmo.",
      },
    ],
  },
  {
    slug: "curious-not-judgmental",
    text: "Be curious, not judgmental.",
    work: { title: "Ted Lasso", type: "series", year: 2020 },
    character: "Ted Lasso",
    season: 1,
    episode: 8,
    sceneContextEs:
      "Durante una partida de dardos, el entrenador explica por qué la gente le ha subestimado siempre.",
    translationEs: "Sé curioso, no juzgues.",
    variety: "us",
    tags: ["motivacion"],
    expressions: [
      {
        surface: "judgmental",
        phrase: "judgmental",
        type: "other",
        register: "neutral",
        meaningEn: "Too quick to criticise others.",
        meaningEs: "Que juzga o critica a los demás con facilidad.",
        noteEs: "Ortografía: 'judgmental' (EE. UU.) o 'judgemental' (Reino Unido).",
      },
    ],
  },
  {
    slug: "taking-on-a-challenge",
    text: "Taking on a challenge is a lot like riding a horse, isn't it? If you're comfortable while you're doing it, you're probably doing it wrong.",
    work: { title: "Ted Lasso", type: "series", year: 2020 },
    character: "Ted Lasso",
    season: 1,
    episode: 1,
    sceneContextEs:
      "Un entrenador de fútbol americano acepta dirigir un equipo de fútbol inglés sin conocer el deporte.",
    translationEs:
      "Asumir un reto se parece mucho a montar a caballo, ¿no? Si estás cómodo mientras lo haces, seguramente lo estás haciendo mal.",
    variety: "us",
    tags: ["motivacion", "trabajo"],
    expressions: [
      {
        surface: "Taking on",
        phrase: "take on",
        type: "phrasal_verb",
        register: "neutral",
        meaningEn: "Accept a task or responsibility.",
        meaningEs: "Asumir, aceptar (un reto o una responsabilidad).",
        noteEs:
          "Otros sentidos: contratar ('take on staff') y enfrentarse a alguien ('take on the champion').",
      },
      {
        surface: "isn't it?",
        phrase: "question tags",
        type: "grammar",
        register: "neutral",
        meaningEn: "A short question added to seek agreement.",
        meaningEs: "Coletilla interrogativa: '¿verdad?', '¿no?'.",
      },
    ],
  },
  {
    slug: "chaos-is-a-ladder",
    text: "Chaos isn't a pit. Chaos is a ladder.",
    work: { title: "Game of Thrones", type: "series", year: 2011 },
    character: "Petyr Baelish",
    season: 3,
    episode: 6,
    sceneContextEs:
      "Un intrigante explica que el desorden es una oportunidad para quien sabe aprovecharlo.",
    translationEs: "El caos no es un pozo. El caos es una escalera.",
    culturalNoteEs:
      "Metáfora en paralelo: dos frases cortas con la misma estructura para dar fuerza retórica.",
    variety: "uk",
    tags: ["estrategia", "retorica"],
    expressions: [
      {
        surface: "Chaos is a ladder",
        phrase: "X is a ladder (metaphor)",
        type: "other",
        register: "formal",
        meaningEn: "A situation that offers a way to climb higher.",
        meaningEs: "Algo que sirve para ascender (metáfora).",
      },
    ],
  },
  {
    slug: "die-a-hero",
    text: "You either die a hero, or you live long enough to see yourself become the villain.",
    work: { title: "The Dark Knight", type: "film", year: 2008 },
    character: "Harvey Dent",
    sceneContextEs:
      "Durante una cena, un fiscal reflexiona sobre cómo el poder acaba corrompiendo a los héroes.",
    translationEs:
      "O mueres siendo un héroe, o vives lo suficiente para verte convertido en el villano.",
    variety: "us",
    tags: ["retorica"],
    expressions: [
      {
        surface: "live long enough to",
        phrase: "long enough to",
        type: "grammar",
        register: "neutral",
        meaningEn: "For the amount of time needed to do something.",
        meaningEs: "El tiempo suficiente para…",
      },
      {
        surface: "see yourself become",
        phrase: "see someone + bare infinitive",
        type: "grammar",
        register: "neutral",
        meaningEn: "Witness a complete action or change.",
        meaningEs: "Ver a alguien hacer algo (acción completa, infinitivo sin 'to').",
      },
    ],
  },
  {
    slug: "great-responsibility",
    text: "With great power comes great responsibility.",
    work: { title: "Spider-Man", type: "film", year: 2002 },
    character: "Ben Parker",
    sceneContextEs: "Un tío aconseja a su sobrino adolescente sobre cómo usar sus capacidades.",
    translationEs: "Un gran poder conlleva una gran responsabilidad.",
    variety: "us",
    tags: ["retorica", "motivacion"],
    expressions: [
      {
        surface: "With great power comes",
        phrase: "with X comes Y (inversion)",
        type: "grammar",
        register: "formal",
        meaningEn: "Inversion after a prepositional phrase for emphasis.",
        meaningEs: "Inversión sujeto-verbo tras un complemento, para dar énfasis.",
        noteEs: "'With age comes wisdom.' El sujeto real es 'great responsibility'.",
      },
    ],
  },
];
