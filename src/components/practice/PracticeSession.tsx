"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  checkGapFill,
  checkMeaning,
  checkWhoSaidIt,
  revealRewrite,
  type ChoiceResult,
  type GapResult,
  type RewriteResult,
} from "@/app/practicar/actions";
import { CheckIcon, CrossIcon, LightbulbIcon } from "@/components/icons";
import type {
  Exercise,
  GapFillExercise,
  MeaningExercise,
  RewriteExercise,
  WhoSaidItExercise,
} from "@/lib/exercises/build";

const TITLES: Record<Exercise["kind"], string> = {
  who_said_it: "¿Quién lo dijo?",
  meaning_mcq: "¿Qué significa?",
  gap_fill: "Completa la cita",
  register_rewrite: "Cambia el registro",
};

const primaryButton =
  "min-h-12 w-full rounded-xl bg-accent px-5 font-semibold text-accent-contrast transition-opacity disabled:opacity-50";
const ERROR = "No se ha podido comprobar. Inténtalo de nuevo.";

type Outcome = { correct: boolean } | { graded: false };

function Feedback({
  correct,
  title,
  children,
}: {
  correct: boolean;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className={`mt-4 rounded-2xl border p-4 ${
        correct
          ? "border-emerald-600/30 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-100"
          : "border-rose-600/30 bg-rose-50 text-rose-950 dark:bg-rose-950 dark:text-rose-100"
      }`}
    >
      <p className="flex items-center gap-2 font-semibold">
        {correct ? <CheckIcon className="size-5" /> : <CrossIcon className="size-5" />}
        {title}
      </p>
      {children && <div className="mt-2 text-sm leading-relaxed">{children}</div>}
    </div>
  );
}

function Options({
  name,
  options,
  value,
  onChange,
  disabled,
  lang,
}: {
  name: string;
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
  disabled: boolean;
  lang?: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:disabled]:cursor-default"
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            disabled={disabled}
            className="size-5 shrink-0 accent-[var(--accent)]"
          />
          <span lang={lang}>{option}</span>
        </label>
      ))}
    </div>
  );
}

function ChoiceStep({
  exercise,
  check,
  onDone,
  lang,
}: {
  exercise: WhoSaidItExercise | MeaningExercise;
  check: (picked: string) => Promise<ChoiceResult>;
  onDone: (o: Outcome) => void;
  lang?: string;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<ChoiceResult | null>(null);
  const [pending, start] = useTransition();
  const answered = result?.ok === true;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!picked) return;
        start(async () => {
          const r = await check(picked);
          setResult(r);
          if (r.ok) onDone({ correct: r.correct });
        });
      }}
    >
      <fieldset>
        <legend className="sr-only">Elige una opción</legend>
        <Options
          name={exercise.kind}
          options={exercise.options}
          value={picked}
          onChange={setPicked}
          disabled={answered || pending}
          lang={lang}
        />
      </fieldset>
      {!answered && (
        <button type="submit" disabled={!picked || pending} className={`${primaryButton} mt-4`}>
          {pending ? "Comprobando…" : "Comprobar"}
        </button>
      )}
      {result?.ok === false && (
        <p role="alert" className="mt-3 text-sm text-accent">
          {ERROR}
        </p>
      )}
      {result?.ok && (
        <Feedback correct={result.correct} title={result.correct ? "¡Correcto!" : "No exactamente"}>
          {!result.correct && (
            <p>
              Respuesta: <strong>{result.answer}</strong>
            </p>
          )}
          {result.detail && <p className="mt-1">{result.detail}</p>}
        </Feedback>
      )}
    </form>
  );
}

function GapStep({
  quoteId,
  exercise,
  onDone,
}: {
  quoteId: string;
  exercise: GapFillExercise;
  onDone: (o: Outcome) => void;
}) {
  const [value, setValue] = useState("");
  const [hint, setHint] = useState(false);
  const [result, setResult] = useState<GapResult | null>(null);
  const [pending, start] = useTransition();
  const answered = result?.ok === true;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await checkGapFill(quoteId, exercise.expressionId, value);
          setResult(r);
          if (r.ok) onDone({ correct: r.correct });
        });
      }}
    >
      <p lang="en" className="font-serif text-xl leading-relaxed">
        {exercise.before}
        <span className="mx-1 inline-block min-w-16 border-b-2 border-accent text-center text-accent">
          {answered ? result.answer : " ? "}
        </span>
        {exercise.after}
      </p>
      <label htmlFor="gap" className="mt-5 block text-sm font-medium">
        Escribe la expresión que falta
      </label>
      <input
        id="gap"
        lang="en"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={answered || pending}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        maxLength={120}
        className="mt-1 block min-h-12 w-full rounded-xl border border-border bg-surface px-4"
      />
      {!answered && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setHint(true)}
            disabled={hint}
            className="flex min-h-12 items-center gap-1.5 rounded-xl border border-border bg-surface px-4 text-sm font-medium disabled:opacity-50"
          >
            <LightbulbIcon className="size-4" />
            Pista
          </button>
          <button type="submit" disabled={!value.trim() || pending} className={primaryButton}>
            {pending ? "Comprobando…" : "Comprobar"}
          </button>
        </div>
      )}
      {hint && !answered && (
        <p className="mt-3 rounded-xl bg-surface-2 px-4 py-3 text-sm">
          <span lang="en" className="font-mono tracking-widest">
            {exercise.pattern}
          </span>
          <span className="mt-1 block text-muted">Significa: {exercise.hintEs}</span>
        </p>
      )}
      {result?.ok === false && (
        <p role="alert" className="mt-3 text-sm text-accent">
          {ERROR}
        </p>
      )}
      {result?.ok && (
        <Feedback
          correct={result.correct}
          title={
            result.almost
              ? "¡Casi! Revisa la ortografía"
              : result.correct
                ? "¡Correcto!"
                : "No exactamente"
          }
        >
          <p>
            La expresión es <strong lang="en">{result.answer}</strong>: {result.detail}
          </p>
        </Feedback>
      )}
    </form>
  );
}

