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
  "Date & Time",
  "Source URL",
  "Full Name",
  "Contact Number",
  "Email",
  "Country",
  "Venue Status",
  "Venue Address (if any)",
  "Lead Status",
  "Assigned to",
  "Notes",
];

// A=Date & Time, B=Source URL, C=Full Name, D=Contact Number, E=Email, F=Country, G=Venue Status, H=Venue Address, I=Lead Status, J=Assigned to, K=Notes
const STATUS_COLUMN = 9; // 1-indexed, column I

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
    range: "Sheet1!A1:K1",
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
    range: "Sheet1!E:E", // Email is column E
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

  const row = [
    formattedDate,        // A - Date & Time
    lead.utmParams ?? "", // B - Source URL
    lead.fullName,        // C - Full Name
    lead.phone,           // D - Contact Number
    lead.email,           // E - Email
    lead.country,         // F - Country
    lead.venueStatus,     // G - Venue Status
    venueAddress,         // H - Venue Address (if any)
    "New",                // I - Lead Status
    "",                   // J - Assigned to
    "",                   // K - Notes
  ];

  // Get last row with data to append directly after it
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:K",
  });
  const lastRow = existing.data.values?.length ?? 1;
  const nextRow = lastRow + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sheet1!A${nextRow}:K${nextRow}`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });

  await setRowDataValidation(sheets, spreadsheetId, nextRow);

  return { duplicate: false };
}
