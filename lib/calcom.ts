import type { LeadInput } from "./schema";
import type { Attribution } from "./schema";

/**
 * Not used as the automatic post-submit redirect anymore (scheduling is now
 * manual, after a human reaches out — see app/obrigado/page.tsx) but kept
 * intact and still computed/logged per lead, so the link is ready whenever
 * someone wants to send it. Cal.com's public booking pages support prefill
 * via querystring (`name`, documented standard behavior, not an invented
 * param). CALCOM_BOOKING_URL must be the real event-type URL; falls back to
 * "#" so the build never breaks before that env var exists.
 */
export function buildCalcomRedirectUrl(lead: Pick<LeadInput, "nome">, attribution: Attribution): string {
  const base = process.env.CALCOM_BOOKING_URL ?? "";
  if (!base) return "#calcom-not-configured";

  const url = new URL(base);
  url.searchParams.set("name", lead.nome);

  if (attribution.utm_source) url.searchParams.set("utm_source", attribution.utm_source);
  if (attribution.utm_campaign) url.searchParams.set("utm_campaign", attribution.utm_campaign);

  return url.toString();
}
