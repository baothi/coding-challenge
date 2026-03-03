export interface Currency {
  code: string;
  name: string;
  symbol: string;
  icon?: string;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  timestamp: Date;
}

export interface SwapFormData {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
}
