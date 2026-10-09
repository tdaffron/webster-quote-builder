import type { HeatStripId, HomeType, MoneyRange, StandardTons, ThermostatId, TierId, UnitLocation } from "@/lib/types";

/**
 * Placeholder installed-price book for a full heat-pump changeout in the
 * Orlando area (outdoor unit, air handler, pad, disconnect, haul-away, and
 * a permit allowance).
 *
 * Swap this module for Webster's real price book later. The estimate math in
 * `estimate.ts` only reads the shapes below — keep the keys and replace the
 * dollar ranges.
 *
 * Ranges are demo figures, not a quote. Tiers do not overlap so a presenter
 * can show the price step up as the homeowner moves from Good to Best.
 */
export const PRICE_BOOK = {
  currency: "USD",
  region: "Orlando, FL",
  tiers: {
    good: {
      id: "good" as const,
      name: "Good",
      brand: "Comfortmaker",
      product: "Single-stage heat pump",
      seer2: 15.2,
      headline: "Steady comfort, straightforward install.",
      detail:
        "A single-stage Comfortmaker heat pump. It cools the house, holds up to an Orlando summer, and keeps the installed price in check.",
      warranty: "10-year parts · 2-year labor",
      byTons: {
        1.5: [6400, 8200],
        2: [7200, 9200],
        2.5: [7800, 9900],
        3: [8400, 10800],
        3.5: [9100, 11600],
        4: [9800, 12600],
        5: [11200, 14400],
      } satisfies Record<StandardTons, MoneyRange>,
    },
    better: {
      id: "better" as const,
      name: "Better",
      brand: "Comfortmaker",
      product: "Two-stage heat pump",
      seer2: 17,
      headline: "Quieter, and better at pulling humidity out.",
      detail:
        "Two-stage Comfortmaker equipment. Longer, gentler cycles on humid afternoons. The system most Orlando homes land on.",
      warranty: "10-year parts · 5-year labor",
      featured: true,
      byTons: {
        1.5: [8600, 10800],
        2: [9400, 11800],
        2.5: [10200, 12800],
        3: [11000, 13800],
        3.5: [12000, 15000],
        4: [13000, 16200],
        5: [14800, 18600],
      } satisfies Record<StandardTons, MoneyRange>,
    },
    best: {
      id: "best" as const,
      name: "Best",
      brand: "Trane",
      product: "Variable-speed heat pump",
      seer2: 19,
      headline: "The tightest temperature hold we install.",
      detail:
        "A variable-speed Trane heat pump with a communicating thermostat included. Long, quiet runtimes and the strongest humidity control.",
      warranty: "10-year parts · 10-year labor",
      byTons: {
        1.5: [11200, 14000],
        2: [12200, 15400],
        2.5: [13200, 16600],
        3: [14400, 18200],
        3.5: [15600, 19600],
        4: [16800, 21200],
        5: [19200, 24200],
      } satisfies Record<StandardTons, MoneyRange>,
    },
  } satisfies Record<
    TierId,
    {
      id: TierId;
      name: string;
      brand: string;
      product: string;
      seer2: number;
      headline: string;
      detail: string;
      warranty: string;
      featured?: boolean;
      byTons: Record<StandardTons, MoneyRange>;
    }
  >,
  heatStrips: {
    none: {
      label: "No heat strip",
      kw: 0,
      detail: "Heat pump only. Fine if you rarely want backup heat.",
      range: [0, 0],
    },
    "5": {
      label: "5 kW",
      kw: 5,
      detail: "The usual starting point for a Florida heat pump.",
      range: [350, 500],
    },
    "8": {
      label: "8 kW",
      kw: 8,
      detail: "More backup on the few cold mornings we get.",
      range: [450, 700],
    },
    "10": {
      label: "10 kW",
      kw: 10,
      detail: "For larger homes or rooms that run cold.",
      range: [600, 850],
    },
  } satisfies Record<HeatStripId, { label: string; kw: number; detail: string; range: MoneyRange }>,
  thermostats: {
    standard: {
      label: "Programmable",
      detail: "A reliable thermostat, included with the install.",
      range: [0, 0],
    },
    wifi: {
      label: "Wi-Fi",
      detail: "Change the temperature from the couch, or from the airport.",
      range: [250, 350],
    },
    premium: {
      label: "Communicating",
      detail: "Talks to the equipment. Included with Best.",
      range: [400, 650],
    },
  } satisfies Record<ThermostatId, { label: string; detail: string; range: MoneyRange }>,
  locations: {
    attic: {
      label: "Attic",
      detail: "Platform, drain line, and the pull through the attic.",
      range: [450, 900],
    },
    closet: {
      label: "Closet",
      detail: "The shortest swap. The air handler is already where we can reach it.",
      range: [0, 0],
    },
    garage: {
      label: "Garage",
      detail: "A longer line set and a chase back into the house.",
      range: [250, 550],
    },
  } satisfies Record<UnitLocation, { label: string; detail: string; range: MoneyRange }>,
  stories: {
    ranch: { label: "Single story", range: [0, 0] as MoneyRange },
    "two-story": {
      label: "Two-story labor",
      range: [650, 1100] as MoneyRange,
    },
    townhome: { label: "Townhome", range: [0, 0] as MoneyRange },
  } satisfies Record<HomeType, { label: string; range: MoneyRange }>,
  financing: {
    apr: 0.0999,
    termMonths: 60,
    label: "60 months at 9.99% APR",
    disclaimer:
      "Placeholder financing for this demo. Not a credit offer and not a commitment to lend. Webster’s lender terms would replace this rate, term, and payment.",
  },
  included: [
    "Outdoor heat pump and matching indoor air handler",
    "Thermostat shown in your options",
    "Heat strip shown in your options",
    "New disconnect, whip, and a level pad",
    "Line-set flush and haul-away of the old equipment",
    "Permit allowance",
  ],
  excluded: [
    "Duct replacement or added returns",
    "Electrical panel upgrades",
    "Code items we only find once we’re in the attic or closet",
    "A second system, if the house needs one",
  ],
} as const;

export type TierSpec = (typeof PRICE_BOOK.tiers)[TierId];
