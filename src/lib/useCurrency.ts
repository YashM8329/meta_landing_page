"use client";

import { useEffect, useState } from "react";
import en from "react-phone-number-input/locale/en";

export interface CurrencyInfo {
  symbol: string;
  code: string;
  rate: number; // vs USD
  countryName?: string;
  countryCode?: string; // 2-letter ISO, e.g., "US", "IN"
}

const DEFAULT: CurrencyInfo = { symbol: "$", code: "USD", rate: 1, countryName: "United States", countryCode: "US" };

// Exchange rates vs 1 USD (approximate static rates for simulation)
const CURRENCIES: Record<string, Omit<CurrencyInfo, "countryName" | "countryCode" | "code">> = {
  USD: { symbol: "$",    rate: 1      },
  GBP: { symbol: "£",   rate: 0.79   },
  EUR: { symbol: "€",   rate: 0.92   },
  AUD: { symbol: "A$",  rate: 1.53   },
  CAD: { symbol: "C$",  rate: 1.36   },
  NZD: { symbol: "NZ$", rate: 1.63   },
  SGD: { symbol: "S$",  rate: 1.35   },
  AED: { symbol: "AED ", rate: 3.67  },
  INR: { symbol: "₹",   rate: 83     },
  ZAR: { symbol: "R",   rate: 18.5   },
  JPY: { symbol: "¥",   rate: 149    },
  KRW: { symbol: "₩",   rate: 1330   },
  MYR: { symbol: "RM ", rate: 4.47   },
  THB: { symbol: "฿",   rate: 35     },
  SAR: { symbol: "SAR ", rate: 3.75  },
  QAR: { symbol: "QR ", rate: 3.64   },
  IDR: { symbol: "Rp",   rate: 16400  },
  VND: { symbol: "₫",    rate: 25400  },
  PHP: { symbol: "₱",    rate: 58     },
  CHF: { symbol: "CHF",  rate: 0.89   },
  SEK: { symbol: "kr",   rate: 10.5   },
  NOK: { symbol: "kr",   rate: 10.6   },
  DKK: { symbol: "kr",   rate: 6.9    },
  PLN: { symbol: "zł",   rate: 3.96   },
  CZK: { symbol: "Kč",   rate: 23.2   },
  HUF: { symbol: "Ft",   rate: 365    },
  RON: { symbol: "lei",  rate: 4.58   },
  TRY: { symbol: "₺",    rate: 32.8   },
  CNY: { symbol: "¥",    rate: 7.25   },
  TWD: { symbol: "NT$",  rate: 32.3   },
  HKD: { symbol: "HK$",  rate: 7.8    },
  BRL: { symbol: "R$",   rate: 5.48   },
  MXN: { symbol: "Mex$", rate: 18.1   },
  COP: { symbol: "Col$", rate: 4150   },
  CLP: { symbol: "CLP$", rate: 935    },
  PEN: { symbol: "S/.",  rate: 3.8    },
  ARS: { symbol: "AR$",  rate: 910    },
  EGP: { symbol: "EGP ", rate: 48     },
};

// Comprehensive Country ISO-2 -> Currency Code mapping
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // North America
  US: "USD", CA: "CAD", MX: "MXN",
  // Europe (EUR countries)
  FR: "EUR", DE: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR", IE: "EUR", AT: "EUR", FI: "EUR", GR: "EUR", PT: "EUR",
  SK: "EUR", SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", MT: "EUR", CY: "EUR", LU: "EUR", MC: "EUR", AD: "EUR", SM: "EUR", VA: "EUR", ME: "EUR", XK: "EUR",
  // Europe (Other)
  GB: "GBP", CH: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", IS: "ISK", PLN: "PLN", CZ: "CZK", HU: "HUF", RO: "RON", BG: "BGN", UA: "UAH", RU: "RUB", BY: "BYN", TR: "TRY",
  // Asia
  IN: "INR", PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR", MV: "MVR",
  CN: "CNY", JP: "JPY", KR: "KRW", TW: "TWD", HK: "HKD", SG: "SGD", MY: "MYR", TH: "THB", ID: "IDR", PH: "PHP", VN: "VND", KH: "KHR", LA: "LAK", MM: "MMK",
  // Oceania
  AU: "AUD", NZ: "NZD", FJ: "FJD", PG: "PGK",
  // Middle East
  AE: "AED", SA: "SAR", QA: "QAR", OM: "OMR", KW: "KWD", BH: "BHD", IL: "ILS", JO: "JOD", LB: "LBP", YE: "YER",
  // Africa
  ZA: "ZAR", EG: "EGP", NG: "NGN", KE: "KES", GH: "GHS", MA: "MAD", DZ: "DZD", TN: "TND", MU: "MUR",
  // South America
  BR: "BRL", AR: "ARS", CO: "COP", CL: "CLP", PE: "PEN", VE: "VES", UY: "UYU", PY: "PYG", BO: "BOB", EC: "USD",
};

