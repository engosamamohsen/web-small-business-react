import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { questionsFor, recommend, type Answers, type MenuDish, type Recommendation } from "@/lib/meal-helper/engine";
import { buildProductPath } from "@/lib/product-url";

// ─── Meal helper: a few taps, then dishes from this store's menu ─────────────

interface Props {
  dishes: MenuDish[];
  defaultImage?: string;
}

const fmt = (n: number) => (n % 1 === 0 ? n.toString() : n.toFixed(2));

/** Sends a helper event to whichever pixels the store loaded (see src/components/Tracking). */
function track(event: string, data: Record<string, unknown> = {}) {
  const w = window as any;
  try {
    w.fbq?.("trackCustom", event, data);
    w.ttq?.track?.(event, data);
    w.gtag?.("event", event, data);
  } catch {
    // tracking must never break the helper
  }
}

export default function MealHelper({ dishes, defaultImage }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  // Later questions narrow to what fits the earlier answers.
  const questions = useMemo(() => questionsFor(dishes, answers), [dishes, answers]);
  const heading = useRef<HTMLHeadingElement>(null);

  const done = step >= questions.length;
  const result = useMemo(() => (done ? recommend(dishes, answers) : null), [done, dishes, answers]);

  // Move focus to the new question so screen readers announce it.
  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);

  useEffect(() => {
    if (result) track("helper_done", { answers: JSON.stringify(answers), picks: result.picks.length, relaxed: result.relaxed });
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  const answer = (key: keyof Answers, value: unknown) => {
    if (step === 0) track("helper_start");
    // Keep only the answers before this question: after going back and changing
    // one, the later answers may no longer fit.
    const earlier = Object.fromEntries(questions.slice(0, step).map((q) => [q.key, answers[q.key]]));
    setAnswers({ ...earlier, [key]: value });
    setStep(step + 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
  };

  if (dishes.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center ring-1 ring-black/5">
        <p className="text-slate-600">المنيو مش متاح دلوقتي. جرب تاني بعد شوية.</p>
        <a href="/" className="mt-4 inline-block font-semibold text-[var(--main-color)] underline">
          ارجع للرئيسية
        </a>
      </div>
    );
  }

  return (
    <div dir="rtl" className="mx-auto w-full max-w-xl">
      {!done ? (
        <section aria-labelledby="helper-question" className="flex flex-col gap-5 rounded-2xl bg-white p-5 ring-1 ring-black/5 sm:p-7">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
            <span>
              سؤال {step + 1} من {questions.length}
            </span>
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--main-color)]"
              >
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                رجوع
              </button>
            )}
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
            <div className="h-full rounded-full bg-[var(--main-color)] transition-[width] duration-300" style={{ width: `${(step / questions.length) * 100}%` }} />
          </div>

          <h2 id="helper-question" ref={heading} tabIndex={-1} className="text-xl font-bold text-slate-900 outline-none sm:text-2xl">
            {questions[step].title}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {questions[step].options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => answer(questions[step].key, o.value)}
                className="flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center transition hover:border-[var(--main-color)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--main-color)]"
              >
                <span className="text-base font-semibold text-slate-900">{o.label}</span>
                {o.hint && <span className="text-xs text-slate-500">{o.hint}</span>}
              </button>
            ))}
            {questions[step].key !== "people" && (
              <button
                type="button"
                onClick={() => answer(questions[step].key, null)}
                className="col-span-2 rounded-xl border border-dashed border-slate-300 px-3 py-3 text-sm font-medium text-slate-600 transition hover:border-[var(--main-color)] hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--main-color)]"
              >
                مش فارقة
              </button>
            )}
          </div>
        </section>
      ) : (
        <section aria-labelledby="helper-result" className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <h2 id="helper-result" ref={heading} tabIndex={-1} className="flex items-center gap-2 text-xl font-bold text-slate-900 outline-none sm:text-2xl">
                <Sparkles className="h-5 w-5 text-[var(--main-color)]" aria-hidden="true" />
                ده اللي يناسبك
              </h2>
              {result!.relaxed && (
                <p className="text-sm text-slate-500">مالقيناش حاجة بكل اختياراتك، فدي أقرب حاجة ليها.</p>
              )}
            </div>
            <button
              type="button"
              onClick={restart}
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--main-color)]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              ابدأ من جديد
            </button>
          </div>

          <ul className="flex flex-col gap-3">
            {result!.picks.map((pick, i) => (
              <ResultCard key={pick.dish.id} pick={pick} rank={i} defaultImage={defaultImage} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ResultCard({ pick, rank, defaultImage }: { pick: Recommendation; rank: number; defaultImage?: string }) {
  const { dish, quantity, total, reasons } = pick;
  const href = `${buildProductPath(dish)}?from=helper`;
  const image = dish.image || defaultImage;

  return (
    <li className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-black/5 sm:gap-4 sm:p-4">
      {image ? (
        <img src={image} alt="" loading="lazy" decoding="async" className="h-24 w-24 shrink-0 rounded-xl object-cover sm:h-28 sm:w-28" />
      ) : (
        <div className="h-24 w-24 shrink-0 rounded-xl bg-slate-100 sm:h-28 sm:w-28" aria-hidden="true" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900">{dish.name}</h3>
          {rank === 0 && (
            <span className="shrink-0 rounded-full bg-[var(--main-color)] px-2 py-0.5 text-[11px] font-semibold text-white">الأنسب</span>
          )}
        </div>
        {reasons.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {reasons.map((r) => (
              <span key={r} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                {r}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-orange-500">
            {quantity > 1 ? `${quantity} × ${fmt(dish.price)} = ${fmt(total)} ج.م` : `${fmt(dish.price)} ج.م`}
          </span>
          <a
            href={href}
            onClick={() => track("helper_click", { product_id: dish.id, rank: rank + 1 })}
            className="rounded-lg bg-[var(--main-color)] px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--main-color)]"
          >
            شوف الطبق
          </a>
        </div>
      </div>
    </li>
  );
}
