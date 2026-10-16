"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Embeds the HyperGrid brochure flow (same questions, autocomplete, validation,
 * thank-you logic as /brochure/asia) inside the homepage's brochure-form slot.
 * Loaded as an iframe so its own styling, fonts and script never collide with
 * the homepage's Tailwind design system.
 *
 * On a positive lead the widget posts a message up to this wrapper, which then
 * navigates the whole page to /thank-you — that page fires the real Meta Pixel
 * "Lead" conversion itself. Negative leads stay inside the iframe and never
 * trigger that conversion event.
 */
const MIN_HEIGHT = 420;

export default function AisaBrochureWidget() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(MIN_HEIGHT);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (!e.data || e.data.source !== "hg-aisa-widget") return;
      if (e.data.type === "positive-lead") {
        router.push("/thank-you");
      } else if (e.data.type === "height" && typeof e.data.height === "number") {
        setHeight(Math.max(MIN_HEIGHT, Math.ceil(e.data.height)));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  return (
    <iframe
      ref={iframeRef}
      src="/aisa/widget.html"
      title="Get the HyperGrid brochure"
      className="w-full rounded-2xl border border-line transition-[height] duration-200"
      style={{ height, colorScheme: "normal" }}
      loading="lazy"
    />
  );
}
