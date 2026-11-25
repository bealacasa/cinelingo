import Link from "next/link";
import { EXPRESSION_TYPE_STYLE, EXPRESSION_TYPE_LABEL } from "@/lib/quotes/labels";
import type { QuoteView } from "@/lib/quotes/schema";
import { CharacterAvatar } from "./CharacterAvatar";

/** Tarjeta compacta de una cita para listados. */
export function QuoteTile({ quote }: { quote: QuoteView }) {
  const firstType = quote.expressions[0]?.type;
  return (
    <Link
      href={`/cita/${quote.id}`}
      className="group flex h-full min-h-11 min-w-0 flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
    >
      <span className="mb-3 flex items-center gap-2.5">
        <CharacterAvatar name={quote.character} size="sm" />
        <span className="min-w-0 text-sm">
          <span className="block truncate font-semibold">{quote.character}</span>
          <span className="block truncate text-xs text-muted">
            {quote.work.title} &middot; {quote.work.year}
          </span>
        </span>
      </span>
      <span lang="en" className="line-clamp-4 font-serif text-lg leading-snug">
        &ldquo;{quote.text}&rdquo;
      </span>
      <span className="mt-auto flex items-end justify-between gap-2 pt-4">
        {firstType && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${EXPRESSION_TYPE_STYLE[firstType]}`}
          >
            {EXPRESSION_TYPE_LABEL[firstType]}
          </span>
        )}
        <span className="text-xs text-muted">
          {quote.level} &middot; {quote.expressions.length}{" "}
          {quote.expressions.length === 1 ? "expr." : "expr."}
        </span>
      </span>
    </Link>
  );
}
