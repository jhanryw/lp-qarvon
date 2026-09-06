import type { LeadInput } from "./schema";

/**
 * Configurable lead score, kept intentionally simple to match the
 * simplified form (faturamento + whether they already run paid traffic).
 * Tune here as ICP-fit data comes in — never block submission on score,
 * only route/prioritize.
 */
const SCORE_RULES: Array<{ points: number; test: (lead: LeadInput) => boolean }> = [
  { points: 3, test: (l) => l.faturamento === "R$150 mil a R$300 mil/mês" || l.faturamento === "R$300 mil+/mês" },
  { points: 2, test: (l) => l.faturamento === "R$70 mil a R$150 mil/mês" },
  { points: 1, test: (l) => l.faturamento === "R$30 mil a R$70 mil/mês" },
  { points: -2, test: (l) => l.faturamento === "Até R$30 mil/mês" },
  { points: 2, test: (l) => l.ja_investe_trafego === "Já invisto" },
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

  const lead_tier: LeadTier = lead_score >= 5 ? "A" : lead_score >= 2 ? "B" : "C";
  const is_icp = lead_tier !== "C";

  return { lead_score, lead_tier, is_icp };
}
