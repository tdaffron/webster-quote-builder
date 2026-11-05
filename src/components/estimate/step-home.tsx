import { ChoiceButton } from "@/components/estimate/choice";
import { HouseGraphic, homeBlurb } from "@/components/estimate/house-graphic";
import { HOME_TYPES, type HomeType } from "@/lib/types";

export function StepHome({ home, onChange }: { home: HomeType | null; onChange: (home: HomeType) => void }) {
  return (
    <div className="step-in">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Let’s get to know your home</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-steel">
        Every home has different cooling needs. Tell us a little about yours and we will help narrow down the right options.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {HOME_TYPES.map((type) => {
          const copy = homeBlurb(type);
          const selected = home === type;
          return (
            <ChoiceButton key={type} selected={selected} onClick={() => onChange(type)} className="overflow-hidden p-0">
              <HouseGraphic home={type} compact className="bg-foam" />
              <span className="block px-4 pt-3 pb-4">
                <span className="block font-heading text-lg font-bold text-ink">{copy.title}</span>
                <span className="mt-1 block text-sm leading-6 text-steel">{copy.body}</span>
              </span>
            </ChoiceButton>
          );
        })}
      </div>
    </div>
  );
}
