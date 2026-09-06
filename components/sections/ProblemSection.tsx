import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { FunnelLeakDiagram } from "@/components/method/FunnelLeakDiagram";

export function ProblemSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <SectionEyebrow>O problema</SectionEyebrow>
          <SectionHeading>Existe uma mentira cara sendo repetida no varejo.</SectionHeading>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
            Quando a venda trava, a resposta de sempre é &ldquo;coloca mais verba&rdquo;. Mas o
            dinheiro que você põe no Meta passa por 6 portas antes de virar venda — e cada uma
            delas pode vazar receita.
          </p>
        </div>

        <div className="mt-12">
          <FunnelLeakDiagram />
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-lg font-medium text-fg">
          Aumentar verba sem fechar os vazamentos é pagar mais caro pelo mesmo furo.
        </p>
      </Container>
    </section>
  );
}
