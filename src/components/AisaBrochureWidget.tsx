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
 *   it has a previous question, by keeping one pushed history entry per
 *   outstanding step instead of letting back leave /asia entirely.
 */
const MIN_HEIGHT = 420;

export default function AisaBrochureWidget() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(MIN_HEIGHT);
  const canGoBackRef = useRef(false);
  // Number of history entries we've pushed so far to back the widget's
  // current step depth. Kept in lockstep with the depth the iframe reports
  // (one pushed entry per step beyond the first) so a back press always has
  // exactly one of our own entries to consume per step, however deep the
  // flow goes — no re-arm timing to get wrong, no dependence on scroll
  // position, and no real navigation (with its page reload) while any
  // progress remains.
  const pushedCountRef = useRef(0);
  const goingBackRef = useRef(false);

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
        // Target depth beyond the first question (depth 1 = nothing to push
        // for yet). This is reported by the iframe directly instead of being
        // inferred, so it stays correct no matter how many questions deep
        // the flow has gone.
        const depth = typeof e.data.depth === "number" ? e.data.depth : canGoBackRef.current ? 2 : 1;
        const targetPushed = Math.max(0, depth - 1);
        // A back press already popped one browser entry itself; don't push
        // a replacement for that pop here, onPopState does it once instead
        // (avoids double-counting depth vs. the handler the browser already
        // ran for us).
        if (!goingBackRef.current) {
          while (pushedCountRef.current < targetPushed) {
            history.pushState({ hgAsiaWidget: true }, "");
            pushedCountRef.current += 1;
          }
        }
        pushedCountRef.current = targetPushed;
        goingBackRef.current = false;
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  // While the widget still has a pushed history entry outstanding (i.e. it
  // has a previous question to go back to), route the browser/mobile back
  // button into the flow's own back() instead of leaving /asia. This is
  // gated purely on pushedCountRef, not on scroll/viewport position, since
  // the widget's height (and therefore its on-screen position) changes
  // across steps and an in-view check can miss the widget entirely.
  useEffect(() => {
    function onPopState() {
      if (pushedCountRef.current > 0) {
        pushedCountRef.current -= 1;
        goingBackRef.current = true;
        iframeRef.current?.contentWindow?.postMessage(
          { source: "hg-asia-parent", type: "go-back" },
          window.location.origin
        );
        // The widget replies with a "step" message reporting its new depth;
        // the handler above syncs pushedCountRef to it without pushing a
        // replacement entry for the one the browser just popped for us.
      }
      // Otherwise (no widget steps left to undo) let the browser's default
      // back navigation proceed.
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
