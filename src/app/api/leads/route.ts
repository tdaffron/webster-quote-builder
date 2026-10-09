import { leadReference, phoneDigits, validateLead, type LeadInput } from "@/lib/lead";
import { NextResponse } from "next/server";

type StoredLead = LeadInput & {
  reference: string;
  createdAt: string;
  summary: unknown;
};

const leads: StoredLead[] = [];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "We couldn’t read that form." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, message: "We couldn’t read that form." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const time = raw.time === "morning" || raw.time === "afternoon" || raw.time === "evening" ? raw.time : "";
  const input: LeadInput = {
    name: typeof raw.name === "string" ? raw.name : "",
    phone: typeof raw.phone === "string" ? raw.phone : "",
    email: typeof raw.email === "string" ? raw.email : "",
    zip: typeof raw.zip === "string" ? raw.zip : "",
    time,
    notes: typeof raw.notes === "string" ? raw.notes : "",
    consent: raw.consent === true,
  };

  const errors = validateLead(input);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  const reference = leadReference();
  leads.push({
    ...input,
    phone: phoneDigits(input.phone),
    email: input.email.trim(),
    name: input.name.trim(),
    zip: input.zip.trim(),
    notes: input.notes.trim(),
    reference,
    createdAt: new Date().toISOString(),
    summary: raw.summary ?? null,
  });

  return NextResponse.json({ ok: true, reference });
}
