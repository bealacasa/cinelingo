import Link from "next/link";
import { DemoBanner } from "@/components/DemoBanner";
import { PracticeSession } from "@/components/practice/PracticeSession";
import { buildPractice } from "@/lib/exercises/build";
import { seededShuffle } from "@/lib/exercises/random";
import { dayInTimeZone } from "@/lib/quotes/daily";
import { getAllQuotes } from "@/lib/quotes/queries";
import type { QuoteView } from "@/lib/quotes/schema";

/** Sesión de práctica de una cita (servidor): genera los ejercicios sin incluir las respuestas. */
export async function PracticeView({ quote, eyebrow }: { quote: QuoteView; eyebrow: string }) {
  const all = await getAllQuotes();
  const exercises = buildPractice(quote, all);
  // "Otra cita": distinta de la actual, variada pero estable durante el día.
  const next = seededShuffle(
    all.filter((q) => q.id !== quote.id),
    `${quote.id}:${dayInTimeZone(new Date())}`,
  )[0];

  return (
    <>
      <DemoBanner />
      <p className="text-sm font-medium text-muted">{eyebrow}</p>
      <h1 className="mb-1 text-3xl font-semibold tracking-tight sm:text-4xl">Practicar</h1>
      <p className="mb-6 text-muted">
        {exercises.length} ejercicios sobre una escena. Al final descubrirás de dónde es.
      </p>
      <PracticeSession
        key={quote.id}
        quoteId={quote.id}
        exercises={exercises}
        quoteHref={`/cita/${quote.id}`}
        nextHref={next ? `/practicar/${next.id}` : null}
      />
      <p className="mt-8 text-center text-sm">
        <Link href="/explorar" className="inline-flex min-h-11 items-center text-muted underline">
          Elegir otra cita en Explorar
        </Link>
      </p>
    </>
  );
}
