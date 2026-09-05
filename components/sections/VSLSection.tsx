import { Container } from "@/components/ui/Container";
import { SectionEyebrow, SectionHeading } from "@/components/ui/SectionHeading";
import { VideoEmbed } from "@/components/ui/VideoEmbed";

/**
 * Institutional VSL (LP-QARVON-SPEC.md section 14 has the full script).
 * Not recorded yet — only the Luzanni/Pedro André testimonial exists today
 * (see CaseSection). Renders a dev-only placeholder and disappears in
 * production via VideoEmbed until NEXT_PUBLIC_VSL_URL is set.
 */
export function VSLSection() {
  const src = process.env.NEXT_PUBLIC_VSL_URL;

  if (!src && process.env.NODE_ENV === "production") return null;

  return (
    <section className="border-b border-border py-16 sm:py-24">
      <Container>
        <SectionEyebrow>Entenda em poucos minutos</SectionEyebrow>
        <SectionHeading>Por que mais tráfego não resolve uma operação ineficiente.</SectionHeading>
        <div className="mt-8 max-w-3xl">
          <VideoEmbed
            src={src}
            title="VSL institucional Qarvon"
            todoLabel="VSL institucional ainda não gravada — roteiro pronto em LP-QARVON-SPEC.md §14. Definir NEXT_PUBLIC_VSL_URL quando existir."
          />
        </div>
      </Container>
    </section>
  );
}
