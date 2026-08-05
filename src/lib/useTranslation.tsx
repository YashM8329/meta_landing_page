"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en, { type Translations } from "./translations/en";

export type SupportedLocale = "en" | "de" | "fr" | "it" | "es";

// Maps a BCP 47 language tag (e.g. "de-AT", "fr-BE") to a supported locale
function getLocaleFromBrowserTag(tag: string): SupportedLocale {
  const primary = tag.split("-")[0].toLowerCase();
  if (primary === "de") return "de";
  if (primary === "fr") return "fr";
  if (primary === "it") return "it";
  if (primary === "es") return "es";
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
    // Read browser language preference — instant, no network request
    const preferred = navigator.languages?.length
      ? navigator.languages
      : [navigator.language ?? "en"];

    const detectedLocale =
      preferred.map(getLocaleFromBrowserTag).find((l) => l !== "en") ?? "en";

    if (detectedLocale !== "en") {
      loadTranslations(detectedLocale).then((bundle) => {
        setTranslations(bundle);
        setLocale(detectedLocale);
        // Update the html lang attribute for accessibility & SEO
        document.documentElement.lang = detectedLocale;
      });
    }
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
