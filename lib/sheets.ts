import { sheets, auth } from "@googleapis/sheets";

/**
 * Uses the scoped @googleapis/sheets package instead of the `googleapis`
 * monolith. `googleapis` unpacks to ~213MB (every Google API client, most of
 * which we never touch) versus ~1MB here — that size is exactly what turned
 * "Collecting page data" into a multi-minute stall during the EasyPanel
 * Docker build. Same generated client/auth classes, just scoped to Sheets.
 */

/**
 * Column order in the "Leads" sheet tab. Keep in sync with lib/schema.ts
 * (simplified form — nome/whatsapp/instagram_site/faturamento/
 * ja_investe_trafego only). lead_id lives in column B and is the
 * idempotency key: a resubmitted lead_id (client retry) is skipped rather
 * than appended twice.
 */
export const SHEET_COLUMNS = [
  "submitted_at",
  "lead_id",
  "nome",
  "whatsapp",
  "instagram_site",
  "faturamento",
  "ja_investe_trafego",
  "lead_score",
  "lead_tier",
  "is_icp",
  "page_url",
  "referrer",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "fbp",
  "fbc",
  "user_agent",
  "cal_redirect_url",
  "webhook_status",
] as const;

export type SheetRow = Record<(typeof SHEET_COLUMNS)[number], string | number | boolean>;

export function isSheetsConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
  );
}

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  const jwt = new auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return sheets({ version: "v4", auth: jwt });
}

function sheetTabName(): string {
  return process.env.GOOGLE_SHEETS_TAB_NAME ?? "Leads";
}

/** 1-indexed column number -> spreadsheet letters (27 -> "AA"). */
function columnLetter(index: number): string {
  let n = index;
  let letters = "";
  while (n > 0) {
    const remainder = (n - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    n = Math.floor((n - 1) / 26);
  }
  return letters;
}

async function findExistingLeadIdRow(leadId: string): Promise<boolean> {
  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const tab = sheetTabName();

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${tab}!B2:B`,
  });

  const existingIds = (data.values ?? []).flat();
  return existingIds.includes(leadId);
}

export interface AppendLeadResult {
  appended: boolean;
  duplicate: boolean;
}

/**
 * Appends a lead row, skipping it if lead_id already exists (idempotent
 * retries). Throws if Sheets isn't configured or the API call fails — the
 * caller decides how to degrade (see app/api/leads/route.ts).
 */
export async function appendLeadRow(row: SheetRow): Promise<AppendLeadResult> {
  if (!isSheetsConfigured()) {
    throw new Error("Google Sheets is not configured (missing env vars)");
  }

  const leadId = String(row.lead_id);
  const alreadyExists = await findExistingLeadIdRow(leadId);
  if (alreadyExists) {
    return { appended: false, duplicate: true };
  }

  const sheets = getSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
  const tab = sheetTabName();
  const values = [SHEET_COLUMNS.map((key) => row[key])];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A:${columnLetter(SHEET_COLUMNS.length)}`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values },
  });

  return { appended: true, duplicate: false };
}
