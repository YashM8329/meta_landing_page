import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "Email service is not configured yet. Please configure the RESEND_API_KEY environment variable." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "info@hypergrid.ai";

    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      venueStatus,
      venueStatusOther,
      venueLocation,
      plannedArea,
      country,
    } = body;

    // Basic server-side validation
    if (!fullName || !email || !phone || !venueStatus || !country) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Format the email HTML body
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9ebef; border-radius: 12px;">
        <h2 style="color: #1d6cef; margin-bottom: 20px;">New Brochure Request</h2>
        <p>A user has requested the HyperGrid brochure. Here are their details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef; font-weight: bold; width: 35%;">Full Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef; font-weight: bold;">Work Email:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef; font-weight: bold;">Phone Number:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef; font-weight: bold;">Country:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef;">${country}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef; font-weight: bold;">Venue Status:</td>
            <td style="padding: 10px; border-bottom: 1px solid #e9ebef;">${venueStatus}</td>
          </tr>
          ${
            venueStatus === "existing"
              ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e9ebef; font-weight: bold;">Venue Location:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e9ebef;">${venueLocation}</td>
                 </tr>`
              : ""
          }
          ${
            venueStatus === "other"
              ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e9ebef; font-weight: bold;">Other Details:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e9ebef;">${venueStatusOther}</td>
                 </tr>`
              : ""
          }
          ${
            plannedArea
              ? `<tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e9ebef; font-weight: bold;">Planned Area Size:</td>
                  <td style="padding: 10px; border-bottom: 1px solid #e9ebef;">${plannedArea}</td>
                 </tr>`
              : ""
          }
        </table>
        
        <div style="margin-top: 30px; font-size: 12px; color: #9aa3b2; border-top: 1px solid #e9ebef; padding-top: 15px;">
          This email was generated from the HyperGrid Landing Page Brochure request form.
        </div>
      </div>
    `;

    // Send the email using Resend
    let { data, error } = await resend.emails.send({
      from: "HyperGrid Lead <onboarding@resend.dev>",
      to: receiverEmail,
      subject: `New Lead: Brochure Request from ${fullName}`,
      html: emailHtml,
    });

    // Handle Resend's testing sandbox restriction (redirect to account owner if unverified recipient is rejected)
    if (error && (error.message.includes("testing emails") || error.message.includes("own email address"))) {
      const fallbackEmail = process.env.CONTACT_RECEIVER_EMAIL || "mehtay0309@gmail.com";
      console.warn(`Resend sandbox active: Redirecting lead email from ${receiverEmail} to verified owner ${fallbackEmail}`);
      const fallback = await resend.emails.send({
        from: "HyperGrid Lead <onboarding@resend.dev>",
        to: fallbackEmail,
        subject: `[Sandbox Lead] Brochure Request from ${fullName} (intended: ${receiverEmail})`,
        html: emailHtml,
      });
      data = fallback.data;
      error = fallback.error;
    }

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Server error handling email:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
