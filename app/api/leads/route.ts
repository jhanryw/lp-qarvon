import { NextResponse } from "next/server";
import { leadRequestSchema } from "@/lib/schema";
import { scoreLead } from "@/lib/scoring";
import { persistLead, type LeadRecord } from "@/lib/leadPersistence";
import { dispatchLeadWebhooks } from "@/lib/webhooks";
import { buildCalcomRedirectUrl } from "@/lib/calcom";
import { isRateLimited } from "@/lib/rateLimit";

// This route depends on Node-only APIs (@googleapis/sheets' underlying
// google-auth-library, node:crypto, node:fs/promises) that don't run on the
// Edge runtime. App Router route handlers default to Node already, so this
// doesn't change today's behavior — it pins that default so a future Next.js
// version (or a misconfigured deployment platform) can't silently switch
// this route to Edge and break it.
export const runtime = "nodejs";

// Deliberately NOT setting `export const dynamic = "force-dynamic"` here:
// this file only exports POST, so Next has no GET to statically render or
// prerender in the first place — the flag would be a no-op. It also would
// not have prevented the EasyPanel build stall, since "Collecting page data"
// imports every route module (to build the manifest) regardless of static
// vs. dynamic; the stall was the cost of importing the ~213MB `googleapis`
// package that lib/sheets.ts pulled in, now fixed by switching to the
// scoped `@googleapis/sheets` package (~1MB) — see lib/sheets.ts.

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto e tente novamente." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const parsed = leadRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", issues: parsed.error.issues },
      { status: 422 },
    );
  }

  const lead = parsed.data;

  // Honeypot: bots fill hidden fields. Pretend success so they don't adapt.
  if (lead.website) {
    return NextResponse.json({ success: true, redirectUrl: "#" });
  }

  const { lead_score, lead_tier, is_icp } = scoreLead(lead);
  // Cal.com integration stays intact and the link is still logged for
  // reference, but it's no longer used as the automatic post-submit
  // redirect — scheduling now happens manually after a human reaches out.
  // See app/obrigado/page.tsx.
  const cal_redirect_url = buildCalcomRedirectUrl(lead, lead.attribution);

  const row: LeadRecord = {
    submitted_at: new Date().toISOString(),
    lead_id: lead.lead_id,
    nome: lead.nome,
    whatsapp: lead.whatsapp,
    empresa: lead.empresa,
    faturamento: lead.faturamento,
    ja_investe_trafego: lead.ja_investe_trafego,
    lead_score,
    lead_tier,
    is_icp,
    page_url: lead.attribution.page_url,
    referrer: lead.attribution.referrer,
    utm_source: lead.attribution.utm_source,
    utm_medium: lead.attribution.utm_medium,
    utm_campaign: lead.attribution.utm_campaign,
    utm_content: lead.attribution.utm_content,
    utm_term: lead.attribution.utm_term,
    fbclid: lead.attribution.fbclid,
    fbp: lead.attribution.fbp,
    fbc: lead.attribution.fbc,
    user_agent: request.headers.get("user-agent") ?? "",
    cal_redirect_url,
    webhook_status: "pending",
  };

  // Route/form don't know or care which backend this is (Sheets today,
  // maybe Supabase/CRM tomorrow) — see lib/leadPersistence.ts.
  const { persisted, duplicate } = await persistLead(row);

  if (!persisted) {
    // Lead couldn't be saved anywhere. Fail loudly instead of silently
    // dropping it — the client shows an error and the user can retry or
    // reach out directly.
    return NextResponse.json(
      { error: "Não conseguimos registrar sua aplicação agora. Tente novamente em instantes." },
      { status: 502 },
    );
  }

  const webhookResults = await dispatchLeadWebhooks({
    event: "qarvon.lead.created",
    event_id: lead.lead_id,
    occurred_at: row.submitted_at,
    lead: {
      name: lead.nome,
      phone: lead.whatsapp,
      company: lead.empresa,
      revenue_range: lead.faturamento,
      paid_media_status: lead.ja_investe_trafego,
      score: lead_score,
      tier: lead_tier,
      is_icp,
    },
    attribution: lead.attribution,
  });

  if (webhookResults.some((r) => !r.ok)) {
    console.error("[api/leads] one or more webhooks failed:", webhookResults);
  }

  return NextResponse.json({
    success: true,
    duplicate,
    // Cal.com link is preserved in the sheet row (cal_redirect_url) for
    // manual use, but the visitor is sent to our own thank-you page —
    // scheduling now happens after a human reviews the lead.
    redirectUrl: "/obrigado",
  });
}
