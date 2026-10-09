import { DemoBanner } from "@/components/DemoBanner";
import { MoreQuotes } from "@/components/quote/MoreQuotes";
import { QuoteBreakdown } from "@/components/quote/QuoteBreakdown";
import { PracticeCta } from "@/components/practice/PracticeCta";
import { QuoteCard } from "@/components/quote/QuoteCard";
import { APP_TIME_ZONE } from "@/lib/quotes/daily";
import { getDailyQuote, getMoreQuotes } from "@/lib/quotes/queries";

export default async function HomePage() {
  const quote = await getDailyQuote();
  const today = new Intl.DateTimeFormat("es-ES", {
    timeZone: APP_TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <>
      <DemoBanner />
      <p className="mb-1 text-sm font-medium text-muted">
        {today.charAt(0).toUpperCase() + today.slice(1)}
      </p>
      <p className="mb-5 text-3xl font-semibold tracking-tight sm:text-4xl">Tu escena de hoy</p>
      {quote ? (
        <>
          <QuoteCard quote={quote} eyebrow="Cita del día" />
          <PracticeCta href="/practicar" />
          <QuoteBreakdown quote={quote} />
          <MoreQuotes quotes={await getMoreQuotes(quote.id)} />
        </>
      ) : (
        <p className="rounded-2xl border border-border bg-surface p-5">
          Todavía no hay citas publicadas. Vuelve pronto.
        </p>
      )}
    </>
  );
}
