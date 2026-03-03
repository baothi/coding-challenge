import type { ExchangeRate } from '../types/currency';

// Mock API - simulate delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock exchange rates
const MOCK_RATES: Record<string, Record<string, number>> = {
  USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, CNY: 6.45, VND: 23000 },
  EUR: { USD: 1.18, GBP: 0.86, JPY: 129.5, CNY: 7.6, VND: 27000 },
  GBP: { USD: 1.37, EUR: 1.16, JPY: 150.0, CNY: 8.8, VND: 31000 },
  JPY: { USD: 0.0091, EUR: 0.0077, GBP: 0.0067, CNY: 0.059, VND: 209 },
  CNY: { USD: 0.155, EUR: 0.132, GBP: 0.114, JPY: 17.0, VND: 3565 },
  VND: { USD: 0.000043, EUR: 0.000037, GBP: 0.000032, JPY: 0.0048, CNY: 0.00028 },
};

export const getExchangeRate = async (
  from: string,
  to: string
): Promise<ExchangeRate> => {
  // Simulate API call
  await delay(500);

  if (from === to) {
    return {
      from,
      to,
      rate: 1,
      timestamp: new Date(),
    };
  }

  const rate = MOCK_RATES[from]?.[to];

  if (!rate) {
    throw new Error(`Exchange rate not available for ${from} to ${to}`);
  }

  return {
    from,
    to,
    rate,
    timestamp: new Date(),
  };
};

export const convertCurrency = async (
  amount: number,
  from: string,
  to: string
): Promise<number> => {
  const { rate } = await getExchangeRate(from, to);
  return amount * rate;
};
