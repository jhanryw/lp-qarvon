import type { LeadInput } from "./schema";

/**
 * Configurable lead score. Weights follow LP-QARVON-SPEC.md section 7.
 * Tune here as ICP-fit data comes in from real submissions — never block
 * submission based on score, only route/prioritize.
 */
const SCORE_RULES: Array<{ points: number; test: (lead: LeadInput) => boolean }> = [
  { points: 3, test: (l) => l.faturamento === "R$150–300 mil" || l.faturamento === "R$300 mil+" },
  { points: 2, test: (l) => l.faturamento === "R$70–150 mil" },
  { points: -2, test: (l) => l.faturamento === "Até R$30 mil" },
  { points: 3, test: (l) => l.faixa_midia === "R$5–10 mil" || l.faixa_midia === "R$10–20 mil" || l.faixa_midia === "R$20 mil+" },
  { points: 2, test: (l) => l.faixa_midia === "R$2–5 mil" },
  { points: 2, test: (l) => l.cargo === "Dono(a)/Sócio(a)" },
  { points: 1, test: (l) => l.cargo === "Diretor(a)/Gestor(a)" },
  { points: 2, test: (l) => l.ja_investe_trafego === "Sim" },
  { points: 1, test: (l) => l.ja_investe_trafego === "Já investi, mas parei" },
  { points: 2, test: (l) => l.faixa_investimento_assessoria === "R$12–20 mil/mês" || l.faixa_investimento_assessoria === "R$20 mil+/mês" },
  { points: 1, test: (l) => l.faixa_investimento_assessoria === "R$5–12 mil/mês" },
];

export type LeadTier = "A" | "B" | "C";

export interface LeadScoreResult {
  lead_score: number;
  lead_tier: LeadTier;
  is_icp: boolean;
}

export function scoreLead(lead: LeadInput): LeadScoreResult {
  const lead_score = SCORE_RULES.reduce(
    (total, rule) => (rule.test(lead) ? total + rule.points : total),
    0,
  );

  const lead_tier: LeadTier = lead_score >= 8 ? "A" : lead_score >= 3 ? "B" : "C";
  const is_icp = lead_tier !== "C";

  return { lead_score, lead_tier, is_icp };
}
