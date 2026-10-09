import { formatPhone } from "@/lib/format";
import type { LeadErrors, LeadInput } from "@/lib/lead";
import { CALL_TIMES, type CallTime } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

const TIME_LABEL: Record<CallTime, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export function StepLead({
  lead,
  errors,
  summary,
  priceLabel,
  monthlyLabel,
  submitting,
  submitError,
  onChange,
  onSubmit,
}: {
  lead: LeadInput;
  errors: LeadErrors;
  summary: string[];
  priceLabel: string;
  monthlyLabel: string;
  submitting: boolean;
  submitError: string | null;
  onChange: (patch: Partial<LeadInput>) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="step-in">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Where should we send the detailed quote?</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-steel">
        A comfort advisor calls, confirms the house, and turns this range into a written quote. No deposit on this form.
      </p>

      <div className="mt-5 rounded-2xl bg-foam px-4 py-3 text-sm text-ink ring-1 ring-cyan/30">
        <p className="font-semibold">
          {priceLabel} · {monthlyLabel}/mo
        </p>
        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-steel">
          {summary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <form
        className="mt-5 grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="lead-name" error={errors.name}>
            <Input
              id="lead-name"
              name="name"
              autoComplete="name"
              value={lead.name}
              onChange={(event) => onChange({ name: event.target.value })}
              aria-invalid={Boolean(errors.name)}
              className="h-11 text-base"
            />
          </Field>
          <Field label="Mobile" htmlFor="lead-phone" error={errors.phone}>
            <Input
              id="lead-phone"
              name="tel"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={lead.phone}
              onChange={(event) => onChange({ phone: formatPhone(event.target.value) })}
              aria-invalid={Boolean(errors.phone)}
              placeholder="(407) 555-0199"
              className="h-11 text-base"
            />
          </Field>
          <Field label="Email" htmlFor="lead-email" error={errors.email}>
            <Input
              id="lead-email"
              name="email"
              type="email"
              autoComplete="email"
              value={lead.email}
              onChange={(event) => onChange({ email: event.target.value })}
              aria-invalid={Boolean(errors.email)}
              className="h-11 text-base"
            />
          </Field>
          <Field label="ZIP code" htmlFor="lead-zip" error={errors.zip}>
            <Input
              id="lead-zip"
              name="postal-code"
              autoComplete="postal-code"
              inputMode="numeric"
              value={lead.zip}
              onChange={(event) => onChange({ zip: event.target.value.replace(/\D/g, "").slice(0, 5) })}
              aria-invalid={Boolean(errors.zip)}
              placeholder="32835"
              className="h-11 text-base"
            />
          </Field>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-ink">Best time for a call</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {CALL_TIMES.map((time) => (
              <button
                key={time}
                type="button"
                aria-pressed={lead.time === time}
                onClick={() => onChange({ time })}
                className={`h-11 rounded-xl text-sm font-semibold ring-1 transition ${
                  lead.time === time ? "bg-cyan text-ink ring-cyan" : "bg-white text-steel ring-slate-200 hover:ring-cyan"
                }`}
              >
                {TIME_LABEL[time]}
              </button>
            ))}
          </div>
          {errors.time ? (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {errors.time}
            </p>
          ) : null}
        </fieldset>

        <Field label="Anything we should know?" htmlFor="lead-notes" error={errors.notes} optional>
          <textarea
            id="lead-notes"
            value={lead.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
            rows={3}
            maxLength={500}
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Pets in the yard, a gate code, a room that never cools."
          />
        </Field>

        <div>
          <label className="flex items-start gap-3 text-sm leading-6 text-ink">
            <Checkbox checked={lead.consent} onCheckedChange={(checked) => onChange({ consent: checked })} className="mt-1" />
            <span>Webster can call or text me about this estimate. Message rates from my carrier may apply.</span>
          </label>
          {errors.consent ? (
            <p role="alert" className="mt-2 text-sm text-red-700">
              {errors.consent}
            </p>
          ) : null}
        </div>

        {submitError ? (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            {submitError}
          </p>
        ) : null}

        <Button type="submit" disabled={submitting} className="h-12 rounded-full px-6 text-base font-semibold">
          {submitting ? "Sending…" : "Request my detailed quote"}
        </Button>
      </form>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>
        {label}
        {optional ? <span className="font-normal text-steel">Optional</span> : null}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function LeadConfirmation({
  reference,
  name,
  priceLabel,
  onReset,
}: {
  reference: string;
  name: string;
  priceLabel: string;
  onReset: () => void;
}) {
  return (
    <div className="step-in rounded-2xl bg-white px-6 py-10 text-center ring-1 ring-slate-200">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-mint text-ink">
        <Check className="size-7" aria-hidden />
      </span>
      <h1 className="mt-4 font-heading text-3xl font-bold text-ink">You’re on the schedule list</h1>
      <p className="mx-auto mt-3 max-w-lg text-base leading-7 text-steel">
        Thanks, {name.split(" ")[0]}. A Webster comfort advisor will call to turn the {priceLabel} range into a written quote. Your reference is{" "}
        <span className="font-semibold text-ink">{reference}</span>.
      </p>
      <p className="mt-4 text-sm text-steel">
        Rather not wait? Call{" "}
        <a href="tel:+14072950598" className="font-semibold text-cyan-deep">
          (407) 295-0598
        </a>{" "}
        and mention {reference}.
      </p>
      <Button type="button" variant="outline" onClick={onReset} className="mt-6 h-11 rounded-full px-5">
        Price another home
      </Button>
    </div>
  );
}
