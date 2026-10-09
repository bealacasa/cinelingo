import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeView } from "@/components/practice/PracticeView";
import { getQuote } from "@/lib/quotes/queries";

// Sin el nombre de la obra en el título: revelaría la respuesta de "¿Quién lo dijo?".
export const metadata: Metadata = { title: "Practicar" };

export default async function PracticeQuotePage({ params }: PageProps<"/practicar/[id]">) {
  const quote = await getQuote((await params).id);
  if (!quote) notFound();
  return <PracticeView quote={quote} eyebrow="Práctica" />;
}
