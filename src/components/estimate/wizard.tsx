"use client";

import { HouseGraphic } from "@/components/estimate/house-graphic";
import { StepHome } from "@/components/estimate/step-home";
import { LeadConfirmation, StepLead } from "@/components/estimate/step-lead";
import { StepPlate } from "@/components/estimate/step-plate";
import { StepPrice } from "@/components/estimate/step-price";
import { StepSetup } from "@/components/estimate/step-setup";
import { Stepper } from "@/components/estimate/stepper";
import { StepSystem } from "@/components/estimate/step-system";
import { StickyPrice } from "@/components/estimate/sticky-price";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ESTIMATE_CLOCK, SIMULATED_PHOTO_PLATE, decodePlate } from "@/lib/decoder";
import { buildQuote } from "@/lib/estimate";
import { formatSqft, formatTons, moneyRange } from "@/lib/format";
import { leadReference, validateLead, type LeadErrors, type LeadInput } from "@/lib/lead";
import { PRICE_BOOK } from "@/lib/pricing";
import { sizingAdvice } from "@/lib/sizing";
import type { HeatStripId, HomeType, StandardTons, StepIndex, ThermostatId, TierId, UnitLocation } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

const EMPTY_LEAD: LeadInput = {
  name: "",
  phone: "",
  email: "",
  zip: "",
  time: "",
  notes: "",
  consent: false,
};

const HOME_NAME: Record<HomeType, string> = {
  ranch: "Single-story ranch",
  "two-story": "Two-story",
  townhome: "Townhome",
};

const LOCATION_NAME: Record<UnitLocation, string> = {
  attic: "Attic unit",
  closet: "Closet unit",
  garage: "Garage unit",
};

