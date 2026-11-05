import { publicPath } from "@/lib/public-path";
import type { CondenserSitting, HomeType, UnitLocation } from "@/lib/types";
import { cn } from "cn";

type HouseGraphicProps = {
  home: HomeType | null;
  location?: UnitLocation | null;
  condenser?: CondenserSitting | null;
  compact?: boolean;
  className?: string;
};

const HOME_LABEL: Record<HomeType, string> = {
  single: "Single Story Home",
  "multi-story": "Multi-Story Home",
  "multi-family": "Multi-Family Home",
};

const HOME_ART: Record<HomeType, string> = {
  single: "/homes/single-story.jpg",
  "multi-story": "/homes/multi-story.jpg",
  "multi-family": "/homes/multi-family.jpg",
};

const LOCATION_LABEL: Record<UnitLocation, string> = {
  closet: "Closet air handler",
  utility: "Utility room air handler",
  garage: "Garage air handler",
  attic: "Attic air handler",
};

const CONDENSER_LABEL: Record<CondenserSitting, string> = {
  ground: "Ground-level condenser",
  mounted: "Mounted condenser",
  rooftop: "Rooftop condenser",
};

type Spot = { left: string; top: string };

/** Centers, as a percent of each house drawing. */
const HANDLER_SPOT: Record<HomeType, Record<UnitLocation, Spot>> = {
  single: {
    closet: { left: "46%", top: "56%" },
    utility: { left: "70%", top: "56%" },
    garage: { left: "26%", top: "57%" },
    attic: { left: "48%", top: "34%" },
  },
  "multi-story": {
    closet: { left: "48%", top: "24%" },
    utility: { left: "42%", top: "55%" },
    garage: { left: "18%", top: "56%" },
    attic: { left: "56%", top: "14%" },
  },
  "multi-family": {
    closet: { left: "42%", top: "40%" },
    utility: { left: "58%", top: "40%" },
    garage: { left: "58%", top: "68%" },
    attic: { left: "48%", top: "24%" },
  },
};

const CONDENSER_SPOT: Record<HomeType, Record<CondenserSitting, Spot>> = {
  single: {
    ground: { left: "6%", top: "62%" },
    mounted: { left: "8%", top: "50%" },
    rooftop: { left: "78%", top: "36%" },
  },
  "multi-story": {
    ground: { left: "92%", top: "62%" },
    mounted: { left: "90%", top: "40%" },
    rooftop: { left: "80%", top: "16%" },
  },
  "multi-family": {
    ground: { left: "34%", top: "82%" },
    mounted: { left: "36%", top: "55%" },
    rooftop: { left: "46%", top: "16%" },
  },
};

export function HouseGraphic({ home, location = null, condenser = null, compact = false, className }: HouseGraphicProps) {
  const label = [
    home ? HOME_LABEL[home] : "Home not chosen",
    location ? LOCATION_LABEL[location] : null,
    condenser ? CONDENSER_LABEL[condenser] : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <figure className={cn("m-0", className)}>
      {home ? (
        <div className="relative bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={publicPath(HOME_ART[home])} alt={label} width={1408} height={768} className="h-auto w-full" />
          {!compact && location ? (
            <Equipment art="/homes/air-handler.png" label={LOCATION_LABEL[location]} spot={HANDLER_SPOT[home][location]} width="7.4%" />
          ) : null}
          {!compact && condenser ? (
            <Equipment art="/homes/condenser.png" label={CONDENSER_LABEL[condenser]} spot={CONDENSER_SPOT[home][condenser]} width="8.4%" />
          ) : null}
        </div>
      ) : (
        <div
          role="img"
          aria-label={label}
          className="flex aspect-[1408/768] items-center justify-center bg-[#f3fbfd] text-base font-semibold text-steel"
        >
          Pick a home
        </div>
      )}
      {!compact && home ? (
        <figcaption className="mt-3 flex flex-wrap gap-2 px-1 text-sm text-steel">
          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">{HOME_LABEL[home]}</span>
          {location ? (
            <span className="rounded-full bg-foam px-3 py-1 font-medium text-cyan-deep ring-1 ring-cyan/40">
              {LOCATION_LABEL[location]}
            </span>
          ) : (
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Air handler not placed yet</span>
          )}
          {condenser ? (
            <span className="rounded-full bg-foam px-3 py-1 font-medium text-cyan-deep ring-1 ring-cyan/40">
              {CONDENSER_LABEL[condenser]}
            </span>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

function Equipment({ art, label, spot, width }: { art: string; label: string; spot: Spot; width: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={publicPath(art)}
      alt=""
      aria-hidden
      title={label}
      className="pointer-events-none absolute max-w-none -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-500 ease-out"
      style={{ left: spot.left, top: spot.top, width }}
    />
  );
}

export function homeBlurb(home: HomeType): { title: string; body: string } {
  if (home === "single") {
    return {
      title: "Single Story Home",
      body: "A standalone home with all living areas on one floor. The outdoor unit is typically at ground level with the indoor air handler in the closet, utility room, garage, or attic.",
    };
  }
  if (home === "multi-story") {
    return {
      title: "Multi-Story Home",
      body: "A standalone home with living areas on multiple floors. The outdoor unit is typically at ground level, with the indoor air handler in the closet, utility room, garage, or attic.",
    };
  }
  return {
    title: "Multi-Family Home",
    body: "This includes townhomes, duplexes, triplexes, condos, or larger residential properties. Equipment may be separate or shared, line sets can differ, and the outdoor unit may be on the roof or in a designated equipment area.",
  };
}
