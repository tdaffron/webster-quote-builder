import { formatTons } from "@/lib/format";
import { STANDARD_TONS, type HomeType, type StandardTons } from "@/lib/types";

/** Cooled square feet per ton. A stand-in for Manual J, not a load calculation. */
export const SQFT_PER_TON: Record<HomeType, number> = {
  ranch: 450,
  "two-story": 420,
  townhome: 500,
};

export type SizingAdvice = {
  rawTons: number;
  recommended: StandardTons;
  allowed: StandardTons[];
  secondSystem: boolean;
  note: string;
};

export function nearestTons(raw: number): StandardTons {
  return STANDARD_TONS.reduce((best, tons) =>
    Math.abs(tons - raw) < Math.abs(best - raw) ? tons : best,
  );
}

export function sizingAdvice(sqft: number, home: HomeType, existingTons: number | null): SizingAdvice {
  const rawTons = sqft / SQFT_PER_TON[home];
  const secondSystem = rawTons > 5.4;
  const target = Math.min(rawTons, 5);
  const recommended = nearestTons(target);

  const allowed = new Set<StandardTons>(
    STANDARD_TONS.filter((tons) => Math.abs(tons - target) <= 0.55),
  );
  allowed.add(recommended);

  if (allowed.size < 2 && !secondSystem) {
    const neighbor = STANDARD_TONS.filter((tons) => !allowed.has(tons)).reduce((best, tons) =>
      Math.abs(tons - target) < Math.abs(best - target) ? tons : best,
    );
    allowed.add(neighbor);
  }

  const sizes = STANDARD_TONS.filter((tons) => allowed.has(tons));
  const existing =
    existingTons == null ? null : STANDARD_TONS.find((tons) => tons === existingTons) ?? nearestTons(existingTons);

  let note: string;
  if (secondSystem) {
    note = `About ${formatTons(Number(rawTons.toFixed(1)))} of cooling on a rule-of-thumb load. That’s past one system in Florida. This range prices a single 5-ton system, and the in-home visit would look at a second.`;
  } else if (existing != null && existing > recommended + 0.49) {
    note = `The plate shows ${formatTons(existing)}. For this house we’d start at ${formatTons(recommended)} so the system runs long enough to pull humidity out.`;
  } else if (existing != null && existing < recommended - 0.49) {
    note = `The plate shows ${formatTons(existing)}, which looks small for this square footage. Allowed sizes start around ${formatTons(recommended)}.`;
  } else if (existing != null && existing === recommended) {
    note = `The plate matches the size we’d start with: ${formatTons(existing)}.`;
  } else if (existing != null) {
    note = `${formatTons(existing)} is on the plate. ${formatTons(recommended)} is the size we’d price first, and both are in the allowed range.`;
  } else {
    note = `From the square footage, we’d start at ${formatTons(recommended)}. A Manual J on site is what locks the size.`;
  }

  return { rawTons, recommended, allowed: sizes, secondSystem, note };
}
