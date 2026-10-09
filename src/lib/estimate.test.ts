import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SAMPLE_PLATES, decodeModel, decodePlate, decodeSerial } from "./decoder";
import { buildQuote, monthlyPayment } from "./estimate";
import { validateLead } from "./lead";
import { PRICE_BOOK } from "./pricing";
import { sizingAdvice } from "./sizing";
import { STANDARD_TONS } from "./types";

const AS_OF = new Date("2026-10-09T12:00:00Z");

describe("model decoder", () => {
  it("reads a Trane heat pump capacity from the model number", () => {
    const decoded = decodeModel("4TWR4036J1000A");
    assert.equal(decoded.ok, true);
    if (!decoded.ok) return;
    assert.equal(decoded.brand, "Trane");
    assert.equal(decoded.kind, "heat-pump");
    assert.equal(decoded.tons, 3);
    assert.equal(decoded.nominalBtu, 36000);
  });

  it("reads a Trane air conditioner", () => {
    const decoded = decodeModel("4ttr6036j1000a");
    assert.equal(decoded.ok, true);
    if (!decoded.ok) return;
    assert.equal(decoded.kind, "air-conditioner");
    assert.equal(decoded.tons, 3);
  });

  it("reads a Carrier air conditioner and ignores dashes", () => {
    const decoded = decodeModel("24-ACC6-48-A003");
    assert.equal(decoded.ok, true);
    if (!decoded.ok) return;
    assert.equal(decoded.brand, "Carrier");
    assert.equal(decoded.kind, "air-conditioner");
    assert.equal(decoded.tons, 4);
  });

  it("reads a Carrier heat pump", () => {
    const decoded = decodeModel("25HBC636A003");
    assert.equal(decoded.ok, true);
    if (!decoded.ok) return;
    assert.equal(decoded.kind, "heat-pump");
    assert.equal(decoded.tons, 3);
  });

  it("reads a Goodman condenser, including the series SEER", () => {
    const decoded = decodeModel("gsx140241");
    assert.equal(decoded.ok, true);
    if (!decoded.ok) return;
    assert.equal(decoded.brand, "Goodman");
    assert.equal(decoded.kind, "air-conditioner");
    assert.equal(decoded.tons, 2);
    assert.equal(decoded.seriesSeer, 14);
  });

  it("reads a Goodman heat pump", () => {
    const decoded = decodeModel("GSZ160361");
    assert.equal(decoded.ok, true);
    if (!decoded.ok) return;
    assert.equal(decoded.kind, "heat-pump");
    assert.equal(decoded.tons, 3);
    assert.equal(decoded.seriesSeer, 16);
  });

  it("rejects a short or unknown model without throwing", () => {
    const short = decodeModel("4TWR");
    assert.equal(short.ok, false);
    if (!short.ok) assert.equal(short.reason, "short");
    const unknown = decodeModel("HELLO-WORLD-99");
    assert.equal(unknown.ok, false);
    if (unknown.ok) return;
    assert.equal(unknown.reason, "unknown");
  });

  it("rejects a Trane-shaped model with a fake capacity", () => {
    assert.equal(decodeModel("4TWR4099J1000A").ok, false);
  });
});

describe("serial ages", () => {
  it("dates the three sample plates", () => {
    const [trane, carrier, goodman] = SAMPLE_PLATES;
    const tranePlate = decodePlate(trane.model, trane.serial, AS_OF);
    const carrierPlate = decodePlate(carrier.model, carrier.serial, AS_OF);
    const goodmanPlate = decodePlate(goodman.model, goodman.serial, AS_OF);

    assert.equal(tranePlate.ok, true);
    assert.equal(carrierPlate.ok, true);
    assert.equal(goodmanPlate.ok, true);
    if (!tranePlate.ok || !carrierPlate.ok || !goodmanPlate.ok) return;

    assert.equal(tranePlate.serial?.year, 2014);
    assert.equal(tranePlate.serial?.week, 28);
    assert.match(tranePlate.ageLabel ?? "", /2014/);
    assert.match(tranePlate.ageLabel ?? "", /12 years/);

    assert.equal(carrierPlate.serial?.year, 2018);
    assert.equal(carrierPlate.serial?.week, 12);
    assert.match(carrierPlate.ageLabel ?? "", /2018/);

    assert.equal(goodmanPlate.serial?.year, 2021);
    assert.equal(goodmanPlate.serial?.month, 3);
    assert.match(goodmanPlate.ageLabel ?? "", /March 2021/);
  });

  it("does not invent an age for a serial from the wrong brand", () => {
    assert.equal(decodeSerial("trane", "2103123984", AS_OF), null);
    const plate = decodePlate("GSX140241", "not-a-serial", AS_OF);
    assert.equal(plate.ok, true);
    if (!plate.ok) return;
    assert.equal(plate.serial, null);
    assert.match(plate.serialMessage ?? "", /isn’t one the demo can date/);
  });
});

