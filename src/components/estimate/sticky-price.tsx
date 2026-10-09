import { moneyRange } from "@/lib/format";
import { PRICE_BOOK } from "@/lib/pricing";
import type { Quote } from "@/lib/estimate";

export function StickyPrice({ quote, detail }: { quote: Quote | null; detail: string }) {
  return (
    <div className="border-t border-cyan/40 bg-foam">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-cyan-deep uppercase">Live range · demo pricing</p>
          <p className="truncate text-sm text-steel">{quote ? detail : "Pick a home and the range shows up here."}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-heading text-lg font-bold tracking-tight text-ink tabular-nums sm:text-2xl">
            {quote ? moneyRange(quote.low, quote.high) : "—"}
          </p>
          <p className="text-xs text-steel tabular-nums sm:text-sm">
            {quote
              ? `${moneyRange(quote.monthlyLow, quote.monthlyHigh)}/mo · ${PRICE_BOOK.financing.termMonths} mo`
              : "Monthly payment lands here"}
          </p>
        </div>
      </div>
    </div>
  );
}
