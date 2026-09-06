const NODES = [
  "Aquisição",
  "Criativo",
  "Oferta",
  "Atendimento",
  "Follow-up",
  "Conversão",
  "Dados",
  "Escala",
];

/** Healthy 8-node flow (Ato 6) — the "fixed" counterpart to FunnelLeakDiagram's broken one. */
export function SystemPipeline() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
      {NODES.map((label, i) => (
        <div key={label} className="flex items-center sm:flex-1 sm:flex-col sm:items-stretch">
          <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent/60 bg-accent/10 font-mono text-xs font-bold text-accent">
              {i + 1}
            </span>
            <span className="text-xs font-medium text-fg sm:text-center">{label}</span>
          </div>
          {i < NODES.length - 1 && (
            <div className="relative mx-3 h-6 w-0.5 flex-1 bg-gradient-to-b from-accent/60 to-accent/10 sm:mx-0 sm:my-2 sm:h-0.5 sm:w-full sm:bg-gradient-to-r">
              <span className="animate-travel-particle absolute left-0 top-0 size-1.5 rounded-full bg-[#8ff5da] shadow-[0_0_8px_#8ff5da] sm:top-[-2px]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
