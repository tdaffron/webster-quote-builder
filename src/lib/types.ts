export const HOME_TYPES = ["ranch", "two-story", "townhome"] as const;
export type HomeType = (typeof HOME_TYPES)[number];

export const UNIT_LOCATIONS = ["attic", "closet", "garage"] as const;
export type UnitLocation = (typeof UNIT_LOCATIONS)[number];

export const TIER_IDS = ["good", "better", "best"] as const;
export type TierId = (typeof TIER_IDS)[number];

export const HEAT_STRIPS = ["none", "5", "8", "10"] as const;
export type HeatStripId = (typeof HEAT_STRIPS)[number];

export const THERMOSTATS = ["standard", "wifi", "premium"] as const;
export type ThermostatId = (typeof THERMOSTATS)[number];

export const STANDARD_TONS = [1.5, 2, 2.5, 3, 3.5, 4, 5] as const;
export type StandardTons = (typeof STANDARD_TONS)[number];

export const CALL_TIMES = ["morning", "afternoon", "evening"] as const;
export type CallTime = (typeof CALL_TIMES)[number];

export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

export type MoneyRange = readonly [number, number];
