import { ChoiceButton } from "@/components/estimate/choice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DecodedPlate } from "@/lib/decoder";
import { formatTons } from "@/lib/format";
import { HEAT_SOURCES, STANDARD_TONS, type HeatSource, type StandardTons } from "@/lib/types";

const HEAT_LABEL: Record<HeatSource, string> = {
  "heat-pump": "Heat Pump",
  electric: "Electric",
  gas: "Gas/Propane",
};

export function StepCustomize({
  model,
  serial,
  decoded,
  tons,
  heat,
  heatConfirmed,
  showHelp,
  onModel,
  onSerial,
  onTons,
  onHeat,
  onConfirmHeat,
  onToggleHelp,
}: {
  model: string;
  serial: string;
  decoded: DecodedPlate;
  tons: StandardTons | null;
  heat: HeatSource | null;
  heatConfirmed: boolean;
  showHelp: boolean;
  onModel: (value: string) => void;
  onSerial: (value: string) => void;
  onTons: (tons: StandardTons) => void;
  onHeat: (heat: HeatSource) => void;
  onConfirmHeat: (keep: boolean) => void;
  onToggleHelp: () => void;
}) {
  const needsCheck = heat === "electric" || heat === "gas";
  return (
    <div className="step-in">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Let’s Customize Your Comfort</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-steel">
        Select your current system size and what heats your home. You’ll compare efficiency on the next step.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="model-number">Model number</Label>
          <Input id="model-number" value={model} onChange={(event) => onModel(event.target.value)} placeholder="4TWR4036J1000A" className="h-11" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="serial-number">Serial number</Label>
          <Input id="serial-number" value={serial} onChange={(event) => onSerial(event.target.value)} placeholder="1428TRN4512" className="h-11" />
        </div>
      </div>
      {decoded.ok ? (
        <p className="mt-3 text-sm text-ink">
          {decoded.brand} {decoded.kindLabel.toLowerCase()}, {formatTons(decoded.tons)}.
          {decoded.ageLabel ? ` ${decoded.ageLabel}.` : ""}
        </p>
      ) : model.trim().length > 3 ? (
        <p className="mt-3 text-sm text-steel">{decoded.message}</p>
      ) : null}

      <Button type="button" variant="outline" className="mt-4 h-10 rounded-full px-4" onClick={onToggleHelp}>
        I’m not sure
      </Button>
      {showHelp ? (
        <p className="mt-3 max-w-2xl rounded-2xl bg-foam px-4 py-3 text-sm leading-6 text-ink ring-1 ring-cyan/30">
          If you don’t have the model or serial number, call{" "}
          <a href="tel:+14072950598" className="font-semibold text-cyan-deep">
            (407) 295-0598
          </a>{" "}
          or email{" "}
          <a href="mailto:info@websterac.com" className="font-semibold text-cyan-deep">
            info@websterac.com
          </a>
          . The office can walk you through this step or set up the visit. You can continue without those numbers.
        </p>
      ) : null}

      <fieldset className="mt-6">
        <legend className="font-heading text-lg font-bold text-ink">System size</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {STANDARD_TONS.map((size) => (
            <ChoiceButton key={size} selected={tons === size} onClick={() => onTons(size)} className="px-4 py-3">
              <span className="font-semibold text-ink">{formatTons(size)}</span>
            </ChoiceButton>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="font-heading text-lg font-bold text-ink">Heating</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {HEAT_SOURCES.map((id) => (
            <ChoiceButton key={id} selected={heat === id} onClick={() => onHeat(id)} className="px-4 py-3">
              <span className="font-semibold text-ink">{HEAT_LABEL[id]}</span>
            </ChoiceButton>
          ))}
        </div>
        {needsCheck && !heatConfirmed ? (
          <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-cyan/40">
            <p className="text-sm leading-6 text-ink">
              You picked {HEAT_LABEL[heat]}. Most replacements we install are heat pumps. Is this home really heated with{" "}
              {heat === "gas" ? "gas or propane" : "electric resistance"}, not a heat pump?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" className="h-10 rounded-full px-4" onClick={() => onConfirmHeat(true)}>
                Yes, keep {HEAT_LABEL[heat]}
              </Button>
              <Button type="button" variant="outline" className="h-10 rounded-full px-4" onClick={() => onConfirmHeat(false)}>
                No, it’s a heat pump
              </Button>
            </div>
          </div>
        ) : null}
      </fieldset>
    </div>
  );
}
