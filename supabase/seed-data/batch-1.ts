import type { SeedQuote } from "../../src/lib/quotes/schema";

// Citas breves, atribuidas y con comentario educativo. Pendientes de verificación (reviewed_at = null).
export const batch1: SeedQuote[] = [
  {
    slug: "glacial-pace",
    text: "By all means, move at a glacial pace. You know how that thrills me.",
    work: { title: "The Devil Wears Prada", type: "film", year: 2006 },
    character: "Miranda Priestly",
    sceneContextEs:
      "La directora de una revista de moda reprocha a su nueva asistente que tarda demasiado en ponerse en marcha.",
    translationEs: "Tú tranquila, ve a paso de tortuga. Ya sabes lo que me encanta.",
    culturalNoteEs:
      "Sarcasmo frío: la frase dice lo contrario de lo que quiere decir. El tono educado lo hace aún más cortante.",
    variety: "us",
    tags: ["sarcasmo", "trabajo"],
    expressions: [
      {
        surface: "By all means",
        phrase: "by all means",
        type: "discourse_marker",
        register: "formal",
        meaningEn: "Certainly; please go ahead.",
        meaningEs: "Por supuesto; adelante.",
        noteEs: "Aquí se usa con ironía: da permiso para algo que en realidad molesta.",
      },
      {
        surface: "at a glacial pace",
        phrase: "at a glacial pace",
        type: "collocation",
        register: "neutral",
        meaningEn: "Extremely slowly.",
        meaningEs: "Lentísimo, a paso de tortuga.",
      },
    ],
  },
  {
    slug: "florals-for-spring",
    text: "Florals? For spring? Groundbreaking.",
    work: { title: "The Devil Wears Prada", type: "film", year: 2006 },
    character: "Miranda Priestly",
    sceneContextEs:
      "En una reunión, alguien propone estampados de flores para la colección de primavera.",
    translationEs: "¿Flores? ¿En primavera? Qué revolucionario.",
    culturalNoteEs:
      "Fórmula muy usada en memes para burlarse de una idea poco original: pregunta + pregunta + adjetivo elogioso irónico.",
    variety: "us",
    tags: ["sarcasmo", "trabajo"],
    expressions: [
      {
        surface: "Groundbreaking",
        phrase: "groundbreaking",
        type: "other",
        register: "neutral",
        meaningEn: "Innovative; never done before.",
        meaningEs: "Pionero, revolucionario.",
        noteEs: "Usado con ironía para decir que algo es obvio o trillado.",
      },
    ],
  },
  {
    slug: "offer-he-cant-refuse",
    text: "I'm gonna make him an offer he can't refuse.",
    work: { title: "The Godfather", type: "film", year: 1972 },
    character: "Vito Corleone",
    sceneContextEs:
      "El jefe de la familia promete conseguir un papel para su ahijado presionando a un productor.",
    translationEs: "Le haré una oferta que no podrá rechazar.",
    culturalNoteEs:
      "Hoy se usa en broma para cualquier propuesta muy atractiva, aunque en la película insinúa una amenaza.",
    variety: "us",
    tags: ["negociacion"],
    expressions: [
      {
        surface: "make him an offer he can't refuse",
        phrase: "make someone an offer they can't refuse",
        type: "idiom",
        register: "informal",
        meaningEn: "Make a proposal so attractive (or threatening) that saying no isn't realistic.",
        meaningEs: "Hacer una propuesta imposible de rechazar.",
      },
      {
        surface: "gonna",
        phrase: "gonna",
        type: "slang",
        register: "informal",
        meaningEn: "Spoken form of 'going to'.",
        meaningEs: "Forma oral de 'going to' (voy a).",
        noteEs: "Habitual al hablar; evítalo en textos formales.",
      },
    ],
  },
  {
    slug: "enemies-closer",
    text: "Keep your friends close, but your enemies closer.",
    work: { title: "The Godfather Part II", type: "film", year: 1974 },
    character: "Michael Corleone",
    sceneContextEs:
      "Michael explica la estrategia que le enseñó su padre para sobrevivir en un mundo de traiciones.",
    translationEs: "Ten cerca a tus amigos, pero aún más cerca a tus enemigos.",
    variety: "us",
    tags: ["estrategia", "negociacion"],
    expressions: [
      {
        surface: "Keep your friends close, but your enemies closer",
        phrase: "keep your friends close and your enemies closer",
        type: "idiom",
        register: "neutral",
        meaningEn: "Watch your rivals carefully so you know what they are planning.",
        meaningEs: "Vigila de cerca a tus rivales para saber qué traman.",
        noteEs: "Fíjate en la elipsis: 'your enemies closer' = 'keep your enemies closer'.",
      },
    ],
  },
  {
    slug: "that-word",
    text: "You keep using that word. I do not think it means what you think it means.",
    work: { title: "The Princess Bride", type: "film", year: 1987 },
    character: "Inigo Montoya",
    sceneContextEs:
      "Un espadachín corrige a su jefe, que repite la palabra 'inconceivable' sin parar.",
    translationEs: "No paras de usar esa palabra. No creo que signifique lo que tú crees.",
    culturalNoteEs: "Se cita para señalar con humor que alguien usa mal un término.",
    variety: "us",
    tags: ["humor", "lenguaje"],
    expressions: [
      {
        surface: "keep using",
        phrase: "keep + -ing",
        type: "grammar",
        register: "neutral",
        meaningEn: "Do something repeatedly or continuously.",
        meaningEs: "No dejar de hacer algo; hacerlo una y otra vez.",
        noteEs: "Suele expresar fastidio: 'You keep interrupting me'.",
      },
    ],
  },
  {
    slug: "seize-the-day",
    text: "Seize the day, boys. Make your lives extraordinary.",
    work: { title: "Dead Poets Society", type: "film", year: 1989 },
    character: "John Keating",
    sceneContextEs:
      "Un profesor anima a sus alumnos a aprovechar la vida frente a una vitrina con fotos antiguas.",
    translationEs: "Aprovechad el momento, chicos. Haced que vuestras vidas sean extraordinarias.",
    culturalNoteEs:
      "Justo antes, el profesor cita la expresión latina 'carpe diem', de la que 'seize the day' es la traducción habitual.",
    variety: "us",
    tags: ["motivacion", "educacion"],
    expressions: [
      {
        surface: "Seize the day",
        phrase: "seize the day",
        type: "idiom",
        register: "neutral",
        meaningEn: "Make the most of the present moment.",
        meaningEs: "Aprovechar el momento.",
      },
      {
        surface: "Make your lives extraordinary",
        phrase: "make something + adjective",
        type: "grammar",
        register: "neutral",
        meaningEn: "Cause something to become a certain way.",
        meaningEs: "Hacer que algo sea de cierta manera.",
      },
    ],
  },
];
