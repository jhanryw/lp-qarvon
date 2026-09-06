import { appendLeadRow, isSheetsConfigured, type SheetRow } from "./sheets";
import { appendLeadLocally } from "./devFallback";

/**
 * The one seam between the API route and wherever leads actually get
 * stored. The route/form only ever talk to `persistLead` — they don't know
 * (and shouldn't need to know) that Google Sheets is the backend today.
 *
 * To swap in a CRM/Supabase later: add a new backend module (e.g.
 * lib/leadStoreSupabase.ts) exposing the same append-by-lead_id contract,
 * then change the branching inside `persistLead` to try it. Nothing in
 * app/api/leads/route.ts, lib/schema.ts, or the form needs to change.
 */
export type LeadRecord = SheetRow;

export type PersistBackend = "sheets" | "local-dev" | "none";

export interface PersistLeadResult {
  persisted: boolean;
  duplicate: boolean;
  backend: PersistBackend;
}

export async function persistLead(record: LeadRecord): Promise<PersistLeadResult> {
  if (isSheetsConfigured()) {
    try {
      const result = await appendLeadRow(record);
      return { persisted: true, duplicate: result.duplicate, backend: "sheets" };
    } catch (error) {
      console.error("[leadPersistence] Sheets append failed:", error);
    }
  } else {
    console.warn("[leadPersistence] No production backend configured — using local dev fallback only.");
  }

  // Dev-only safety net (see lib/devFallback.ts) — never active in
  // production, so a misconfigured/unreachable primary backend fails loud
  // there instead of silently pretending to have saved the lead.
  try {
    await appendLeadLocally(record);
    return { persisted: process.env.NODE_ENV !== "production", duplicate: false, backend: "local-dev" };
  } catch (error) {
    console.error("[leadPersistence] local dev fallback failed:", error);
    return { persisted: false, duplicate: false, backend: "none" };
  }
}
