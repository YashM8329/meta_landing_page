"use client";

import { useState } from "react";

type VenueStatus = "" | "existing" | "new";
type AreaSize = "" | "small" | "large";

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  venueStatus: VenueStatus;
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
}

const COUNTRIES = ["United States", "Canada", "United Kingdom", "Australia", "India", "UAE", "Singapore", "New Zealand", "South Africa", "Other"];
const inputBase = "w-full h-[50px] rounded-lg border px-4 text-[15px] text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all duration-150";
const selectArrow = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%235B6472' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

export default function BrochureForm() {
  const [form, setForm] = useState<FormState>({ fullName: "", email: "", phone: "", venueStatus: "", venueLocation: "", plannedArea: "", country: "" });
  const [errors, setErrors] = useState<FieldError>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (field: keyof FormState, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field as keyof FieldError]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = (): FieldError => {
    const e: FieldError = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.venueStatus) e.venueStatus = "Please select a venue status.";
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
    /* TODO: wire submission endpoint */
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="brochure-form" className="snap-start min-h-dvh flex flex-col justify-center px-6 text-center" aria-label="Confirmation">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(29,108,239,0.4)]">
          <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M7 14L12 19L21 9" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-[28px] font-extrabold tracking-[-0.02em] text-ink mb-2">Brochure on its way!</h2>
        <p className="text-[15px] text-ink-soft leading-relaxed">
          We&apos;ll be in touch at <span className="font-semibold text-ink">{form.email}</span><br />within 1 business day.
        </p>
      </section>
    );
  }

  return (
    <section id="brochure-form" className="snap-start min-h-dvh relative flex flex-col justify-center px-6 lg:px-16 xl:px-24 pt-24 pb-32 overflow-hidden [@media(max-height:900px)]:justify-start" aria-label="Request brochure form">
      <div className="lg:max-w-7xl lg:mx-auto w-full lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left column: context */}
        <div className="hidden lg:flex flex-col">
          <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-2">Get the full picture</p>
          <h2 className="text-[48px] leading-[0.95] font-extrabold tracking-[-0.03em] text-ink mb-6">
            Request the<br />Brochure
          </h2>
          <p className="text-[16px] text-ink-soft leading-relaxed mb-8 max-w-[400px]">
            Get detailed specs, revenue data, and case studies. Our team will follow up within one business day.
          </p>
          <div className="flex flex-col gap-4">
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
            <p className="text-[13px] font-semibold tracking-[0.2em] text-ink-faint uppercase mb-1">Get the full picture</p>
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
                <label htmlFor="field-email" className="block text-[13px] font-semibold text-ink mb-1.5">Work email <span className="text-accent">*</span></label>
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
                <input id="field-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "err-phone" : undefined} placeholder="+1 555 000 0000"
                  className={`${inputBase} ${errors.phone ? "border-red-400 bg-red-50" : "border-line bg-white"}`} />
                {errors.phone && <p id="err-phone" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
              </div>

              <div className="mb-4">
                <label htmlFor="field-country" className="block text-[13px] font-semibold text-ink mb-1.5">Country <span className="text-accent">*</span></label>
                <select id="field-country" value={form.country} onChange={(e) => set("country", e.target.value)}
                  aria-invalid={!!errors.country} aria-describedby={errors.country ? "err-country" : undefined}
                  className={`${inputBase} appearance-none bg-no-repeat bg-[right_14px_center] ${errors.country ? "border-red-400 bg-red-50" : "border-line bg-white"}`}
                  style={{ backgroundImage: selectArrow }}>
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p id="err-country" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.country}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="field-venueStatus" className="block text-[13px] font-semibold text-ink mb-1.5">Do you operate a venue? <span className="text-accent">*</span></label>
              <select id="field-venueStatus" value={form.venueStatus} onChange={(e) => set("venueStatus", e.target.value as VenueStatus)}
                aria-invalid={!!errors.venueStatus} aria-describedby={errors.venueStatus ? "err-venueStatus" : undefined}
                className={`${inputBase} appearance-none bg-no-repeat bg-[right_14px_center] ${errors.venueStatus ? "border-red-400 bg-red-50" : "border-line bg-white"}`}
                style={{ backgroundImage: selectArrow }}>
                <option value="">Select an option</option>
                <option value="existing">Yes — I have an existing venue</option>
                <option value="new">No — I&apos;m planning a new venue</option>
              </select>
              {errors.venueStatus && <p id="err-venueStatus" role="alert" className="text-[12px] text-red-500 mt-1 font-medium">{errors.venueStatus}</p>}
            </div>

            {form.venueStatus === "existing" && (
              <div className="mb-4 bg-accent/5 border border-accent/15 rounded-[12px] p-4">
                <label htmlFor="field-venueLocation" className="block text-[13px] font-semibold text-ink mb-1.5">Venue location</label>
                <input id="field-venueLocation" type="text" autoComplete="address-line1" value={form.venueLocation} onChange={(e) => set("venueLocation", e.target.value)}
                  placeholder="Search your venue address…" aria-describedby="venue-hint"
                  className="w-full h-[50px] rounded-lg border border-accent/20 bg-white px-4 text-[15px] text-ink placeholder-ink-faint focus:outline-none focus:ring-2 focus:ring-accent/40" />
                <p id="venue-hint" className="text-[12px] text-accent/70 mt-1.5 font-medium">Helps us check sizing &amp; logistics for your location.</p>
              </div>
            )}

            {form.venueStatus === "new" && (
              <div className="mb-4 bg-accent/5 border border-accent/15 rounded-[12px] p-4">
                <p className="text-[13px] font-semibold text-ink mb-3">Approximate area planned for HyperGrid</p>
                <div className="flex flex-col gap-2">
                  {[{ value: "small" as AreaSize, label: "Under 10,000 sqft / 100 sqm" }, { value: "large" as AreaSize, label: "10,000 sqft / 100 sqm or more" }].map((opt) => (
                    <label key={opt.value} className={`flex items-center gap-3 h-[50px] px-4 rounded-lg border cursor-pointer transition-all duration-150 ${form.plannedArea === opt.value ? "border-accent bg-accent/10" : "border-accent/20 bg-white"}`}>
                      <input type="radio" name="plannedArea" value={opt.value} checked={form.plannedArea === opt.value} onChange={() => set("plannedArea", opt.value)} className="accent-accent w-4 h-4 flex-shrink-0" />
                      <span className="text-[14px] text-ink font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={submitting} aria-busy={submitting}
              className="btn-glass-accent w-full h-[54px] text-white font-semibold text-[16px] rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent mt-2">
              {submitting ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
                    <path d="M9 2a7 7 0 017 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Sending…
                </>
              ) : (
                <>Send me the brochure
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-[12px] text-ink-faint text-center mt-3">No spam. Brochure + follow-up from the FOG team only.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
