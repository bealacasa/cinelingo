import Link from "next/link";
import { EXPRESSION_TYPE_STYLE, EXPRESSION_TYPE_LABEL } from "@/lib/quotes/labels";
import type { QuoteView } from "@/lib/quotes/schema";

/** Tarjeta compacta de una cita para listados. */
export function QuoteTile({ quote }: { quote: QuoteView }) {
  const firstType = quote.expressions[0]?.type;
  return (
    <Link
      href={`/cita/${quote.id}`}
      className="group flex h-full min-h-11 min-w-0 flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
    >
      <span lang="en" className="line-clamp-4 font-serif text-lg leading-snug">
        “{quote.text}”
      </span>
      <span className="mt-auto flex items-end justify-between gap-2 pt-4">
        <span className="min-w-0 text-sm">
          <span className="block truncate font-medium">{quote.character}</span>
          <span className="block truncate text-muted">
            {quote.work.title} · {quote.work.year}
          </span>
        </span>
        {firstType && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${EXPRESSION_TYPE_STYLE[firstType]}`}
          >
            {EXPRESSION_TYPE_LABEL[firstType]}
          </span>
        )}
      </span>
    </Link>
  );
}
