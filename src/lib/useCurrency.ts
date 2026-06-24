"use client";

import { useEffect, useState } from "react";

export interface CurrencyInfo {
  symbol: string;
  code: string;
  rate: number; // vs USD
  countryName?: string;
}

const DEFAULT: CurrencyInfo = { symbol: "$", code: "USD", rate: 1 };

// Approximate exchange rates vs USD (static, for display purposes)
const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { symbol: "$",    code: "USD", rate: 1      },
  GBP: { symbol: "£",   code: "GBP", rate: 0.79   },
  EUR: { symbol: "€",   code: "EUR", rate: 0.92   },
  AUD: { symbol: "A$",  code: "AUD", rate: 1.53   },
  CAD: { symbol: "C$",  code: "CAD", rate: 1.36   },
  NZD: { symbol: "NZ$", code: "NZD", rate: 1.63   },
  SGD: { symbol: "S$",  code: "SGD", rate: 1.35   },
  AED: { symbol: "AED ", code: "AED", rate: 3.67  },
  INR: { symbol: "₹",   code: "INR", rate: 83     },
  ZAR: { symbol: "R",   code: "ZAR", rate: 18.5   },
  JPY: { symbol: "¥",   code: "JPY", rate: 149    },
  KRW: { symbol: "₩",   code: "KRW", rate: 1330   },
  MYR: { symbol: "RM ", code: "MYR", rate: 4.47   },
  THB: { symbol: "฿",   code: "THB", rate: 35     },
  SAR: { symbol: "SAR ", code: "SAR", rate: 3.75  },
  QAR: { symbol: "QR ", code: "QAR", rate: 3.64   },
};

export function useCurrency(): CurrencyInfo {
  const [currency, setCurrency] = useState<CurrencyInfo>(DEFAULT);

  useEffect(() => {
    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) })
      .then((r) => r.json())
      .then((data) => {
        const code = typeof data?.currency === "string" ? data.currency : "";
        const country = typeof data?.country_name === "string" ? data.country_name : "";
        const cur = CURRENCIES[code] ?? DEFAULT;
        setCurrency({ ...cur, countryName: country });
      })
      .catch(() => {/* keep default USD */});
  }, []);

  return currency;
}
