import { ChoiceButton } from "@/components/estimate/choice";
import { formatSqft } from "@/lib/format";
import type { UnitLocation } from "@/lib/types";
import { Slider } from "@/components/ui/slider";

const LOCATIONS: { id: UnitLocation; title: string; body: string }[] = [
  {
    id: "attic",
    title: "Attic",
    body: "Common on slab ranches. Access, a platform, and the drain line add labor.",
  },
  {
    id: "closet",
    title: "Hall or utility closet",
    body: "The easiest swap. Short line set, and we can stand in front of the unit.",
  },
  {
    id: "garage",
    title: "Garage",
    body: "Often an end unit or an older home. Extra line-set work to get back inside.",
  },
];

const PRESETS = [1200, 1600, 2000, 2600, 3200];

export function StepSetup({
  location,
  sqft,
  onLocation,
  onSqft,
}: {
  location: UnitLocation | null;
  sqft: number;
  onLocation: (location: UnitLocation) => void;
  onSqft: (sqft: number) => void;
}) {
  return (
    <div className="step-in">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Where does the system sit today?</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-steel">
        The indoor unit’s location changes the labor. Square footage sets the size we’d start with. The house on the left updates as you answer.
      </p>

      <div className="mt-6 grid gap-3">
        {LOCATIONS.map((item) => (
          <ChoiceButton key={item.id} selected={location === item.id} onClick={() => onLocation(item.id)} className="px-4 py-3">
            <span className="font-heading text-lg font-bold text-ink">{item.title}</span>
            <span className="mt-1 block text-sm leading-6 text-steel">{item.body}</span>
          </ChoiceButton>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <div className="flex items-end justify-between gap-3">
          <label htmlFor="sqft" className="font-heading text-lg font-bold text-ink">
            Cooled square footage
          </label>
          <p className="font-heading text-2xl font-bold text-cyan-deep tabular-nums">{formatSqft(sqft)}</p>
        </div>
        <p className="mt-1 text-sm leading-6 text-steel">Living area only. Leave out the garage, lanai, and attic. A guess is fine.</p>
        <Slider
          id="sqft"
          aria-label="Cooled square footage"
          min={900}
          max={4200}
          step={50}
          value={[sqft]}
          onValueChange={(value) => onSqft(Array.isArray(value) ? value[0] : value)}
          className="mt-6"
        />
        <div className="mt-2 flex justify-between text-xs text-steel">
          <span>900</span>
          <span>4,200</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onSqft(preset)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
                sqft === preset ? "bg-cyan text-ink ring-cyan" : "bg-white text-steel ring-slate-200 hover:ring-cyan"
              }`}
            >
              {formatSqft(preset)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
