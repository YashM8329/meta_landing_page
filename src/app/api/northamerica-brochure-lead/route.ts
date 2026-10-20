import { NextResponse } from "next/server";
import { appendBrochureLead } from "@/lib/googleSheets";

/** Same shape as /api/asia-brochure-lead, writing to its own "Sheet3" tab
 * instead of Sheet2 — Sheet1 and Sheet2 are untouched by this route. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      segment,
      venueAddress,
      city,
      country,
      spaceAnswer,
      budgetAnswer,
      fullName,
      email,
      phone,
      contactMode,
      callDay,
      callTime,
      leadQuality,
      sourceUrl,
      utmParams,
    } = body;

    if (!email || !fullName) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const { duplicate } = await appendBrochureLead(
      {
        segment: segment ?? "",
        venueAddress: venueAddress ?? "",
        city: city ?? "",
        country: country ?? "",
        spaceAnswer: spaceAnswer ?? "",
        budgetAnswer: budgetAnswer ?? "",
        fullName,
        email,
        phone: phone ?? "",
        contactMode: contactMode ?? "",
        callDay,
        callTime,
        leadQuality: leadQuality === "Positive" ? "Positive" : "Negative",
        sourceUrl,
        utmParams,
      },
      "Sheet3"
    );

    if (duplicate) {
      console.warn(`[Sheets] Duplicate /northamerica/brochure lead skipped: ${email}`);
    }

    return NextResponse.json({ success: true, duplicate });
  } catch (error: any) {
    console.error("[api/northamerica-brochure-lead] error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
