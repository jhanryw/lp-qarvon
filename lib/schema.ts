import { z } from "zod";

// Ordered highest → lowest on purpose: leading with the biggest bracket
// anchors higher, instead of letting the visitor default to the first
// (smallest) option in the list.
export const faturamentoOptions = [
  "Mais de R$1 milhão/mês",
  "R$500 mil a R$1 milhão/mês",
  "R$100 mil a R$500 mil/mês",
  "R$30 mil a R$100 mil/mês",
  "Menos de R$30 mil/mês",
] as const;

export type Faturamento = (typeof faturamentoOptions)[number];

export const jaInvesteTrafegoOptions = ["Já invisto", "Ainda não invisto"] as const;

export const attributionSchema = z.object({
  page_url: z.string().max(2048).optional().default(""),
  referrer: z.string().max(2048).optional().default(""),
  utm_source: z.string().max(256).optional().default(""),
  utm_medium: z.string().max(256).optional().default(""),
  utm_campaign: z.string().max(256).optional().default(""),
  utm_content: z.string().max(256).optional().default(""),
  utm_term: z.string().max(256).optional().default(""),
  fbclid: z.string().max(512).optional().default(""),
  fbp: z.string().max(512).optional().default(""),
  fbc: z.string().max(512).optional().default(""),
  // Preenchidos via querystring do anúncio (?campaign_id={{campaign.id}}&
  // adset_id={{adset.id}}&ad_id={{ad.id}}), independentes dos UTMs — Meta
  // Ads não preenche automaticamente esses IDs em nenhum UTM padrão.
  campaign_id: z.string().max(256).optional().default(""),
  adset_id: z.string().max(256).optional().default(""),
  ad_id: z.string().max(256).optional().default(""),
  // Google Ads — capturados mesmo sem nenhuma integração Google Ads
  // implementada ainda, mesma simetria de lib/integrations/leads/schema.ts
  // no Qarvon OS.
  gclid: z.string().max(512).optional().default(""),
  gbraid: z.string().max(512).optional().default(""),
  wbraid: z.string().max(512).optional().default(""),
});

export type Attribution = z.infer<typeof attributionSchema>;

/**
 * Deliberately short: the LP itself (positioning, copy, promise) does most
 * of the qualifying. The form only needs enough to let a human evaluate and
 * reach out — see the 2026-XX simplification request. Do not add fields
 * back without a fresh explicit ask; this list is intentionally exhaustive.
 */
export const leadInputSchema = z.object({
  lead_id: z.string().uuid(),
  nome: z.string().trim().min(2, "Informe seu nome completo").max(160),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD")
    .max(20),
  empresa: z.string().trim().min(2, "Informe o nome da empresa").max(160),
  faturamento: z.enum(faturamentoOptions),
  ja_investe_trafego: z.enum(jaInvesteTrafegoOptions),
  // Honeypot: hidden from real users via CSS. Deliberately unrestricted so a
  // bot filling it still parses successfully — app/api/leads/route.ts reads
  // this value and silently drops the submission instead of erroring, which
  // is what actually makes it work as a trap.
  website: z.string().optional().default(""),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

const emptyAttribution: Attribution = {
  page_url: "",
  referrer: "",
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
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

export const leadRequestSchema = leadInputSchema.extend({
  attribution: attributionSchema.optional().default(emptyAttribution),
});

export type LeadRequest = z.infer<typeof leadRequestSchema>;

// One field per step — five steps total, aiming for a sub-60s application.
export const stepSchemas = [
  leadInputSchema.pick({ nome: true }),
  leadInputSchema.pick({ whatsapp: true }),
  leadInputSchema.pick({ empresa: true }),
  leadInputSchema.pick({ faturamento: true }),
  leadInputSchema.pick({ ja_investe_trafego: true }),
] as const;
