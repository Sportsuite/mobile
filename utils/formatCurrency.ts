export const formatCurrency = (
  amount: number | string,
  currency: string = "EUR",
  locale: string = "en"
): string => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};
