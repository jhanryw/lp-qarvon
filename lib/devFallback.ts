import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "leads.local.jsonl");

/**
 * Dev-only safety net for when Google Sheets isn't configured yet (no
 * credentials in .env.local). Never used in production — Vercel/most
 * serverless filesystems are read-only or ephemeral, and this file is
 * gitignored. Once real Sheets credentials exist this path is never hit.
 */
export async function appendLeadLocally(row: Record<string, unknown>): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  await mkdir(DIR, { recursive: true });
  await appendFile(FILE, `${JSON.stringify(row)}\n`, "utf8");
}
