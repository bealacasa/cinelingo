import type { SeedQuote } from "../../src/lib/quotes/schema";

export const batch2: SeedQuote[] = [
  {
    slug: "get-busy-living",
    text: "Get busy living, or get busy dying.",
    work: { title: "The Shawshank Redemption", type: "film", year: 1994 },
    character: "Andy Dufresne",
    sceneContextEs: "En la cárcel, un preso le explica a su amigo que no rendirse es una decisión.",
    translationEs: "O te pones a vivir, o te pones a morir.",
    variety: "us",
    tags: ["motivacion"],
    expressions: [
      {
        surface: "Get busy living",
        phrase: "get busy + -ing",
        type: "grammar",
        register: "informal",
        meaningEn: "Start doing something actively and energetically.",
        meaningEs: "Ponerse manos a la obra con algo.",
        noteEs: "'Let's get busy' = pongámonos a trabajar.",
      },
    ],
  },
  {
    slug: "looking-at-you-kid",
    text: "Here's looking at you, kid.",
    work: { title: "Casablanca", type: "film", year: 1942 },
    character: "Rick Blaine",
    sceneContextEs:
      "Rick brinda por Ilsa en varios momentos de la película, el último en la despedida.",
    translationEs: "Por ti, pequeña.",
    culturalNoteEs: "Fórmula de brindis anticuada; hoy suena a homenaje al cine clásico.",
    variety: "us",
    tags: ["amor", "clasicos"],
    expressions: [
      {
        surface: "Here's looking at you",
        phrase: "here's looking at you",
        type: "idiom",
        register: "informal",
        meaningEn: "A toast meaning 'to your health' or 'this is to you'.",
        meaningEs: "Brindis: '¡por ti!', '¡a tu salud!'.",
      },
    ],
  },
  {
    slug: "had-me-at-hello",
    text: "You had me at hello.",
    work: { title: "Jerry Maguire", type: "film", year: 1996 },
    character: "Dorothy Boyd",
    sceneContextEs:
      "Él suelta un largo discurso para reconciliarse; ella le interrumpe porque ya la había convencido.",
    translationEs: "Me convenciste con el 'hola'.",
    culturalNoteEs: "Se usa en broma: 'Free pizza? You had me at free'.",
    variety: "us",
    tags: ["amor"],
    expressions: [
      {
        surface: "You had me at",
        phrase: "you had me at ___",
        type: "idiom",
        register: "informal",
        meaningEn: "You convinced me from the very first word.",
        meaningEs: "Me convenciste desde el primer momento.",
      },
    ],
  },
  {
    slug: "make-fetch-happen",
    text: "Stop trying to make fetch happen. It's not going to happen.",
    work: { title: "Mean Girls", type: "film", year: 2004 },
    character: "Regina George",
    sceneContextEs:
      "Una amiga insiste en usar la palabra 'fetch' como sinónimo de 'guay', y la líder del grupo se harta.",
    translationEs: "Deja de intentar que 'fetch' se ponga de moda. No va a pasar.",
    culturalNoteEs:
      "Se cita cuando alguien intenta imponer una moda o una palabra que nadie más usa.",
    variety: "us",
    tags: ["humor", "jerga"],
    expressions: [
      {
        surface: "make fetch happen",
        phrase: "make something happen",
        type: "collocation",
        register: "informal",
        meaningEn: "Cause something to succeed or take place.",
        meaningEs: "Conseguir que algo ocurra o triunfe.",
      },
      {
        surface: "Stop trying to",
        phrase: "stop + -ing vs. stop + to",
        type: "grammar",
        register: "neutral",
        meaningEn:
          "Stop doing something (stop + -ing) vs. stop in order to do something (stop + to).",
        meaningEs: "'Stop trying' = dejar de intentar; 'stop to try' = pararse para intentar.",
      },
    ],
  },
  {
    slug: "just-your-opinion",
    text: "Yeah, well, you know, that's just, like, your opinion, man.",
    work: { title: "The Big Lebowski", type: "film", year: 1998 },
    character: "The Dude",
    sceneContextEs:
      "El protagonista, muy relajado, responde a una crítica sin molestarse en rebatirla.",
    translationEs: "Ya, bueno, o sea, eso es, en plan, tu opinión, tío.",
    variety: "us",
    tags: ["jerga", "humor"],
    expressions: [
      {
        surface: "like",
        phrase: "like (filler)",
        type: "discourse_marker",
        register: "slang",
        meaningEn: "Filler word used to hesitate or soften a statement.",
        meaningEs: "Muletilla equivalente a 'en plan' o 'o sea'.",
      },
      {
        surface: "man",
        phrase: "man (vocative)",
        type: "slang",
        register: "slang",
        meaningEn: "Informal way to address someone.",
        meaningEs: "Equivalente a 'tío' o 'colega'.",
      },
    ],
  },
  {
    slug: "nothing-wrong-with-that",
    text: "Not that there's anything wrong with that.",
    work: { title: "Seinfeld", type: "series", year: 1989 },
    character: "Jerry Seinfeld",
    season: 4,
    episode: 17,
    sceneContextEs:
      "Jerry y George intentan desmentir un malentendido y repiten esta coletilla para no parecer prejuiciosos.",
    translationEs: "Y no es que tenga nada de malo, ¿eh?",
    culturalNoteEs:
      "Ejemplo de hedging: matizar para no ofender. Se cita con ironía cuando alguien se justifica de más.",
    variety: "us",
    tags: ["humor", "matices"],
    expressions: [
      {
        surface: "Not that",
        phrase: "not that + clause",
        type: "discourse_marker",
        register: "neutral",
        meaningEn: "Used to deny a possible inference: 'I'm not saying that…'.",
        meaningEs: "'No es que…': aclara lo que no quieres insinuar.",
        noteEs: "'I can't come — not that I wanted to.'",
      },
    ],
  },
];
