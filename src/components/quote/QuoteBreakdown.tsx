import { ChevronIcon, GlobeIcon, SceneIcon, SparkIcon, TranslateIcon } from "@/components/icons";
import {
  EXPRESSION_TYPE_BAR,
  EXPRESSION_TYPE_LABEL,
  EXPRESSION_TYPE_STYLE,
  REGISTER_LABEL,
  REGISTER_LEVEL,
} from "@/lib/quotes/labels";
import type { QuoteView } from "@/lib/quotes/schema";

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-accent">
          {icon}
        </span>
        {title}
      </h2>
      <div className="mt-3 leading-relaxed">{children}</div>
    </section>
  );
}

/** Escala de registro: 4 segmentos, de slang a formal. */
function RegisterMeter({ register }: { register: keyof typeof REGISTER_LEVEL }) {
  const level = REGISTER_LEVEL[register];
  return (
    <span className="flex items-center gap-2 text-xs text-muted">
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={`h-1.5 w-4 rounded-full ${n <= level ? "bg-accent" : "bg-surface-2"}`}
          />
        ))}
      </span>
      <span>Registro: {REGISTER_LABEL[register]}</span>
    </span>
  );
}

/** Contexto, traducción (oculta hasta que la pidas), matiz cultural y desglose. */
export function QuoteBreakdown({ quote }: { quote: QuoteView }) {
  return (
    <div className="mt-6 space-y-8">
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard icon={<SceneIcon className="size-4" />} title="La escena">
          <p>{quote.sceneContextEs}</p>
        </InfoCard>

        {/* Primero intenta entenderla: la traducción se despliega a petición (sin JS). */}
        <details className="group self-start rounded-2xl border border-border bg-surface px-5 py-3 shadow-sm open:pb-5">
          <summary className="flex min-h-11 cursor-pointer items-center justify-between gap-2 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-accent">
                <TranslateIcon className="size-4" />
              </span>
              Ver traducción natural
            </span>
            <ChevronIcon className="size-5 text-muted transition-transform group-open:rotate-90" />
          </summary>
          <p className="mt-3 font-serif text-lg italic leading-relaxed">{quote.translationEs}</p>
        </details>
      </div>

      {quote.culturalNoteEs && (
        <InfoCard icon={<GlobeIcon className="size-4" />} title="Matiz cultural">
          <p>{quote.culturalNoteEs}</p>
        </InfoCard>
      )}

      <section aria-labelledby="desglose">
        <div className="flex items-baseline justify-between">
          <h2
            id="desglose"
            className="flex items-center gap-2 text-xl font-semibold tracking-tight"
          >
            <SparkIcon className="size-5 text-accent" />
            Desglose
          </h2>
          <span className="text-sm text-muted">
            {quote.expressions.length}{" "}
            {quote.expressions.length === 1 ? "expresión" : "expresiones"}
          </span>
        </div>

        <ul className="mt-4 space-y-3">
          {quote.expressions.map((e) => (
            <li
              key={e.id}
              id={`expr-${e.id}`}
              className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-surface p-5 pl-6 shadow-sm transition-shadow target:ring-2 target:ring-accent"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-1.5 ${EXPRESSION_TYPE_BAR[e.type]}`}
              />
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p lang="en" className="font-serif text-xl font-semibold leading-snug">
                  {e.phrase}
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${EXPRESSION_TYPE_STYLE[e.type]}`}
                >
                  {EXPRESSION_TYPE_LABEL[e.type]}
                </span>
              </div>
              <p className="mt-2 text-[1.05rem]">{e.meaningEs}</p>
              <p lang="en" className="mt-1 text-sm italic text-muted">
                {e.meaningEn}
              </p>
              {e.noteEs && (
                <p className="mt-3 rounded-xl bg-surface-2 px-3.5 py-2.5 text-sm leading-relaxed">
                  {e.noteEs}
                </p>
              )}
              <div className="mt-4">
                <RegisterMeter register={e.register} />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
