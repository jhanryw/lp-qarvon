// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendLeadToQarvonOS, isQarvonOsConfigured, type QarvonOsLeadInput } from "./qarvonOsLeadBackend";
import type { Attribution } from "./schema";

const emptyAttribution: Attribution = {
  page_url: "",
  referrer: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  fbclid: "",
  fbp: "",
  fbc: "",
  campaign_id: "",
  adset_id: "",
  ad_id: "",
  gclid: "",
  gbraid: "",
  wbraid: "",
};

const baseInput: QarvonOsLeadInput = {
  externalSubmissionId: "lead-uuid-123",
  name: "Maria Teste",
  whatsapp: "(11) 91234-5678",
  company: "Empresa Teste LP",
  revenueRange: "100k_500k",
  investsPaidTraffic: true,
  attribution: emptyAttribution,
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("qarvonOsLeadBackend", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("QARVON_OS_API_URL", "https://crm.qarvon.com.br");
    vi.stubEnv("QARVON_OS_INTEGRATION_TOKEN", "super-secret-token");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  describe("isQarvonOsConfigured", () => {
    it("retorna true quando URL e token estão configurados", () => {
      expect(isQarvonOsConfigured()).toBe(true);
    });

    it("retorna false quando falta o token", () => {
      vi.stubEnv("QARVON_OS_INTEGRATION_TOKEN", "");
      expect(isQarvonOsConfigured()).toBe(false);
    });
  });

  it("retorna not_configured sem chamar fetch quando env vars estão ausentes", async () => {
    vi.stubEnv("QARVON_OS_API_URL", "");
    const result = await sendLeadToQarvonOS(baseInput);
    expect(result).toMatchObject({ ok: false, reason: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("chama POST /api/integrations/leads com Authorization Bearer e nunca expõe o token fora do header", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, { success: true, lead_id: "l1", submission_id: "s1", is_new_lead: true, duplicate_submission: false }),
    );

    await sendLeadToQarvonOS(baseInput);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://crm.qarvon.com.br/api/integrations/leads");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Authorization: "Bearer super-secret-token" });

    const body = JSON.parse(init.body as string);
    expect(body.external_submission_id).toBe("lead-uuid-123");
    expect(JSON.stringify(body)).not.toContain("super-secret-token");
  });

  it("monta o payload exatamente no formato esperado pelo Qarvon OS", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, { success: true, lead_id: "l1", submission_id: "s1", is_new_lead: true, duplicate_submission: false }),
    );

    await sendLeadToQarvonOS({
      ...baseInput,
      attribution: {
        ...emptyAttribution,
        page_url: "https://qarvon.com.br/?utm_source=meta",
        referrer: "",
        utm_source: "meta",
        utm_campaign: "campanha-1",
        fbclid: "fb.123",
        campaign_id: "120212",
        adset_id: "120213",
        ad_id: "120214",
      },
    });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(init.body as string);

    expect(body).toMatchObject({
      version: 1,
      external_submission_id: "lead-uuid-123",
      name: "Maria Teste",
      whatsapp: "(11) 91234-5678",
      company: "Empresa Teste LP",
      revenue_range: "100k_500k",
      invests_paid_traffic: true,
    });
    expect(body.attribution).toMatchObject({
      utm_source: "meta",
      utm_campaign: "campanha-1",
      fbclid: "fb.123",
      campaign_id: "120212",
      adset_id: "120213",
      ad_id: "120214",
      landing_page: "https://qarvon.com.br/?utm_source=meta",
      referrer: "",
    });
    // Campos de atribuição vazios não são enviados (contrato usa .min(1) —
    // string vazia falharia a validação); só referrer sempre vai, mesmo "".
    expect(body.attribution).not.toHaveProperty("utm_medium");
    expect(body.attribution).not.toHaveProperty("gclid");
  });

  it("retorna ok:true com os campos do 201 (lead novo)", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(201, {
        success: true,
        lead_id: "lead-abc",
        submission_id: "sub-abc",
        is_new_lead: true,
        duplicate_submission: false,
      }),
    );

    const result = await sendLeadToQarvonOS(baseInput);
    expect(result).toEqual({
      ok: true,
      status: 201,
      leadId: "lead-abc",
      submissionId: "sub-abc",
      isNewLead: true,
      duplicateSubmission: false,
    });
  });

  it("retorna ok:true com 200 para lead retornando/idempotente", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, {
        success: true,
        lead_id: "lead-abc",
        submission_id: "sub-xyz",
        is_new_lead: false,
        duplicate_submission: true,
      }),
    );

    const result = await sendLeadToQarvonOS(baseInput);
    expect(result).toEqual({
      ok: true,
      status: 200,
      leadId: "lead-abc",
      submissionId: "sub-xyz",
      isNewLead: false,
      duplicateSubmission: true,
    });
  });

  it("retorna reason:unauthorized em 401 sem re-tentar", async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { success: false, error: "UNAUTHORIZED" }));

    const result = await sendLeadToQarvonOS(baseInput);
    expect(result).toMatchObject({ ok: false, reason: "unauthorized", status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retorna reason:validation em 422 sem re-tentar", async () => {
    fetchMock.mockResolvedValue(jsonResponse(422, { success: false, error: "VALIDATION_ERROR" }));

    const result = await sendLeadToQarvonOS(baseInput);
    expect(result).toMatchObject({ ok: false, reason: "validation", status: 422 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("re-tenta uma vez em 500 e se recupera se a segunda tentativa suceder", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(500, { success: false, error: "INTERNAL_ERROR" }))
      .mockResolvedValueOnce(
        jsonResponse(201, { success: true, lead_id: "l1", submission_id: "s1", is_new_lead: true, duplicate_submission: false }),
      );

    const result = await sendLeadToQarvonOS(baseInput);
    expect(result).toMatchObject({ ok: true, leadId: "l1" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retorna reason:server_error após esgotar a única re-tentativa em 500 persistente", async () => {
    fetchMock.mockResolvedValue(jsonResponse(500, { success: false, error: "INTERNAL_ERROR" }));

    const result = await sendLeadToQarvonOS(baseInput);
    expect(result).toMatchObject({ ok: false, reason: "server_error", status: 500 });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("re-tenta uma vez em erro de rede/timeout e retorna reason:network_error se persistir", async () => {
    fetchMock.mockRejectedValue(new DOMException("The operation timed out", "TimeoutError"));

    const result = await sendLeadToQarvonOS(baseInput);
    expect(result).toMatchObject({ ok: false, reason: "network_error" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("não faz mais que uma re-tentativa (no máximo 2 chamadas ao todo)", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    await sendLeadToQarvonOS(baseInput);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("nunca inclui o token em nenhuma mensagem de erro retornada", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(401, { success: false, error: "UNAUTHORIZED" }));
    const unauthorized = await sendLeadToQarvonOS(baseInput);
    expect(JSON.stringify(unauthorized)).not.toContain("super-secret-token");

    fetchMock.mockResolvedValueOnce(jsonResponse(500, { success: false, error: "INTERNAL_ERROR" }));
    fetchMock.mockResolvedValueOnce(jsonResponse(500, { success: false, error: "INTERNAL_ERROR" }));
    const serverError = await sendLeadToQarvonOS(baseInput);
    expect(JSON.stringify(serverError)).not.toContain("super-secret-token");
  });
});
