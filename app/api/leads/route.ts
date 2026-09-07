import { NextResponse } from "next/server";
import { leadRequestSchema } from "@/lib/schema";
import { scoreLead } from "@/lib/scoring";
import { persistLead, type LeadRecord } from "@/lib/leadPersistence";
import { dispatchLeadWebhooks } from "@/lib/webhooks";
import { buildCalcomRedirectUrl } from "@/lib/calcom";
import { isRateLimited } from "@/lib/rateLimit";
import { faturamentoToRevenueRange } from "@/lib/revenueRange";
import { sendLeadToQarvonOS } from "@/lib/qarvonOsLeadBackend";

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
  // Rede de segurança final: qualquer exceção não prevista em algo abaixo
  // (scoring, persistência, chamada ao Qarvon OS) NUNCA pode escapar como
  // uma página de erro HTML do Next — o cliente faz response.json() no
  // corpo da resposta (ver components/form/LeadForm.tsx), e um corpo HTML
  // nesse parse falha com uma mensagem genérica de "falha de conexão" que
  // esconde a causa real. Handler específicos abaixo (Qarvon OS, Sheets,
  // webhook) já não lançam por construção — isto é defesa em profundidade,
  // não a linha de tratamento principal.
  try {
    return await handleLeadSubmission(request);
  } catch (error) {
    console.error("[api/leads] erro inesperado não tratado:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar seus dados agora. Tente novamente em instantes." },
      { status: 500 },
    );
  }
}

async function handleLeadSubmission(request: Request): Promise<Response> {
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

  // Qarvon OS é a fonte de verdade agora — gate de sucesso da submissão.
  // Chamado ANTES do Sheets de propósito: se falhar aqui, a resposta já é
  // erro e o Sheets sequer é tentado (evita persistir em um lugar que não é
  // mais o CRM real quando o CRM real recusou o lead).
  const qarvonResult = await sendLeadToQarvonOS({
    externalSubmissionId: lead.lead_id,
    name: lead.nome,
    whatsapp: lead.whatsapp,
    company: lead.empresa,
    revenueRange: faturamentoToRevenueRange(lead.faturamento),
    investsPaidTraffic: lead.ja_investe_trafego === "Já invisto",
    attribution: lead.attribution,
  });

  if (!qarvonResult.ok) {
    if (qarvonResult.reason === "not_configured" && process.env.NODE_ENV !== "production") {
      // Dev local sem QARVON_OS_API_URL/QARVON_OS_INTEGRATION_TOKEN: não
      // bloqueia (mesma postura de isSheetsConfigured/appendLeadLocally) —
      // permite iterar na LP sem um Qarvon OS local rodando. Em produção
      // essa mesma condição é uma configuração ausente real, ver abaixo.
      console.warn("[api/leads] Qarvon OS não configurado — pulando em ambiente de desenvolvimento.");
    } else {
      // Log específico por causa — nunca o token, nunca o payload — para
      // que 401/422/5xx/timeout sejam diferenciáveis nos logs do servidor
      // mesmo quando o lead só vê uma mensagem genérica.
      switch (qarvonResult.reason) {
        case "unauthorized":
          // Erro de CONFIGURAÇÃO da integração (token/pepper/credencial),
          // nunca do lead — não expor esse detalhe na resposta.
          console.error(
            "[api/leads] Qarvon OS: token de integração rejeitado (401) — verificar QARVON_OS_INTEGRATION_TOKEN / INTEGRATION_TOKEN_PEPPER / credencial ativa no Qarvon OS.",
          );
          break;
        case "validation":
          // Não deveria acontecer com um formulário válido: é a LP enviando
          // algo fora do contrato do Qarvon OS — erro de CONTRATO, não do
          // usuário.
          console.error(
            "[api/leads] Qarvon OS recusou o payload como inválido (422) — provável divergência de contrato entre LP e Qarvon OS:",
            qarvonResult.message,
          );
          break;
        case "not_configured":
          console.error(
            "[api/leads] Qarvon OS não configurado em produção — QARVON_OS_API_URL/QARVON_OS_INTEGRATION_TOKEN ausentes no ambiente.",
          );
          break;
        default:
          // server_error / network_error: falha temporária (5xx ou
          // timeout/rede) do lado do Qarvon OS.
          console.error(
            "[api/leads] Qarvon OS indisponível temporariamente:",
            qarvonResult.reason,
            qarvonResult.status,
            qarvonResult.message,
          );
      }
      return NextResponse.json(
        { error: "Não foi possível enviar seus dados agora. Tente novamente em instantes." },
        { status: 502 },
      );
    }
  }

  // Sheets agora é secundário/best-effort: só registrado para referência —
  // uma falha aqui NUNCA derruba a resposta de sucesso, já garantida pelo
  // Qarvon OS acima. Route/form don't know or care which backend this is —
  // see lib/leadPersistence.ts.
  const { persisted: sheetsPersisted, backend: sheetsBackend } = await persistLead(row);
  if (!sheetsPersisted) {
    console.error("[api/leads] Sheets (secundário) não persistiu o lead:", sheetsBackend);
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
    // Reflete a idempotência do Qarvon OS (mesmo external_submission_id
    // reenviado), não mais a do Sheets — é a fonte de verdade agora.
    duplicate: qarvonResult.ok ? qarvonResult.duplicateSubmission : false,
    // Cal.com link is preserved in the sheet row (cal_redirect_url) for
    // manual use, but the visitor is sent to our own thank-you page —
    // scheduling now happens after a human reviews the lead.
    redirectUrl: "/obrigado",
  });
}
