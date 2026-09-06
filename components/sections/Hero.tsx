import { Container } from "@/components/ui/Container";
import { ContextualCta } from "@/components/ui/ContextualCta";
import { CrtFrame } from "@/components/ui/CrtFrame";
import { DepthBackground } from "@/components/ui/DepthBackground";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border pb-16 pt-6 sm:pb-24 sm:pt-8">
      <DepthBackground />

      <Container className="relative z-10">
        <div className="mb-6 flex items-center justify-between sm:mb-8">
          <span className="text-sm font-semibold tracking-tight text-fg">Qarvon</span>
          <a href="#aplicar-info" className="text-xs text-fg-muted underline underline-offset-4 hover:text-accent">
            Aplicar
          </a>
        </div>

        <div className="mx-auto max-w-2xl text-center animate-fade-up">
          <p className="mb-4 inline-flex items-center rounded-full border border-border-strong px-3 py-1 text-xs font-medium text-fg-muted">
            Assessoria de crescimento para varejo
          </p>

          <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl">
            Venda mais com o investimento em tráfego que você já faz.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">
            Mais tráfego não corrige uma operação ineficiente. A Qarvon corrige a operação
            primeiro — e só depois escala o investimento.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-2xl">
          <CrtFrame
            src={process.env.NEXT_PUBLIC_VSL_URL}
            title="VSL — Método QARVON"
            todoLabel="VSL institucional (TODO_CONTENT_VSL) — ver ASSET-MANIFEST.md item 1. Definir NEXT_PUBLIC_VSL_URL."
            label="QARVON.VSL // HERO"
          />
        </div>

        <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ContextualCta>Analisar minha operação</ContextualCta>
            <a
              href="#case"
              className="text-sm font-medium text-fg-muted underline underline-offset-4 hover:text-accent"
            >
              Ver o case Luzanni
            </a>
          </div>
          <p className="font-mono text-xs text-fg-subtle">Luzanni: de R$50 mil a R$210 mil por mês.</p>
        </div>
      </Container>
    </section>
  );
}
