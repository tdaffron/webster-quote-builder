import { formatSqft } from "@/lib/format";
import type { HomeType, UnitLocation } from "@/lib/types";
import { cn } from "cn";

type HouseGraphicProps = {
  home: HomeType | null;
  location?: UnitLocation | null;
  sqft?: number | null;
  compact?: boolean;
  className?: string;
};

const HOME_LABEL: Record<HomeType, string> = {
  ranch: "Single-story ranch",
  "two-story": "Two-story",
  townhome: "Townhome",
};

const LOCATION_LABEL: Record<UnitLocation, string> = {
  attic: "Attic air handler",
  closet: "Closet air handler",
  garage: "Garage air handler",
};

function Window({ x, y, w = 52, h = 38 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill="#f7fbfc" stroke="#3d4c5c" strokeWidth={2} />
      <rect x={x + 3} y={y + 3} width={w - 6} height={h - 6} fill="#d7f3fa" />
      <path d={`M${x + 3} ${y + h / 2} H${x + w - 3}`} stroke="#f7fbfc" strokeWidth={2} />
      <path d={`M${x + 8} ${y + 8} l10 -2`} stroke="#ffffff" strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

function Door({ x, y, h = 74 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={34} height={h} rx={2} fill="#243038" />
      <rect x={x + 6} y={y + 8} width={22} height={16} rx={1} fill="#9ad7ea" />
      <circle cx={x + 26} cy={y + h / 2} r={2} fill="#57c4e5" />
    </g>
  );
}

function GarageDoor({ x, y, w = 92, h = 72 }: { x: number; y: number; w?: number; h?: number }) {
  const rows = 4;
  const gap = (h - 8) / rows;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={2} fill="#e7edf1" stroke="#3d4c5c" strokeWidth={2} />
      {Array.from({ length: rows }, (_, index) => (
        <path key={index} d={`M${x + 6} ${y + 6 + gap * index} H${x + w - 6}`} stroke="#b7c3cc" strokeWidth={2} />
      ))}
    </g>
  );
}

function AirHandler({ x, y }: { x: number; y: number }) {
  return (
    <g
      style={{
        transformBox: "fill-box",
        transformOrigin: "0 0",
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 480ms cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <rect width={62} height={38} rx={4} fill="#e7f7fc" stroke="#0b6e8a" strokeWidth={2} />
      <circle cx={18} cy={19} r={9} fill="#ffffff" stroke="#57c4e5" strokeWidth={2} />
      <path d="M18 12.5 v13 M11.5 19 h13" stroke="#0b6e8a" strokeWidth={1.5} />
      <text x={33} y={23} fill="#0b6e8a" fontSize={11} fontWeight={700} fontFamily="Cabin, sans-serif">
        AH
      </text>
    </g>
  );
}

function Condenser({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={2} y={34} width={52} height={6} rx={1} fill="#c5ced6" />
      <rect x={6} y={8} width={44} height={28} rx={3} fill="#d5dde3" stroke="#3d4c5c" strokeWidth={2} />
      <ellipse cx={28} cy={8} rx={16} ry={6} fill="#eef3f6" stroke="#3d4c5c" strokeWidth={2} />
      <ellipse cx={28} cy={8} rx={7} ry={2.5} fill="none" stroke="#57c4e5" strokeWidth={1.5} />
      <path d="M12 16 h32 M12 24 h32 M12 31 h32" stroke="#9aab87" strokeWidth={1} opacity={0.0} />
      <path d="M14 18 h28 M14 25 h28" stroke="#b7c4ce" strokeWidth={1.4} />
    </g>
  );
}

function Palm({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M18 78 C22 50 16 36 26 18" fill="none" stroke="#8a6239" strokeWidth={5} strokeLinecap="round" />
      <path d="M26 20 C10 18 2 28 0 34" fill="none" stroke="#1f8a4c" strokeWidth={3} strokeLinecap="round" />
      <path d="M26 18 C18 6 28 -2 40 2" fill="none" stroke="#2ea15d" strokeWidth={3} strokeLinecap="round" />
      <path d="M26 18 C36 8 50 8 56 16" fill="none" stroke="#176b38" strokeWidth={3} strokeLinecap="round" />
      <path d="M26 22 C40 22 50 30 52 40" fill="none" stroke="#27a35a" strokeWidth={3} strokeLinecap="round" />
      <circle cx={26} cy={18} r={3} fill="#80ed99" />
    </g>
  );
}

function Ground() {
  return <ellipse cx={360} cy={430} rx={250} ry={18} fill="#d5f5e0" />;
}

function SqftLine({ sqft, x1, x2, y }: { sqft: number; x1: number; x2: number; y: number }) {
  return (
    <g>
      <path d={`M${x1} ${y} H${x2}`} stroke="#0b6e8a" strokeWidth={1.5} />
      <path d={`M${x1} ${y - 6} V${y + 6} M${x2} ${y - 6} V${y + 6}`} stroke="#0b6e8a" strokeWidth={1.5} />
      <text
        x={(x1 + x2) / 2}
        y={y - 8}
        textAnchor="middle"
        fill="#0b6e8a"
        fontSize={13}
        fontWeight={700}
        fontFamily="Cabin, sans-serif"
      >
        {formatSqft(sqft)}
      </text>
    </g>
  );
}

function Ranch({ location }: { location: UnitLocation | null }) {
  const attic = location === "attic";
  const closet = location === "closet";
  const garage = location === "garage";
  return (
    <g>
      <Palm x={600} y={300} />
      <Condenser x={36} y={318} />
      <path d="M78 268 L168 168 H552 L642 268 Z" fill="#5e6e80" stroke="#3d4c5c" strokeWidth={2} />
      <path d="M168 168 H552" stroke="#d5dde3" strokeWidth={3} />
      <path d="M120 250 H600" stroke="#4e5d6d" strokeWidth={2} opacity={0.45} />
      <path d="M150 220 H570" stroke="#4e5d6d" strokeWidth={2} opacity={0.3} />
      {attic ? (
        <path d="M230 230 L280 186 H470 L520 230 Z" fill="#f4ecdf" stroke="#0b6e8a" strokeWidth={2} strokeDasharray="5 4" />
      ) : null}
      <rect x={110} y={268} width={500} height={128} fill="#f6f3ee" stroke="#3d4c5c" strokeWidth={2} />
      <path d="M430 268 V396" stroke="#3d4c5c" strokeWidth={2} />
      {garage ? <rect x={432} y={270} width={176} height={124} fill="#e7f6fb" opacity={0.85} /> : null}
      <Window x={150} y={300} />
      <Window x={230} y={300} />
      <Door x={330} y={322} />
      <Window x={390} y={300} w={28} h={38} />
      <GarageDoor x={470} y={300} w={110} h={84} />
      {closet ? (
        <g>
          <rect x={145} y={292} width={92} height={86} rx={3} fill="#e7f7fc" stroke="#0b6e8a" strokeWidth={2} />
          <path d="M191 292 V378" stroke="#0b6e8a" strokeWidth={1.5} />
        </g>
      ) : null}
      {location === "attic" ? <AirHandler x={330} y={188} /> : null}
      {location === "closet" ? <AirHandler x={158} y={318} /> : null}
      {location === "garage" ? <AirHandler x={448} y={328} /> : null}
    </g>
  );
}

function TwoStory({ location }: { location: UnitLocation | null }) {
  const attic = location === "attic";
  const closet = location === "closet";
  const garage = location === "garage";
  return (
    <g>
      <Palm x={40} y={300} scale={0.9} />
      <Condenser x={560} y={330} />
      <path d="M188 176 L330 78 L500 176 Z" fill="#5e6e80" stroke="#3d4c5c" strokeWidth={2} />
      <path d="M250 140 H430" stroke="#4e5d6d" strokeWidth={2} opacity={0.4} />
      {attic ? <path d="M286 150 L330 104 L392 150 Z" fill="#f4ecdf" stroke="#0b6e8a" strokeWidth={2} /> : null}
      <rect x={200} y={176} width={280} height={220} fill="#f6f3ee" stroke="#3d4c5c" strokeWidth={2} />
      <path d="M200 286 H480" stroke="#3d4c5c" strokeWidth={2} />
      <rect x={96} y={286} width={120} height={110} fill={garage ? "#e7f6fb" : "#f6f3ee"} stroke="#3d4c5c" strokeWidth={2} />
      <path d="M96 286 H200" stroke="#3d4c5c" strokeWidth={2} />
      <GarageDoor x={114} y={312} w={84} h={72} />
      <Window x={230} y={206} />
      <Window x={320} y={206} />
      <Window x={400} y={206} />
      <Window x={230} y={312} />
      <Door x={330} y={322} />
      <Window x={400} y={312} />
      {closet ? <rect x={220} y={304} width={78} height={78} rx={3} fill="#e7f7fc" stroke="#0b6e8a" strokeWidth={2} /> : null}
      {location === "attic" ? <AirHandler x={308} y={108} /> : null}
      {location === "closet" ? <AirHandler x={228} y={328} /> : null}
      {location === "garage" ? <AirHandler x={124} y={318} /> : null}
    </g>
  );
}

function Townhome({ location }: { location: UnitLocation | null }) {
  const attic = location === "attic";
  const closet = location === "closet";
  const garage = location === "garage";
  return (
    <g>
      <Palm x={48} y={310} scale={0.85} />
      <Condenser x={130} y={336} />
      <g opacity={0.38}>
        <path d="M470 196 L560 130 L650 196 Z" fill="#8ea0b0" />
        <rect x={478} y={196} width={164} height={200} fill="#e4e7ea" stroke="#8ea0b0" strokeWidth={2} />
      </g>
      <path d="M250 196 L360 92 L470 196 Z" fill="#5e6e80" stroke="#3d4c5c" strokeWidth={2} />
      {attic ? <path d="M318 160 L360 116 L410 160 Z" fill="#f4ecdf" stroke="#0b6e8a" strokeWidth={2} /> : null}
      <rect x={262} y={196} width={196} height={200} fill="#f6f3ee" stroke="#3d4c5c" strokeWidth={2} />
      <path d="M458 196 V396" stroke="#3d4c5c" strokeWidth={4} />
      <path d="M262 300 H458" stroke="#3d4c5c" strokeWidth={2} />
      <Window x={286} y={226} w={46} />
      <Window x={386} y={226} w={46} />
      {garage ? <rect x={264} y={302} width={192} height={92} fill="#e7f6fb" /> : null}
      <Door x={292} y={322} h={72} />
      <GarageDoor x={350} y={318} w={84} h={68} />
      {closet ? <rect x={286} y={214} width={70} height={70} rx={3} fill="#e7f7fc" stroke="#0b6e8a" strokeWidth={2} /> : null}
      {location === "attic" ? <AirHandler x={328} y={118} /> : null}
      {location === "closet" ? <AirHandler x={290} y={228} /> : null}
      {location === "garage" ? <AirHandler x={360} y={332} /> : null}
    </g>
  );
}

function EmptyHouse() {
  return (
    <g opacity={0.55}>
      <path d="M120 280 L220 190 H500 L600 280 Z" fill="#e7eef2" stroke="#b7c4ce" strokeWidth={2} strokeDasharray="6 6" />
      <rect x={150} y={280} width={420} height={110} fill="#f7fafb" stroke="#b7c4ce" strokeWidth={2} strokeDasharray="6 6" />
      <text x={360} y={250} textAnchor="middle" fill="#5a6477" fontSize={16} fontFamily="Cabin, sans-serif" fontWeight={700}>
        Pick a home
      </text>
    </g>
  );
}

export function HouseGraphic({ home, location = null, sqft = null, compact = false, className }: HouseGraphicProps) {
  const label = [
    home ? HOME_LABEL[home] : "Home not chosen",
    location ? LOCATION_LABEL[location] : null,
    sqft ? formatSqft(sqft) : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <figure className={cn("m-0", className)}>
      <svg
        viewBox="0 0 720 470"
        role="img"
        aria-label={label}
        className="h-auto w-full"
      >
        <rect width={720} height={470} fill={compact ? "transparent" : "#f3fbfd"} rx={compact ? 0 : 24} />
        <Ground />
        {home === "ranch" ? <Ranch location={compact ? null : location} /> : null}
        {home === "two-story" ? <TwoStory location={compact ? null : location} /> : null}
        {home === "townhome" ? <Townhome location={compact ? null : location} /> : null}
        {home == null ? <EmptyHouse /> : null}
        {!compact && home && sqft ? (
          <SqftLine
            sqft={sqft}
            x1={home === "townhome" ? 250 : 120}
            x2={home === "townhome" ? 470 : 600}
            y={438}
          />
        ) : null}
      </svg>
      {!compact && home ? (
        <figcaption className="mt-3 flex flex-wrap gap-2 text-sm text-steel">
          <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">{HOME_LABEL[home]}</span>
          {location ? (
            <span className="rounded-full bg-foam px-3 py-1 font-medium text-cyan-deep ring-1 ring-cyan/40">
              {LOCATION_LABEL[location]}
            </span>
          ) : (
            <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">Indoor unit not placed yet</span>
          )}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function homeBlurb(home: HomeType): { title: string; body: string } {
  if (home === "ranch") {
    return {
      title: "Single-story ranch",
      body: "Wide footprint, one attic. The plan we see most often around Orlando.",
    };
  }
  if (home === "two-story") {
    return {
      title: "Two-story",
      body: "More wall area and a longer line set. Usually a larger system than a ranch of the same square footage.",
    };
  }
  return {
    title: "Townhome",
    body: "Shared walls and a smaller footprint. The air handler is often in a closet.",
  };
}
