import { google } from "googleapis";

export interface LeadRow {
  fullName: string;
  phone: string;
  email: string;
  country: string;
  venueStatus: string;
  venueLocation?: string;
  venueStatusOther?: string;
  utmParams?: string;
}

const SHEET_HEADERS = [
  "Date & Time",       // A
  "Source URL",        // B
  "utm_source",        // C
  "utm_medium",        // D
  "utm_campaign",      // E
  "utm_content",       // F
  "Full Name",         // G
  "Contact Number",    // H
  "Email",             // I
  "Country",           // J
  "Venue Status",      // K
  "Venue Address (if any)", // L
  "Lead Status",       // M
  "Assigned to",       // N
  "Notes",             // O
];

// A=Date & Time, B=Source URL, C=utm_source, D=utm_medium, E=utm_campaign, F=utm_content, G=Full Name, H=Contact Number, I=Email, J=Country, K=Venue Status, L=Venue Address, M=Lead Status, N=Assigned to, O=Notes
const STATUS_COLUMN = 13; // 1-indexed, column M

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Google service account credentials are not configured.");
  }

  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function ensureHeaders(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string): Promise<void> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A1:O1",
  });

  const firstRow = response.data.values?.[0];
  if (!firstRow || firstRow.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS] },
    });
  }
}

async function getSheetId(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string): Promise<number> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  return meta.data.sheets?.[0]?.properties?.sheetId ?? 0;
}

async function setRowDataValidation(
  sheets: ReturnType<typeof google.sheets>,
  spreadsheetId: string,
  rowIndex: number // 1-indexed row number
): Promise<void> {
  const sheetId = await getSheetId(sheets, spreadsheetId);
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          setDataValidation: {
            range: {
              sheetId,
              startRowIndex: rowIndex - 1, // 0-indexed
              endRowIndex: rowIndex,       // 0-indexed exclusive
              startColumnIndex: STATUS_COLUMN - 1, // col I (0-indexed = 8)
              endColumnIndex: STATUS_COLUMN,
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: [
                  { userEnteredValue: "New" },
                  { userEnteredValue: "Contacted" },
                  { userEnteredValue: "Qualified" },
                  { userEnteredValue: "Disqualified" },
                  { userEnteredValue: "Follow Up" },
                  { userEnteredValue: "Processed" },
                  { userEnteredValue: "Duplicate" },
                ],
              },
              showCustomUi: true,
              strict: true,
            },
          },
        },
      ],
    },
  });
}

async function isDuplicate(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string, email: string): Promise<boolean> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!I:I", // Email is column I
  });

  const emails = response.data.values?.flat() ?? [];
  return emails.slice(1).some((e) => e?.toLowerCase() === email.toLowerCase());
}

export async function appendLead(lead: LeadRow): Promise<{ duplicate: boolean }> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID is not configured.");
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await ensureHeaders(sheets, spreadsheetId);

  const duplicate = await isDuplicate(sheets, spreadsheetId, lead.email);
  if (duplicate) {
    return { duplicate: true };
  }

  const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000); // shift to IST (UTC+5:30)
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mon = months[now.getUTCMonth()];
  const yyyy = now.getUTCFullYear();
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const formattedDate = `${dd}-${mon}-${yyyy} ${hh}:${mm} IST`;

  const venueAddress = lead.venueStatus === "existing"
    ? lead.venueLocation ?? ""
    : lead.venueStatus === "other"
    ? lead.venueStatusOther ?? ""
    : "";

  // Parse UTM params string into individual columns (skip if direct)
  const utmMap: Record<string, string> = {};
  if (lead.utmParams && lead.utmParams !== "direct") {
    lead.utmParams.split("&").forEach((part) => {
      const [k, v] = part.split("=");
      if (k && v) utmMap[k] = decodeURIComponent(v);
    });
  }

  const row = [
    formattedDate,                  // A - Date & Time
    lead.utmParams ?? "",           // B - Source URL
    utmMap["utm_source"] ?? "",     // C - utm_source
    utmMap["utm_medium"] ?? "",     // D - utm_medium
    utmMap["utm_campaign"] ?? "",   // E - utm_campaign
    utmMap["utm_content"] ?? "",    // F - utm_content
    lead.fullName,                  // G - Full Name
    lead.phone,                     // H - Contact Number
    lead.email,                     // I - Email
    lead.country,                   // J - Country
    lead.venueStatus,               // K - Venue Status
    venueAddress,                   // L - Venue Address (if any)
    "New",                          // M - Lead Status
    "",                             // N - Assigned to
    "",                             // O - Notes
  ];

  // Get last row with data to append directly after it
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:O",
  });
  const lastRow = existing.data.values?.length ?? 1;
  const nextRow = lastRow + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sheet1!A${nextRow}:O${nextRow}`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });

  await setRowDataValidation(sheets, spreadsheetId, nextRow);

  return { duplicate: false };
}
