import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FIT = [
  "Varejo com faturamento e equipe.",
  "Empresa que já investe ou está pronta para investir de forma séria.",
  "Decisor que quer crescimento mensurável.",
  "Empresa disposta a ajustar operação, não apenas anúncio.",
];

const NOT_FIT = [
  "Quem busca o menor preço.",
  "Quem quer apenas “subir campanha”.",
  "Profissional liberal.",
  "Negócio sem capacidade operacional ou financeira para executar.",
];

export function FitSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <SectionHeading>Para quem é — e para quem não é.</SectionHeading>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.06] p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">É para</h3>
            <ul className="mt-4 space-y-3 text-[15px] text-fg-muted">
              {FIT.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 text-accent">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border-strong bg-bg-elevated/40 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-fg-subtle">
              Não é para
            </h3>
            <ul className="mt-4 space-y-3 text-[15px] text-fg-muted">
              {NOT_FIT.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 text-danger">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
