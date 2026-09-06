import { Container } from "@/components/ui/Container";
import { ContextualCta } from "@/components/ui/ContextualCta";
import { DepthBackground } from "@/components/ui/DepthBackground";

export function FinalCtaSection() {
  return (
    <section id="aplicar-info" className="scroll-mt-8 py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-accent/[0.06] p-8 text-center sm:p-14">
          <DepthBackground />
          <h2 className="relative z-10 text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Antes de colocar mais dinheiro em mídia, descubra quanto sua operação atual ainda pode
            entregar.
          </h2>
          <div className="relative z-10 mt-8">
            <ContextualCta>Solicitar diagnóstico</ContextualCta>
          </div>
        </div>
      </Container>
    </section>
  );
}
