import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@/components/icons";
import { DemoBanner } from "@/components/DemoBanner";
import { MoreQuotes } from "@/components/quote/MoreQuotes";
import { QuoteBreakdown } from "@/components/quote/QuoteBreakdown";
import { QuoteCard } from "@/components/quote/QuoteCard";
import { getMoreQuotes, getQuote } from "@/lib/quotes/queries";

export async function generateMetadata({ params }: PageProps<"/cita/[id]">): Promise<Metadata> {
  const quote = await getQuote((await params).id);
  if (!quote) return { title: "Cita no encontrada" };
  return {
    title: `${quote.character} en ${quote.work.title}`,
    description: `Aprende las expresiones de nivel ${quote.level} de esta cita de ${quote.work.title}.`,
  };
}

export default async function QuotePage({ params }: PageProps<"/cita/[id]">) {
  const quote = await getQuote((await params).id);
  if (!quote) notFound();

  return (
    <>
      <DemoBanner />
      <Link
        href="/explorar"
        className="mb-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted hover:text-text"
      >
        <ArrowLeftIcon className="size-4" />
        Todas las citas
      </Link>
      <QuoteCard quote={quote} eyebrow={quote.work.type === "series" ? "Serie" : "Película"} />
      <QuoteBreakdown quote={quote} />
      <MoreQuotes quotes={await getMoreQuotes(quote.id)} />
    </>
  );
}