// Map currency code to a default country 2-letter code
const CURRENCY_TO_COUNTRY: Record<string, string> = {
  USD: "US", GBP: "GB", INR: "IN", IDR: "ID", VND: "VN", PHP: "PH", SGD: "SG",
  AUD: "AU", CAD: "CA", NZD: "NZ", AED: "AE", ZAR: "ZA", JPY: "JP", KRW: "KR",
  MYR: "MY", THB: "TH", SAR: "SA", QAR: "QA", EUR: "FR", CHF: "CH", SEK: "SE",
  NOK: "NO", DKK: "DK", PLN: "PL", CZK: "CZ", HUF: "HU", RON: "RO", TRY: "TR",
  CNY: "CN", TWD: "TW", HKD: "HK", BRL: "BR", MXN: "MX", COP: "CO", CLP: "CL",
  PEN: "PE", ARS: "AR", EGP: "EG"
};

// Simple global state
let globalCurrency: CurrencyInfo = DEFAULT;
const listeners = new Set<(c: CurrencyInfo) => void>();

export function setGlobalLocation(info: Partial<CurrencyInfo>) {
  let updated: CurrencyInfo = { ...globalCurrency };
  
  if (info.countryCode) {
    const code = info.countryCode.toUpperCase();
    const currencyCode = COUNTRY_TO_CURRENCY[code] || "USD";
    const cur = CURRENCIES[currencyCode] || { symbol: "$", rate: 1 };
    const name = en[code as keyof typeof en] || info.countryName || "United States";
    
    updated = {
      symbol: cur.symbol,
      code: currencyCode,
      rate: cur.rate,
      countryName: name,
      countryCode: code,
    };
  } else if (info.code) {
    const currencyCode = info.code.toUpperCase();
    const countryCode = CURRENCY_TO_COUNTRY[currencyCode] || "US";
    const cur = CURRENCIES[currencyCode] || { symbol: "$", rate: 1 };
    const name = en[countryCode as keyof typeof en] || "United States";
    
    updated = {
      symbol: cur.symbol,
      code: currencyCode,
      rate: cur.rate,
      countryName: name,
      countryCode: countryCode,
    };
  } else if (info.countryName) {
    const name = info.countryName.trim();
    // find key in en
    const normalizedName = name.toLowerCase();
    const foundCode = Object.entries(en).find(([_, val]) => val.toLowerCase() === normalizedName)?.[0];
    if (foundCode) {
      const currencyCode = COUNTRY_TO_CURRENCY[foundCode] || "USD";
      const cur = CURRENCIES[currencyCode] || { symbol: "$", rate: 1 };
      updated = {
        symbol: cur.symbol,
        code: currencyCode,
        rate: cur.rate,
        countryName: name,
        countryCode: foundCode,
      };
    } else {
      // Custom country name with default USD
      updated = {
        symbol: "$",
        code: "USD",
        rate: 1,
        countryName: name,
        countryCode: undefined,
      };
    }
  }

  globalCurrency = updated;
  listeners.forEach((l) => l(globalCurrency));
}

let hasFetched = false;

export function useCurrency(): CurrencyInfo & { setLocation: (info: Partial<CurrencyInfo>) => void } {
  const [currency, setCurrency] = useState<CurrencyInfo>(globalCurrency);

  useEffect(() => {
    setCurrency(globalCurrency);
    listeners.add(setCurrency);
    
    if (!hasFetched) {
      hasFetched = true;
      fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) })
        .then((r) => r.json())
        .then((data) => {
          const countryCode = typeof data?.country === "string" ? data.country.toUpperCase() : "US";
          const countryName = typeof data?.country_name === "string" ? data.country_name : "United States";
          setGlobalLocation({ countryCode, countryName });
        })
        .catch(() => {
          // keep default
        });
    }

    return () => {
      listeners.delete(setCurrency);
    };
  }, []);

  return { ...currency, setLocation: setGlobalLocation };
}
