import { cn } from "cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function ChoiceButton({
  selected,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "rounded-2xl bg-white p-4 text-left ring-1 ring-slate-200 transition hover:ring-cyan focus-visible:ring-2 focus-visible:ring-cyan-deep focus-visible:outline-none",
        selected && "bg-foam shadow-[0_16px_40px_-28px_rgba(11,110,138,0.9)] ring-2 ring-cyan-deep",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
