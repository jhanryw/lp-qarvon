// @vitest-environment node
//
// Testa a orquestração da rota: Qarvon OS como gate de sucesso, Sheets como
// secundário/best-effort, webhook inalterado. sendLeadToQarvonOS e
// persistLead são mockados; leadRequestSchema/scoreLead ficam reais.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendLeadToQarvonOS } = vi.hoisted(() => ({ sendLeadToQarvonOS: vi.fn() }));
vi.mock("@/lib/qarvonOsLeadBackend", () => ({ sendLeadToQarvonOS }));

const { persistLead } = vi.hoisted(() => ({ persistLead: vi.fn() }));
vi.mock("@/lib/leadPersistence", () => ({ persistLead }));

const { dispatchLeadWebhooks } = vi.hoisted(() => ({ dispatchLeadWebhooks: vi.fn() }));
vi.mock("@/lib/webhooks", () => ({ dispatchLeadWebhooks }));

const { POST } = await import("@/app/api/leads/route");

let ipCounter = 0;

const VALID_BODY = {
  nome: "Maria Teste",
  whatsapp: "(11) 91234-5678",
  empresa: "Empresa Teste LP",
  faturamento: "R$100 mil a R$500 mil/mês",
  ja_investe_trafego: "Já invisto",
  lead_id: "550e8400-e29b-41d4-a716-446655440000",
  attribution: {
    utm_source: "meta",
    utm_medium: "cpc",
    utm_campaign: "campanha-1",
    utm_content: "",
    utm_term: "",
    fbclid: "fb.123",
    fbp: "fp.1",
    fbc: "fc.1",
    page_url: "https://qarvon.com.br/",
    referrer: "",
  },
};

function request(body: unknown = VALID_BODY): Request {
  // IP diferente por request — o rate limiter (lib/rateLimit.ts) é um Map
  // em memória compartilhado entre testes deste arquivo.
  ipCounter += 1;
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${ipCounter}` },
    body: JSON.stringify(body),
  });
}

const QARVON_SUCCESS_NEW = {
  ok: true,
  status: 201,
  leadId: "lead-1",
  submissionId: "sub-1",
  isNewLead: true,
  duplicateSubmission: false,
};

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "test");
  sendLeadToQarvonOS.mockReset();
  persistLead.mockReset();
  dispatchLeadWebhooks.mockReset();
  sendLeadToQarvonOS.mockResolvedValue(QARVON_SUCCESS_NEW);
  persistLead.mockResolvedValue({ persisted: true, duplicate: false, backend: "sheets" });
  dispatchLeadWebhooks.mockResolvedValue([]);
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("POST /api/leads", () => {
  it("cria lead com sucesso (201 do Qarvon OS) e redireciona para /obrigado", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ success: true, duplicate: false, redirectUrl: "/obrigado" });
  });

  it("envia external_submission_id = lead_id, revenue_range convertido e invests_paid_traffic booleano", async () => {
    await POST(request());
    expect(sendLeadToQarvonOS).toHaveBeenCalledWith(
      expect.objectContaining({
        externalSubmissionId: "550e8400-e29b-41d4-a716-446655440000",
        revenueRange: "100k_500k",
        investsPaidTraffic: true,
      }),
    );
  });

  it("reflete duplicate_submission do Qarvon OS quando é um replay idempotente (200)", async () => {
    sendLeadToQarvonOS.mockResolvedValue({
      ok: true,
      status: 200,
      leadId: "lead-1",
      submissionId: "sub-1",
      isNewLead: true,
      duplicateSubmission: true,
    });

    const response = await POST(request());
    const body = await response.json();
    expect(body).toMatchObject({ success: true, duplicate: true });
  });

  it("retorna erro 502 quando o Qarvon OS recusa por 401, sem persistir no Sheets nem disparar webhook", async () => {
    sendLeadToQarvonOS.mockResolvedValue({ ok: false, reason: "unauthorized", status: 401, message: "Qarvon OS respondeu 401" });

    const response = await POST(request());
    expect(response.status).toBe(502);
    const body = await response.json();
    expect(body.error).toBeTruthy();
    expect(body.redirectUrl).toBeUndefined();
    expect(persistLead).not.toHaveBeenCalled();
    expect(dispatchLeadWebhooks).not.toHaveBeenCalled();
  });

  it("retorna erro 502 quando o Qarvon OS recusa por 422 (validação)", async () => {
    sendLeadToQarvonOS.mockResolvedValue({ ok: false, reason: "validation", status: 422, message: "payload rejeitado" });

    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(persistLead).not.toHaveBeenCalled();
  });

  it("retorna erro 502 quando o Qarvon OS falha com 500", async () => {
    sendLeadToQarvonOS.mockResolvedValue({ ok: false, reason: "server_error", status: 500, message: "Qarvon OS respondeu 500" });

    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(persistLead).not.toHaveBeenCalled();
  });

  it("retorna erro 502 quando o Qarvon OS falha por timeout/erro de rede", async () => {
    sendLeadToQarvonOS.mockResolvedValue({ ok: false, reason: "network_error", message: "The operation timed out" });

    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(persistLead).not.toHaveBeenCalled();
  });

  it("não trata not_configured como sucesso em produção — retorna 502", async () => {
    vi.stubEnv("NODE_ENV", "production");
    sendLeadToQarvonOS.mockResolvedValue({ ok: false, reason: "not_configured", message: "não configurado" });

    const response = await POST(request());
    expect(response.status).toBe(502);
    expect(persistLead).not.toHaveBeenCalled();
  });

  it("em desenvolvimento, not_configured não bloqueia a submissão (permite iterar sem Qarvon OS local)", async () => {
    sendLeadToQarvonOS.mockResolvedValue({ ok: false, reason: "not_configured", message: "não configurado" });

    const response = await POST(request());
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(persistLead).toHaveBeenCalled();
  });

  it("uma falha no Sheets (secundário) não impede a resposta de sucesso", async () => {
    persistLead.mockResolvedValue({ persisted: false, duplicate: false, backend: "none" });

    const response = await POST(request());
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it("dispara o webhook exatamente como antes (payload/shape inalterado) quando o Qarvon OS aceita o lead", async () => {
    await POST(request());
    expect(dispatchLeadWebhooks).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "qarvon.lead.created",
        lead: expect.objectContaining({ name: "Maria Teste", phone: "(11) 91234-5678" }),
      }),
    );
  });

  it("rejeita payload inválido com 422 antes de chamar o Qarvon OS", async () => {
    const response = await POST(request({ ...VALID_BODY, whatsapp: "" }));
    expect(response.status).toBe(422);
    expect(sendLeadToQarvonOS).not.toHaveBeenCalled();
  });
});
