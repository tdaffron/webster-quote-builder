import { formatTons } from "@/lib/format";

export type EquipmentKind = "air-conditioner" | "heat-pump";

export type PlateFormat = "trane" | "carrier" | "goodman";

export type SerialInfo = {
  year: number;
  month: number | null;
  week: number | null;
  manufactured: Date;
  ageYears: number;
};

export type DecodedModel = {
  ok: true;
  format: PlateFormat;
  brand: string;
  model: string;
  kind: EquipmentKind;
  kindLabel: string;
  nominalBtu: number;
  tons: number;
  seriesSeer: number | null;
};

export type DecodeFailure = {
  ok: false;
  model: string;
  /** `short` means the homeowner is still typing. */
  reason: "empty" | "short" | "unknown";
  message: string;
};

export type DecodedPlate = (DecodedModel | DecodeFailure) & {
  serial: SerialInfo | null;
  serialMessage: string | null;
  ageLabel: string | null;
};

const CAPACITY_BTU = [18000, 24000, 30000, 36000, 42000, 48000, 60000] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const SAMPLE_PLATES = [
  {
    id: "trane",
    label: "Trane heat pump",
    model: "4TWR4036J1000A",
    serial: "1428TRN4512",
    hint: "3 tons · week 28 of 2014",
  },
  {
    id: "carrier",
    label: "Carrier air conditioner",
    model: "24ACC648A003",
    serial: "1218C55219",
    hint: "4 tons · week 12 of 2018",
  },
  {
    id: "goodman",
    label: "Goodman condenser",
    model: "GSX140241",
    serial: "2103123984",
    hint: "2 tons · March 2021",
  },
] as const;

export const SIMULATED_PHOTO_PLATE = SAMPLE_PLATES[0];

