import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CONTRASTS = [
  { neutral: "Seu Meta Ads mostra resultado.", turn: "Seu caixa discorda." },
  { neutral: "Você gera lead.", turn: "O WhatsApp não fecha." },
  { neutral: "Um mês vende.", turn: "No próximo, despenca." },
  { neutral: "Quando a meta não bate:", turn: "mais orçamento." },
  { neutral: "Você troca de gestor.", turn: "O problema continua." },
];

export function IdentificationSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <SectionHeading className="text-center">Você está tentando escalar uma operação que ainda perde vendas?</SectionHeading>

        <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3">
          {CONTRASTS.map((c) => (
            <div
              key={c.neutral}
              className="rounded-2xl border border-border-strong bg-[radial-gradient(140%_100%_at_20%_0%,rgba(43,201,168,0.08)_0%,rgba(0,0,0,0.3)_70%)] px-6 py-5 text-lg leading-snug"
            >
              <span className="text-fg-muted">{c.neutral}</span>{" "}
              <span className="font-semibold text-accent">{c.turn}</span>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-sm text-fg-subtle">
          Se dois destes já aconteceram este ano, o problema não está no anúncio.
        </p>
      </Container>
    </section>
  );
}
