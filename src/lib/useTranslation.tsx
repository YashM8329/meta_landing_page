"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en, { type Translations } from "./translations/en";

// Countries that map to each supported language
const GERMAN_COUNTRIES = new Set(["DE", "AT", "LI"]); // Germany, Austria, Liechtenstein
const FRENCH_COUNTRIES = new Set(["FR", "BE", "LU", "CH", "MC", "BJ", "BF", "BI", "CM", "CF", "TD", "KM", "CD", "CG", "CI", "DJ", "GQ", "GA", "GN", "HT", "MG", "ML", "MR", "MU", "NE", "RW", "SN", "SC", "TG", "VU"]);
const ITALIAN_COUNTRIES = new Set(["IT", "SM", "VA"]);
const SPANISH_COUNTRIES = new Set(["ES", "MX", "CO", "AR", "PE", "VE", "CL", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "GQ", "PR"]);

export type SupportedLocale = "en" | "de" | "fr" | "it" | "es";

function getLocaleFromCountry(countryCode: string): SupportedLocale {
  const code = countryCode.toUpperCase();
  if (GERMAN_COUNTRIES.has(code)) return "de";
  if (FRENCH_COUNTRIES.has(code)) return "fr";
  if (ITALIAN_COUNTRIES.has(code)) return "it";
  if (SPANISH_COUNTRIES.has(code)) return "es";
  return "en";
}

interface I18nContextValue {
  t: Translations;
  locale: SupportedLocale;
}

const I18nContext = createContext<I18nContextValue>({ t: en, locale: "en" });

// Lazy-load translation bundles only when needed
async function loadTranslations(locale: SupportedLocale): Promise<Translations> {
  if (locale === "en") return en;
  if (locale === "de") return (await import("./translations/de")).default;
  if (locale === "fr") return (await import("./translations/fr")).default;
  if (locale === "it") return (await import("./translations/it")).default;
  if (locale === "es") return (await import("./translations/es")).default;
  return en;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<Translations>(en);
  const [locale, setLocale] = useState<SupportedLocale>("en");

  useEffect(() => {
    // Read the country detected by useCurrency's ipapi.co fetch.
    // We tap into the same fetch to avoid a second network request.
    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) })
      .then((r) => r.json())
      .then(async (data) => {
        const countryCode =
          typeof data?.country === "string" ? data.country.toUpperCase() : "US";
        const detectedLocale = getLocaleFromCountry(countryCode);

        if (detectedLocale !== "en") {
          const bundle = await loadTranslations(detectedLocale);
          setTranslations(bundle);
          setLocale(detectedLocale);
          // Update the html lang attribute for accessibility & SEO
          document.documentElement.lang = detectedLocale;
        }
      })
      .catch(() => {
        // keep English on failure
      });
  }, []);

  return (
    <I18nContext.Provider value={{ t: translations, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
