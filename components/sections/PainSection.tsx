import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PAINS = [
  "Você investe em mídia, mas não sabe exatamente quanto retorna em venda.",
  "Quando o faturamento trava, a primeira solução é aumentar orçamento.",
  "A equipe atende bem no balcão, mas o WhatsApp é inconsistente.",
  "O follow-up depende de memória e improviso.",
  "Você já trocou de agência e o resultado continuou parecido.",
  "Há tráfego, mas falta clareza de CAC, conversão e gargalo.",
  "O dono ainda precisa “empurrar” a operação para a venda acontecer.",
];

export function PainSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <SectionHeading>
          Você está tentando escalar uma operação que ainda perde vendas no caminho?
        </SectionHeading>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {PAINS.map((pain) => (
            <li
              key={pain}
              className="flex items-start gap-3 rounded-xl border border-border bg-bg-elevated/50 p-4 text-[15px] leading-relaxed text-fg-muted"
            >
              <span className="mt-0.5 text-danger">✕</span>
              <span>{pain}</span>
            </li>
          ))}
        </ul>

        <p className="mt-8 max-w-2xl text-lg text-fg">
          Se dois ou mais desses pontos fazem parte da sua rotina, provavelmente há dinheiro
          sendo perdido antes de você precisar comprar mais tráfego.
        </p>
      </Container>
    </section>
  );
}
