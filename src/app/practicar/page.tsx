import type { Metadata } from "next";
import { PracticeView } from "@/components/practice/PracticeView";
import { getDailyQuote } from "@/lib/quotes/queries";

export const metadata: Metadata = {
  title: "Practicar",
  description:
    "Ejercicios de inglés C1 con la cita del día: quién lo dijo, significado, huecos y registro.",
};

export default async function PracticeTodayPage() {
  const quote = await getDailyQuote();
  if (!quote) {
    return (
      <p className="rounded-2xl border border-border bg-surface p-5">
        Todavía no hay citas para practicar. Vuelve pronto.
      </p>
    );
  }
  return <PracticeView quote={quote} eyebrow="Cita del día" />;
}