export function EstimateApp() {
  const [step, setStep] = useState<StepIndex>(0);
  const [home, setHome] = useState<HomeType | null>(null);
  const [location, setLocation] = useState<UnitLocation | null>(null);
  const [sqft, setSqft] = useState(1800);
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [sizeOverride, setSizeOverride] = useState<StandardTons | null>(null);
  const [tier, setTier] = useState<TierId | null>(null);
  const [heatStrip, setHeatStrip] = useState<HeatStripId>("5");
  const [thermostat, setThermostat] = useState<ThermostatId>("standard");
  const [thermostatTouched, setThermostatTouched] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [simulated, setSimulated] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [lead, setLead] = useState<LeadInput>(EMPTY_LEAD);
  const [leadErrors, setLeadErrors] = useState<LeadErrors>({});
  const [reference, setReference] = useState<string | null>(null);
  const scanTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scanTimer.current) window.clearInterval(scanTimer.current);
    };
  }, []);

  const decoded = useMemo(() => decodePlate(model, serial, ESTIMATE_CLOCK), [model, serial]);
  const advice = useMemo(
    () => (home ? sizingAdvice(sqft, home, decoded.ok ? decoded.tons : null) : null),
    [home, sqft, decoded],
  );
  const pricedTons = sizeOverride ?? advice?.recommended ?? null;
  const quote = useMemo(() => {
    if (!home || pricedTons == null) return null;
    return buildQuote({
      home,
      location,
      tons: pricedTons,
      tier,
      heatStrip,
      thermostat,
    });
  }, [home, location, pricedTons, tier, heatStrip, thermostat]);

  const priceDetail = quote
    ? tier
      ? `${PRICE_BOOK.tiers[tier].name} · ${PRICE_BOOK.tiers[tier].seer2} SEER2 · ${formatTons(quote.tons)}`
      : `${formatTons(quote.tons)} · Good through Best`
    : "";

  let maxReachable = 0;
  if (home) maxReachable = 1;
  if (home && location) maxReachable = 3;
  if (home && location && tier) maxReachable = 5;

  function scrollToTool() {
    document.getElementById("estimate")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function go(next: StepIndex) {
    setBlockError(null);
    setStep(next);
    scrollToTool();
  }

  function continueStep() {
    if (step === 0 && !home) {
      setBlockError("Pick the home that looks most like yours.");
      return;
    }
    if (step === 1 && !location) {
      setBlockError("Tell us where the indoor unit sits.");
      return;
    }
    if (step === 3 && !tier) {
      setBlockError("Choose a Good, Better, or Best system.");
      return;
    }
    go((step + 1) as StepIndex);
  }

  function selectTier(next: TierId) {
    setTier(next);
    setBlockError(null);
    if (!thermostatTouched) {
      setThermostat(next === "best" ? "premium" : "standard");
    }
  }

  function onFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setPhotoError("Use a JPG or PNG of the data plate.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setPhotoError("That photo is too large. Try one under 8 MB.");
      return;
    }
    setPhotoError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
    setPhotoName(file.name);
    setScanning(true);
    setScanProgress(6);
    setSimulated(false);
    if (scanTimer.current) window.clearInterval(scanTimer.current);
    const started = Date.now();
    scanTimer.current = window.setInterval(() => {
      const elapsed = Date.now() - started;
      setScanProgress(Math.min(100, Math.round((elapsed / 1400) * 100)));
      if (elapsed >= 1400) {
        if (scanTimer.current) window.clearInterval(scanTimer.current);
        setScanning(false);
        setModel(SIMULATED_PHOTO_PLATE.model);
        setSerial(SIMULATED_PHOTO_PLATE.serial);
        setSizeOverride(null);
        setSimulated(true);
      }
    }, 80);
  }

  function submitLead() {
    const errors = validateLead(lead);
    setLeadErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setReference(leadReference());
    scrollToTool();
  }

  function reset() {
    if (scanTimer.current) window.clearInterval(scanTimer.current);
    setStep(0);
    setHome(null);
    setLocation(null);
    setSqft(1800);
    setModel("");
    setSerial("");
    setSizeOverride(null);
    setTier(null);
    setHeatStrip("5");
    setThermostat("standard");
    setThermostatTouched(false);
    setPhotoUrl(null);
    setPhotoName(null);
    setScanning(false);
    setScanProgress(0);
    setPhotoError(null);
    setSimulated(false);
    setBlockError(null);
    setLead(EMPTY_LEAD);
    setLeadErrors({});
    setReference(null);
    scrollToTool();
  }

  const summaryBits = [
    home ? HOME_NAME[home] : null,
    formatSqft(sqft),
    location ? LOCATION_NAME[location] : null,
    pricedTons ? formatTons(pricedTons) : null,
    tier ? PRICE_BOOK.tiers[tier].name : null,
    decoded.ok ? decoded.model : null,
  ].filter((item): item is string => Boolean(item));

  const priceSummary =
    quote && tier
      ? `${HOME_NAME[home!]} · ${formatSqft(sqft)} · ${location ? LOCATION_NAME[location] : "Location still open"} · ${PRICE_BOOK.tiers[tier].name} ${formatTons(quote.tons)} ${PRICE_BOOK.tiers[tier].product.toLowerCase()}.`
      : "";

  return (
    <div className="flex min-h-screen flex-col bg-[#f6fafb] text-ink">
      <SiteHeader price={<StickyPrice quote={quote} detail={priceDetail} />} />
      <main id="estimate" className="mx-auto w-full max-w-6xl flex-1 scroll-mt-36 px-4 py-8 sm:px-6">
        <Stepper
          step={step}
          maxReachable={maxReachable}
          onStep={(index) => {
            if (index <= maxReachable) go(index as StepIndex);
          }}
        />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(260px,380px)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-40">
            <div className="rounded-3xl bg-white p-3 ring-1 ring-slate-200">
              <HouseGraphic home={home} location={location} sqft={home ? sqft : null} />
            </div>
          </div>

          <div>
            {reference && quote ? (
              <LeadConfirmation
                reference={reference}
                name={lead.name.trim() || "there"}
                priceLabel={moneyRange(quote.low, quote.high)}
                onReset={reset}
              />
            ) : null}

            {!reference && step === 0 ? (
              <StepHome
                home={home}
                onChange={(next) => {
                  setHome(next);
                  setBlockError(null);
                  setSizeOverride(null);
                }}
              />
            ) : null}

            {!reference && step === 1 ? (
              <StepSetup
                location={location}
                sqft={sqft}
                onLocation={(next) => {
                  setLocation(next);
                  setBlockError(null);
                }}
                onSqft={(next) => {
                  setSqft(next);
                  setSizeOverride(null);
                }}
              />
            ) : null}

            {!reference && step === 2 && advice && pricedTons ? (
              <StepPlate
                model={model}
                serial={serial}
                decoded={decoded}
                advice={advice}
                pricedTons={pricedTons}
                photoUrl={photoUrl}
                photoName={photoName}
                scanning={scanning}
                scanProgress={scanProgress}
                photoError={photoError}
                simulated={simulated}
                onModel={(value) => {
                  setModel(value);
                  setSimulated(false);
                }}
                onSerial={setSerial}
                onTons={setSizeOverride}
                onFile={onFile}
              />
            ) : null}

            {!reference && step === 3 && pricedTons ? (
              <StepSystem
                tons={pricedTons}
                tier={tier}
                heatStrip={heatStrip}
                thermostat={thermostat}
                onTier={selectTier}
                onHeatStrip={setHeatStrip}
                onThermostat={(next) => {
                  setThermostatTouched(true);
                  setThermostat(next);
                }}
              />
            ) : null}

            {!reference && step === 4 && quote ? <StepPrice quote={quote} summary={priceSummary} /> : null}

            {!reference && step === 5 && quote ? (
              <StepLead
                lead={lead}
                errors={leadErrors}
                summary={summaryBits}
                priceLabel={moneyRange(quote.low, quote.high)}
                monthlyLabel={moneyRange(quote.monthlyLow, quote.monthlyHigh)}
                submitting={false}
                submitError={null}
                onChange={(patch) => {
                  setLead((current) => ({ ...current, ...patch }));
                  setLeadErrors((current) => {
                    const next = { ...current };
                    for (const key of Object.keys(patch) as (keyof LeadInput)[]) delete next[key];
                    return next;
                  });
                }}
                onSubmit={submitLead}
              />
            ) : null}

            {blockError ? (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {blockError}
              </p>
            ) : null}

            {!reference && step < 5 ? (
              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={() => go((step - 1) as StepIndex)}>
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                <Button type="button" className="h-11 rounded-full px-6 text-base font-semibold" onClick={continueStep}>
                  {step === 4 ? "Request the detailed quote" : "Continue"}
                </Button>
              </div>
            ) : null}

            {!reference && step === 5 ? (
              <div className="mt-4">
                <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={() => go(4)}>
                  Back to the price
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
