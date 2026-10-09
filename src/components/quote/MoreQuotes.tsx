import Link from "next/link";
import { QuoteTile } from "./QuoteTile";
import type { QuoteView } from "@/lib/quotes/schema";

export function MoreQuotes({ quotes }: { quotes: QuoteView[] }) {
  if (quotes.length === 0) return null;
  return (
    <section className="mt-12" aria-labelledby="mas-citas">
      <div className="flex items-baseline justify-between">
        <h2 id="mas-citas" className="text-xl font-semibold tracking-tight">
          Sigue explorando
        </h2>
        <Link
          href="/explorar"
          className="inline-flex min-h-11 items-center text-sm font-medium text-accent"
        >
          Ver todas
        </Link>
      </div>
      <ul className="mt-3 grid gap-3 sm:grid-cols-3">
        {quotes.map((q) => (
          <li key={q.id} className="min-w-0">
            <QuoteTile quote={q} />
          </li>
        ))}
      </ul>
    </section>
  );
}
