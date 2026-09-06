import { Container } from "@/components/ui/Container";
import { DepthBackground } from "@/components/ui/DepthBackground";
import { SectionEyebrow } from "@/components/ui/SectionHeading";
import { AnimatedLineChart } from "@/components/ui/AnimatedLineChart";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";

export function CaseTeaserSection() {
  return (
    <section className="relative overflow-hidden border-b border-border py-16 sm:py-24">
      <DepthBackground flip />
      <Container className="relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Case real</SectionEyebrow>
          <p className="text-balance text-4xl font-extrabold tracking-tight text-fg sm:text-6xl">
            R$50 mil <span className="text-accent">→</span> R$210 mil
          </p>
          <p className="mt-3 text-fg-muted">por mês, na Luzanni.</p>
          <p className="mt-1 text-lg font-medium text-fg">E não começou aumentando a verba.</p>
        </div>

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-border-strong bg-bg-elevated/60 p-6">
          <AnimatedLineChart startLabel="R$50 mil/mês" endLabel="R$210 mil/mês" />
        </div>

        <div className="mx-auto mt-6 max-w-xs">
          <AssetPlaceholder
            kind="dashboard"
            aspect="16/10"
            label="Comprovação real do faturamento (ASSET-MANIFEST.md item 7) — extrato/relatório anonimizado, autorizado pela Luzanni."
          />
        </div>

        <div className="mt-8 text-center">
          <a href="#case" className="text-sm font-medium text-fg-muted underline underline-offset-4 hover:text-accent">
            Ver como aconteceu →
          </a>
        </div>
      </Container>
    </section>
  );
}
