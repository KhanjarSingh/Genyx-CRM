export function formatCurrency(value, locale = 'en-US', currencyCode = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
  }).format(value);
}
