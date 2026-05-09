const malutiFormatter = new Intl.NumberFormat("en-LS", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export function formatMoney(value) {
  const amount = Number(value || 0);
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return `M ${malutiFormatter.format(safeAmount)}`;
}
