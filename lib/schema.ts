import { z } from "zod";

export const cargoOptions = [
  "Dono(a)/Sócio(a)",
  "Diretor(a)/Gestor(a)",
  "Marketing",
  "Outro",
] as const;

export const faturamentoOptions = [
  "Até R$30 mil",
  "R$30–70 mil",
  "R$70–150 mil",
  "R$150–300 mil",
  "R$300 mil+",
] as const;

export const jaInvesteTrafegoOptions = [
  "Sim",
  "Já investi, mas parei",
  "Nunca investi",
] as const;

export const faixaMidiaOptions = [
  "Até R$2 mil",
  "R$2–5 mil",
  "R$5–10 mil",
  "R$10–20 mil",
  "R$20 mil+",
  "Ainda não invisto",
] as const;

export const gargaloOptions = [
  "Gerar demanda",
  "Criativos/oferta",
  "Atendimento/follow-up",
  "Conversão em vendas",
  "Falta de previsibilidade",
  "Não sei onde está o problema",
] as const;

export const capacidadeInvestimentoOptions = [
  "Até R$5 mil/mês",
  "R$5–12 mil/mês",
  "R$12–20 mil/mês",
  "R$20 mil+/mês",
  "Prefiro conversar antes de definir",
] as const;

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
});

export type Attribution = z.infer<typeof attributionSchema>;

export const leadInputSchema = z.object({
  lead_id: z.string().uuid(),
  nome: z.string().trim().min(2, "Informe seu nome completo").max(160),
  whatsapp: z
    .string()
    .trim()
    .min(10, "Informe um WhatsApp válido com DDD")
    .max(20),
  email: z.string().trim().email("Informe um e-mail válido").max(200),
  empresa: z.string().trim().min(2, "Informe o nome da empresa").max(160),
  instagram_site: z.string().trim().min(2, "Informe Instagram ou site").max(200),
  cargo: z.enum(cargoOptions),
  segmento: z.string().trim().min(2, "Informe o segmento").max(160),
  faturamento: z.enum(faturamentoOptions),
  ja_investe_trafego: z.enum(jaInvesteTrafegoOptions),
  faixa_midia: z.enum(faixaMidiaOptions),
  gargalo: z.enum(gargaloOptions),
  objetivo_90d: z.string().trim().min(3, "Conte seu objetivo para os próximos 90 dias").max(500),
  faixa_investimento_assessoria: z.enum(capacidadeInvestimentoOptions),
  consentimento: z.literal(true, {
    error: "É necessário aceitar o contato para continuar",
  }),
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
  utm_content: "",
  utm_term: "",
  fbclid: "",
  fbp: "",
  fbc: "",
};

export const leadRequestSchema = leadInputSchema.extend({
  attribution: attributionSchema.optional().default(emptyAttribution),
});

export type LeadRequest = z.infer<typeof leadRequestSchema>;

export const formStepFields = [
  ["nome", "whatsapp", "email"],
  ["empresa", "instagram_site", "cargo"],
  ["segmento", "faturamento"],
  ["ja_investe_trafego", "faixa_midia"],
  ["gargalo", "objetivo_90d"],
  ["faixa_investimento_assessoria", "consentimento"],
] as const;

export const stepSchemas = [
  leadInputSchema.pick({ nome: true, whatsapp: true, email: true }),
  leadInputSchema.pick({ empresa: true, instagram_site: true, cargo: true }),
  leadInputSchema.pick({ segmento: true, faturamento: true }),
  leadInputSchema.pick({ ja_investe_trafego: true, faixa_midia: true }),
  leadInputSchema.pick({ gargalo: true, objetivo_90d: true }),
  leadInputSchema.pick({ faixa_investimento_assessoria: true, consentimento: true }),
] as const;
