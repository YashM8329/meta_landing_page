import { NextResponse } from "next/server";
import { sendLeadEvent, clientIpFromHeaders } from "@/lib/metaCapi";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, eventSourceUrl, fbc, fbp, eventId } = body;

    if (!eventSourceUrl) {
      return NextResponse.json({ error: "eventSourceUrl is required." }, { status: 400 });
    }

    const result = await sendLeadEvent({
      email,
      phone,
      eventSourceUrl,
      fbc,
      fbp,
      eventId,
      clientIp: clientIpFromHeaders(request.headers),
      userAgent: request.headers.get("user-agent") || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[api/meta-capi] error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
