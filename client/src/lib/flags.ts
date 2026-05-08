export const countryCodeMap: Record<string, string> = {
  "Algeria": "dz",
  "Argentina": "ar",
  "Australia": "au",
  "Austria": "at",
  "Belgium": "be",
  "Bolivia": "bo",
  "Brazil": "br",
  "Cameroon": "cm",
  "Canada": "ca",
  "Chile": "cl",
  "China": "cn",
  "Colombia": "co",
  "Costa Rica": "cr",
  "Croatia": "hr",
  "Czech Republic": "cz",
  "Denmark": "dk",
  "DR Congo": "cd",
  "Ecuador": "ec",
  "Egypt": "eg",
  "England": "gb-eng",
  "France": "fr",
  "Germany": "de",
  "Honduras": "hn",
  "Hungary": "hu",
  "India": "in",
  "Iran": "ir",
  "Iraq": "iq",
  "Italy": "it",
  "Jamaica": "jm",
  "Japan": "jp",
  "Mexico": "mx",
  "Morocco": "ma",
  "Netherlands": "nl",
  "New Zealand": "nz",
  "Nigeria": "ng",
  "Panama": "pa",
  "Paraguay": "py",
  "Peru": "pe",
  "Poland": "pl",
  "Portugal": "pt",
  "Qatar": "qa",
  "Saudi Arabia": "sa",
  "Scotland": "gb-sct",
  "Senegal": "sn",
  "Serbia": "rs",
  "Slovenia": "si",
  "South Africa": "za",
  "South Korea": "kr",
  "Spain": "es",
  "Switzerland": "ch",
  "Tunisia": "tn",
  "Turkey": "tr",
  "UAE": "ae",
  "Ukraine": "ua",
  "United Kingdom": "gb",
  "United States": "us",
  "USA": "us",
  "Uruguay": "uy",
  "Uzbekistan": "uz",
  "Venezuela": "ve",
  "Wales": "gb-wls",
};

export const languageCodeMap: Record<string, string> = {
  "en": "us",
  "es": "es",
  "fr": "fr",
  "nl": "nl",
  "de": "de",
  "it": "it",
  "ar": "sa",
  "pt": "br",
  "ja": "jp",
};

export const currencyCodeMap: Record<string, string> = {
  "USD": "us",
  "EUR": "eu",
  "GBP": "gb",
  "CAD": "ca",
  "MXN": "mx",
  "JPY": "jp",
  "CNY": "cn",
  "AUD": "au",
  "BRL": "br",
  "ARS": "ar",
  "KRW": "kr",
  "CHF": "ch",
  "INR": "in",
  "SAR": "sa",
  "AED": "ae",
  "QAR": "qa",
};

export function getFlagUrl(countryName: string, size: number = 80): string {
  const code = countryCodeMap[countryName] || "un";
  return `https://flagcdn.com/w${size}/${code}.png`;
}

export function getLanguageFlagUrl(langCode: string, size: number = 40): string {
  const code = languageCodeMap[langCode] || "un";
  return `https://flagcdn.com/w${size}/${code}.png`;
}

export function getCurrencyFlagUrl(currencyCode: string, size: number = 40): string {
  const code = currencyCodeMap[currencyCode] || "un";
  return `https://flagcdn.com/w${size}/${code}.png`;
}

export function getFlagUrlByCode(countryCode: string, size: number = 80): string {
  return `https://flagcdn.com/w${size}/${countryCode}.png`;
}