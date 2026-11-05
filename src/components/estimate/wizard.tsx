"use client";

import { HouseGraphic } from "@/components/estimate/house-graphic";
import { StepCustomize } from "@/components/estimate/step-customize";
import { StepHome } from "@/components/estimate/step-home";
import { LeadConfirmation, StepLead } from "@/components/estimate/step-lead";
import { StepPrice } from "@/components/estimate/step-price";
import { StepSetup } from "@/components/estimate/step-setup";
import { Stepper } from "@/components/estimate/stepper";
import { StepSystem } from "@/components/estimate/step-system";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { ESTIMATE_CLOCK, decodePlate } from "@/lib/decoder";
import { buildQuote } from "@/lib/estimate";
import { formatTons, moneyRange } from "@/lib/format";
import { leadReference, validateLead, type LeadErrors, type LeadInput } from "@/lib/lead";
import { PRICE_BOOK } from "@/lib/pricing";
import type {
  AirQualityId,
  CondenserSitting,
  HeatSource,
  HomeType,
  StandardTons,
  StepIndex,
  ThermostatId,
  TierId,
  UnitLocation,
} from "@/lib/types";
import { useMemo, useState } from "react";

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
  single: "Single Story Home",
  "multi-story": "Multi-Story Home",
  "multi-family": "Multi-Family Home",
};

const LOCATION_NAME: Record<UnitLocation, string> = {
  closet: "Closet air handler",
  utility: "Utility room air handler",
  garage: "Garage air handler",
  attic: "Attic air handler",
};

const CONDENSER_NAME: Record<CondenserSitting, string> = {
  ground: "Ground-level condenser",
  mounted: "Mounted condenser",
  rooftop: "Rooftop condenser",
};

const HEAT_NAME: Record<HeatSource, string> = {
  "heat-pump": "Heat pump",
  electric: "Electric heat",
  gas: "Gas/propane heat",
};

