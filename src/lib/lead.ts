import type { CallTime } from "@/lib/types";

export type LeadInput = {
  name: string;
  phone: string;
  email: string;
  zip: string;
  time: CallTime | "";
  notes: string;
  consent: boolean;
};

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

export function phoneDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return digits.slice(1);
  return digits.slice(0, 10);
}

export function validateLead(input: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  const name = input.name.trim();
  if (name.length < 2) {
    errors.name = "Enter the name we should ask for.";
  } else if (!/^[a-zA-Z][a-zA-Z .'-]{0,60}$/.test(name)) {
    errors.name = "Use the name as you’d say it on a call.";
  }

  const phone = phoneDigits(input.phone);
  if (phone.length !== 10) {
    errors.phone = "Enter a 10-digit mobile number.";
  }

  const email = input.email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter an email that can take the written quote.";
  }

  if (!/^\d{5}$/.test(input.zip.trim())) {
    errors.zip = "Enter the 5-digit ZIP for the house.";
  }

  if (input.time !== "morning" && input.time !== "afternoon" && input.time !== "evening") {
    errors.time = "Pick a time of day for the call.";
  }

  if (input.notes.trim().length > 500) {
    errors.notes = "Keep the note under 500 characters.";
  }

  if (!input.consent) {
    errors.consent = "We need a yes before we call or text.";
  }

  return errors;
}

export function leadReference(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `WEB-${n}`;
}
