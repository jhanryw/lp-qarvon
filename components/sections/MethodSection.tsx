import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";

const STEPS = [
  {
    letter: "Q",
    word: "Qualificação",
    description: "Entender o negócio, momento, metas, números, histórico de mídia e capacidade operacional.",
  },
  {
    letter: "A",
    word: "Análise",
    description: "Mapear aquisição, criativos, oferta, atendimento, follow-up, conversão e indicadores para localizar desperdícios e gargalos.",
  },
  {
    letter: "R",
    word: "Reestruturação",
    description: "Corrigir o que impede a operação de transformar demanda em receita: campanhas, criativos, proposta, processo comercial e acompanhamento.",
  },
  {
    letter: "V",
    word: "Validação",
    description: "Testar as mudanças com dados reais antes de escalar agressivamente o investimento.",
  },
  {
    letter: "O",
    word: "Otimização",
    description: "Melhorar continuamente CAC, conversão, criativos, campanhas, velocidade de atendimento e rentabilidade.",
  },
  {
    letter: "N",
    word: "Nova Escala",
    description: "Aumentar investimento e metas somente quando a operação provar que está preparada para absorver mais demanda.",
  },
] as const;

export function MethodSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <SectionEyebrow>Método QARVON</SectionEyebrow>
        <SectionHeading>Mais tráfego não corrige uma operação ineficiente.</SectionHeading>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
          A Qarvon primeiro identifica onde a operação desperdiça demanda e receita, corrige os
          gargalos e valida a estrutura. Só depois recomenda escala de investimento.
        </p>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.letter}
              className="relative rounded-2xl border border-border-strong bg-bg-elevated/60 p-6"
            >
              <span className="text-xs font-medium text-fg-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-accent">{s.letter}</span>
                <span className="text-lg font-semibold text-fg">{s.word}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{s.description}</p>
            </li>
          ))}
        </ol>

        <p className="mt-6 text-sm text-fg-subtle">
          Todo projeto começa por um Raio-X da operação dentro da etapa de Análise do Método
          QARVON.
        </p>
      </Container>
    </section>
  );
}
