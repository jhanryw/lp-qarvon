import { Container } from "@/components/ui/Container";

export function FinalCtaSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="rounded-3xl border border-accent/30 bg-accent/[0.06] p-8 text-center sm:p-14">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            Antes de colocar mais dinheiro em mídia, descubra quanto sua operação atual ainda pode
            entregar.
          </h2>
          <a
            href="#aplicar"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full bg-accent px-7 py-3 text-[15px] font-semibold text-[#08110f] transition-colors hover:bg-accent-strong"
          >
            Quero aplicar para o diagnóstico
          </a>
        </div>
      </Container>
    </section>
  );
}
