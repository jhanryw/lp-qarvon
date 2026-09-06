import { DepthBackground } from "@/components/ui/DepthBackground";

export function ReframeSection() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-b border-border py-20">
      <DepthBackground />
      <p className="relative z-10 mx-auto max-w-3xl text-balance px-6 text-center text-3xl font-bold uppercase tracking-tight text-fg sm:text-5xl">
        Mais tráfego não corrige uma operação ineficiente.
      </p>
    </section>
  );
}
