"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PhoneInput, { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import en from "react-phone-number-input/locale/en";
import { useCurrency } from "@/lib/useCurrency";
import { useTranslation } from "@/lib/useTranslation";

type VenueStatus = "" | "existing" | "new" | "other";
type AreaSize = "" | "small" | "large";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  venueStatus: VenueStatus;
  venueStatusOther: string;
  venueLocation: string;
  plannedArea: AreaSize;
  country: string;
}
interface FieldError {
  fullName?: string;
  email?: string;
  phone?: string;
  venueStatus?: string;
  country?: string;
  venueStatusOther?: string;
  venueLocation?: string;
}

const COUNTRIES = Object.values(en).map(c => c === "United Arab Emirates" ? "UAE" : c).sort();

const COUNTRY_PHONE_SPECS: Record<string, { code: string; length: number | number[] }> = {
  "United States": { code: "+1", length: 10 },
  "Canada": { code: "+1", length: 10 },
  "India": { code: "+91", length: 10 },
  "UAE": { code: "+971", length: 9 },
  "United Kingdom": { code: "+44", length: [10, 11] },
  "Australia": { code: "+61", length: 9 },
  "Germany": { code: "+49", length: [10, 11] },
  "France": { code: "+33", length: 9 },
  "Singapore": { code: "+65", length: 8 },
  "Saudi Arabia": { code: "+966", length: 9 },
  "Qatar": { code: "+974", length: 8 },
  "Kuwait": { code: "+965", length: 8 },
  "Oman": { code: "+968", length: 8 },
  "Bahrain": { code: "+973", length: 8 },
  "New Zealand": { code: "+64", length: [8, 9, 10] },
  "South Africa": { code: "+27", length: 9 },
  "Japan": { code: "+81", length: [9, 10] },
  "China": { code: "+86", length: 11 },
  "Brazil": { code: "+55", length: [10, 11] },
  "Mexico": { code: "+52", length: 10 },
  "Ireland": { code: "+353", length: 9 },
  "Netherlands": { code: "+31", length: 9 },
  "Spain": { code: "+34", length: 9 },
  "Italy": { code: "+39", length: [9, 10] }
};

const inputBase = "w-full h-[50px] lg:h-[52px] rounded-xl border px-4 text-[15px] lg:text-[16px] font-medium text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-150";
const selectArrow = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%235B6472' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;


