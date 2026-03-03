import { ArrowLeftRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { CURRENCIES, DEFAULT_FROM_CURRENCY, DEFAULT_TO_CURRENCY } from '../../constants/currencies';
import { useCurrencySwap } from '../../hooks/useCurrencySwap';
import { formatNumber } from '../../utils/formatter';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';

export const CurrencySwapForm: React.FC = () => {
  const [fromAmount, setFromAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState(DEFAULT_FROM_CURRENCY);
  const [toAmount, setToAmount] = useState<string>('0');
  const [toCurrency, setToCurrency] = useState(DEFAULT_TO_CURRENCY);
  const [isRotating, setIsRotating] = useState(false);

  const { isLoading, error, exchangeRate, fetchExchangeRate, convert } = useCurrencySwap();

  const currencyOptions = CURRENCIES.map(c => ({
    value: c.code,
    label: `${c.icon} ${c.code} - ${c.name}`,
  }));

  // Fetch exchange rate when currencies change
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchExchangeRate(fromCurrency, toCurrency);
    }
  }, [fromCurrency, toCurrency, fetchExchangeRate]);

  // Auto-convert when amount or rate changes
  useEffect(() => {
    const amount = parseFloat(fromAmount);
    if (!isNaN(amount) && amount > 0 && exchangeRate) {
      const result = amount * exchangeRate.rate;
      setToAmount(formatNumber(result));
    } else {
      setToAmount('0');
    }
  }, [fromAmount, exchangeRate]);

  const handleSwap = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);

    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  const handleConvert = async () => {
    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    if (fromCurrency === toCurrency) {
      return;
    }

    try {
      const result = await convert(amount, fromCurrency, toCurrency);
      setToAmount(formatNumber(result));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up">
      {/* Main Card with Glass Morphism */}
      <div className="glass-morphism-strong rounded-3xl shadow-2xl p-8 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Exchange</h2>
          <div className="flex items-center gap-2 text-sm text-blue-200">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Rates</span>
          </div>
        </div>

        {/* From Section */}
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-semibold text-blue-200 mb-3">You Send</label>
          <div className="glass-morphism rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
            <div className="flex gap-3">
              <Input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent border-none text-white text-2xl font-bold placeholder-blue-300/50 focus:ring-0 p-0"
                min="0"
                step="0.01"
              />
              <Select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                options={currencyOptions}
                className="w-40 bg-white/10 border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Swap Button with Animation */}
        <div className="flex justify-center my-6 relative">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full opacity-20 blur-xl animate-pulse-glow"></div>
          </div>
          <button
            onClick={handleSwap}
            className={`relative z-10 w-14 h-14 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-full
              flex items-center justify-center shadow-lg hover:shadow-cyan-500/50
              transition-all duration-300 hover:scale-110 active:scale-95
              ${isRotating ? 'animate-rotate-icon' : ''}`}
          >
            <ArrowLeftRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* To Section */}
        <div className="mb-6 space-y-2">
          <label className="block text-sm font-semibold text-blue-200 mb-3">You Receive</label>
          <div className="glass-morphism rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
            <div className="flex gap-3">
              <Input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.00"
                className="flex-1 bg-transparent border-none text-white text-2xl font-bold placeholder-blue-300/50 focus:ring-0 p-0"
              />
              <Select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                options={currencyOptions}
                className="w-40 bg-white/10 border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Exchange Rate Display */}
        {exchangeRate && (
          <div className="mb-6 p-4 glass-morphism rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-200">Exchange Rate</span>
              <span className="font-bold text-white text-lg">
                1 {fromCurrency} = {formatNumber(exchangeRate.rate)} {toCurrency}
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm">
            <p className="text-sm text-red-200 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              {error}
            </p>
          </div>
        )}

        {/* Convert Button */}
        <Button
          variant="primary"
          size="lg"
          onClick={handleConvert}
          isLoading={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          {isLoading ? 'Converting...' : 'Convert Now'}
        </Button>

        {/* Info Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-300/70">
            🔒 Secure • Fast • Reliable
          </p>
        </div>
      </div>
    </div>
  );
};