export function normalizePlate(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function tonsFromBtu(btu: number): number {
  return btu / 12000;
}

function isCapacityBtu(btu: number): boolean {
  return (CAPACITY_BTU as readonly number[]).includes(btu);
}

function kindLabel(kind: EquipmentKind): string {
  return kind === "heat-pump" ? "Heat pump" : "Air conditioner";
}

/**
 * Trane / American Standard outdoor unit.
 * Example: 4TWR4036J1000A → heat pump, 36,000 BTU (3 tons).
 * The capacity sits in the three digits after the series number.
 */
function decodeTrane(model: string): DecodedModel | null {
  const match = model.match(/^([34])T([TW])([A-Z])(\d)(\d{3})([A-Z])(\d{3,4})([A-Z])$/);
  if (!match) return null;
  const btu = Number(match[5]) * 1000;
  if (!isCapacityBtu(btu)) return null;
  const kind: EquipmentKind = match[2] === "W" ? "heat-pump" : "air-conditioner";
  return {
    ok: true,
    format: "trane",
    brand: "Trane",
    model,
    kind,
    kindLabel: kindLabel(kind),
    nominalBtu: btu,
    tons: tonsFromBtu(btu),
    seriesSeer: null,
  };
}

/**
 * Carrier / Bryant / Payne outdoor unit.
 * Example: 24ACC648A003 → air conditioner, 48,000 BTU (4 tons).
 * 24 is cooling-only, 25 is a heat pump. Capacity is the two digits before the series letter.
 */
function decodeCarrier(model: string): DecodedModel | null {
  const match = model.match(/^(24|25)([A-Z]{3})(\d)(\d{2})([A-Z])(\d{3})$/);
  if (!match) return null;
  const btu = Number(match[4]) * 1000;
  if (!isCapacityBtu(btu)) return null;
  const kind: EquipmentKind = match[1] === "25" ? "heat-pump" : "air-conditioner";
  return {
    ok: true,
    format: "carrier",
    brand: "Carrier",
    model,
    kind,
    kindLabel: kindLabel(kind),
    nominalBtu: btu,
    tons: tonsFromBtu(btu),
    seriesSeer: null,
  };
}

/**
 * Goodman / Amana split-system condenser.
 * Example: GSX140241 → 14 SEER series, 24,000 BTU (2 tons).
 * GSZ / ASZ prefixes are heat pumps. The two digits after the prefix are the series SEER, not a certified SEER2.
 */
function decodeGoodman(model: string): DecodedModel | null {
  const match = model.match(/^(GSXC|GSZC|GSXH|GSZH|ASXC|ASZC|GSX|GSZ|ASX|ASZ)(\d{2})(\d{3})(\d)$/);
  if (!match) return null;
  const btu = Number(match[3]) * 1000;
  if (!isCapacityBtu(btu)) return null;
  const seriesSeer = Number(match[2]);
  if (seriesSeer < 13 || seriesSeer > 26) return null;
  const prefix = match[1];
  const kind: EquipmentKind = prefix.includes("SZ") ? "heat-pump" : "air-conditioner";
  const brand = prefix.startsWith("A") ? "Amana" : "Goodman";
  return {
    ok: true,
    format: "goodman",
    brand,
    model,
    kind,
    kindLabel: kindLabel(kind),
    nominalBtu: btu,
    tons: tonsFromBtu(btu),
    seriesSeer,
  };
}

export function decodeModel(input: string): DecodedModel | DecodeFailure {
  const model = normalizePlate(input);
  if (!model) {
    return {
      ok: false,
      model,
      reason: "empty",
      message: "Enter the model number from the data plate, or snap a photo.",
    };
  }
  if (model.length < 8) {
    return {
      ok: false,
      model,
      reason: "short",
      message: "Keep going. Model numbers on these plates run about 10 to 15 characters.",
    };
  }
  const decoded = decodeTrane(model) ?? decodeCarrier(model) ?? decodeGoodman(model);
  if (!decoded) {
    return {
      ok: false,
      model,
      reason: "unknown",
      message:
        "That format isn’t one this demo reads. Try a Trane 4TWR, Carrier 24ACC, or Goodman GSX number, or pick a size below.",
    };
  }
  return decoded;
}

function expandYear(yy: number): number | null {
  if (yy <= 39) return 2000 + yy;
  if (yy >= 70) return 1900 + yy;
  return null;
}

function yearsBetween(from: Date, now: Date): number {
  const ms = now.getTime() - from.getTime();
  return ms / (365.25 * 24 * 60 * 60 * 1000);
}

function dateFromWeek(year: number, week: number): Date {
  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(1 + (week - 1) * 7);
  return date;
}

function finishSerial(manufactured: Date, now: Date, extra: Omit<SerialInfo, "manufactured" | "ageYears">): SerialInfo | null {
  if (manufactured.getTime() > now.getTime()) return null;
  const ageYears = yearsBetween(manufactured, now);
  if (ageYears < 0 || ageYears > 50) return null;
  return { ...extra, manufactured, ageYears };
}

function decodeTraneSerial(serial: string, now: Date): SerialInfo | null {
  const match = serial.match(/^(\d{2})(\d{2})(?=[A-Z0-9]*[A-Z])[A-Z0-9]{3,}$/);
  if (!match) return null;
  const year = expandYear(Number(match[1]));
  const week = Number(match[2]);
  if (!year || week < 1 || week > 52) return null;
  return finishSerial(dateFromWeek(year, week), now, { year, month: null, week });
}

function decodeCarrierSerial(serial: string, now: Date): SerialInfo | null {
  const match = serial.match(/^(\d{2})(\d{2})[A-Z][A-Z0-9]{3,}$/);
  if (!match) return null;
  const week = Number(match[1]);
  const year = expandYear(Number(match[2]));
  if (!year || week < 1 || week > 52) return null;
  return finishSerial(dateFromWeek(year, week), now, { year, month: null, week });
}

function decodeGoodmanSerial(serial: string, now: Date): SerialInfo | null {
  const match = serial.match(/^(\d{2})(\d{2})\d{4,}$/);
  if (!match) return null;
  const year = expandYear(Number(match[1]));
  const month = Number(match[2]);
  if (!year || month < 1 || month > 12) return null;
  const manufactured = new Date(Date.UTC(year, month - 1, 15));
  return finishSerial(manufactured, now, { year, month, week: null });
}

export function decodeSerial(format: PlateFormat, input: string, now = new Date()): SerialInfo | null {
  const serial = normalizePlate(input);
  if (!serial) return null;
  if (format === "trane") return decodeTraneSerial(serial, now);
  if (format === "carrier") return decodeCarrierSerial(serial, now);
  return decodeGoodmanSerial(serial, now);
}

export function formatAge(serial: SerialInfo): string {
  if (serial.ageYears < 1) return "Less than a year old";
  const years = Math.round(serial.ageYears);
  const span = years === 1 ? "about 1 year old" : `about ${years} years old`;
  if (serial.month) {
    return `Built ${MONTHS[serial.month - 1]} ${serial.year} · ${span}`;
  }
  if (serial.week) {
    return `Built week ${serial.week} of ${serial.year} · ${span}`;
  }
  return `Built ${serial.year} · ${span}`;
}

export function decodePlate(modelInput: string, serialInput: string, now = new Date()): DecodedPlate {
  const model = decodeModel(modelInput);
  if (!model.ok) {
    return { ...model, serial: null, serialMessage: null, ageLabel: null };
  }
  const serialRaw = normalizePlate(serialInput);
  if (!serialRaw) {
    return { ...model, serial: null, serialMessage: null, ageLabel: null };
  }
  const serial = decodeSerial(model.format, serialRaw, now);
  if (!serial) {
    return {
      ...model,
      serial: null,
      serialMessage: "The model decoded. This serial style isn’t one the demo can date.",
      ageLabel: null,
    };
  }
  return {
    ...model,
    serial,
    serialMessage: null,
    ageLabel: formatAge(serial),
  };
}

export function describeDecoded(plate: DecodedModel): string {
  const seer = plate.seriesSeer ? ` · ${plate.seriesSeer} SEER series` : "";
  return `${plate.brand} ${plate.kindLabel.toLowerCase()} · ${formatTons(plate.tons)}${seer}`;
}
