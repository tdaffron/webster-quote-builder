import { cn } from "cn";
import { Check } from "lucide-react";

const STEPS = ["Your home", "Current setup", "Data plate", "System", "Price", "Quote"] as const;

export function Stepper({ step, maxReachable, onStep }: { step: number; maxReachable: number; onStep: (index: number) => void }) {
  return (
    <nav aria-label="Estimate steps" className="overflow-x-auto">
      <ol className="flex min-w-[36rem] items-start gap-1 sm:min-w-0">
        {STEPS.map((label, index) => {
          const complete = index < step;
          const current = index === step;
          const enabled = index <= maxReachable;
          return (
            <li key={label} className="flex min-w-0 flex-1 items-start">
              <button
                type="button"
                disabled={!enabled}
                onClick={() => onStep(index)}
                aria-current={current ? "step" : undefined}
                className="group flex min-w-0 flex-1 flex-col items-center gap-2 disabled:cursor-not-allowed"
              >
                <span className="flex w-full items-center">
                  <span className={cn("h-px flex-1", index === 0 ? "bg-transparent" : complete || current ? "bg-cyan" : "bg-slate-200")} />
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition",
                      current && "bg-cyan text-ink ring-4 ring-cyan/25",
                      complete && "bg-mint text-ink",
                      !current && !complete && "bg-white text-steel ring-1 ring-slate-200",
                      enabled && !current && "group-hover:ring-cyan/50",
                    )}
                  >
                    {complete ? <Check className="size-4" aria-hidden /> : index + 1}
                  </span>
                  <span className={cn("h-px flex-1", index === STEPS.length - 1 ? "bg-transparent" : index < step ? "bg-cyan" : "bg-slate-200")} />
                </span>
                <span className={cn("px-1 text-center text-xs leading-tight sm:text-[13px]", current ? "font-semibold text-ink" : "text-steel")}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
