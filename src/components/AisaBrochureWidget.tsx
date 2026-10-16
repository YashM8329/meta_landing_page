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
 * navigates to /asia/thankyou-q — that page fires the real Meta Pixel "Lead"
 * conversion itself. Negative leads stay inside the iframe and never trigger
 * that conversion event. Both end states show the same Download Brochure +
 * contact-card content; the only difference is the pixel. /asia/thankyou-q is
 * prefetched as soon as this widget mounts so that redirect is instant rather
 * than fetching the route on demand right when the visitor finishes the flow.
 *
 * This component also bridges two things the iframe can't do on its own:
 * - Scrolling the real page so a focused field inside the iframe clears the
 *   on-screen keyboard (the iframe's own viewport isn't the real one).
 * - Routing the browser/mobile back button into the flow's own back() while
 *   the widget is on screen and has a previous question, via one shared
 *   history entry instead of letting back leave /asia entirely.
 */
const MIN_HEIGHT = 420;

export default function AisaBrochureWidget() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(MIN_HEIGHT);
  const canGoBackRef = useRef(false);
  const historyArmedRef = useRef(false);

  useEffect(() => {
    router.prefetch("/asia/thankyou-q");
  }, [router]);

  useEffect(() => {
    function scrollFieldIntoView(fieldTop: number, fieldBottom: number) {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const rect = iframe.getBoundingClientRect();
      const vv = window.visualViewport;
      const viewportHeight = vv ? vv.height : window.innerHeight;
      const viewportTop = vv ? vv.offsetTop : 0;
      const absoluteFieldTop = rect.top + fieldTop;
      const absoluteFieldBottom = rect.top + fieldBottom;
      const safeBottom = viewportTop + viewportHeight - 24;
      const safeTop = viewportTop + 24;
      if (absoluteFieldBottom > safeBottom || absoluteFieldTop < safeTop) {
        const target = window.scrollY + absoluteFieldTop - viewportHeight * 0.3;
        window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
      }
    }

    function onMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin) return;
      if (!e.data || e.data.source !== "hg-asia-widget") return;
      if (e.data.type === "positive-lead") {
        const mode = typeof e.data.mode === "string" ? e.data.mode : "";
        router.push(`/asia/thankyou-q${mode ? `?mode=${encodeURIComponent(mode)}` : ""}`);
      } else if (e.data.type === "height" && typeof e.data.height === "number") {
        setHeight(Math.max(MIN_HEIGHT, Math.ceil(e.data.height)));
      } else if (e.data.type === "focus-field") {
        scrollFieldIntoView(e.data.fieldTop, e.data.fieldBottom);
      } else if (e.data.type === "step") {
        canGoBackRef.current = !!e.data.canGoBack;
        if (!historyArmedRef.current) {
          history.pushState({ hgAsiaWidget: true }, "");
          historyArmedRef.current = true;
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  // While the widget is in view and has a previous question, route the
  // browser/mobile back button into the flow instead of leaving /asia.
  useEffect(() => {
    function isWidgetInView() {
      const el = containerRef.current;
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    }

    function onPopState() {
      if (historyArmedRef.current && canGoBackRef.current && isWidgetInView()) {
        history.pushState({ hgAsiaWidget: true }, "");
        iframeRef.current?.contentWindow?.postMessage(
          { source: "hg-asia-parent", type: "go-back" },
          window.location.origin
        );
      }
      // Otherwise let the browser's default back navigation proceed.
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[640px] mx-auto">
      <iframe
        ref={iframeRef}
        src="/asia/widget.html"
        title="Get the HyperGrid brochure"
        className="w-full rounded-2xl border border-line transition-[height] duration-200"
        style={{ height, colorScheme: "normal" }}
        loading="lazy"
      />
    </div>
  );
}
