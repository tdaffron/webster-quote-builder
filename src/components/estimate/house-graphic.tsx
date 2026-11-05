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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={publicPath(HOME_ART[home])}
          alt={label}
          width={1408}
          height={768}
          className="h-auto w-full bg-white"
        />
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
