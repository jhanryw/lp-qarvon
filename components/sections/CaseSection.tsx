import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { VideoEmbed } from "@/components/ui/VideoEmbed";
import { TodoContent } from "@/components/ui/TodoContent";

export function CaseSection() {
  return (
    <section id="case" className="scroll-mt-8 border-b border-border py-16 sm:py-24">
      <Container>
        <SectionEyebrow>Case real</SectionEyebrow>
        <SectionHeading>Luzanni: de R$50 mil a R$210 mil de faturamento mensal.</SectionHeading>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <VideoEmbed
              src={process.env.NEXT_PUBLIC_CASE_VIDEO_URL}
              title="Depoimento de Pedro André sobre o case Luzanni"
              todoLabel="Vídeo de depoimento (Pedro André / Luzanni) — falta URL final. Definir NEXT_PUBLIC_CASE_VIDEO_URL em .env.local (mp4 hospedado ou embed de YouTube/Vimeo não-listado)."
            />
            <p className="mt-3 text-sm text-fg-subtle">
              Pedro André, à frente da Luzanni, sobre a correção do tráfego pago e da operação
              comercial da loja.
            </p>
          </div>

          <div>
            <div className="overflow-hidden rounded-2xl border border-border-strong">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-bg-elevated-2 text-left text-fg-muted">
                    <th className="px-4 py-3 font-medium">Indicador</th>
                    <th className="px-4 py-3 font-medium">Antes</th>
                    <th className="px-4 py-3 font-medium">Depois</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 text-fg-muted">Faturamento mensal</td>
                    <td className="px-4 py-3 text-fg">R$50 mil</td>
                    <td className="px-4 py-3 font-semibold text-accent">R$210 mil</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="px-4 py-3 text-fg-muted">Período</td>
                    <td colSpan={2} className="px-4 py-3">
                      <TodoContent label="Datas do case Luzanni (início/fim do período medido) — confirmar antes de publicar." />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-3 text-[15px] leading-relaxed text-fg-muted">
              <p>
                A Luzanni já investia em tráfego pago, mas o crescimento tinha esbarrado num teto:
                mídia rodando sem clareza de onde a operação perdia venda entre o anúncio e o
                fechamento.
              </p>
              <p>
                A Qarvon aplicou o Método QARVON — qualificação da operação, análise de aquisição
                e conversão, reestruturação de campanhas e processo comercial, validação com dados
                reais antes de escalar o investimento.
              </p>
              <p className="text-sm text-fg-subtle">
                Resultados variam de acordo com o histórico, a estrutura e o mercado de cada
                operação. O case acima reflete os números reais da Luzanni.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
