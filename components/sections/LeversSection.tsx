import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";

const LEVERS = [
  {
    title: "Aquisição",
    description: "Mídia e distribuição orientadas a venda, não a vaidade de métrica.",
  },
  {
    title: "Criativos",
    description: "Mensagens e ofertas que geram demanda real, testadas com dado.",
  },
  {
    title: "Conversão",
    description: "Atendimento, scripts e follow-up — para o clique virar venda.",
  },
  {
    title: "Dados",
    description: "CAC, conversão, margem, metas e leitura de resultado, sem achismo.",
  },
  {
    title: "Escala",
    description: "Aumento de investimento condicionado à validação da operação.",
  },
] as const;

export function LeversSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <SectionEyebrow>Como atuamos</SectionEyebrow>
        <SectionHeading>Cinco alavancas, não uma lista de serviços soltos.</SectionHeading>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LEVERS.map((lever, i) => (
            <div
              key={lever.title}
              className="rounded-2xl border border-border-strong bg-bg-elevated/60 p-5"
            >
              <span className="text-xs font-medium text-fg-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-semibold text-fg">{lever.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{lever.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
