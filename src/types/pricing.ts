export interface PricingTier {
  name: string;
  basePrice: number;
  messageCredits: number;
  teamMembers: number;
  buildApps: number;
  vectorStorage: number;
  documentsQuota: number;
  annotationQuota: number;
  customTools: number;
}

export interface AdditionalFeature {
  id: string;
  name: string;
  priceIncrement: number;
  description: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY';
export type LanguageCode = 'en' | 'zh' | 'ja';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  decimalSeparator: string;
  thousandsSeparator: string;
}

export interface BillingOption {
  id: 'monthly' | 'yearly';
  name: string;
}

export const BASE_TIER: PricingTier = {
  name: "Enterprise",
  basePrice: 139,
  messageCredits: 10000,
  teamMembers: 10,
  buildApps: 100,
  vectorStorage: 1024,
  documentsQuota: 1000,
  annotationQuota: 5000,
  customTools: 20
};

export const PRICE_INCREMENTS = {
  teamMember: 20,
  messageCredits: 10,
  vectorStorage: 8,
  documentsQuota: 15,
  annotationQuota: 20,
  customTools: 40
};

export const BILLING_OPTIONS: BillingOption[] = [
  {
    id: 'monthly',
    name: 'Monthly'
  },
  {
    id: 'yearly',
    name: 'Yearly'
  }
];

export interface LocalizedFeature extends Omit<AdditionalFeature, 'name' | 'description'> {
  name: {
    en: string;
    zh: string;
    ja: string;
  };
  description: {
    en: string;
    zh: string;
    ja: string;
  };
}

export interface CustomFeature extends Omit<LocalizedFeature, 'name' | 'description'> {
  name: string;
  description: string;
  isCustom?: boolean;
}

export interface PriceBreakdown {
  basePrice: number;
  teamMembersCost: number;
  messageCreditsCost: number;
  vectorStorageCost: number;
  additionalFeaturesCost: { [key: string]: number };
  discount: number;
  total: number;
} 