export default function BrochureForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ fullName: "", email: "", phone: "", venueStatus: "", venueStatusOther: "", venueLocation: "", plannedArea: "", country: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [defaultCountry, setDefaultCountry] = useState<Country | undefined>(undefined);
  const [venueInputValue, setVenueInputValue] = useState("");
  const [venueOptions, setVenueOptions] = useState<{ label: string; value: string; mainText?: string; secondaryText?: string }[]>([]);
  const [isVenueLoading, setIsVenueLoading] = useState(false);
  const [countryInputValue, setCountryInputValue] = useState("");
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [sessionToken, setSessionToken] = useState("");
  const [hasSelected, setHasSelected] = useState(false);
  const [venueDropdownDirection, setVenueDropdownDirection] = useState<"down" | "up">("down");
  const venueOtherInputRef = useRef<HTMLInputElement>(null);
  const venueLocationInputRef = useRef<HTMLInputElement>(null);
  const venuePanelOtherRef = useRef<HTMLDivElement>(null);
  const venuePanelLocationRef = useRef<HTMLDivElement>(null);

  const { countryName, countryCode, setLocation } = useCurrency();

  useEffect(() => {
    if (countryName) {
      const displayCountry = (countryName === "United Arab Emirates" || countryName === "UAE") ? "UAE" : countryName;
      setForm((prev) => ({
        ...prev,
        country: displayCountry,
      }));
    }
    if (countryCode) {
      setDefaultCountry(countryCode as Country);
    }
  }, [countryName, countryCode]);

  // Autocomplete fetch logic
  const fetchSuggestions = async (query: string, tokenToUse?: string) => {
    if (!query || query.length < 2) {
      setVenueOptions([]);
      return;
    }

    // Skip autocomplete fetch if a suggestion was already selected
    if (hasSelected) {
      setVenueOptions([]);
      return;
    }

    let token = tokenToUse || sessionToken;
    if (!token) {
      if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
        token = window.crypto.randomUUID();
      } else {
        token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }
      setSessionToken(token);
    }

    setIsVenueLoading(true);
    try {
      const url = `/api/places-autocomplete?input=${encodeURIComponent(query)}&sessiontoken=${encodeURIComponent(token)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVenueOptions(data);
      }
    } catch (err) {
      // fail silently
    } finally {
      setIsVenueLoading(false);
    }
  };

  useEffect(() => {
    if (!venueInputValue || venueInputValue.length < 2) {
      setVenueOptions([]);
      return;
    }

    if (hasSelected) {
      setVenueOptions([]);
      return;
    }

    // Generate session token if it doesn't exist yet
    let token = sessionToken;
    if (!token) {
      if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
        token = window.crypto.randomUUID();
      } else {
        token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      }
      setSessionToken(token);
    }

    const timer = setTimeout(() => {
      fetchSuggestions(venueInputValue, token);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [venueInputValue, sessionToken, hasSelected]);

  useEffect(() => {
    if (!countryInputValue || countryInputValue.length < 1) {
      setCountryOptions([]);
      return;
    }
    const filtered = COUNTRIES.filter(c =>
      c.toLowerCase().includes(countryInputValue.toLowerCase())
    ).slice(0, 10);
    setCountryOptions(filtered);
  }, [countryInputValue]);



  const validateEmailField = (emailVal: string) => {
    if (!emailVal.trim()) {
      setErrors((prev) => ({ ...prev, email: t.form.errors.emailRequired }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setErrors((prev) => ({ ...prev, email: t.form.errors.emailInvalid }));
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const validatePhoneField = (phoneVal: string) => {
    if (!phoneVal.trim()) {
      setErrors((prev) => ({ ...prev, phone: t.form.errors.phoneRequired }));
      return;
    }
    const digitsOnly = phoneVal.replace(/[^\d+]/g, "");
    const selectedCountry = form.country.trim();
    const spec = COUNTRY_PHONE_SPECS[selectedCountry];
    
    let isInvalid = false;
    if (spec) {
      let nationalNumber = digitsOnly;
      if (digitsOnly.startsWith(spec.code)) {
        nationalNumber = digitsOnly.substring(spec.code.length);
      } else if (digitsOnly.startsWith("+")) {
        const matchedCode = Object.values(COUNTRY_PHONE_SPECS)
          .map(s => s.code)
          .find(code => digitsOnly.startsWith(code));
        if (matchedCode) {
          nationalNumber = digitsOnly.substring(matchedCode.length);
        }
      }
      
      if (nationalNumber.startsWith("0")) {
        nationalNumber = nationalNumber.substring(1);
      }

      const len = nationalNumber.length;
      const expectedLengths = Array.isArray(spec.length) ? spec.length : [spec.length];
      const maxExpected = Math.max(...expectedLengths);
      const minExpected = Math.min(...expectedLengths);

      if (len > maxExpected || len < minExpected || !isValidPhoneNumber(phoneVal)) {
        isInvalid = true;
      }
    } else {
      if (!isValidPhoneNumber(phoneVal)) {
        isInvalid = true;
      }
    }

    if (isInvalid) {
      setErrors((prev) => ({ ...prev, phone: t.form.errors.phoneInvalid }));
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const set = (field: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field as keyof FieldError]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  // Scroll the expanded sub-panel into view after animation starts (#1)
  const scrollPanelIntoView = (ref: React.RefObject<HTMLDivElement | null>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 120);
  };

  // Detect available space below the input and set dropdown direction (#4)
  const detectDropdownDirection = (inputEl: HTMLInputElement | null) => {
    if (!inputEl) return;
    const rect = inputEl.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setVenueDropdownDirection(spaceBelow < 220 ? "up" : "down");
  };

  const validate = (): FieldError => {
    const e: FieldError = {};
    if (!form.fullName.trim()) e.fullName = t.form.errors.fullNameRequired;
    if (!form.email.trim()) e.email = t.form.errors.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.form.errors.emailInvalid;
    if (!form.phone.trim()) {
      e.phone = t.form.errors.phoneRequired;
    } else {
      // Normalize number (remove spaces, dashes, parens, keep digits and +)
      const digitsOnly = form.phone.replace(/[^\d+]/g, "");
      const selectedCountry = form.country.trim();
      const spec = COUNTRY_PHONE_SPECS[selectedCountry];
      
      if (spec) {
        let nationalNumber = digitsOnly;
        // Strip country code if present
        if (digitsOnly.startsWith(spec.code)) {
          nationalNumber = digitsOnly.substring(spec.code.length);
        } else if (digitsOnly.startsWith("+")) {
          // If phone starts with another country code (e.g. user selected different flag in the dialer)
          const matchedCode = Object.values(COUNTRY_PHONE_SPECS)
            .map(s => s.code)
            .find(code => digitsOnly.startsWith(code));
          if (matchedCode) {
            nationalNumber = digitsOnly.substring(matchedCode.length);
          }
        }
        
        // Strip leading zero if present (common local prefix)
        if (nationalNumber.startsWith("0")) {
          nationalNumber = nationalNumber.substring(1);
        }

        const len = nationalNumber.length;
        const expectedLengths = Array.isArray(spec.length) ? spec.length : [spec.length];
        const maxExpected = Math.max(...expectedLengths);
        const minExpected = Math.min(...expectedLengths);

        if (len > maxExpected) {
          e.phone = t.form.errors.phoneInvalid;
        } else if (len < minExpected) {
          e.phone = t.form.errors.phoneInvalid;
        } else if (!isValidPhoneNumber(form.phone)) {
          e.phone = t.form.errors.phoneInvalid;
        }
      } else {
        // Fallback for non-mapped countries using general library validation
        if (!isValidPhoneNumber(form.phone)) {
          e.phone = t.form.errors.phoneInvalid;
        }
      }
    }
    if (!form.venueStatus) e.venueStatus = t.form.errors.venueStatusRequired;
    if (form.venueStatus === "other" && !form.venueStatusOther.trim()) e.venueStatusOther = t.form.errors.venueStatusOtherRequired;
    if (form.venueStatus === "existing" && !form.venueLocation.trim()) e.venueLocation = t.form.errors.venueLocationRequired;
    if (!form.country) e.country = t.form.errors.countryRequired;
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fe = validate();
    if (Object.keys(fe).length > 0) {
      setErrors(fe);
      const firstErrorEl = document.getElementById(`field-${Object.keys(fe)[0]}`);
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        // Delay focus slightly so scroll completes before keyboard appears on iOS
        setTimeout(() => firstErrorEl.focus(), 300);
      }
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Failed to send lead details.");
      }

      router.push("/thank-you");
    } catch (err: any) {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="brochure-form" className="min-h-0 lg:py-10 relative flex flex-col justify-center pt-6 pb-8 overflow-hidden" aria-label="Request brochure form">
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0 md:grid md:grid-cols-2 md:gap-8 lg:gap-16 md:items-start">
        {/* Left column: context */}
        <div className="hidden md:flex flex-col">
          {/* <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-2">Get the full picture</p> */}
          <h2 className="text-[48px] xl:text-[56px] leading-[0.95] font-extrabold tracking-[-0.03em] text-ink mb-6">
            {t.form.heading}
          </h2>
          {/* <p className="text-[16px] text-ink-soft leading-relaxed mb-8 max-w-[400px]">
            Get detailed specs, revenue data, and case studies.
          </p> */}
          <div className="flex flex-col gap-9 mt-3">
            {([
              <svg key="analytics" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><path d="M15 9h4v4"/></svg>,
              <svg key="specs" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18" strokeWidth="1" opacity="0.4"/></svg>,
              <svg key="handshake" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>,
            ] as const).map((icon, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">{icon}</span>
                <span className="text-[15px] md:text-[18px] lg:text-[22px] font-medium text-ink">{t.form.benefits[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column (or full width on mobile): form */}
        <div>
          {/* Mobile header */}
          <div className="md:hidden mb-7">
            {/* <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">Get the full picture</p> */}
            <h2 className="text-[clamp(30px,8.5vw,42px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">{t.form.heading}</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate aria-label="Brochure request">
            {/* Name + Email as 2-col on desktop */}
            <div className="md:grid md:grid-cols-2 md:gap-4">
              <div className="mb-4">
                <label htmlFor="field-fullName" className="block text-[14px] lg:text-[16px] font-semibold text-ink mb-1.5">{t.form.fields.fullName} <span className="text-accent">*</span></label>
                <input id="field-fullName" type="text" autoComplete="name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                  aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "err-fullName" : undefined} placeholder={t.form.fields.fullNamePlaceholder}
                  className={`${inputBase} ${errors.fullName ? "border-red-400 bg-red-50" : "border-line bg-white"}`} />
                {errors.fullName && <p id="err-fullName" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.fullName}</p>}
              </div>

               <div className="mb-4">
                <label htmlFor="field-email" className="block text-[14px] lg:text-[16px] font-semibold text-ink mb-1.5">{t.form.fields.email} <span className="text-accent">*</span></label>
                <input id="field-email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  onBlur={() => validateEmailField(form.email)}
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} placeholder={t.form.fields.emailPlaceholder}
                  className={`${inputBase} ${errors.email ? "border-red-400 bg-red-50" : "border-line bg-white"}`} />
                {errors.email && <p id="err-email" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.email}</p>}
              </div>
            </div>

            {/* Phone + Country as 2-col on desktop */}
            <div className="md:grid md:grid-cols-2 md:gap-4">
              <div className="mb-4">
                <label htmlFor="field-phone" className="block text-[14px] lg:text-[16px] font-semibold text-ink mb-1.5">{t.form.fields.phone} <span className="text-accent">*</span></label>
                <PhoneInput
                  placeholder={t.form.fields.phonePlaceholder}
                  value={form.phone}
                  onChange={(val) => set("phone", val || "")}
                  onBlur={() => validatePhoneField(form.phone)}
                  defaultCountry={defaultCountry}
                  country={defaultCountry}
                  onCountryChange={(c) => {
                    if (c && c !== defaultCountry) {
                      setLocation({ countryCode: c });
                    }
                  }}
                  className={errors.phone ? "PhoneInput--error" : ""}
                  numberInputProps={{
                    id: "field-phone",
                    "aria-invalid": !!errors.phone,
                    "aria-describedby": errors.phone ? "err-phone" : undefined,
                  }}
                />
                {errors.phone && <p id="err-phone" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="field-country" className="block text-[14px] lg:text-[16px] font-semibold text-ink mb-1.5">{t.form.fields.country} <span className="text-accent">*</span></label>
                <div className="relative">
                  <input
                    id="field-country"
                    type="text"
                    value={form.country}
                    onChange={(e) => {
                      set("country", e.target.value);
                      setCountryInputValue(e.target.value);
                    }}
                    onBlur={() => {
                      setTimeout(() => setCountryOptions([]), 200);
                      if (form.country) {
                        setLocation({ countryName: form.country });
                      }
                    }}
                    placeholder={t.form.fields.countryPlaceholder}
                    className={`${inputBase} ${errors.country ? "border-red-400 bg-red-50" : "border-line bg-white"}`}
                  />
                  {countryOptions.length > 0 && (
                    <ul className="absolute left-0 right-0 mt-1 bg-white border border-line rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                      {countryOptions.map((c, idx) => (
                        <li
                          key={idx}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            set("country", c);
                            setCountryOptions([]);
                            setLocation({ countryName: c });
                          }}
                          className="px-4 py-2 hover:bg-accent/10 cursor-pointer text-[14px] text-ink border-b border-line last:border-none"
                        >
                          {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {errors.country && <p id="err-country" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.country}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="field-venueStatus" className="block text-[14px] lg:text-[16px] font-semibold text-ink mb-1.5">
                {t.form.fields.venueStatus} <span className="text-accent">*</span>
              </label>
              <select
                id="field-venueStatus"
                value={form.venueStatus}
                onChange={(e) => {
                  const val = e.target.value as VenueStatus;
                  set("venueStatus", val);
                  if (val === "other") scrollPanelIntoView(venuePanelOtherRef);
                  if (val === "existing") scrollPanelIntoView(venuePanelLocationRef);
                }}
                aria-invalid={!!errors.venueStatus}
                aria-describedby={errors.venueStatus ? "err-venueStatus" : undefined}
                className={`${inputBase} appearance-none bg-no-repeat bg-[right_14px_center] ${errors.venueStatus ? "border-red-400 bg-red-50" : "border-line bg-white"}`}
                style={{ backgroundImage: selectArrow }}
              >
                <option value="">{t.form.fields.venueStatusDefault}</option>
                <option value="existing">{t.form.fields.venueStatusExisting}</option>
                <option value="new">{t.form.fields.venueStatusNew}</option>
                <option value="other">{t.form.fields.venueStatusOther}</option>
              </select>
              {errors.venueStatus && <p id="err-venueStatus" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.venueStatus}</p>}
              <AnimatePresence>
              {form.venueStatus === "other" && (
              <motion.div
                ref={venuePanelOtherRef}
                id="venue-other-container"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
              <div className="mb-4 bg-accent/5 border border-accent/15 rounded-[12px] p-4 mt-4">
                <label htmlFor="field-venueStatusOther" className="block text-[14px] lg:text-[16px] font-semibold text-ink mb-1.5">{t.form.fields.venueLocationOther} <span className="text-accent">*</span></label>
                <div className="relative">
                  <input
                    ref={venueOtherInputRef}
                    id="field-venueStatusOther"
                    type="text"
                    value={form.venueStatusOther}
                    onChange={(e) => {
                      set("venueStatusOther", e.target.value);
                      setVenueInputValue(e.target.value);
                      setHasSelected(false);
                    }}
                    onFocus={() => {
                      detectDropdownDirection(venueOtherInputRef.current);
                      fetchSuggestions(venueInputValue);
                    }}
                    onBlur={() => {
                      setTimeout(() => setVenueOptions([]), 200);
                    }}
                    placeholder={t.form.fields.venueLocationOtherPlaceholder}
                    className={`${inputBase} ${errors.venueStatusOther ? "border-red-400 bg-red-50" : "border-line bg-white"}`}
                  />
                  {isVenueLoading && (
                    <div className="absolute right-3 top-3.5">
                      <svg className="animate-spin h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  )}
                  {venueOptions.length > 0 && (
                    <ul className={`absolute left-0 right-0 bg-white border border-line rounded-lg shadow-lg max-h-56 overflow-y-auto z-50 divide-y divide-line ${venueDropdownDirection === "up" ? "bottom-full mb-1" : "mt-1"}`}>
                      {venueOptions.map((opt, idx) => (
                        <li
                          key={idx}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            set("venueStatusOther", opt.value);
                            setVenueInputValue(opt.value);
                            setVenueOptions([]);
                            setSessionToken("");
                            setHasSelected(true);
                          }}
                          className="px-4 py-2.5 hover:bg-accent/10 cursor-pointer flex items-center gap-2.5 text-[14px]"
                        >
                          <svg className="w-4 h-4 text-[#8A95A5] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <div className="flex-1 truncate text-left">
                            <span className="font-semibold text-ink">
                              {opt.mainText || opt.label}
                            </span>
                            {opt.secondaryText && (
                              <span className="text-[12px] text-ink-faint ml-1.5">
                                {opt.secondaryText}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                      <li className="flex justify-end items-center px-4 py-2 bg-gray-50 border-t border-line sticky bottom-0 select-none">
                        <span className="text-[10px] text-ink-faint font-medium uppercase tracking-wider">{t.form.poweredBy}</span>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                          alt="Google"
                          className="h-[12px] ml-1.5 object-contain"
                        />
                      </li>
                    </ul>
                  )}
                </div>
                {errors.venueStatusOther && <p id="err-venueStatusOther" role="alert" className="text-[12px] text-red-500 mt-1.5 font-medium">{errors.venueStatusOther}</p>}
              </div>
              </motion.div>
            )}
            </AnimatePresence>

            <AnimatePresence>
            {form.venueStatus === "existing" && (
              <motion.div
                ref={venuePanelLocationRef}
                id="venue-location-container"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
              <div className="mb-4 bg-accent/5 border border-accent/15 rounded-[12px] p-4 mt-3">
                <label htmlFor="field-venueLocation" className="block text-[14px] lg:text-[16px] font-semibold text-ink mb-1.5">{t.form.fields.venueLocation} <span className="text-accent">*</span></label>
                <div className="relative">
                  <input
                    ref={venueLocationInputRef}
                    id="field-venueLocation"
                    type="text"
                    value={form.venueLocation}
                    onChange={(e) => {
                      set("venueLocation", e.target.value);
                      setVenueInputValue(e.target.value);
                      setHasSelected(false);
                    }}
                    onFocus={() => {
                      detectDropdownDirection(venueLocationInputRef.current);
                      fetchSuggestions(venueInputValue);
                    }}
                    onBlur={() => {
                      setTimeout(() => setVenueOptions([]), 200);
                    }}
                    placeholder={t.form.fields.venueLocationPlaceholder}
                    className={`${inputBase} ${errors.venueLocation ? "border-red-400 bg-red-50" : "border-line bg-white"}`}
                  />
                  {isVenueLoading && (
                    <div className="absolute right-3 top-3.5">
                      <svg className="animate-spin h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  )}
                  {venueOptions.length > 0 && (
                    <ul className={`absolute left-0 right-0 bg-white border border-line rounded-lg shadow-lg max-h-56 overflow-y-auto z-50 divide-y divide-line ${venueDropdownDirection === "up" ? "bottom-full mb-1" : "mt-1"}`}>
                      {venueOptions.map((opt, idx) => (
                        <li
                          key={idx}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            set("venueLocation", opt.value);
                            setVenueInputValue(opt.value);
                            setVenueOptions([]);
                            setSessionToken("");
                            setHasSelected(true);
                          }}
                          className="px-4 py-2.5 hover:bg-accent/10 cursor-pointer flex items-center gap-2.5 text-[14px]"
                        >
                          <svg className="w-4 h-4 text-[#8A95A5] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          <div className="flex-1 truncate text-left">
                            <span className="font-semibold text-ink">
                              {opt.mainText || opt.label}
                            </span>
                            {opt.secondaryText && (
                              <span className="text-[12px] text-ink-faint ml-1.5">
                                {opt.secondaryText}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                      <li className="flex justify-end items-center px-4 py-2 bg-gray-50 border-t border-line sticky bottom-0 select-none">
                        <span className="text-[10px] text-ink-faint font-medium uppercase tracking-wider">{t.form.poweredBy}</span>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                          alt="Google"
                          className="h-[12px] ml-1.5 object-contain"
                        />
                      </li>
                    </ul>
                  )}
                </div>
                {errors.venueLocation && <p id="err-venueLocation" role="alert" className="text-[12px] text-red-500 mt-1.5 font-medium">{errors.venueLocation}</p>}
              </div>
              </motion.div>
            )}
            </AnimatePresence>
            </div>

            {serverError && (
              <p role="alert" className="text-[13px] text-red-500 font-medium bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
                {serverError}
              </p>
            )}

            <button type="submit" disabled={submitting} aria-busy={submitting}
              className="relative w-full h-[54px] text-white font-semibold text-[18px] rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent mt-2 overflow-hidden shadow-lg select-none bg-gradient-to-r from-[#1D6CEF] via-[#2f74e6] to-[#1D6CEF] hover:brightness-105 active:scale-[0.98] transition-all duration-150">
              
              {/* Halftone pattern overlay denser on left and right flanks (white dots) */}
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1.5px, transparent 2px)',
                  backgroundSize: '6px 6px',
                  WebkitMaskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 65%, black 100%)',
                  maskImage: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.05) 65%, black 100%)',
                }}
              />

              <motion.div
                className="flex items-center justify-center gap-2 relative z-10"
                animate={{ scale: [1, 1, 1.05, 1, 1] }}
                transition={{
                  times: [0, 0.14, 0.20, 0.26, 1.0],
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                      <path d="M9 2a7 7 0 017 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {t.form.submitting}
                  </>
                ) : (
                  <>
                    {t.form.submit}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </motion.div>
            </button>
            {/* <p className="text-[12px] text-ink-faint text-center mt-3">No spam. Brochure + follow-up from the FOG team only.</p> */}
          </form>
        </div>
      </div>
    </section>
  );
}
