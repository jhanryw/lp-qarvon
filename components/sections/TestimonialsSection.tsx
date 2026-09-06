import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";

export function TestimonialsSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <SectionEyebrow>Quem já aplicou</SectionEyebrow>
          <SectionHeading>Depoimentos.</SectionHeading>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-5 text-sm">
            <p className="font-semibold text-fg">Pedro André — Luzanni</p>
            <p className="mt-2 text-fg-muted">
              Vídeo completo na seção do case acima. Citação em texto: transcrever trecho real
              do vídeo quando finalizado (nunca escrever fala no lugar do cliente).
            </p>
          </div>
          <AssetPlaceholder kind="photo" aspect="4/5" label="Depoimento 02 — nome, empresa, resultado (ASSET-MANIFEST.md item 13)." />
          <AssetPlaceholder kind="photo" aspect="4/5" label="Depoimento 03 — nome, empresa, resultado (ASSET-MANIFEST.md item 13)." />
        </div>
      </Container>
    </section>
  );
}
