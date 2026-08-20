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
  "Date",
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

const STATUS_COLUMN = 3; // 1-indexed, column C (Lead Status)

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

    // Apply dropdown validation to Lead Status column (B)
    const sheetId = await getSheetId(sheets, spreadsheetId);
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            setDataValidation: {
              range: {
                sheetId,
                startRowIndex: 1, // row 2 onward (0-indexed)
                startColumnIndex: STATUS_COLUMN - 1,
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
}

async function getSheetId(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string): Promise<number> {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  return meta.data.sheets?.[0]?.properties?.sheetId ?? 0;
}

async function isDuplicate(sheets: ReturnType<typeof google.sheets>, spreadsheetId: string, email: string): Promise<boolean> {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!F:F", // Email column (col F after UTM Source inserted at B)
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
  const formattedDate = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");

  const venueAddress = lead.venueStatus === "existing"
    ? lead.venueLocation ?? ""
    : lead.venueStatus === "other"
    ? lead.venueStatusOther ?? ""
    : "";

  const row = [
    formattedDate,
    lead.utmParams ?? "",
    "New",
    lead.fullName,
    lead.phone,
    lead.email,
    lead.country,
    lead.venueStatus,
    venueAddress,
    "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:J", // A=Date, B=UTM Source, C=Lead Status, D=Full Name, E=Contact Number, F=Email, G=Country, H=Venue Status, I=Venue Address, J=Notes
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });

  return { duplicate: false };
}
