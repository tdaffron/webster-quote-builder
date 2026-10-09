export function money(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function moneyRange(low: number, high: number): string {
  if (low === high) return money(low);
  return `${money(low)}–${money(high)}`;
}

export function formatTons(tons: number): string {
  const label = Number.isInteger(tons) ? String(tons) : tons.toFixed(1);
  return `${label} ${tons === 1 ? "ton" : "tons"}`;
}

export function formatSqft(sqft: number): string {
  return `${new Intl.NumberFormat("en-US").format(sqft)} sq ft`;
}

export function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
