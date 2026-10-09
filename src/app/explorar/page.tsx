import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { DemoBanner } from "@/components/DemoBanner";
import { QuoteTile } from "@/components/quote/QuoteTile";
import { franchiseOf, slugify } from "@/lib/quotes/labels";
import { getAllQuotes } from "@/lib/quotes/queries";

export const metadata: Metadata = {
  title: "Explorar citas",
  description: "Todas las citas de cine y series para practicar inglés C1, por temas y por obra.",
};

const slugParam = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .max(80);

type Filters = { tema: string | null; obra: string | null };
type Option = { slug: string; label: string; count: number };

/** URL de Explorar con los filtros dados (los nulos se omiten). */
function exploreHref(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.tema) params.set("tema", filters.tema);
  if (filters.obra) params.set("obra", filters.obra);
  const query = params.toString();
  return query ? `/explorar?${query}` : "/explorar";
}

function chipClass(active: boolean) {
  return `inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors ${
    active ? "border-text bg-text text-bg" : "border-border bg-surface text-muted hover:text-text"
  }`;
}

function count(map: Map<string, Option>, slug: string, label: string) {
  const entry = map.get(slug) ?? { slug, label, count: 0 };
  entry.count++;
  map.set(slug, entry);
}

function FilterRow({
  label,
  allLabel,
  options,
  active,
  hrefFor,
}: {
  label: string;
  allLabel: string;
  options: Option[];
  active: string | null;
  hrefFor: (slug: string | null) => string;
}) {
  return (
    <nav aria-label={label} className="-mx-4 mt-3 overflow-x-auto px-4 pb-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
      <ul className="flex gap-2">
        <li>
          <Link
            href={hrefFor(null)}
            aria-current={active ? undefined : "page"}
            className={chipClass(!active)}
          >
            {allLabel}
          </Link>
        </li>
        {options.map((o) => (
          <li key={o.slug}>
            <Link
              href={hrefFor(o.slug)}
              aria-current={active === o.slug ? "page" : undefined}
              className={chipClass(active === o.slug)}
            >
              {o.label}
              <span className="ml-1.5 text-xs tabular-nums">{o.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function ExplorePage({ searchParams }: PageProps<"/explorar">) {
  const params = await searchParams;
  const tema = slugParam.safeParse(params.tema);
  const obra = slugParam.safeParse(params.obra);
  const filters: Filters = {
    tema: tema.success ? tema.data : null,
    obra: obra.success ? obra.data : null,
  };

  const quotes = await getAllQuotes();
  const workSlug = (title: string) => slugify(franchiseOf(title));

  const tags = new Map<string, Option>();
  const works = new Map<string, Option>();
  for (const q of quotes) {
    for (const t of q.tags) count(tags, t.slug, t.nameEs);
    count(works, workSlug(q.work.title), franchiseOf(q.work.title));
  }
  const byCount = (a: Option, b: Option) => b.count - a.count || a.label.localeCompare(b.label);

  const visible = quotes.filter(
    (q) =>
      (!filters.tema || q.tags.some((t) => t.slug === filters.tema)) &&
      (!filters.obra || workSlug(q.work.title) === filters.obra),
  );

  return (
    <>
      <DemoBanner />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Explorar</h1>
      <p className="mt-1 text-muted">
        {quotes.length} escenas para afinar tu inglés. Filtra por tema o por serie y película.
      </p>

      <div className="mt-4">
        <FilterRow
          label="Temas"
          allLabel="Todos"
          options={[...tags.values()].sort(byCount)}
          active={filters.tema}
          hrefFor={(slug) => exploreHref({ ...filters, tema: slug })}
        />
        <FilterRow
          label="Series y películas"
          allLabel="Todas"
          options={[...works.values()].sort(byCount)}
          active={filters.obra}
          hrefFor={(slug) => exploreHref({ ...filters, obra: slug })}
        />
      </div>

      <p className="mt-5 text-sm text-muted" aria-live="polite">
        {visible.length} {visible.length === 1 ? "cita" : "citas"}
      </p>

      {visible.length > 0 ? (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {visible.map((q) => (
            <li key={q.id} className="min-w-0 animate-rise">
              <QuoteTile quote={q} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-2xl border border-border bg-surface p-5">
          No hay citas con esa combinación de filtros.{" "}
          <Link href="/explorar" className="text-accent underline">
            Quitar filtros
          </Link>
        </p>
      )}
    </>
  );
}
