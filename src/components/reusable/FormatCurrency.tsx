export function formatToNaira(amountInKobo: number): string {
  const naira = amountInKobo / 100;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(naira);
}

export function parseCurrency(value: string): number {
  return Number(value.replace(/[^0-9.-]+/g, ""));
}