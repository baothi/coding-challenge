import { useCallback, useState } from 'react';
import { convertCurrency, getExchangeRate } from '../services/currencyService';
import type { ExchangeRate } from '../types/currency';

export const useCurrencySwap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);

  const fetchExchangeRate = useCallback(async (from: string, to: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const rate = await getExchangeRate(from, to);
      setExchangeRate(rate);
      return rate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exchange rate';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const convert = useCallback(async (amount: number, from: string, to: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await convertCurrency(amount, from, to);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert currency';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    exchangeRate,
    fetchExchangeRate,
    convert,
  };
};
