import type { Faturamento } from "./schema";

/**
 * Códigos canônicos compartilhados com o contrato do Qarvon OS
 * (POST /api/integrations/leads, revenue_range) — ver
 * qarvon-os/lib/leads/revenue-range.ts, fonte de verdade real desses
 * valores. Não existe import cross-repo então este mapa é uma cópia
 * deliberada: qualquer mudança nos códigos do lado do Qarvon OS precisa ser
 * replicada aqui manualmente.
 *
 * A LP nunca envia o label em português para o CRM — só o código. O label
 * continua sendo o que o visitante vê (lib/schema.ts, faturamentoOptions).
 */
export const FATURAMENTO_TO_REVENUE_RANGE: Record<Faturamento, string> = {
  "Mais de R$1 milhão/mês": "over_1m",
  "R$500 mil a R$1 milhão/mês": "500k_1m",
  "R$100 mil a R$500 mil/mês": "100k_500k",
  "R$30 mil a R$100 mil/mês": "30k_100k",
  "Menos de R$30 mil/mês": "under_30k",
};

export function faturamentoToRevenueRange(faturamento: Faturamento): string {
  return FATURAMENTO_TO_REVENUE_RANGE[faturamento];
}
