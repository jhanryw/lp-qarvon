import type { LeadInput } from "./schema";
import type { Attribution } from "./schema";

/**
 * Cal.com's public booking pages support prefill via querystring (`name`,
 * `email`, `notes`) — documented, standard behavior, not an invented param.
 * CALCOM_BOOKING_URL must be the real event-type URL; falls back to "#" so
 * the build never breaks before that env var exists (see README/.env.example).
 */
export function buildCalcomRedirectUrl(lead: Pick<LeadInput, "nome" | "email">, attribution: Attribution): string {
  const base = process.env.CALCOM_BOOKING_URL ?? "";
  if (!base) return "#calcom-not-configured";

  const url = new URL(base);
  url.searchParams.set("name", lead.nome);
  url.searchParams.set("email", lead.email);

  if (attribution.utm_source) url.searchParams.set("utm_source", attribution.utm_source);
  if (attribution.utm_campaign) url.searchParams.set("utm_campaign", attribution.utm_campaign);

  return url.toString();
}
