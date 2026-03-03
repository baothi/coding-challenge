import type { Currency } from '../types/currency';

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', icon: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', icon: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', icon: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', icon: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', icon: '🇨🇳' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', icon: '🇻🇳' },
];

export const DEFAULT_FROM_CURRENCY = 'USD';
export const DEFAULT_TO_CURRENCY = 'EUR';
