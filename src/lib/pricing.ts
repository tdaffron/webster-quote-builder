import type { AirQualityId, HomeType, MoneyRange, StandardTons, ThermostatId, TierId, UnitLocation } from "@/lib/types";

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
 * can show the price step up as the homeowner moves from Basic to Premium.
 */
export const PRICE_BOOK = {
  currency: "USD",
  region: "Orlando, FL",
  tiers: {
    good: {
      id: "good" as const,
      name: "Basic",
      dollarSigns: "$",
      brand: "Comfortmaker",
      product: "Single-stage heat pump",
      seer2: 15.2,
      headline: "Steady comfort, straightforward install.",
      detail:
        "A single-stage Comfortmaker heat pump. It cools the house, holds up through an Orlando summer, and keeps the installed price in check.",
      warranty: "10-year parts · 1-year labor",
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
      name: "Enhanced",
      dollarSigns: "$$",
      brand: "Comfortmaker",
      product: "Two-stage heat pump",
      seer2: 17,
      headline: "Quieter, and better at pulling humidity out.",
      detail:
        "Two-stage Comfortmaker equipment. Longer, gentler cycles on humid afternoons. The system most Orlando homes land on.",
      warranty: "10-year parts · 1-year labor",
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
      name: "Premium",
      dollarSigns: "$$$",
      brand: "Trane",
      product: "Variable-speed heat pump",
      seer2: 19,
      headline: "The tightest temperature hold we install.",
      detail:
        "A variable-speed Trane heat pump with a communicating thermostat included. Long, quiet runtimes and the strongest humidity control.",
      warranty: "10-year parts · 1-year labor",
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
      dollarSigns: string;
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
  airQuality: {
    none: {
      label: "No add-on",
      detail: "The system as priced, without an air-treatment product.",
      range: [0, 0],
    },
    scrubber: {
      label: "Air Scrubber",
      detail: "Placeholder add-on. Webster has not priced this yet.",
      range: [700, 1100],
    },
    reme: {
      label: "REME Halo",
      detail: "Placeholder add-on. Webster has not priced this yet.",
      range: [1100, 1600],
    },
    uv: {
      label: "UV Light",
      detail: "Placeholder add-on. Webster has not priced this yet.",
      range: [400, 700],
    },
  } satisfies Record<AirQualityId, { label: string; detail: string; range: MoneyRange }>,
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
      detail: "Talks to the equipment. Included with Premium.",
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
    utility: {
      label: "Utility room",
      detail: "Priced like a closet until Webster sets a different adder.",
      range: [0, 0],
    },
    garage: {
      label: "Garage",
      detail: "A longer line set and a chase back into the house.",
      range: [250, 550],
    },
  } satisfies Record<UnitLocation, { label: string; detail: string; range: MoneyRange }>,
  stories: {
    single: { label: "Single story", range: [0, 0] as MoneyRange },
    "multi-story": {
      label: "Multi-story labor",
      range: [650, 1100] as MoneyRange,
    },
    "multi-family": { label: "Multi-family", range: [0, 0] as MoneyRange },
  } satisfies Record<HomeType, { label: string; range: MoneyRange }>,
  priceNote:
    "All prices shown are approximate ranges for budgeting purposes only. They are not an official estimate or quote. Actual pricing depends on your home’s specific needs and installation requirements. A member of the Webster AC sales team must visit your property to provide a detailed quote with accurate pricing.",
  included: [
    "Outdoor condenser and indoor air handler",
    "Thermostat chosen",
    "Heat strip",
    "Float switch",
    "Hurricane straps",
    "Permitting",
    "Line set flush, equipment haul-away, and complete system start-up",
  ],
  excluded: [
    "Duct replacement or added returns",
    "Grille replacements",
    "Electrical panel upgrades",
    "Code items we only find once we are on site",
    "A second system, if desired",
    "Drain pan and air handler platform needs",
    "Copper line set integrity",
    "Filter sizing and housing",
  ],
} as const;

export type TierSpec = (typeof PRICE_BOOK.tiers)[TierId];
