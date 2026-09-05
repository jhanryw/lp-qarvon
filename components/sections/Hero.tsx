"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/form/LeadForm";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border pt-10 pb-16 sm:pt-16 sm:pb-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex items-center rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-fg-muted">
              Assessoria de crescimento para varejo
            </p>

            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl lg:text-[3.25rem]">
              Aumente as vendas da sua loja sem investir mais em tráfego pago.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
              A Qarvon identifica onde sua operação perde vendas, corrige os gargalos entre
              anúncio, atendimento e conversão — e só depois escala o investimento com o Método
              QARVON.
            </p>

            <p className="mt-4 max-w-xl text-sm text-fg-subtle">
              Para operações de varejo que já faturam, têm equipe e querem extrair mais do
              investimento atual antes de simplesmente colocar mais dinheiro em mídia.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                type="button"
                onClick={() =>
                  document.getElementById("nome")?.focus({ preventScroll: false })
                }
              >
                Quero analisar minha operação
              </Button>
              <a
                href="#case"
                className="text-sm font-medium text-fg-muted underline underline-offset-4 hover:text-accent"
              >
                Ver o case primeiro
              </a>
            </div>

            <p className="mt-3 text-xs text-fg-subtle">
              Aplicação rápida · sem compromisso · para donos e decisores
            </p>
          </div>

          <div id="aplicar" className="lg:sticky lg:top-8">
            <LeadForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
