import Script from "next/script";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You — HyperGrid",
  description: "Thanks for your interest in HyperGrid. Your brochure is on its way.",
};

export default function ThankYouPage() {
  return (
    <>
      {/* Meta Pixel — Thank You Page (Lead conversion) */}
      <Script
        id="meta-pixel-thankyou"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1079278694629302');
            fbq('track', 'Lead');
          `,
        }}
      />
      <noscript>
        <img height="1" width="1" style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1079278694629302&ev=Lead&noscript=1"
        />
      </noscript>

      <main className="min-h-dvh bg-white flex flex-col items-center justify-center px-6 text-center">
        {/* Checkmark icon */}
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-8 shadow-[0_12px_32px_rgba(29,108,239,0.35)]">
          <svg width="36" height="36" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M7 14L12 19L21 9" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-[clamp(32px,7vw,56px)] font-extrabold tracking-[-0.03em] text-ink leading-[1.05] mb-4">
          Brochure on its way!
        </h1>

        {/* Subtext */}
        <p className="text-[17px] text-ink-soft leading-relaxed max-w-[480px] mb-10">
          Thanks for your interest in HyperGrid. Our team will be in touch with you shortly with everything you need to know.
        </p>

        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-[52px] px-8 rounded-full bg-accent text-white text-[15px] font-semibold tracking-[-0.01em] hover:bg-accent-deep transition-colors duration-150"
        >
          Back to Home
        </Link>
      </main>
    </>
  );
}
