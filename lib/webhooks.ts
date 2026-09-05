import { createHmac } from "node:crypto";

const TIMEOUT_MS = 5000;

export interface WebhookDispatchResult {
  url: string;
  ok: boolean;
  status?: number;
  error?: string;
}

function getWebhookUrls(): string[] {
  const raw = process.env.WEBHOOK_URLS ?? "";
  return raw
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
}

function signPayload(payload: string): string | undefined {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return undefined;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Fires the lead-created payload to every configured webhook, best-effort.
 * Never throws: a failing/absent webhook must not lose the lead, which is
 * already persisted in Sheets before this runs (see app/api/leads/route.ts).
 */
export async function dispatchLeadWebhooks(payload: object): Promise<WebhookDispatchResult[]> {
  const urls = getWebhookUrls();
  if (urls.length === 0) return [];

  const body = JSON.stringify(payload);
  const signature = signPayload(body);

  return Promise.all(
    urls.map(async (url): Promise<WebhookDispatchResult> => {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(signature ? { "X-Qarvon-Signature": signature } : {}),
          },
          body,
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        return { url, ok: response.ok, status: response.status };
      } catch (error) {
        return { url, ok: false, error: error instanceof Error ? error.message : "unknown error" };
      }
    }),
  );
}
