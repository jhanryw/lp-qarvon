import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const FIT = [
  "Varejo com faturamento e equipe.",
  "Empresa que já investe ou está pronta para investir de forma séria.",
  "Decisor que quer crescimento mensurável.",
  "Empresa disposta a ajustar operação, não só o anúncio.",
];

const NOT_FIT = [
  "Quem busca o menor preço.",
  "Quem quer só “subir campanha”.",
  "Profissional liberal.",
  "Negócio sem capacidade operacional ou financeira para executar.",
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 stroke-accent" fill="none" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0 stroke-danger" fill="none" strokeWidth="2">
      <path d="M4 4l16 16M20 4L4 20" strokeLinecap="round" />
    </svg>
  );
}

export function FitSection() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <SectionHeading className="text-center">Para quem é — e para quem não é.</SectionHeading>

        <div className="mx-auto mt-10 grid max-w-4xl overflow-hidden rounded-2xl border border-border-strong sm:grid-cols-2">
          <div className="bg-[radial-gradient(140%_100%_at_20%_0%,rgba(43,201,168,0.12)_0%,rgba(0,0,0,0.3)_70%)] p-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent">
              <CheckIcon /> É para
            </h3>
            <ul className="mt-4 space-y-3 text-[15px] text-fg-muted">
              {FIT.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[radial-gradient(140%_100%_at_80%_100%,rgba(226,86,79,0.08)_0%,rgba(0,0,0,0.3)_70%)] p-8">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-fg-subtle">
              <XIcon /> Não é para
            </h3>
            <ul className="mt-4 space-y-3 text-[15px] text-fg-muted">
              {NOT_FIT.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XIcon />
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
