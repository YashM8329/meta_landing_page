import { NextResponse } from "next/server";
import { appendBrochureLead } from "@/lib/googleSheets";

/** Same as /api/asia-brochure-lead: appends to the same Sheet2 tab. */
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

    const { duplicate } = await appendBrochureLead({
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
      });

    if (duplicate) {
      console.warn(`[Sheets] Duplicate /northamerica/brochure lead skipped: ${email}`);
    }

    return NextResponse.json({ success: true, duplicate });
  } catch (error: any) {
    console.error("[api/northamerica-brochure-lead] error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
