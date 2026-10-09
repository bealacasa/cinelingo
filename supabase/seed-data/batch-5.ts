import type { SeedQuote } from "../../src/lib/quotes/schema";

export const batch5: SeedQuote[] = [
  {
    slug: "inventors-of-facebook",
    text: "If you guys were the inventors of Facebook, you'd have invented Facebook.",
    work: { title: "The Social Network", type: "film", year: 2010 },
    character: "Mark Zuckerberg",
    sceneContextEs:
      "En una declaración judicial, el protagonista responde con desprecio a quienes le acusan de robarles la idea.",
    translationEs: "Si vosotros fuerais los inventores de Facebook, habríais inventado Facebook.",
    variety: "us",
    tags: ["sarcasmo", "trabajo"],
    expressions: [
      {
        surface: "If you guys were the inventors of Facebook, you'd have invented Facebook",
        phrase: "mixed conditional",
        type: "grammar",
        register: "neutral",
        meaningEn:
          "Present unreal condition (if + past) with a past result (would have + participle).",
        meaningEs: "Condicional mixto: condición irreal presente + consecuencia en el pasado.",
      },
      {
        surface: "you guys",
        phrase: "you guys",
        type: "slang",
        register: "informal",
        meaningEn: "Plural 'you' in American English, for any gender.",
        meaningEs: "Vosotros/vosotras (plural coloquial).",
      },
    ],
  },
  {
    slug: "them-apples",
    text: "How do you like them apples?",
    work: { title: "Good Will Hunting", type: "film", year: 1997 },
    character: "Will Hunting",
    sceneContextEs:
      "Tras conseguir el teléfono de una chica, el protagonista se lo restriega a un estudiante arrogante.",
    translationEs: "¿Qué te parece eso, eh?",
    culturalNoteEs:
      "Gramática deliberadamente incorrecta ('them' por 'those'); se usa para presumir tras ganar una discusión.",
    variety: "us",
    tags: ["jerga", "humor"],
    expressions: [
      {
        surface: "How do you like them apples?",
        phrase: "how do you like them apples",
        type: "idiom",
        register: "slang",
        meaningEn: "Said triumphantly after doing something surprising or winning.",
        meaningEs: "'¡Chúpate esa!', '¿qué te parece?'",
      },
    ],
  },
  {
    slug: "life-moves-fast",
    text: "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it.",
    work: { title: "Ferris Bueller's Day Off", type: "film", year: 1986 },
    character: "Ferris Bueller",
    sceneContextEs:
      "Un estudiante que hace novillos habla directamente a la cámara para justificar su día libre.",
    translationEs:
      "La vida pasa muy deprisa. Si no te paras a mirar a tu alrededor de vez en cuando, te la puedes perder.",
    variety: "us",
    tags: ["motivacion"],
    expressions: [
      {
        surface: "once in a while",
        phrase: "once in a while",
        type: "idiom",
        register: "neutral",
        meaningEn: "Occasionally.",
        meaningEs: "De vez en cuando.",
      },
      {
        surface: "pretty fast",
        phrase: "pretty + adjective",
        type: "collocation",
        register: "informal",
        meaningEn: "'Pretty' as an adverb meaning 'quite' or 'fairly'.",
        meaningEs: "'Bastante' (no 'bonito').",
        noteEs: "Falso amigo de registro: 'pretty good' = bastante bien.",
      },
    ],
  },
  {
    slug: "thats-a-knife",
    text: "That's not a knife. That's a knife.",
    work: { title: "Crocodile Dundee", type: "film", year: 1986 },
    character: "Mick Dundee",
    sceneContextEs:
      "Un atracador saca una navaja en Nueva York; el australiano responde sacando un cuchillo enorme.",
    translationEs: "Eso no es un cuchillo. Esto sí es un cuchillo.",
    culturalNoteEs:
      "El humor depende de la entonación: el segundo 'That's' recibe el énfasis. Inglés australiano.",
    variety: "au",
    tags: ["humor", "pronunciacion"],
    expressions: [
      {
        surface: "That's a knife",
        phrase: "contrastive stress",
        type: "grammar",
        register: "neutral",
        meaningEn: "Stressing a word to contrast it with what was said before.",
        meaningEs: "Acento contrastivo: enfatizar una palabra cambia el significado.",
      },
    ],
  },
  {
    slug: "not-entertained",
    text: "Are you not entertained?",
    work: { title: "Gladiator", type: "film", year: 2000 },
    character: "Maximus",
    sceneContextEs: "Tras una victoria brutal en la arena, el gladiador desafía al público.",
    translationEs: "¿No os divierte esto?",
    culturalNoteEs: "Hoy se usa en broma después de hacer algo espectacular.",
    variety: "us",
    tags: ["retorica"],
    expressions: [
      {
        surface: "Are you not",
        phrase: "negative question (uncontracted)",
        type: "grammar",
        register: "formal",
        meaningEn: "Negative question without contraction, sounding more emphatic or formal.",
        meaningEs: "Pregunta negativa sin contraer: suena más enfática y solemne que 'Aren't you'.",
      },
    ],
  },
  {
    slug: "time-given-to-us",
    text: "All we have to decide is what to do with the time that is given to us.",
    work: { title: "The Lord of the Rings: The Fellowship of the Ring", type: "film", year: 2001 },
    character: "Gandalf",
    sceneContextEs: "Frodo lamenta lo que le ha tocado vivir y el mago le responde con calma.",
    translationEs: "Lo único que debemos decidir es qué hacer con el tiempo que se nos ha dado.",
    variety: "uk",
    tags: ["retorica", "motivacion"],
    expressions: [
      {
        surface: "All we have to decide is",
        phrase: "all + clause + is (cleft)",
        type: "grammar",
        register: "formal",
        meaningEn: "Pseudo-cleft structure meaning 'the only thing we…'.",
        meaningEs: "Estructura enfática: 'Lo único que… es…'.",
        noteEs: "'All I need is time.' Ojo: 'all' + verbo singular 'is'.",
      },
    ],
  },
];
