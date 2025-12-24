import { NotificationService } from './NotificationService';

interface CurrencyInfo {
  country: string;
  code: string;
  symbol: string;
  name: string;
  exchangeRateToUSD: number;
  tips: string[];
  atmNetworks: string[];
  cardAcceptance: string;
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  US: {
    country: 'United States',
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRateToUSD: 1,
    tips: [
      'Tipping is customary: 15-20% at restaurants, $1-2 per drink at bars',
      'Most places accept credit cards, but keep small bills for tips',
      'Sales tax is added at checkout (varies by state: 0-10%)',
    ],
    atmNetworks: ['Visa/Plus', 'Mastercard/Cirrus', 'Allpoint', 'MoneyPass'],
    cardAcceptance: 'Excellent - cards accepted almost everywhere',
  },
  CA: {
    country: 'Canada',
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    exchangeRateToUSD: 0.74,
    tips: [
      'Tipping similar to US: 15-20% at restaurants',
      '$1 and $2 coins (Loonie and Toonie) are common',
      'HST/GST tax (5-15%) added at checkout',
    ],
    atmNetworks: ['Interac', 'Visa/Plus', 'Mastercard/Cirrus'],
    cardAcceptance: 'Excellent - tap-to-pay widely used',
  },
  MX: {
    country: 'Mexico',
    code: 'MXN',
    symbol: '$',
    name: 'Mexican Peso',
    exchangeRateToUSD: 0.058,
    tips: [
      'Tipping is expected: 10-15% at restaurants',
      'Many places show prices with "MXN" to distinguish from USD',
      'Street vendors and small shops prefer cash',
      'ATMs at banks (not convenience stores) offer better rates',
    ],
    atmNetworks: ['Visa/Plus', 'Mastercard/Cirrus'],
    cardAcceptance: 'Good in tourist areas, cash preferred in local spots',
  },
};

const CITY_COUNTRIES: Record<string, string> = {
  kansasCity: 'US',
  newYork: 'US',
  losAngeles: 'US',
  miami: 'US',
  dallas: 'US',
  houston: 'US',
  atlanta: 'US',
  philadelphia: 'US',
  seattle: 'US',
  boston: 'US',
  sanFrancisco: 'US',
  toronto: 'CA',
  vancouver: 'CA',
  mexicoCity: 'MX',
  guadalajara: 'MX',
  monterrey: 'MX',
};

const LAST_COUNTRY_KEY = 'last_detected_country';

function getLastCountry(): string | null {
  return localStorage.getItem(LAST_COUNTRY_KEY);
}

function setLastCountry(country: string): void {
  localStorage.setItem(LAST_COUNTRY_KEY, country);
}

export function checkCurrencyChange(cityKey: string): boolean {
  const currentCountry = CITY_COUNTRIES[cityKey];
  if (!currentCountry) return false;

  const lastCountry = getLastCountry();
  
  if (lastCountry && lastCountry !== currentCountry) {
    triggerCurrencyAlert(lastCountry, currentCountry);
    setLastCountry(currentCountry);
    return true;
  }

  setLastCountry(currentCountry);
  return false;
}

function triggerCurrencyAlert(fromCountry: string, toCountry: string): void {
  const fromCurrency = CURRENCIES[fromCountry];
  const toCurrency = CURRENCIES[toCountry];

  if (!fromCurrency || !toCurrency) return;

  const conversionExample = toCountry === 'US' 
    ? '' 
    : ` (~${(100 / toCurrency.exchangeRateToUSD).toFixed(0)} ${toCurrency.code} = 100 USD)`;

  const topTip = toCurrency.tips[0] || '';

  NotificationService.addNotification({
    type: 'currency',
    title: `Currency Change: ${toCurrency.code}`,
    message: `Welcome to ${toCurrency.country}! You're now using ${toCurrency.name} (${toCurrency.symbol})${conversionExample}. ${topTip}`,
    icon: '💱',
    priority: 'medium',
  });
}

export function getCurrencyInfo(cityKey: string): CurrencyInfo | null {
  const country = CITY_COUNTRIES[cityKey];
  if (!country) return null;
  return CURRENCIES[country] || null;
}

export function getConversionRate(fromCityKey: string, toCityKey: string): { rate: number; fromCode: string; toCode: string } | null {
  const fromCountry = CITY_COUNTRIES[fromCityKey];
  const toCountry = CITY_COUNTRIES[toCityKey];
  
  if (!fromCountry || !toCountry) return null;
  
  const fromCurrency = CURRENCIES[fromCountry];
  const toCurrency = CURRENCIES[toCountry];
  
  if (!fromCurrency || !toCurrency) return null;

  const rate = fromCurrency.exchangeRateToUSD / toCurrency.exchangeRateToUSD;
  
  return {
    rate,
    fromCode: fromCurrency.code,
    toCode: toCurrency.code,
  };
}

export function convertAmount(amount: number, fromCityKey: string, toCityKey: string): number | null {
  const conversion = getConversionRate(fromCityKey, toCityKey);
  if (!conversion) return null;
  return amount * conversion.rate;
}

export function formatCurrency(amount: number, cityKey: string): string {
  const country = CITY_COUNTRIES[cityKey];
  const currency = CURRENCIES[country];
  
  if (!currency) return `$${amount.toFixed(2)}`;
  
  const formatter = new Intl.NumberFormat(
    country === 'MX' ? 'es-MX' : country === 'CA' ? 'en-CA' : 'en-US',
    { style: 'currency', currency: currency.code }
  );
  
  return formatter.format(amount);
}

export function getAllCurrencies(): CurrencyInfo[] {
  return Object.values(CURRENCIES);
}
