import { PRICE_BOOK } from "@/lib/pricing";
import { nearestTons } from "@/lib/sizing";
import type {
  HeatStripId,
  HomeType,
  StandardTons,
  ThermostatId,
  TierId,
  UnitLocation,
} from "@/lib/types";

export type QuoteLine = {
  id: string;
  label: string;
  detail?: string;
  low: number;
  high: number;
};

export type Quote = {
  tons: StandardTons;
  tier: TierId | null;
  low: number;
  high: number;
  monthlyLow: number;
  monthlyHigh: number;
  lines: QuoteLine[];
  wide: boolean;
};

export type QuoteInput = {
  home: HomeType;
  location: UnitLocation | null;
  tons: number;
  tier: TierId | null;
  heatStrip: HeatStripId;
  thermostat: ThermostatId;
};

export function monthlyPayment(
  principal: number,
  apr: number = PRICE_BOOK.financing.apr,
  months: number = PRICE_BOOK.financing.termMonths,
): number {
  if (principal <= 0) return 0;
  const monthlyRate = apr / 12;
  if (monthlyRate === 0) return principal / months;
  const growth = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * growth) / (growth - 1);
}

function band(table: Record<StandardTons, readonly [number, number]>, tons: StandardTons): [number, number] {
  const found = table[tons];
  return [found[0], found[1]];
}

function thermostatCharge(tier: TierId | null, thermostat: ThermostatId): [number, number] {
  if (tier === "best") return [0, 0];
  const range = PRICE_BOOK.thermostats[thermostat].range;
  return [range[0], range[1]];
}

export function buildQuote(input: QuoteInput): Quote {
  const tons = nearestTons(input.tons);
  const strip = PRICE_BOOK.heatStrips[input.heatStrip];
  const thermo = PRICE_BOOK.thermostats[input.thermostat];
  const story = PRICE_BOOK.stories[input.home];
  const location = input.location ? PRICE_BOOK.locations[input.location] : null;

  const equipment: [number, number] = input.tier
    ? band(PRICE_BOOK.tiers[input.tier].byTons, tons)
    : [PRICE_BOOK.tiers.good.byTons[tons][0], PRICE_BOOK.tiers.best.byTons[tons][1]];

  const thermoRange = thermostatCharge(input.tier, input.thermostat);
  const thermoDetail =
    input.tier === "best"
      ? "Included with Best."
      : thermoRange[0] === 0
        ? "Included."
        : thermo.detail;

  const lines: QuoteLine[] = [
    {
      id: "equipment",
      label: input.tier
        ? `${PRICE_BOOK.tiers[input.tier].name} · ${PRICE_BOOK.tiers[input.tier].brand} equipment and install`
        : "Equipment and install, Good through Best",
      low: equipment[0],
      high: equipment[1],
    },
  ];

  if (story.range[0] > 0 || story.range[1] > 0) {
    lines.push({
      id: "stories",
      label: story.label,
      detail: "Second-floor return and a longer line set.",
      low: story.range[0],
      high: story.range[1],
    });
  }

  if (location && (location.range[0] > 0 || location.range[1] > 0)) {
    lines.push({
      id: "location",
      label: `${location.label} installation`,
      detail: location.detail,
      low: location.range[0],
      high: location.range[1],
    });
  }

  lines.push({
    id: "strip",
    label: strip.kw === 0 ? "No heat strip" : `${strip.label} heat strip`,
    detail: strip.detail,
    low: strip.range[0],
    high: strip.range[1],
  });

  lines.push({
    id: "thermostat",
    label: `${thermo.label} thermostat`,
    detail: thermoDetail,
    low: thermoRange[0],
    high: thermoRange[1],
  });

  const low = lines.reduce((sum, line) => sum + line.low, 0);
  const high = lines.reduce((sum, line) => sum + line.high, 0);

  return {
    tons,
    tier: input.tier,
    low,
    high,
    monthlyLow: Math.round(monthlyPayment(low)),
    monthlyHigh: Math.round(monthlyPayment(high)),
    lines,
    wide: input.tier == null,
  };
}
