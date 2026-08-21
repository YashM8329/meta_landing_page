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
  "Lead Status",
  "Full Name",
  "Contact Number",
  "Email",
  "Country",
  "Venue Status",
  "Venue Address (if any)",
  "Notes",
];

// A=Date, B=Source URL, C=Lead Status, D=Full Name, E=Contact Number, F=Email, G=Country, H=Venue Status, I=Venue Address, J=Notes
const STATUS_COLUMN = 3; // 1-indexed, column C

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
    range: "Sheet1!A1:J1",
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
              startColumnIndex: STATUS_COLUMN - 1, // col C (0-indexed = 2)
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
    range: "Sheet1!F:F", // Email is column F
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

  const now = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dd = String(now.getUTCDate()).padStart(2, "0");
  const mon = months[now.getUTCMonth()];
  const yyyy = now.getUTCFullYear();
  const hh = String(now.getUTCHours()).padStart(2, "0");
  const mm = String(now.getUTCMinutes()).padStart(2, "0");
  const formattedDate = `${dd}-${mon}-${yyyy} ${hh}:${mm} UTC`;

  const venueAddress = lead.venueStatus === "existing"
    ? lead.venueLocation ?? ""
    : lead.venueStatus === "other"
    ? lead.venueStatusOther ?? ""
    : "";

  const row = [
    formattedDate,       // A - Date
    lead.utmParams ?? "", // B - Source URL
    "New",               // C - Lead Status
    lead.fullName,       // D - Full Name
    lead.phone,          // E - Contact Number
    lead.email,          // F - Email
    lead.country,        // G - Country
    lead.venueStatus,    // H - Venue Status
    venueAddress,        // I - Venue Address (if any)
    "",                  // J - Notes
  ];

  // Get last row with data to append directly after it
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:J",
  });
  const lastRow = existing.data.values?.length ?? 1;
  const nextRow = lastRow + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sheet1!A${nextRow}:J${nextRow}`,
    valueInputOption: "RAW",
    requestBody: { values: [row] },
  });

  await setRowDataValidation(sheets, spreadsheetId, nextRow);

  return { duplicate: false };
}
