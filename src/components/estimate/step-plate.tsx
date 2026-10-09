import { ChoiceButton } from "@/components/estimate/choice";
import { describeDecoded, SAMPLE_PLATES, type DecodedPlate } from "@/lib/decoder";
import { formatTons } from "@/lib/format";
import type { SizingAdvice } from "@/lib/sizing";
import { STANDARD_TONS, type StandardTons } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Camera, ImagePlus } from "lucide-react";
import { useState } from "react";

export function StepPlate({
  model,
  serial,
  decoded,
  advice,
  pricedTons,
  photoUrl,
  photoName,
  scanning,
  scanProgress,
  photoError,
  simulated,
  onModel,
  onSerial,
  onTons,
  onFile,
}: {
  model: string;
  serial: string;
  decoded: DecodedPlate;
  advice: SizingAdvice;
  pricedTons: StandardTons;
  photoUrl: string | null;
  photoName: string | null;
  scanning: boolean;
  scanProgress: number;
  photoError: string | null;
  simulated: boolean;
  onModel: (value: string) => void;
  onSerial: (value: string) => void;
  onTons: (tons: StandardTons) => void;
  onFile: (file: File) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const existing = decoded.ok ? (STANDARD_TONS.find((tons) => tons === decoded.tons) ?? null) : null;
  const sizeOptions = existing && !advice.allowed.includes(existing) ? [...advice.allowed, existing] : advice.allowed;

  return (
    <div className="step-in">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">Show us the data plate</h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-steel">
        It’s the metal sticker on the outdoor unit. A photo is enough. If you’re at a desk, type the model number — Trane, Carrier, and Goodman formats decode for real.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <label
            onDragOver={(event) => {
              event.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragOver(false);
              const file = event.dataTransfer.files[0];
              if (file) onFile(file);
            }}
            className={`relative flex min-h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
              dragOver ? "border-cyan bg-foam" : "border-slate-300 bg-white hover:border-cyan"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onFile(file);
                event.target.value = "";
              }}
            />
            {photoUrl ? (
              // The preview is a local data URL from the file the homeowner just picked.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="Uploaded data plate" className="mb-3 max-h-36 rounded-lg object-contain" />
            ) : (
              <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-foam text-cyan-deep">
                <ImagePlus className="size-6" aria-hidden />
              </span>
            )}
            <span className="font-heading text-lg font-bold text-ink">
              {photoName ? photoName : "Drop a data-plate photo"}
            </span>
            <span className="mt-1 text-sm text-steel">JPG or PNG, up to 8 MB. The read is simulated for this demo.</span>
            {scanning ? (
              <span className="pointer-events-none absolute inset-x-6 top-6 h-0.5 bg-cyan shadow-[0_0_12px_#57c4e5] plate-scan" />
            ) : null}
          </label>
          {scanning ? (
            <Progress value={scanProgress} className="mt-3">
              <ProgressLabel>Reading the plate</ProgressLabel>
            </Progress>
          ) : null}
          {photoError ? (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {photoError}
            </p>
          ) : null}
          {simulated && !scanning ? (
            <p className="mt-3 rounded-xl bg-foam px-3 py-2 text-sm leading-6 text-cyan-deep">
              Photo reading is simulated. This demo filled in a sample Trane plate. Edit the model number and the tonnage updates from the real decoder.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
          <div className="flex items-center gap-2 text-cyan-deep">
            <Camera className="size-4" aria-hidden />
            <p className="text-sm font-semibold tracking-wide uppercase">Or type it</p>
          </div>
          <div className="mt-4 grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="model">Model number</Label>
              <Input
                id="model"
                value={model}
                onChange={(event) => onModel(event.target.value)}
                placeholder="4TWR4036J1000A"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className="h-11 font-mono text-base uppercase"
                aria-invalid={decoded.ok === false && decoded.reason === "unknown"}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="serial">Serial number, if you have it</Label>
              <Input
                id="serial"
                value={serial}
                onChange={(event) => onSerial(event.target.value)}
                placeholder="1428TRN4512"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className="h-11 font-mono text-base uppercase"
              />
            </div>
          </div>
          <p className="mt-4 text-sm text-steel">Try a sample format:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SAMPLE_PLATES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => {
                  onModel(sample.model);
                  onSerial(sample.serial);
                }}
                className="rounded-full bg-foam px-3 py-1.5 text-left text-sm text-cyan-deep ring-1 ring-cyan/40 hover:ring-cyan-deep"
              >
                <span className="font-semibold">{sample.label}</span>
                <span className="mt-0.5 block text-xs">{sample.hint}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 ring-1 ring-slate-200" aria-live="polite">
        {decoded.ok ? (
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-cyan-deep uppercase">Decoded from the model number</p>
            <p className="mt-1 font-heading text-2xl font-bold text-ink">{describeDecoded(decoded)}</p>
            <p className="mt-1 text-sm text-steel">
              {decoded.nominalBtu.toLocaleString("en-US")} BTU nominal
              {decoded.seriesSeer ? " · series rating from the model, not a certified SEER2" : ""}
            </p>
            {decoded.ageLabel ? <p className="mt-2 text-base text-ink">{decoded.ageLabel}</p> : null}
            {decoded.serialMessage ? <p className="mt-2 text-sm text-steel">{decoded.serialMessage}</p> : null}
            {decoded.serial && decoded.serial.ageYears >= 10 ? (
              <p className="mt-2 text-sm text-steel">
                Past the 10-year mark. In this climate that’s when a lot of homeowners start comparing a new system with another repair.
              </p>
            ) : null}
          </div>
        ) : decoded.reason === "unknown" ? (
          <p role="alert" className="text-sm leading-6 text-red-700">
            {decoded.message}
          </p>
        ) : (
          <p className="text-sm leading-6 text-steel">
            {model.trim() ? decoded.message : "No plate yet. We’ll price the size the square footage suggests, and you can change it."}
          </p>
        )}
        <p className="mt-4 text-sm leading-6 text-ink">{advice.note}</p>
        <p className="mt-4 text-sm font-semibold text-ink">Size to price</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {sizeOptions.map((tons) => {
            const selected = pricedTons === tons;
            const onPlate = existing === tons;
            const suggested = advice.recommended === tons;
            return (
              <ChoiceButton key={tons} selected={selected} onClick={() => onTons(tons)} className="px-3 py-3">
                <span className="font-heading text-lg font-bold text-ink">{formatTons(tons)}</span>
                <span className="mt-1 block text-xs text-steel">
                  {suggested ? "Suggested for this house" : onPlate ? "Matches the plate" : "Allowed neighbor"}
                </span>
              </ChoiceButton>
            );
          })}
        </div>
      </div>
    </div>
  );
}
