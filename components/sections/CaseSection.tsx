import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { EditorialVideoFrame } from "@/components/ui/EditorialVideoFrame";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { AnimatedLineChart } from "@/components/ui/AnimatedLineChart";
import { AssetPlaceholder } from "@/components/ui/AssetPlaceholder";
import { ContextualCta } from "@/components/ui/ContextualCta";

const CASE_VIDEO_SRC = process.env.NEXT_PUBLIC_CASE_VIDEO_URL || "/videos/depoimento-pedro-andre.mp4";

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
    text: "Confirmado por Pedro André, no vídeo acima.",
  },
] as const;

export function CaseSection() {
  return (
    <section id="case" className="scroll-mt-8 border-b border-border py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>O case</SectionEyebrow>
          <SectionHeading>Luzanni: por dentro dos meses que levaram de R$50 mil a R$210 mil.</SectionHeading>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-6">
            {/* Source is a vertical/story-format recording (1080×1920, 9:16) —
                capped width so it doesn't turn into an oversized column on
                desktop once sized at its real aspect ratio instead of a
                cropped 16:9. */}
            <div className="mx-auto w-full max-w-[300px] sm:max-w-[340px]">
              <EditorialVideoFrame label="Case real">
                <VideoEmbed
                  src={CASE_VIDEO_SRC}
                  title="Depoimento de Pedro André — Luzanni"
                  todoLabel="Vídeo de depoimento (Pedro André / Luzanni) — ASSET-MANIFEST.md item 2."
                  posterEyebrow="Case real"
                  posterTitle="Como uma operação de varejo rompeu um teto de crescimento."
                  trackingId="pedro_andre_testimonial"
                  aspectRatio="9/16"
                />
              </EditorialVideoFrame>
            </div>

            <div>
              <p className="text-[15px] leading-relaxed text-fg-muted">
                Esse é um exemplo real de como uma operação de varejo respondeu depois que
                aquisição, atendimento e conversão passaram a ser analisados como um único
                sistema.
              </p>
              <div className="mt-4">
                <ContextualCta>Quero analisar minha operação</ContextualCta>
              </div>
            </div>

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
      </Container>
    </section>
  );
}
