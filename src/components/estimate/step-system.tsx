import { ChoiceButton } from "@/components/estimate/choice";
import { formatTons } from "@/lib/format";
import { PRICE_BOOK } from "@/lib/pricing";
import { HEAT_STRIPS, THERMOSTATS, TIER_IDS, type HeatStripId, type ThermostatId, type TierId } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function StepSystem({
  tons,
  tier,
  heatStrip,
  thermostat,
  onTier,
  onHeatStrip,
  onThermostat,
}: {
  tons: number;
  tier: TierId | null;
  heatStrip: HeatStripId;
  thermostat: ThermostatId;
  onTier: (tier: TierId) => void;
  onHeatStrip: (id: HeatStripId) => void;
  onThermostat: (id: ThermostatId) => void;
}) {
  return (
    <div className="step-in">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Choose a system</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-steel">
        Three tiers Webster installs. Efficiency is the tier. Heat strip and thermostat are yours to set, and the price at the top follows a {formatTons(tons)} system.
      </p>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {TIER_IDS.map((id) => {
          const spec = PRICE_BOOK.tiers[id];
          const selected = tier === id;
          return (
            <ChoiceButton key={id} selected={selected} onClick={() => onTier(id)} className="flex h-full flex-col p-5">
              <span className="flex items-center justify-between gap-2">
                <span className="font-heading text-xl font-bold text-ink">{spec.name}</span>
                {"featured" in spec && spec.featured ? (
                  <Badge className="bg-mint text-ink hover:bg-mint">Most homes</Badge>
                ) : null}
              </span>
              <span className="mt-3 font-heading text-4xl font-bold tracking-tight text-cyan-deep">
                {spec.seer2}
                <span className="ml-1 text-base font-semibold text-steel">SEER2</span>
              </span>
              <span className="mt-2 text-sm font-semibold text-ink">
                {spec.brand} · {spec.product}
              </span>
              <span className="mt-2 flex-1 text-sm leading-6 text-steel">{spec.detail}</span>
              <span className="mt-4 text-xs font-medium tracking-wide text-steel uppercase">{spec.warranty}</span>
            </ChoiceButton>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <fieldset className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <legend className="font-heading text-lg font-bold text-ink">Heat strip</legend>
          <p className="mt-1 text-sm leading-6 text-steel">Backup electric heat for the few cold mornings.</p>
          <div className="mt-3 grid gap-2">
            {HEAT_STRIPS.map((id) => {
              const strip = PRICE_BOOK.heatStrips[id];
              return (
                <ChoiceButton key={id} selected={heatStrip === id} onClick={() => onHeatStrip(id)} className="px-3 py-3">
                  <span className="font-semibold text-ink">{strip.label}</span>
                  <span className="mt-0.5 block text-sm text-steel">{strip.detail}</span>
                </ChoiceButton>
              );
            })}
          </div>
        </fieldset>
        <fieldset className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <legend className="font-heading text-lg font-bold text-ink">Thermostat</legend>
          <p className="mt-1 text-sm leading-6 text-steel">
            {tier === "best" ? "Best includes the communicating thermostat." : "Programmable is included. The others add a little."}
          </p>
          <div className="mt-3 grid gap-2">
            {THERMOSTATS.map((id) => {
              const stat = PRICE_BOOK.thermostats[id];
              const included = tier === "best" || stat.range[0] === 0;
              return (
                <ChoiceButton key={id} selected={thermostat === id} onClick={() => onThermostat(id)} className="px-3 py-3">
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink">{stat.label}</span>
                    <span className="text-xs font-medium text-cyan-deep">{included ? "Included" : "Adds to the range"}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-steel">{stat.detail}</span>
                </ChoiceButton>
              );
            })}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
