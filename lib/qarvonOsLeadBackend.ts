import type { Attribution } from "./schema";

/**
 * Chamada server-to-server LP → Qarvon OS (POST /api/integrations/leads).
 * Nunca chamado do browser — token só existe neste processo (server-side),
 * nunca com prefixo NEXT_PUBLIC_. Contrato real do endpoint em
 * qarvon-os/lib/integrations/leads/schema.ts; este módulo é o único lugar
 * da LP que conhece esse formato.
 */

const TIMEOUT_MS = 8000;
const RETRY_DELAY_MS = 300;
const MAX_ATTEMPTS = 2; // tentativa inicial + 1 retry curto em erro transitório

export interface QarvonOsLeadInput {
  externalSubmissionId: string;
  name: string;
  whatsapp: string;
  company: string;
  revenueRange: string;
  investsPaidTraffic: boolean;
  attribution: Attribution;
}

export type QarvonOsLeadResult =
  | {
      ok: true;
      status: 200 | 201;
      leadId: string;
      submissionId: string;
      isNewLead: boolean;
      duplicateSubmission: boolean;
    }
  | {
      ok: false;
      reason: "not_configured" | "unauthorized" | "validation" | "server_error" | "network_error";
      status?: number;
      message: string;
    };

export function isQarvonOsConfigured(): boolean {
  return Boolean(process.env.QARVON_OS_API_URL && process.env.QARVON_OS_INTEGRATION_TOKEN);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Só inclui campos de atribuição não-vazios: o contrato do Qarvon OS usa
 * `.min(1)` na maioria dos campos (string vazia é rejeitada, campo ausente
 * não), exceto `referrer` — onde string vazia é o valor legítimo de "visita
 * direta" (ver comentário em lib/integrations/leads/schema.ts do Qarvon OS).
 * `page_url` da LP vira `landing_page` no contrato do Qarvon OS — nomes
 * diferentes, mesmo dado.
 */
function buildAttributionPayload(attribution: Attribution): Record<string, unknown> {
  const payload: Record<string, unknown> = { referrer: attribution.referrer ?? "" };

  const passthroughFields: Array<[string, string]> = [
    ["utm_source", attribution.utm_source],
    ["utm_medium", attribution.utm_medium],
    ["utm_campaign", attribution.utm_campaign],
    ["utm_content", attribution.utm_content],
    ["utm_term", attribution.utm_term],
    ["fbclid", attribution.fbclid],
    ["fbp", attribution.fbp],
    ["fbc", attribution.fbc],
    ["campaign_id", attribution.campaign_id],
    ["adset_id", attribution.adset_id],
    ["ad_id", attribution.ad_id],
    ["gclid", attribution.gclid],
    ["gbraid", attribution.gbraid],
    ["wbraid", attribution.wbraid],
  ];

  for (const [key, value] of passthroughFields) {
    if (value) payload[key] = value;
  }

  if (attribution.page_url) payload.landing_page = attribution.page_url;

  return payload;
}

function buildRequestBody(input: QarvonOsLeadInput): string {
  return JSON.stringify({
    version: 1,
    external_submission_id: input.externalSubmissionId,
    name: input.name,
    whatsapp: input.whatsapp,
    company: input.company,
    revenue_range: input.revenueRange,
    invests_paid_traffic: input.investsPaidTraffic,
    attribution: buildAttributionPayload(input.attribution),
  });
}

interface SuccessResponseBody {
  success: true;
  lead_id: string;
  submission_id: string;
  is_new_lead: boolean;
  duplicate_submission: boolean;
}

interface ErrorResponseBody {
  success: false;
  error?: string;
}

/**
 * Envia o lead ao Qarvon OS. Nunca lança — todo desfecho (sucesso, 401,
 * 422, 5xx, timeout/erro de rede) vira um QarvonOsLeadResult tipado; quem
 * chama decide o que fazer. Nunca loga o token nem o corpo da requisição —
 * só status HTTP e mensagens genéricas.
 */
export async function sendLeadToQarvonOS(input: QarvonOsLeadInput): Promise<QarvonOsLeadResult> {
  const apiUrl = process.env.QARVON_OS_API_URL;
  const token = process.env.QARVON_OS_INTEGRATION_TOKEN;

  // DIAGNÓSTICO TEMPORÁRIO — investigação de env em runtime (remover depois
  // de confirmado estável). Só boolean, nunca o valor/tamanho/prefixo.
  console.log({
    qarvonOsApiUrlConfigured: typeof apiUrl === "string" && apiUrl.length > 0,
    qarvonOsTokenConfigured: typeof token === "string" && token.length > 0,
  });

  if (!apiUrl || !token) {
    return {
      ok: false,
      reason: "not_configured",
      message: "QARVON_OS_API_URL/QARVON_OS_INTEGRATION_TOKEN não configurados",
    };
  }

  const url = new URL("/api/integrations/leads", apiUrl).toString();
  const body = buildRequestBody(input);

  let lastFailure: { reason: "network_error" | "server_error"; status?: number; message: string } | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await sleep(RETRY_DELAY_MS);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      // Timeout (AbortError) ou falha de rede — transitório, elegível a
      // retry.
      lastFailure = {
        reason: "network_error",
        message: error instanceof Error ? error.message : "erro de rede desconhecido",
      };
      continue;
    }

    if (response.status === 401) {
      return {
        ok: false,
        reason: "unauthorized",
        status: 401,
        message: "Qarvon OS rejeitou o token de integração (401)",
      };
    }

    if (response.status >= 500) {
      // Transitório — vale re-tentar.
      lastFailure = {
        reason: "server_error",
        status: response.status,
        message: `Qarvon OS respondeu ${response.status}`,
      };
      continue;
    }

    if (!response.ok) {
      // 422 (validação) e qualquer outro 4xx não mapeado: erro do payload
      // em si, re-tentar com o mesmo corpo não muda o resultado.
      const data = (await response.json().catch(() => null)) as ErrorResponseBody | null;
      return {
        ok: false,
        reason: "validation",
        status: response.status,
        message: data?.error ?? `Qarvon OS respondeu ${response.status}`,
      };
    }

    const data = (await response.json()) as SuccessResponseBody;
    return {
      ok: true,
      status: response.status as 200 | 201,
      leadId: data.lead_id,
      submissionId: data.submission_id,
      isNewLead: data.is_new_lead,
      duplicateSubmission: data.duplicate_submission,
    };
  }

  return {
    ok: false,
    reason: lastFailure?.reason ?? "network_error",
    status: lastFailure?.status,
    message: lastFailure?.message ?? "falha desconhecida ao chamar Qarvon OS",
  };
}
