import { PRICE_BOOK } from "@/lib/pricing";
import { nearestTons } from "@/lib/sizing";
import type { AirQualityId, HomeType, StandardTons, ThermostatId, TierId, UnitLocation } from "@/lib/types";

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
  lines: QuoteLine[];
  wide: boolean;
};

export type QuoteInput = {
  home: HomeType;
  location: UnitLocation | null;
  tons: number;
  tier: TierId | null;
  thermostat: ThermostatId;
  airQuality: AirQualityId;
};

export function monthlyPayment(principal: number, apr = 0.0999, months = 60): number {
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
  if (tier === "best" && thermostat === "premium") return [0, 0];
  const range = PRICE_BOOK.thermostats[thermostat].range;
  return [range[0], range[1]];
}

export function buildQuote(input: QuoteInput): Quote {
  const tons = nearestTons(input.tons);
  const thermo = PRICE_BOOK.thermostats[input.thermostat];
  const story = PRICE_BOOK.stories[input.home];
  const location = input.location ? PRICE_BOOK.locations[input.location] : null;
  const air = PRICE_BOOK.airQuality[input.airQuality];

  const equipment: [number, number] = input.tier
    ? band(PRICE_BOOK.tiers[input.tier].byTons, tons)
    : [PRICE_BOOK.tiers.good.byTons[tons][0], PRICE_BOOK.tiers.best.byTons[tons][1]];

  const thermoRange = thermostatCharge(input.tier, input.thermostat);
  const thermoDetail =
    thermoRange[0] === 0
      ? input.tier === "best" && input.thermostat === "premium"
        ? "Included with Premium."
        : "Included."
      : thermo.detail;

  const lines: QuoteLine[] = [
    {
      id: "equipment",
      label: input.tier
        ? `${PRICE_BOOK.tiers[input.tier].name} · ${PRICE_BOOK.tiers[input.tier].brand} equipment and install`
        : "Equipment and install, Basic through Premium",
      detail: "Includes the heat strip.",
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

  if (air.range[0] > 0 || air.range[1] > 0) {
    lines.push({
      id: "air",
      label: air.label,
      detail: air.detail,
      low: air.range[0],
      high: air.range[1],
    });
  }

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
    lines,
    wide: input.tier == null,
  };
}
