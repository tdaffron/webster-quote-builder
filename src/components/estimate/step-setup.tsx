import { ChoiceButton } from "@/components/estimate/choice";
import { CONDENSER_SITTINGS, UNIT_LOCATIONS, type CondenserSitting, type UnitLocation } from "@/lib/types";

const HANDLER: Record<UnitLocation, { title: string; body: string }> = {
  closet: { title: "Closet", body: "The shortest swap. We can stand in front of the air handler." },
  utility: { title: "Utility room", body: "A dedicated room, usually on the first floor." },
  garage: { title: "Garage", body: "Extra line-set work to get from the garage back inside." },
  attic: { title: "Attic", body: "Access, a platform, and the drain line add labor." },
};

const CONDENSER: Record<CondenserSitting, { title: string; body: string }> = {
  ground: { title: "Ground level", body: "Sitting on a pad beside the house. The most common spot." },
  mounted: { title: "Mounted", body: "Raised off the ground, on a stand or a wall bracket." },
  rooftop: { title: "Rooftop", body: "On the roof or in a designated equipment area." },
};

export function StepSetup({
  location,
  condenser,
  onLocation,
  onCondenser,
}: {
  location: UnitLocation | null;
  condenser: CondenserSitting | null;
  onLocation: (location: UnitLocation) => void;
  onCondenser: (condenser: CondenserSitting) => void;
}) {
  return (
    <div className="step-in">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Your Home’s Current System Setup</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-steel">
        Every home is a little different! Where your current indoor and outdoor equipment are located can impact installation costs. Let’s start with where your air handler and condenser are located today. Choose the closest match below. The drawing will update as you answer.
      </p>

      <fieldset className="mt-6">
        <legend className="font-heading text-lg font-bold text-ink">Air handler</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {UNIT_LOCATIONS.map((id) => (
            <ChoiceButton key={id} selected={location === id} onClick={() => onLocation(id)} className="px-4 py-3">
              <span className="font-semibold text-ink">{HANDLER[id].title}</span>
              <span className="mt-1 block text-sm leading-6 text-steel">{HANDLER[id].body}</span>
            </ChoiceButton>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-heading text-lg font-bold text-ink">Condenser</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {CONDENSER_SITTINGS.map((id) => (
            <ChoiceButton key={id} selected={condenser === id} onClick={() => onCondenser(id)} className="px-4 py-3">
              <span className="font-semibold text-ink">{CONDENSER[id].title}</span>
              <span className="mt-1 block text-sm leading-6 text-steel">{CONDENSER[id].body}</span>
            </ChoiceButton>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
