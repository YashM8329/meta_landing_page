"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "@/lib/useTranslation";

/* Same sales placeholder used by the /asia embedded widget
   (public/asia/widget.html CONFIG). Keep these two in sync. */
const DISTRIBUTOR = {
  name: "Vishal Mehta",
  email: "sales@thefutureofgaming.tech",
  phone: "+91 7984489771",
};

const BROCHURE_URL = "/brochure/hypergrid-brochure.pdf";

function UserPlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="8" r="4" />
      <path d="M2.5 21a7.5 7.5 0 0 1 15 0M19 8v6M16 11h6" />
    </svg>
  );
}
const rowClass = "flex items-center gap-4 w-full bg-white border border-line rounded-2xl px-4 py-3.5 text-left hover:border-accent/40 hover:-translate-y-px transition-all duration-150";
function RowBody({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <>
      <span className="flex-none w-11 h-11 rounded-xl bg-accent/10 text-accent flex items-center justify-center">{icon}</span>
      <span className="flex-1 min-w-0 flex flex-col gap-0.5">
        <b className="text-[16px] font-semibold text-ink">{title}</b>
        <span className="text-[13.5px] text-ink-faint truncate">{sub}</span>
      </span>
    </>
  );
}
const VCARD_URL = "https://vcard.link/card/IG2c.vcf";

function SaveContactRow({ icon, title, sub }: {
  icon: React.ReactNode; title: string; sub: string;
}) {
  const handleSave = () => {
    const a = document.createElement("a");
    a.href = VCARD_URL;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  return (
    <button type="button" onClick={handleSave} className={rowClass}>
      <RowBody icon={icon} title={title} sub={sub} />
    </button>
  );
}

export default function ThankYouQContent() {
  const { t } = useTranslation();

  useEffect(() => {
    const a = document.createElement("a");
    a.href = BROCHURE_URL;
    a.download = "HyperGrid Brochure - FOG.pdf";
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, []);

  return (
    <motion.main
      className="min-h-dvh bg-white flex flex-col items-center justify-center px-6 py-16 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-8 shadow-[0_12px_32px_rgba(29,108,239,0.35)]">
        <svg width="36" height="36" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M7 14L12 19L21 9" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-[clamp(26px,4.5vw,40px)] font-extrabold tracking-[-0.03em] text-ink leading-[1.25] max-w-[680px] mb-3">
        Thank you, your brochure is being downloaded
      </h1>
      <p className="text-[15px] text-ink-faint mb-5">We will reach you within 24 hours.</p>

      <div className="flex flex-col gap-3 w-full max-w-[420px] mt-2 mb-8">
        <SaveContactRow
          icon={<UserPlusIcon />}
          title="Save contact"
          sub={`${DISTRIBUTOR.name} · ${DISTRIBUTOR.phone}`}
        />
      </div>

      <Link
        href="/asia"
        className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-accent text-white text-[15px] font-semibold tracking-[-0.01em] hover:bg-accent-deep transition-colors duration-150"
      >
        {t.form.backHome}
      </Link>
    </motion.main>
  );
}
