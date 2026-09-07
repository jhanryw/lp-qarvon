import { describe, expect, it } from "vitest";
import { faturamentoOptions } from "./schema";
import { faturamentoToRevenueRange, FATURAMENTO_TO_REVENUE_RANGE } from "./revenueRange";

// Códigos canônicos reais do Qarvon OS (lib/leads/revenue-range.ts,
// REVENUE_RANGE_CODES) — copiados aqui deliberadamente para o teste não
// depender de um import cross-repo que não existe.
const QARVON_OS_REVENUE_RANGE_CODES = ["under_30k", "30k_100k", "100k_500k", "500k_1m", "over_1m"];

describe("faturamentoToRevenueRange", () => {
  it("converte cada label de faturamento em um código reconhecido pelo Qarvon OS", () => {
    for (const label of faturamentoOptions) {
      expect(QARVON_OS_REVENUE_RANGE_CODES).toContain(faturamentoToRevenueRange(label));
    }
  });

  it("nunca envia o label em português — sempre um código", () => {
    for (const label of faturamentoOptions) {
      expect(faturamentoToRevenueRange(label)).not.toBe(label);
    }
  });

  it("mapeia cada label do formulário para o código esperado", () => {
    expect(faturamentoToRevenueRange("Mais de R$1 milhão/mês")).toBe("over_1m");
    expect(faturamentoToRevenueRange("R$500 mil a R$1 milhão/mês")).toBe("500k_1m");
    expect(faturamentoToRevenueRange("R$100 mil a R$500 mil/mês")).toBe("100k_500k");
    expect(faturamentoToRevenueRange("R$30 mil a R$100 mil/mês")).toBe("30k_100k");
    expect(faturamentoToRevenueRange("Menos de R$30 mil/mês")).toBe("under_30k");
  });

  it("tem exatamente um código por label do formulário, sem sobra nem falta", () => {
    expect(Object.keys(FATURAMENTO_TO_REVENUE_RANGE).sort()).toEqual([...faturamentoOptions].sort());
  });
});
