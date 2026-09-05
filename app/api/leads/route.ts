import { NextResponse } from "next/server";
import { leadRequestSchema } from "@/lib/schema";
import { scoreLead } from "@/lib/scoring";
import { appendLeadRow, isSheetsConfigured, type SheetRow } from "@/lib/sheets";
import { dispatchLeadWebhooks } from "@/lib/webhooks";
import { buildCalcomRedirectUrl } from "@/lib/calcom";
import { isRateLimited } from "@/lib/rateLimit";
import { appendLeadLocally } from "@/lib/devFallback";

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
  const cal_redirect_url = buildCalcomRedirectUrl(lead, lead.attribution);

  const row: SheetRow = {
    submitted_at: new Date().toISOString(),
    lead_id: lead.lead_id,
    nome: lead.nome,
    whatsapp: lead.whatsapp,
    email: lead.email,
    empresa: lead.empresa,
    instagram_site: lead.instagram_site,
    cargo: lead.cargo,
    segmento: lead.segmento,
    faturamento: lead.faturamento,
    ja_investe_trafego: lead.ja_investe_trafego,
    faixa_midia: lead.faixa_midia,
    gargalo: lead.gargalo,
    objetivo_90d: lead.objetivo_90d,
    faixa_investimento_assessoria: lead.faixa_investimento_assessoria,
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

  let persisted = false;
  let duplicate = false;

  if (isSheetsConfigured()) {
    try {
      const result = await appendLeadRow(row);
      persisted = true;
      duplicate = result.duplicate;
    } catch (error) {
      console.error("[api/leads] Google Sheets append failed:", error);
    }
  } else {
    console.warn("[api/leads] Google Sheets not configured — using local dev fallback only.");
  }

  if (!persisted) {
    try {
      await appendLeadLocally(row);
      persisted = process.env.NODE_ENV !== "production";
    } catch (error) {
      console.error("[api/leads] local dev fallback failed:", error);
    }
  }

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
      email: lead.email,
      company: lead.empresa,
      instagram_or_site: lead.instagram_site,
      role: lead.cargo,
      segment: lead.segmento,
      revenue_range: lead.faturamento,
      paid_media_status: lead.ja_investe_trafego,
      paid_media_range: lead.faixa_midia,
      bottleneck: lead.gargalo,
      goal_90d: lead.objetivo_90d,
      budget_range: lead.faixa_investimento_assessoria,
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
    redirectUrl: cal_redirect_url,
  });
}
