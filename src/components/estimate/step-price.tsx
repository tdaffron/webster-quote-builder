import { money, moneyRange } from "@/lib/format";
import type { Quote } from "@/lib/estimate";
import { PRICE_BOOK } from "@/lib/pricing";
import { Separator } from "@/components/ui/separator";

export function StepPrice({ quote, summary }: { quote: Quote; summary: string }) {
  const tier = quote.tier ? PRICE_BOOK.tiers[quote.tier] : null;
  return (
    <div className="step-in">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Your range</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-steel">{summary}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
          <p className="text-xs font-semibold tracking-[0.16em] text-cyan-deep uppercase">Installed price</p>
          <p className="mt-2 font-heading text-4xl font-bold tracking-tight text-ink tabular-nums sm:text-5xl">
            {moneyRange(quote.low, quote.high)}
          </p>
          {tier ? (
            <p className="mt-2 text-sm text-steel">
              {tier.name} · {tier.brand} {tier.product} · {tier.seer2} SEER2
            </p>
          ) : null}
          <Separator className="my-5" />
          <ul className="grid gap-3">
            {quote.lines.map((line) => (
              <li key={line.id} className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium text-ink">{line.label}</span>
                  {line.detail ? <span className="block text-xs leading-5 text-steel">{line.detail}</span> : null}
                </span>
                <span className="shrink-0 text-sm font-semibold text-ink tabular-nums">
                  {line.low === 0 && line.high === 0 ? "Included" : moneyRange(line.low, line.high)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-ink p-6 text-white">
          <p className="text-xs font-semibold tracking-[0.16em] text-cyan uppercase">Monthly</p>
          <p className="mt-2 font-heading text-4xl font-bold tabular-nums">{moneyRange(quote.monthlyLow, quote.monthlyHigh)}</p>
          <p className="mt-1 text-sm text-white/70">per month · {PRICE_BOOK.financing.label}</p>
          <p className="mt-4 text-sm leading-6 text-white/75">{PRICE_BOOK.financing.disclaimer}</p>
          <p className="mt-4 text-xs text-white/50">
            Example on the low end: {money(quote.low)} financed. The in-home quote replaces both ends of this range.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <h2 className="font-heading text-lg font-bold text-ink">In the range</h2>
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
      <p className="mt-4 text-sm leading-6 text-steel">
        These figures are placeholder prices for the demo. They live in one file so Webster’s price book can replace them without touching the screens.
      </p>
    </div>
  );
}
