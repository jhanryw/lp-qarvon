import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { DepthBackground } from "@/components/ui/DepthBackground";

export const metadata = { title: "Aplicação recebida — Qarvon" };

export default function ObrigadoPage() {
  return (
    <main className="relative flex flex-1 items-center overflow-hidden py-20">
      <DepthBackground scale="sm" />
      <Container className="relative z-10 mx-auto max-w-xl text-center">
        <span className="mb-6 inline-flex size-14 items-center justify-center rounded-full border border-accent/50 bg-accent/10 text-2xl text-accent">
          ✓
        </span>

        <h1 className="text-balance text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Recebemos sua aplicação.
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-fg-muted">
          Agora vamos analisar rapidamente sua operação e entraremos em contato para confirmar
          os próximos passos.
        </p>

        <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">
          Se o seu perfil estiver alinhado ao tipo de operação que atendemos, nossa equipe vai
          falar com você para entender o cenário e organizar a reunião.
        </p>

        <p className="mt-6 font-mono text-sm text-accent">
          Fique atento ao WhatsApp e às ligações nos próximos minutos.
        </p>

        <Link
          href="/"
          className="mt-10 inline-flex text-sm font-medium text-fg-muted underline underline-offset-4 hover:text-fg"
        >
          Voltar para o início
        </Link>
      </Container>
    </main>
  );
}
