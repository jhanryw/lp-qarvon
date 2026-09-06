import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { CrtFrame } from "@/components/ui/CrtFrame";
import { AnimatedLineChart } from "@/components/ui/AnimatedLineChart";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";
import { ContextualCta } from "@/components/ui/ContextualCta";

const CHAPTERS = [
  {
    n: "01",
    title: "O cenário",
    text: "Luzanni já investia em tráfego pago, varejo físico com atacado. O crescimento tinha parado.",
  },
  {
    n: "02",
    title: "Onde estava o gargalo",
    text: "Mídia rodando sem clareza de onde a operação perdia venda entre o anúncio e o fechamento.",
  },
  {
    n: "03",
    title: "O que mudamos",
    text: "Campanhas reestruturadas, processo comercial revisado, atendimento e follow-up organizados.",
  },
  {
    n: "04",
    title: "O que validamos",
    text: "Cada mudança testada com dado real antes de aumentar investimento.",
  },
  {
    n: "05",
    title: "A escala",
    text: "Investimento cresceu só depois de a operação provar que aguentava mais demanda.",
  },
  {
    n: "06",
    title: "O resultado",
    text: "R$210 mil de faturamento mensal. Pedro André confirma no vídeo.",
  },
] as const;

export function CaseSection() {
  return (
    <section id="case" className="scroll-mt-8 border-b border-border py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>Mini-documentário</SectionEyebrow>
          <SectionHeading>Luzanni: por dentro dos meses que levaram de R$50 mil a R$210 mil.</SectionHeading>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-6">
            <CrtFrame
              src={process.env.NEXT_PUBLIC_CASE_VIDEO_URL}
              title="Depoimento de Pedro André — Luzanni"
              todoLabel="Vídeo de depoimento (Pedro André / Luzanni) — ASSET-MANIFEST.md item 2. Definir NEXT_PUBLIC_CASE_VIDEO_URL."
              label="QARVON.CASE // LUZANNI"
            />
            <div className="rounded-2xl border border-border-strong bg-bg-elevated/60 p-6">
              <AnimatedLineChart startLabel="R$50 mil/mês" endLabel="R$210 mil/mês" />
            </div>
            <AssetPlaceholder
              kind="dashboard"
              aspect="16/10"
              label="Print real do Meta Ads Manager da Luzanni (ASSET-MANIFEST.md item 8), comparando período antes/depois."
            />
          </div>

          <ol className="flex flex-col gap-6">
            {CHAPTERS.map((c) => (
              <li key={c.n} className="border-l-2 border-accent/40 pl-5">
                <span className="font-mono text-xs text-accent">{c.n}</span>
                <h3 className="text-base font-semibold text-fg">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{c.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-fg-subtle">
          Resultados variam de acordo com o histórico, a estrutura e o mercado de cada operação.
        </p>

        <div className="mt-8 text-center">
          <ContextualCta>Aplicar para o Método QARVON</ContextualCta>
        </div>
      </Container>
    </section>
  );
}
