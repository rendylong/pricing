import { CurrencyCode } from '../types/pricing';

export interface ExchangeRate {
  [key: string]: number;
}

export interface CurrencyInfo {
  symbol: string;
  name: string;
}

export type SupportedCurrencies = Record<CurrencyCode, CurrencyInfo>;

export const SUPPORTED_CURRENCIES: SupportedCurrencies = {
  USD: { symbol: '$', name: 'US Dollar' },
  EUR: { symbol: '€', name: 'Euro' },
  GBP: { symbol: '£', name: 'British Pound' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' }
};

export const fetchExchangeRates = async (base: CurrencyCode = 'USD'): Promise<ExchangeRate> => {
  return {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 150.25,
    CNY: 7.23
  };
}; 