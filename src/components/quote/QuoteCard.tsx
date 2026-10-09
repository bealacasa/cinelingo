import { ClapperIcon } from "@/components/icons";
import { segmentText } from "@/lib/quotes/highlight";
import { VARIETY_SHORT, sourceLabel } from "@/lib/quotes/labels";
import type { QuoteView } from "@/lib/quotes/schema";

/**
 * Cita en una "pantalla de cine" (siempre oscura). Las expresiones resaltadas
 * enlazan a su explicación. Texto plano: React lo escapa, nunca HTML.
 */
export function QuoteCard({
  quote,
  eyebrow,
  headingLevel = 1,
}: {
  quote: QuoteView;
  eyebrow?: string;
  headingLevel?: 1 | 2;
}) {
  const segments = segmentText(
    quote.text,
    quote.expressions.map((e) => ({ id: e.id, start: e.start, end: e.end })),
  );
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <figure className="cinema-screen relative animate-rise overflow-hidden rounded-[1.75rem] px-6 pb-6 pt-7 text-screen-text sm:px-10 sm:pb-9 sm:pt-10">
      <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-[0.18em] text-screen-muted">
        <Heading className="text-screen-accent">{eyebrow ?? "Cita"}</Heading>
        <span className="flex items-center gap-1.5">
          <span className="rounded-full bg-white/10 px-2.5 py-1 tracking-normal normal-case">
            {quote.level}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 tracking-normal normal-case">
            {VARIETY_SHORT[quote.variety]}
          </span>
        </span>
      </div>

      <blockquote lang="en" className="mt-6 sm:mt-8">
        <p className="font-serif text-[1.7rem] leading-[1.25] tracking-[-0.01em] text-balance sm:text-4xl sm:leading-[1.2]">
          <span aria-hidden="true" className="text-screen-accent">
            “
          </span>
          {segments.map((segment, i) =>
            segment.id ? (
              <a
                key={i}
                href={`#expr-${segment.id}`}
                className="rounded-md bg-screen-mark px-1 underline decoration-screen-accent decoration-2 underline-offset-[6px] transition-colors hover:bg-screen-accent/30"
              >
                {segment.text}
              </a>
            ) : (
              <span key={i}>{segment.text}</span>
            ),
          )}
          <span aria-hidden="true" className="text-screen-accent">
            ”
          </span>
        </p>
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5 sm:mt-9">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-screen-accent"
        >
          <ClapperIcon />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{quote.character}</span>
          <cite className="block truncate text-sm not-italic text-screen-muted">
            {sourceLabel(quote)}
          </cite>
        </span>
      </figcaption>
    </figure>
  );
}
