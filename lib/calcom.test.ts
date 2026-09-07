import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildCalcomRedirectUrl } from "./calcom";
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

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("buildCalcomRedirectUrl", () => {
  it("retorna #calcom-not-configured quando a env não está setada", () => {
    vi.stubEnv("CALCOM_BOOKING_URL", "");
    expect(buildCalcomRedirectUrl({ nome: "Maria" }, emptyAttribution)).toBe("#calcom-not-configured");
  });

  it("monta a URL com name/utm_source/utm_campaign quando a env é válida", () => {
    vi.stubEnv("CALCOM_BOOKING_URL", "https://cal.com/qarvon/diagnostico");
    const url = buildCalcomRedirectUrl(
      { nome: "Maria Teste" },
      { ...emptyAttribution, utm_source: "meta", utm_campaign: "campanha-1" },
    );
    expect(url).toContain("name=Maria+Teste");
    expect(url).toContain("utm_source=meta");
    expect(url).toContain("utm_campaign=campanha-1");
  });

  // Regressão: uma CALCOM_BOOKING_URL malformada (ex.: colada sem
  // protocolo) não pode derrubar a rota inteira — antes desta correção,
  // `new URL()` lançava sem try/catch e a exceção não tratada em
  // app/api/leads/route.ts virava uma página de erro HTML em vez de JSON,
  // o que no cliente aparecia como "Falha de conexão" (response.json()
  // falhando ao parsear HTML como JSON) — um sintoma que escondia a causa
  // real.
  it("nunca lança quando CALCOM_BOOKING_URL está malformada — retorna fallback seguro", () => {
    vi.stubEnv("CALCOM_BOOKING_URL", "isso-nao-e-uma-url");
    expect(() => buildCalcomRedirectUrl({ nome: "Maria" }, emptyAttribution)).not.toThrow();
    expect(buildCalcomRedirectUrl({ nome: "Maria" }, emptyAttribution)).toBe("#calcom-not-configured");
  });
});
