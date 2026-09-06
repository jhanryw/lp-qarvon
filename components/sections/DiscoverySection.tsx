import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { SystemPipeline } from "@/components/method/SystemPipeline";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";

export function DiscoverySection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionEyebrow>O que aprendemos em operações reais</SectionEyebrow>
            <SectionHeading>O crescimento não depende só da campanha.</SectionHeading>
            <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
              Depois de olhar operação por operação, o padrão se repete: a mídia funciona, o
              problema está entre a mídia e a venda. Por isso a Qarvon olha o sistema inteiro,
              não só o anúncio.
            </p>
            <div className="mt-6 max-w-[220px]">
              <AssetPlaceholder
                kind="photo"
                aspect="4/5"
                label="Fundador analisando dashboard/operação (ASSET-MANIFEST.md item 4a)."
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border-strong bg-bg-elevated/40 p-8">
            <SystemPipeline />
          </div>
        </div>
      </Container>
    </section>
  );
}
