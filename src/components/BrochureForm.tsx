"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PhoneInput, { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "libphonenumber-js";
import en from "react-phone-number-input/locale/en";

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

const COUNTRIES = Object.values(en).sort();

const COUNTRY_PHONE_SPECS: Record<string, { code: string; length: number | number[] }> = {
  "United States": { code: "+1", length: 10 },
  "Canada": { code: "+1", length: 10 },
  "India": { code: "+91", length: 10 },
  "United Arab Emirates": { code: "+971", length: 9 },
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

const inputBase = "w-full h-[50px] rounded-lg border px-4 text-[15px] text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-150";
const selectArrow = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%235B6472' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;


export default function BrochureForm() {
  const [form, setForm] = useState<FormState>({ fullName: "", email: "", phone: "", venueStatus: "", venueStatusOther: "", venueLocation: "", plannedArea: "", country: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [defaultCountry, setDefaultCountry] = useState<Country | undefined>(undefined);
  const [venueInputValue, setVenueInputValue] = useState("");
  const [venueOptions, setVenueOptions] = useState<{ label: string; value: string; mainText?: string; secondaryText?: string }[]>([]);
  const [isVenueLoading, setIsVenueLoading] = useState(false);
  const [countryInputValue, setCountryInputValue] = useState("");
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [sessionToken, setSessionToken] = useState("");

  useEffect(() => {
    async function detectLocation() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;
        const data = await res.json();
        let detectedCountry = "";
        if (data.country_name) {
          if (data.country_name === "United Arab Emirates") {
            detectedCountry = "UAE";
          } else if (COUNTRIES.includes(data.country_name)) {
            detectedCountry = data.country_name;
          }
        }

        if (data.country) {
          setDefaultCountry(data.country as Country);
        }

        setForm((prev) => ({
          ...prev,
          country: prev.country || detectedCountry,
        }));
      } catch (err) {
        // Geolocation lookup failed or was blocked by an adblocker (fails silently)
      }
    }
    detectLocation();
  }, []);

  useEffect(() => {
    if (!venueInputValue || venueInputValue.length < 2) {
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

    const timer = setTimeout(async () => {
      setIsVenueLoading(true);
      try {
        const url = `/api/places-autocomplete?input=${encodeURIComponent(venueInputValue)}&sessiontoken=${encodeURIComponent(token)}`;
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
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [venueInputValue, sessionToken]);

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

  useEffect(() => {
    if (form.venueStatus === "existing" || form.venueStatus === "other") {
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [form.venueStatus]);

  const set = (field: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field as keyof FieldError]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): FieldError => {
    const e: FieldError = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.phone.trim()) {
      e.phone = "Phone number is required.";
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
          e.phone = `Invalid Phone number`;
        } else if (len < minExpected) {
          e.phone = `Invalid Phone number`;
        } else if (!isValidPhoneNumber(form.phone)) {
          e.phone = "Invalid Phone number";
        }
      } else {
        // Fallback for non-mapped countries using general library validation
        if (!isValidPhoneNumber(form.phone)) {
          e.phone = "Invalid Phone number";
        }
      }
    }
    if (!form.venueStatus) e.venueStatus = "Please select a venue status.";
    if (form.venueStatus === "other" && !form.venueStatusOther.trim()) e.venueStatusOther = "Please specify details or location.";
    if (form.venueStatus === "existing" && !form.venueLocation.trim()) e.venueLocation = "Venue location is required.";
    if (!form.country) e.country = "Please select your country.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fe = validate();
    if (Object.keys(fe).length > 0) {
      setErrors(fe);
      document.getElementById(`field-${Object.keys(fe)[0]}`)?.focus();
      return;
    }
    setSubmitting(true);
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

      setSubmitted(true);
    } catch (err: any) {
      setErrors((p) => ({
        ...p,
        email: err.message || "Something went wrong. Please try again later."
      }));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="brochure-form" className="min-h-0 lg:py-12 flex flex-col justify-center text-center" aria-label="Confirmation">
        <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(29,108,239,0.4)]">
            <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M7 14L12 19L21 9" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-ink mb-2">Brochure on its way!</h2>
          <p className="text-[15px] text-ink-soft leading-relaxed">
            We&apos;ll be in touch at <span className="font-semibold text-ink">{form.email}</span> soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="brochure-form" className="min-h-0 lg:py-12 relative flex flex-col justify-center pt-6 pb-8 overflow-hidden" aria-label="Request brochure form">
      <div className="max-w-[1440px] mx-auto w-full px-6 xl:px-0 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
        {/* Left column: context */}
        <div className="hidden lg:flex flex-col">
          {/* <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-2">Get the full picture</p> */}
          <h2 className="text-[48px] leading-[0.95] font-extrabold tracking-[-0.03em] text-ink mb-6">
            Request the Brochure
          </h2>
          {/* <p className="text-[16px] text-ink-soft leading-relaxed mb-8 max-w-[400px]">
            Get detailed specs, revenue data, and case studies.
          </p> */}
          <div className="flex flex-col gap-9 mt-3">
            {[
              { icon: "📊", text: "Revenue data from 100+ real installations" },
              { icon: "📐", text: "Full technical specs and floor plan requirements" },
              { icon: "🤝", text: "Direct follow-up from the FOG Technologies team" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center text-[18px] flex-shrink-0">{icon}</span>
                <span className="text-[15px] font-medium text-ink">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column (or full width on mobile): form */}
        <div>
          {/* Mobile header */}
          <div className="lg:hidden mb-7">
            {/* <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">Get the full picture</p> */}
            <h2 className="text-[clamp(30px,8.5vw,42px)] leading-[1.0] font-extrabold tracking-[-0.03em] text-ink">Request the Brochure</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate aria-label="Brochure request">
            {/* Name + Email as 2-col on desktop */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-4">
              <div className="mb-4 lg:mb-0">
                <label htmlFor="field-fullName" className="block text-[13px] font-semibold text-ink mb-1.5">Full name <span className="text-accent">*</span></label>
                <input id="field-fullName" type="text" autoComplete="name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                  aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? "err-fullName" : undefined} placeholder="Jane Smith"
                  className={`${inputBase} ${errors.fullName ? "border-red-400 bg-red-50" : "border-line bg-white"}`} />
                {errors.fullName && <p id="err-fullName" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.fullName}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="field-email" className="block text-[13px] font-semibold text-ink mb-1.5">Email <span className="text-accent">*</span></label>
                <input id="field-email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? "err-email" : undefined} placeholder="jane@venue.com"
                  className={`${inputBase} ${errors.email ? "border-red-400 bg-red-50" : "border-line bg-white"}`} />
                {errors.email && <p id="err-email" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.email}</p>}
              </div>
            </div>

            {/* Phone + Country as 2-col on desktop */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-4">
              <div className="mb-4">
                <label htmlFor="field-phone" className="block text-[13px] font-semibold text-ink mb-1.5">Phone number <span className="text-accent">*</span></label>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(val) => set("phone", val || "")}
                  defaultCountry={defaultCountry}
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
                <label htmlFor="field-country" className="block text-[13px] font-semibold text-ink mb-1.5">Country <span className="text-accent">*</span></label>
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
                    }}
                    placeholder="Search or enter country…"
                    className={`${inputBase} ${errors.country ? "border-red-400 bg-red-50" : "border-line bg-white"}`}
                  />
                  {countryOptions.length > 0 && (
                    <ul className="absolute left-0 right-0 mt-1 bg-white border border-line rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                      {countryOptions.map((c, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            set("country", c);
                            setCountryOptions([]);
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
              <label htmlFor="field-venueStatus" className="block text-[13px] font-semibold text-ink mb-1.5">
                Do you operate a venue? <span className="text-accent">*</span>
              </label>
              <select
                id="field-venueStatus"
                value={form.venueStatus}
                onChange={(e) => set("venueStatus", e.target.value as VenueStatus)}
                aria-invalid={!!errors.venueStatus}
                aria-describedby={errors.venueStatus ? "err-venueStatus" : undefined}
                className={`${inputBase} appearance-none bg-no-repeat bg-[right_14px_center] ${errors.venueStatus ? "border-red-400 bg-red-50" : "border-line bg-white"}`}
                style={{ backgroundImage: selectArrow }}
              >
                <option value="">Select an option</option>
                <option value="existing">Yes, I have an existing venue</option>
                <option value="new">No, I&apos;m planning a new venue</option>
                <option value="other">Others</option>
              </select>
              {errors.venueStatus && <p id="err-venueStatus" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.venueStatus}</p>}
              {form.venueStatus === "other" && (
              <div id="venue-other-container" className="mb-4 bg-accent/5 border border-accent/15 rounded-[12px] p-4 mt-4">
                <label htmlFor="field-venueStatusOther" className="block text-[13px] font-semibold text-ink mb-1.5">Please specify/Search venue location <span className="text-accent">*</span></label>
                <div className="relative">
                  <input
                    id="field-venueStatusOther"
                    type="text"
                    value={form.venueStatusOther}
                    onChange={(e) => {
                      set("venueStatusOther", e.target.value);
                      setVenueInputValue(e.target.value);
                    }}
                    onBlur={() => {
                      setTimeout(() => setVenueOptions([]), 200);
                    }}
                    placeholder="Type/Search details or FEC venue location…"
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
                    <ul className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-line rounded-lg shadow-lg max-h-56 overflow-y-auto z-50 divide-y divide-line">
                      {venueOptions.map((opt, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            set("venueStatusOther", opt.value);
                            setVenueOptions([]);
                            setSessionToken("");
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
                        <span className="text-[10px] text-ink-faint font-medium uppercase tracking-wider">Powered by</span>
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
            )}

            {form.venueStatus === "existing" && (
              <div id="venue-location-container" className="mb-4 bg-accent/5 border border-accent/15 rounded-[12px] p-4 mt-3">
                <label htmlFor="field-venueLocation" className="block text-[13px] font-semibold text-ink mb-1.5">Venue location <span className="text-accent">*</span></label>
                <div className="relative">
                  <input
                    id="field-venueLocation"
                    type="text"
                    value={form.venueLocation}
                    onChange={(e) => {
                      set("venueLocation", e.target.value);
                      setVenueInputValue(e.target.value);
                    }}
                    onBlur={() => {
                      setTimeout(() => setVenueOptions([]), 200);
                    }}
                    placeholder="Search or enter FEC venue name or address…"
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
                    <ul className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-line rounded-lg shadow-lg max-h-56 overflow-y-auto z-50 divide-y divide-line">
                      {venueOptions.map((opt, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            set("venueLocation", opt.value);
                            setVenueOptions([]);
                            setSessionToken("");
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
                        <span className="text-[10px] text-ink-faint font-medium uppercase tracking-wider">Powered by</span>
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
            )}
            </div>

            <button type="submit" disabled={submitting} aria-busy={submitting}
              className="relative w-full h-[54px] text-white font-semibold text-[16px] rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent mt-2 overflow-hidden shadow-lg select-none bg-gradient-to-r from-[#1D6CEF] via-[#2f74e6] to-[#1D6CEF] hover:brightness-105 active:scale-[0.98] transition-all duration-150">
              
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

              {submitting ? (
                <div className="flex items-center gap-2 relative z-10">
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                    <path d="M9 2a7 7 0 017 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Sending…
                </div>
              ) : (
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
                  Send me the brochure
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              )}
            </button>
            {/* <p className="text-[12px] text-ink-faint text-center mt-3">No spam. Brochure + follow-up from the FOG team only.</p> */}
          </form>
        </div>
      </div>
    </section>
  );
}
