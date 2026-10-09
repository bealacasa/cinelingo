import type { Metadata } from "next";
import Link from "next/link";
import { z } from "zod";
import { DemoBanner } from "@/components/DemoBanner";
import { QuoteTile } from "@/components/quote/QuoteTile";
import { getAllQuotes } from "@/lib/quotes/queries";

export const metadata: Metadata = {
  title: "Explorar citas",
  description: "Todas las citas de cine y series para practicar inglés C1, por temas.",
};

const tagParam = z
  .string()
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  .max(60);

export default async function ExplorePage({ searchParams }: PageProps<"/explorar">) {
  const parsed = tagParam.safeParse((await searchParams).tema);
  const activeTag = parsed.success ? parsed.data : null;

  const quotes = await getAllQuotes();
  const tags = new Map<string, { nameEs: string; count: number }>();
  for (const q of quotes)
    for (const t of q.tags) {
      const entry = tags.get(t.slug) ?? { nameEs: t.nameEs, count: 0 };
      entry.count++;
      tags.set(t.slug, entry);
    }
  const sortedTags = [...tags.entries()].sort((a, b) => b[1].count - a[1].count);
  const visible = activeTag
    ? quotes.filter((q) => q.tags.some((t) => t.slug === activeTag))
    : quotes;

  const chip = (active: boolean) =>
    `inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors ${
      active ? "border-text bg-text text-bg" : "border-border bg-surface text-muted hover:text-text"
    }`;

  return (
    <>
      <DemoBanner />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Explorar</h1>
      <p className="mt-1 text-muted">
        {quotes.length} escenas para afinar tu inglés. Elige un tema.
      </p>

      <nav aria-label="Temas" className="-mx-4 mt-5 overflow-x-auto px-4 pb-1">
        <ul className="flex gap-2">
          <li>
            <Link
              href="/explorar"
              aria-current={activeTag ? undefined : "page"}
              className={chip(!activeTag)}
            >
              Todas
            </Link>
          </li>
          {sortedTags.map(([slug, { nameEs, count }]) => (
            <li key={slug}>
              <Link
                href={`/explorar?tema=${slug}`}
                aria-current={activeTag === slug ? "page" : undefined}
                className={chip(activeTag === slug)}
              >
                {nameEs}
                <span className="ml-1.5 text-xs tabular-nums">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {visible.length > 0 ? (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {visible.map((q) => (
            <li key={q.id} className="min-w-0 animate-rise">
              <QuoteTile quote={q} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 rounded-2xl border border-border bg-surface p-5">
          No hay citas con ese tema.{" "}
          <Link href="/explorar" className="text-accent underline">
            Ver todas
          </Link>
        </p>
      )}
    </>
  );
}