function RewriteStep({
  quoteId,
  exercise,
  onDone,
}: {
  quoteId: string;
  exercise: RewriteExercise;
  onDone: (o: Outcome) => void;
}) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [pending, start] = useTransition();
  const target = exercise.direction === "to_formal" ? "formal" : "informal";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await revealRewrite(quoteId, value);
          setResult(r);
          if (r.ok) onDone({ graded: false });
        });
      }}
    >
      <blockquote
        lang="en"
        className="border-l-4 border-accent pl-4 font-serif text-xl leading-relaxed"
      >
        {exercise.text}
      </blockquote>
      <label htmlFor="rewrite" className="mt-5 block text-sm font-medium">
        Reescribe la idea en registro <strong>{target}</strong>
      </label>
      <textarea
        id="rewrite"
        lang="en"
        rows={3}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={result?.ok || pending}
        autoCapitalize="sentences"
        maxLength={500}
        className="mt-1 block w-full rounded-xl border border-border bg-surface px-4 py-3"
      />
      {!result?.ok && (
        <button type="submit" disabled={pending} className={`${primaryButton} mt-3`}>
          {pending
            ? "Cargando…"
            : value.trim()
              ? "Comparar con una respuesta modelo"
              : "Ver una respuesta modelo"}
        </button>
      )}
      {result?.ok === false && (
        <p role="alert" className="mt-3 text-sm text-accent">
          {ERROR}
        </p>
      )}
      {result?.ok && (
        <div role="status" className="mt-4 space-y-3">
          {result.feedbackEs.length > 0 && (
            <ul className="space-y-1 rounded-2xl border border-amber-600/30 bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950 dark:text-amber-100">
              {result.feedbackEs.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          )}
          <div className="rounded-2xl border border-border bg-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">
              Una posible respuesta
            </p>
            <p lang="en" className="mt-1 font-serif text-lg">
              {result.modelAnswer}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {result.tipsEs.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </form>
  );
}

export function PracticeSession({
  quoteId,
  exercises,
  quoteHref,
  nextHref,
}: {
  quoteId: string;
  exercises: Exercise[];
  quoteHref: string;
  nextHref: string | null;
}) {
  const [step, setStep] = useState(0);
  const [outcomes, setOutcomes] = useState<Record<number, Outcome>>({});
  const finished = step >= exercises.length;
  const current = exercises[step];
  const done = outcomes[step] !== undefined;

  const record = (o: Outcome) => setOutcomes((prev) => ({ ...prev, [step]: o }));
  const graded = Object.values(outcomes).filter((o): o is { correct: boolean } => "correct" in o);
  const score = graded.filter((o) => o.correct).length;

  return (
    <div>
      <div className="mb-5 flex gap-1.5" aria-hidden="true">
        {exercises.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < step || (i === step && done) ? "bg-accent" : "bg-surface-2"
            }`}
          />
        ))}
      </div>

      {finished || !current ? (
        <section className="animate-rise rounded-3xl border border-border bg-surface p-6 text-center shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">¡Sesión completada!</h2>
          {graded.length > 0 && (
            <p className="mt-2 text-muted">
              Has acertado <strong className="text-text">{score}</strong> de {graded.length}.
            </p>
          )}
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Link
              href={quoteHref}
              className="flex min-h-12 items-center justify-center rounded-xl border border-border bg-surface px-4 font-semibold"
            >
              Ver la cita y el desglose
            </Link>
            {nextHref && (
              <Link
                href={nextHref}
                className="flex min-h-12 items-center justify-center rounded-xl bg-accent px-4 font-semibold text-accent-contrast"
              >
                Practicar otra cita
              </Link>
            )}
          </div>
        </section>
      ) : (
        <section key={step} className="animate-rise" aria-labelledby="ejercicio">
          <p className="text-sm text-muted">
            Ejercicio {step + 1} de {exercises.length}
          </p>
          <h2 id="ejercicio" className="mb-4 text-2xl font-semibold tracking-tight">
            {TITLES[current.kind]}
          </h2>

          {current.kind === "who_said_it" && (
            <>
              <blockquote
                lang="en"
                className="cinema-screen mb-4 rounded-2xl p-5 font-serif text-xl text-screen-text"
              >
                “{current.text}”
              </blockquote>
              <ChoiceStep
                exercise={current}
                check={(p) => checkWhoSaidIt(quoteId, p)}
                onDone={record}
              />
            </>
          )}

          {current.kind === "meaning_mcq" && (
            <>
              <p className="mb-4">
                En esta cita,{" "}
                <strong lang="en" className="font-serif text-lg">
                  {current.phrase}
                </strong>{" "}
                significa…
              </p>
              <ChoiceStep
                exercise={current}
                check={(p) => checkMeaning(quoteId, current.expressionId, p)}
                onDone={record}
              />
            </>
          )}

          {current.kind === "gap_fill" && (
            <GapStep quoteId={quoteId} exercise={current} onDone={record} />
          )}

          {current.kind === "register_rewrite" && (
            <RewriteStep quoteId={quoteId} exercise={current} onDone={record} />
          )}

          {done && (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className={`${primaryButton} mt-4`}
            >
              {step + 1 < exercises.length ? "Siguiente" : "Ver resultado"}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
