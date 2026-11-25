import type { SeedQuote } from "../../src/lib/quotes/schema";

// Cory Ellison (The Morning Show). Pendientes de verificar literalidad y temporada/episodio.
export const batch9: SeedQuote[] = [
  {
    slug: "desperation-big-move",
    text: "Desperation is not a strong position to make a big move.",
    work: { title: "The Morning Show", type: "series", year: 2019 },
    character: "Cory Ellison",
    sceneContextEs:
      "Cory aconseja cautela ante una decisión arriesgada: actuar desde la desesperación es partir con desventaja.",
    translationEs:
      "La desesperación no es una buena posición desde la que hacer un gran movimiento.",
    culturalNoteEs:
      "Frase habitual en entornos corporativos estadounidenses: las decisiones impulsivas por miedo rara vez salen bien.",
    variety: "us",
    tags: ["estrategia", "medios"],
    expressions: [
      {
        surface: "make a big move",
        phrase: "make a move",
        type: "collocation",
        register: "neutral",
        meaningEn: "Take a decisive action, especially one with significant consequences.",
        meaningEs: "Dar un paso decisivo, hacer una jugada importante.",
        noteEs: "'Big move' amplifica la colocación base 'make a move'. Muy usada en negocios.",
      },
    ],
  },
  {
    slug: "business-is-business",
    text: "Business is business. Those things don't change.",
    work: { title: "The Morning Show", type: "series", year: 2019 },
    character: "Cory Ellison",
    sceneContextEs: "Cory justifica una decisión dura separando lo profesional de lo personal.",
    translationEs: "Los negocios son los negocios. Esas cosas no cambian.",
    culturalNoteEs:
      "Expresión que se usa para zanjar una discusión emocional en el trabajo: las reglas del juego no se negocian.",
    variety: "us",
    tags: ["estrategia", "trabajo", "medios"],
    expressions: [
      {
        surface: "Business is business",
        phrase: "business is business",
        type: "idiom",
        register: "neutral",
        meaningEn: "Personal feelings should not interfere with professional decisions.",
        meaningEs:
          "Los sentimientos personales no deben interferir en las decisiones profesionales.",
        noteEs: "Estructura 'X is X' para cerrar debate: 'Rules are rules', 'A deal is a deal'.",
      },
    ],
  },
  {
    slug: "keep-yourself-pure",
    text: "You cannot keep yourself pure just by moving on every time someone disappoints you.",
    work: { title: "The Morning Show", type: "series", year: 2019 },
    character: "Cory Ellison",
    sceneContextEs:
      "Cory le dice a Bradley que huir cada vez que alguien la decepciona no la convierte en mejor persona.",
    translationEs:
      "No puedes mantenerte pura solo con marcharte cada vez que alguien te decepciona.",
    variety: "us",
    tags: ["medios"],
    expressions: [
      {
        surface: "moving on",
        phrase: "move on",
        type: "phrasal_verb",
        register: "neutral",
        meaningEn: "Leave a place or situation behind and continue forward.",
        meaningEs: "Pasar página, seguir adelante.",
        noteEs: "'Move on from something/someone' añade aquello que se deja atrás.",
      },
      {
        surface: "keep yourself pure",
        phrase: "keep + object + adjective",
        type: "grammar",
        register: "neutral",
        meaningEn: "Cause something or someone to remain in a certain state.",
        meaningEs: "Hacer que algo o alguien siga en cierto estado.",
        noteEs: "Patrón muy productivo: 'keep it simple', 'keep them safe', 'keep the door open'.",
      },
    ],
  },
  {
    slug: "chaos-is-the-new-cocaine",
    text: "Chaos is the new cocaine.",
    work: { title: "The Morning Show", type: "series", year: 2019 },
    character: "Cory Ellison",
    sceneContextEs:
      "Cory observa cómo la cultura mediática se ha vuelto adicta al escándalo y la controversia.",
    translationEs: "El caos es la nueva cocaína.",
    culturalNoteEs:
      "Patrón 'X is the new Y' muy productivo en inglés para señalar tendencias culturales: 'Orange is the new black', '50 is the new 30'.",
    variety: "us",
    tags: ["medios", "estrategia"],
    expressions: [
      {
        surface: "the new cocaine",
        phrase: "X is the new Y",
        type: "grammar",
        register: "informal",
        meaningEn: "X has replaced Y as the dominant trend or obsession.",
        meaningEs: "X ha sustituido a Y como la tendencia o la obsesión dominante.",
        noteEs:
          "Fórmula muy usada en periodismo y conversación informal para describir modas o adicciones sociales.",
      },
    ],
  },
  {
    slug: "people-love-a-train-wreck",
    text: "People love a train wreck. They can't look away.",
    work: { title: "The Morning Show", type: "series", year: 2019 },
    character: "Cory Ellison",
    sceneContextEs:
      "Cory explica con cinismo por qué la audiencia sube cuando hay un escándalo: el morbo vende.",
    translationEs: "A la gente le encantan los desastres. No pueden apartar la mirada.",
    culturalNoteEs:
      "Un 'train wreck' en sentido figurado es una situación caótica que resulta fascinante de observar. Muy usado en cultura pop y reality TV.",
    variety: "us",
    tags: ["medios"],
    expressions: [
      {
        surface: "a train wreck",
        phrase: "train wreck",
        type: "idiom",
        register: "informal",
        meaningEn: "A chaotic, disastrous situation that is hard to stop watching.",
        meaningEs: "Un desastre caótico del que no puedes dejar de mirar.",
        noteEs: "También se aplica a personas: 'She's a train wreck' (su vida es un desastre).",
      },
      {
        surface: "can't look away",
        phrase: "can't look away",
        type: "collocation",
        register: "neutral",
        meaningEn: "Unable to stop watching something, usually something shocking or compelling.",
        meaningEs: "No poder dejar de mirar algo, generalmente algo impactante.",
        noteEs: "Colocación habitual con espectáculos, accidentes y escándalos.",
      },
    ],
  },
  {
    slug: "the-truth-is-hard-to-hear",
    text: "The truth isn't always what you want to hear, but it's always what you need to hear.",
    work: { title: "The Morning Show", type: "series", year: 2019 },
    character: "Cory Ellison",
    sceneContextEs:
      "Cory defiende publicar una historia incómoda: lo que el público necesita saber no siempre es lo que quiere oír.",
    translationEs:
      "La verdad no siempre es lo que quieres oír, pero siempre es lo que necesitas oír.",
    culturalNoteEs:
      "Refleja el debate ético del periodismo estadounidense entre dar a la audiencia lo que pide y lo que le conviene saber.",
    variety: "us",
    tags: ["medios", "estrategia"],
    expressions: [
      {
        surface: "what you want to hear",
        phrase: "what you want/need to hear",
        type: "grammar",
        register: "neutral",
        meaningEn: "The thing that one desires or requires to be told.",
        meaningEs: "Lo que uno quiere o necesita que le digan.",
        noteEs:
          "Contraste 'want to hear' vs 'need to hear': muy frecuente en discursos motivacionales y periodísticos.",
      },
    ],
  },
];
