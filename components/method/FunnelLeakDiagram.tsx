const STAGES = ["Criativo", "Cliques", "WhatsApp / Site", "Atendimento", "Follow-up", "Venda"];

/** Narrowing funnel with a leak indicator at each transition (Ato 2). */
export function FunnelLeakDiagram() {
  return (
    <div className="mx-auto flex max-w-md flex-col">
      {STAGES.map((stage, i) => {
        const widthPct = 100 - i * 10;
        return (
          <div key={stage}>
            <div
              className="mx-auto flex h-12 items-center justify-center rounded-lg border border-accent/40 bg-accent/[0.06] text-sm font-medium text-fg"
              style={{ width: `${widthPct}%` }}
            >
              {stage}
            </div>
            {i < STAGES.length - 1 && (
              <div className="relative flex justify-center py-2">
                <svg width="16" height="20" viewBox="0 0 16 20" className="text-danger/70">
                  <path d="M8 0v14M3 10l5 6 5-6" stroke="currentColor" strokeWidth="1.6" fill="none" />
                </svg>
                <span className="absolute left-1/2 top-0 ml-3 whitespace-nowrap font-mono text-[10px] text-danger/80">
                  vazamento
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