export function EstimateApp() {
  const [step, setStep] = useState<StepIndex>(0);
  const [home, setHome] = useState<HomeType | null>(null);
  const [location, setLocation] = useState<UnitLocation | null>(null);
  const [condenser, setCondenser] = useState<CondenserSitting | null>(null);
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [tons, setTons] = useState<StandardTons | null>(null);
  const [heat, setHeat] = useState<HeatSource | null>(null);
  const [heatConfirmed, setHeatConfirmed] = useState(false);
  const [tier, setTier] = useState<TierId | null>(null);
  const [thermostat, setThermostat] = useState<ThermostatId>("standard");
  const [thermostatTouched, setThermostatTouched] = useState(false);
  const [airQuality, setAirQuality] = useState<AirQualityId>("none");
  const [showHelp, setShowHelp] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [lead, setLead] = useState<LeadInput>(EMPTY_LEAD);
  const [leadErrors, setLeadErrors] = useState<LeadErrors>({});
  const [reference, setReference] = useState<string | null>(null);

  const decoded = useMemo(() => decodePlate(model, serial, ESTIMATE_CLOCK), [model, serial]);
  const quote = useMemo(() => {
    if (!home || tons == null) return null;
    return buildQuote({
      home,
      location,
      tons,
      tier,
      thermostat,
      airQuality,
    });
  }, [home, location, tons, tier, thermostat, airQuality]);

  const heatReady = heat === "heat-pump" || (heat != null && heatConfirmed);
  let maxReachable: StepIndex = 0;
  if (home) maxReachable = 1;
  if (home && location && condenser) maxReachable = 2;
  if (home && location && condenser && tons && heatReady) maxReachable = 3;
  if (home && location && condenser && tons && heatReady && tier) maxReachable = 5;

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
    if (step === 1 && (!location || !condenser)) {
      setBlockError("Tell us where the air handler and the condenser sit.");
      return;
    }
    if (step === 2 && (!tons || !heat)) {
      setBlockError("Choose a system size and a heat source.");
      return;
    }
    if (step === 2 && heat !== "heat-pump" && !heatConfirmed) {
      setBlockError("Confirm the heat source before you continue.");
      return;
    }
    if (step === 3 && !tier) {
      setBlockError("Choose a Basic, Enhanced, or Premium system.");
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

  function selectHeat(next: HeatSource) {
    setHeat(next);
    setHeatConfirmed(next === "heat-pump");
    setBlockError(null);
  }

  function submitLead() {
    const errors = validateLead(lead);
    setLeadErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setReference(leadReference());
    scrollToTool();
  }

  function reset() {
    setStep(0);
    setHome(null);
    setLocation(null);
    setCondenser(null);
    setModel("");
    setSerial("");
    setTons(null);
    setHeat(null);
    setHeatConfirmed(false);
    setTier(null);
    setThermostat("standard");
    setThermostatTouched(false);
    setAirQuality("none");
    setShowHelp(false);
    setBlockError(null);
    setLead(EMPTY_LEAD);
    setLeadErrors({});
    setReference(null);
    scrollToTool();
  }

  const summaryBits = [
    home ? HOME_NAME[home] : null,
    location ? LOCATION_NAME[location] : null,
    condenser ? CONDENSER_NAME[condenser] : null,
    tons ? formatTons(tons) : null,
    heat ? HEAT_NAME[heat] : null,
    tier ? PRICE_BOOK.tiers[tier].name : null,
    decoded.ok ? decoded.model : null,
  ].filter((item): item is string => Boolean(item));

  const priceSummary =
    quote && tier && home
      ? `${HOME_NAME[home]} · ${PRICE_BOOK.tiers[tier].name} ${formatTons(quote.tons)} ${PRICE_BOOK.tiers[tier].product.toLowerCase()}.`
      : "";

  return (
    <div className="flex min-h-screen flex-col bg-[#f6fafb] text-ink">
      <SiteHeader />
      <main id="estimate" className="mx-auto w-full max-w-6xl flex-1 scroll-mt-28 px-4 py-8 sm:px-6">
        {step > 0 ? (
          <Stepper
            step={step}
            maxReachable={maxReachable}
            onStep={(index) => {
              if (index <= maxReachable) go(index as StepIndex);
            }}
          />
        ) : null}

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(260px,380px)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-28">
            <div className="rounded-3xl bg-white p-3 ring-1 ring-slate-200">
              <HouseGraphic home={home} location={location} condenser={condenser} />
            </div>
          </div>

          <div>
            {reference && quote ? (
              <LeadConfirmation reference={reference} name={lead.name.trim() || "there"} priceLabel={moneyRange(quote.low, quote.high)} onReset={reset} />
            ) : null}

            {!reference && step === 0 ? (
              <StepHome
                home={home}
                onChange={(next) => {
                  setHome(next);
                  setBlockError(null);
                }}
              />
            ) : null}

            {!reference && step === 1 ? (
              <StepSetup
                location={location}
                condenser={condenser}
                onLocation={(next) => {
                  setLocation(next);
                  setBlockError(null);
                }}
                onCondenser={(next) => {
                  setCondenser(next);
                  setBlockError(null);
                }}
              />
            ) : null}

            {!reference && step === 2 ? (
              <StepCustomize
                model={model}
                serial={serial}
                decoded={decoded}
                tons={tons}
                heat={heat}
                heatConfirmed={heatConfirmed}
                showHelp={showHelp}
                onModel={setModel}
                onSerial={setSerial}
                onTons={(next) => {
                  setTons(next);
                  setBlockError(null);
                }}
                onHeat={selectHeat}
                onConfirmHeat={(keep) => {
                  if (keep) setHeatConfirmed(true);
                  else selectHeat("heat-pump");
                  setBlockError(null);
                }}
                onToggleHelp={() => setShowHelp((current) => !current)}
              />
            ) : null}

            {!reference && step === 3 && tons ? (
              <StepSystem
                tons={tons}
                tier={tier}
                thermostat={thermostat}
                airQuality={airQuality}
                onTier={selectTier}
                onThermostat={(next) => {
                  setThermostatTouched(true);
                  setThermostat(next);
                }}
                onAirQuality={setAirQuality}
              />
            ) : null}

            {!reference && step === 4 && quote ? <StepPrice quote={quote} summary={priceSummary} /> : null}

            {!reference && step === 5 && quote ? (
              <StepLead
                lead={lead}
                errors={leadErrors}
                summary={summaryBits}
                priceLabel={moneyRange(quote.low, quote.high)}
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
                  {step === 4 ? "Continue to your comfort plan" : "Continue"}
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
