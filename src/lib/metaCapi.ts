import { createHash, randomUUID } from "crypto";

const PIXEL_ID = "1079278694629302";
const GRAPH_VERSION = "v21.0";

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Digits only, no leading +, per Meta's CAPI phone format before hashing. */
function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export interface LeadCapiInput {
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl: string;
  fbc?: string;
  fbp?: string;
  eventId?: string;
}

/**
 * Sends a server-side "Lead" event to Meta's Conversions API. No-ops with a
 * console warning (never throws) when META_CAPI_TOKEN isn't configured yet,
 * so callers can wire this in ahead of having the token.
 */
export async function sendLeadEvent(input: LeadCapiInput): Promise<{ sent: boolean; eventId: string }> {
  const eventId = input.eventId || randomUUID();
  const token = process.env.META_CAPI_TOKEN;

  if (!token) {
    console.warn("[meta-capi] META_CAPI_TOKEN not set — skipping Lead event (eventId would have been " + eventId + ")");
    return { sent: false, eventId };
  }

  const userData: Record<string, unknown> = {};
  if (input.email) userData.em = [sha256(input.email)];
  if (input.phone) userData.ph = [sha256(normalizePhone(input.phone))];
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.fbp) userData.fbp = input.fbp;

  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: input.eventSourceUrl,
        action_source: "website",
        user_data: userData,
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[meta-capi] Graph API error ${res.status}: ${text}`);
      return { sent: false, eventId };
    }
    return { sent: true, eventId };
  } catch (err) {
    console.error("[meta-capi] Failed to send Lead event:", err);
    return { sent: false, eventId };
  }
}

/** Best-effort real client IP from common proxy headers (Vercel sets x-forwarded-for). */
export function clientIpFromHeaders(headers: Headers): string | undefined {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return headers.get("x-real-ip") || undefined;
}
