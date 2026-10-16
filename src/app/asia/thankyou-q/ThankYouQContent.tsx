"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/useTranslation";

/* Same sales/manufacturer placeholders used by the /asia embedded widget
   (public/asia/widget.html CONFIG). Keep these two in sync. */
const DISTRIBUTOR = {
  name: "Tommy Nasser",
  email: "sales@bandainamco.co.uk",
  phone: "+44 7917 877297",
};
const MANUFACTURER = {
  name: "Vishal Mehta",
  whatsapp: "+91 00000 00000",
  whatsappMessage: "Hi Vishal, I just requested the HyperGrid brochure and would like to know more.",
};

const BROCHURE_URL = "/brochure/hypergrid-brochure.pdf";

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5" />
      <path d="M4 18v1.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V18" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function UserPlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="8" r="4" />
      <path d="M2.5 21a7.5 7.5 0 0 1 15 0M19 8v6M16 11h6" />
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
function ActionRow({ icon, title, sub, href, download, filename }: {
  icon: React.ReactNode; title: string; sub: string;
  href: string; download?: boolean; filename?: string;
}) {
  return (
    <a
      href={href}
      {...(download ? { download: filename ?? true } : { target: "_blank", rel: "noopener" })}
      className={rowClass}
    >
      <RowBody icon={icon} title={title} sub={sub} />
    </a>
  );
}

function vcard(person: { name: string; org?: string; phone: string }) {
  const tel = person.phone.replace(/[^\d+]/g, "");
  return [
    "BEGIN:VCARD", "VERSION:3.0",
    `N:;${person.name};;;`, `FN:${person.name}`,
    `ORG:${person.org ?? ""}`, `TEL;TYPE=WORK,VOICE:${tel}`,
    "NOTE:HyperGrid brochure follow-up", "END:VCARD",
  ].join("\r\n");
}

function SaveContactRow({ icon, title, sub, person }: {
  icon: React.ReactNode; title: string; sub: string;
  person: { name: string; org?: string; phone: string };
}) {
  const handleSave = () => {
    const blob = new Blob([vcard(person)], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${person.name.replace(/\s+/g, "-")}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };
  return (
    <button type="button" onClick={handleSave} className={rowClass}>
      <RowBody icon={icon} title={title} sub={sub} />
    </button>
  );
}

export default function ThankYouQContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const waNum = MANUFACTURER.whatsapp.replace(/[^\d]/g, "");
  const waHref = `https://wa.me/${waNum}?text=${encodeURIComponent(MANUFACTURER.whatsappMessage)}`;

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

      <h1 className="text-[clamp(26px,4.5vw,40px)] font-extrabold tracking-[-0.03em] text-ink leading-[1.25] max-w-[680px] mb-4">
        {t.form.followUp}
      </h1>

      <div className="flex flex-col gap-3 w-full max-w-[420px] mt-2 mb-8">
        <ActionRow
          icon={<DownloadIcon />}
          title="Download Brochure"
          sub="View the complete product overview"
          href={BROCHURE_URL}
          download
          filename="HyperGrid Brochure - FOG.pdf"
        />
        {mode === "Call" && (
          <SaveContactRow
            icon={<UserPlusIcon />}
            title="Save sales person contact"
            sub={`${DISTRIBUTOR.name} · ${DISTRIBUTOR.phone}`}
            person={{ name: DISTRIBUTOR.name, phone: DISTRIBUTOR.phone }}
          />
        )}
        {mode === "Email" && (
          <ActionRow
            icon={<MailIcon />}
            title="Sales email"
            sub={DISTRIBUTOR.email}
            href={`mailto:${DISTRIBUTOR.email}`}
          />
        )}
        {mode === "WhatsApp" && (
          <ActionRow
            icon={<ChatIcon />}
            title="WhatsApp Manufacturer"
            sub={`Start a prewritten chat with ${MANUFACTURER.name.split(" ")[0]}`}
            href={waHref}
          />
        )}
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-accent text-white text-[15px] font-semibold tracking-[-0.01em] hover:bg-accent-deep transition-colors duration-150"
      >
        {t.form.backHome}
      </Link>
    </motion.main>
  );
}
