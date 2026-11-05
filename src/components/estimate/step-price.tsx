import { moneyRange } from "@/lib/format";
import type { Quote } from "@/lib/estimate";
import { PRICE_BOOK } from "@/lib/pricing";

export function StepPrice({ quote, summary }: { quote: Quote; summary: string }) {
  const tier = quote.tier ? PRICE_BOOK.tiers[quote.tier] : null;
  return (
    <div className="step-in">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Your approximate range</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-steel">{summary}</p>

      <div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200">
        <p className="text-xs font-semibold tracking-[0.16em] text-cyan-deep uppercase">Installed price</p>
        <p className="mt-2 font-heading text-4xl font-bold tracking-tight text-ink tabular-nums sm:text-5xl">
          {moneyRange(quote.low, quote.high)}
        </p>
        {tier ? (
          <p className="mt-2 text-sm text-steel">
            {tier.name} · {tier.brand} {tier.product} · {tier.seer2} SEER2
          </p>
        ) : null}
        <p className="mt-4 text-sm leading-6 text-steel">{PRICE_BOOK.priceNote}</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="font-heading text-lg font-bold text-ink">Price includes</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-steel">
            {PRICE_BOOK.included.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-mint-deep" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="font-heading text-lg font-bold text-ink">Confirmed on site</h2>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-steel">
            {PRICE_BOOK.excluded.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
