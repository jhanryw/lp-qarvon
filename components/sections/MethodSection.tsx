import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { MethodBlueprint } from "@/components/method/MethodBlueprint";
import { MethodPipeline } from "@/components/method/MethodPipeline";
import { ContextualCta } from "@/components/ui/ContextualCta";

export function MethodSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <SectionEyebrow>Como aplicamos isso</SectionEyebrow>
          <SectionHeading>Um sistema, não um serviço avulso.</SectionHeading>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <MethodBlueprint>
            <MethodPipeline />
          </MethodBlueprint>
        </div>

        <div className="mt-10 text-center">
          <ContextualCta>Analisar minha operação</ContextualCta>
        </div>
      </Container>
    </section>
  );
}