describe("allowed sizes", () => {
  it("starts a 1,800 sq ft ranch at 4 tons and allows a neighbor", () => {
    const advice = sizingAdvice(1800, "ranch", null);
    assert.equal(advice.recommended, 4);
    assert.deepEqual(advice.allowed, [3.5, 4]);
    assert.equal(advice.secondSystem, false);
  });

  it("calls out an oversized existing unit", () => {
    const advice = sizingAdvice(1600, "ranch", 5);
    assert.equal(advice.recommended, 3.5);
    assert.match(advice.note, /5 tons/);
    assert.match(advice.note, /humidity/);
  });

  it("flags a house that needs a second system", () => {
    const advice = sizingAdvice(4000, "ranch", null);
    assert.equal(advice.secondSystem, true);
    assert.equal(advice.recommended, 5);
    assert.ok(advice.allowed.every((tons) => tons <= 5));
  });

  it("gives a townhome a smaller recommendation than a two-story at the same size", () => {
    const town = sizingAdvice(1800, "townhome", null);
    const two = sizingAdvice(1800, "two-story", null);
    assert.ok(town.recommended < two.recommended);
  });
});

describe("placeholder pricing", () => {
  it("prices every standard tonnage in every tier", () => {
    for (const tier of ["good", "better", "best"] as const) {
      for (const tons of STANDARD_TONS) {
        const quote = buildQuote({
          home: "ranch",
          location: "closet",
          tons,
          tier,
          heatStrip: "none",
          thermostat: "standard",
        });
        assert.equal(quote.low, PRICE_BOOK.tiers[tier].byTons[tons][0]);
        assert.equal(quote.high, PRICE_BOOK.tiers[tier].byTons[tons][1]);
        assert.ok(quote.monthlyLow > 0);
        assert.ok(quote.monthlyHigh >= quote.monthlyLow);
      }
    }
  });

  it("steps the price up from Good to Best and adds attic and heat-strip cost", () => {
    const base = {
      home: "ranch" as const,
      location: "closet" as const,
      tons: 3,
      heatStrip: "5" as const,
      thermostat: "standard" as const,
    };
    const good = buildQuote({ ...base, tier: "good" });
    const better = buildQuote({ ...base, tier: "better" });
    const best = buildQuote({ ...base, tier: "best" });
    assert.ok(good.high < better.low);
    assert.ok(better.high < best.low);

    const attic = buildQuote({ ...base, tier: "better", location: "attic" });
    assert.ok(attic.low > better.low);
    assert.ok(attic.lines.some((line) => line.id === "location"));

    const strip = buildQuote({ ...base, tier: "better", heatStrip: "10" });
    assert.ok(strip.low > better.low);
  });

  it("includes the communicating thermostat on Best and charges for it on Good", () => {
    const good = buildQuote({
      home: "ranch",
      location: "closet",
      tons: 3,
      tier: "good",
      heatStrip: "none",
      thermostat: "premium",
    });
    const best = buildQuote({
      home: "ranch",
      location: "closet",
      tons: 3,
      tier: "best",
      heatStrip: "none",
      thermostat: "premium",
    });
    assert.ok(good.lines.find((line) => line.id === "thermostat")!.low > 0);
    assert.equal(best.lines.find((line) => line.id === "thermostat")!.low, 0);
    assert.ok(best.low > good.high);
  });

  it("adds two-story labor without changing a closet ranch", () => {
    const ranch = buildQuote({
      home: "ranch",
      location: "closet",
      tons: 3,
      tier: "better",
      heatStrip: "5",
      thermostat: "wifi",
    });
    const two = buildQuote({ ...{
      home: "two-story" as const,
      location: "closet" as const,
      tons: 3,
      tier: "better" as const,
      heatStrip: "5" as const,
      thermostat: "wifi" as const,
    }});
    assert.ok(two.low === ranch.low + PRICE_BOOK.stories["two-story"].range[0]);
  });

  it("spans Good through Best when a tier is not chosen yet", () => {
    const wide = buildQuote({
      home: "ranch",
      location: null,
      tons: 3,
      tier: null,
      heatStrip: "none",
      thermostat: "standard",
    });
    assert.equal(wide.wide, true);
    assert.equal(wide.low, PRICE_BOOK.tiers.good.byTons[3][0]);
    assert.equal(wide.high, PRICE_BOOK.tiers.best.byTons[3][1]);
  });

  it("computes a normal loan payment", () => {
    const payment = monthlyPayment(10000, 0.0999, 60);
    assert.ok(payment > 200 && payment < 230);
    assert.equal(monthlyPayment(0), 0);
    assert.equal(monthlyPayment(1200, 0, 12), 100);
  });
});

describe("lead form", () => {
  it("accepts a complete lead and rejects an empty one", () => {
    const ok = validateLead({
      name: "Sam Rivera",
      phone: "(407) 555-0199",
      email: "sam@example.com",
      zip: "32835",
      time: "morning",
      notes: "",
      consent: true,
    });
    assert.deepEqual(ok, {});

    const bad = validateLead({
      name: "A",
      phone: "555",
      email: "nope",
      zip: "328",
      time: "",
      notes: "",
      consent: false,
    });
    assert.ok(bad.name && bad.phone && bad.email && bad.zip && bad.time && bad.consent);
  });
});
