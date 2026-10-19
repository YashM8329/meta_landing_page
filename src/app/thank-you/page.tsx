import Script from "next/script";
import type { Metadata } from "next";
import ThankYouContent from "./ThankYouContent";

export const metadata: Metadata = {
  title: "Thank You — HyperGrid",
  description: "Thanks for your interest in HyperGrid. Your brochure is on its way.",
};

export default function ThankYouPage() {
  return (
    <>
      {/* Meta Pixel — standard PageView only. The real "Lead" conversion is
          sent server-side from /api/send-email via /api/meta-capi, never
          fired client-side here. */}
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
            fbq('track', 'PageView');
          `,
        }}
      />

      <ThankYouContent />
    </>
  );
}
