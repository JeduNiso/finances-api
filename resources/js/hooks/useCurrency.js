export function useCurrency(locale = 'es-CO', currency = 'COP') {
  const format = (value) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2 }).format(
      Number(value) || 0
    );

  return { format };
}
