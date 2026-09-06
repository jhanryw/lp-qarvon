import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";
import { ContextualCta } from "@/components/ui/ContextualCta";

const LEVERS = [
  {
    name: "Aquisição",
    before: "campanha sem clareza de CAC",
    after: "mídia orientada a receita",
    asset: { kind: "dashboard" as const, label: "Print real do Meta Ads Manager (ASSET-MANIFEST.md item 8)." },
  },
  {
    name: "Criativos",
    before: "criativo genérico repetido",
    after: "teste constante do que gera venda",
    asset: { kind: "creative-grid" as const, label: "Grade de criativos reais (ASSET-MANIFEST.md item 10)." },
  },
  {
    name: "Conversão",
    before: "clique chega no WhatsApp e morre",
    after: "atendimento e follow-up estruturados",
    asset: { kind: "chat" as const, label: "Print real de WhatsApp, antes/depois (ASSET-MANIFEST.md item 9)." },
  },
  {
    name: "Dados",
    before: "decisão por sensação",
    after: "CAC, conversão e margem lidos de verdade",
    asset: { kind: "dashboard" as const, label: "Dashboard real de CAC/conversão/margem (ASSET-MANIFEST.md item 11)." },
  },
  {
    name: "Escala",
    before: "aumentar verba sem saber se aguenta",
    after: "mais combustível só quando o motor aguenta",
    asset: null,
  },
] as const;

export function WhatWeDoSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <SectionEyebrow>Onde a Qarvon interfere</SectionEyebrow>
          <SectionHeading className="lg:text-right">Não gerimos anúncio. Reorganizamos operação.</SectionHeading>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEVERS.map((lever) => (
            <div key={lever.name} className="flex flex-col overflow-hidden rounded-2xl border border-border-strong bg-bg-elevated/40">
              {lever.asset ? (
                <AssetPlaceholder kind={lever.asset.kind} aspect="16/9" label={lever.asset.label} className="rounded-none border-0 border-b border-border" />
              ) : null}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-semibold text-fg">{lever.name}</h3>
                <div className="mt-2 flex flex-1 flex-col gap-1 text-sm">
                  <span className="text-fg-subtle line-through">{lever.before}</span>
                  <span className="font-medium text-accent">→ {lever.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <ContextualCta>Ver se minha operação se encaixa</ContextualCta>
        </div>
      </Container>
    </section>
  );
}
