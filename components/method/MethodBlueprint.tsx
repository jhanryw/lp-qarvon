import type { ReactNode } from "react";

/**
 * Distinct "technical drawing" chrome for the Método QARVON pipeline —
 * deliberately NOT the monitor/CRT bezel used for real video (CrtFrame).
 * Reusing that bezel here would be decoration without function (nothing is
 * being "played"); this is a diagram, so it gets a blueprint treatment
 * instead: thin grid, corner crop marks, a title block. See SELF-CRITIQUE.md.
 */
export function MethodBlueprint({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative rounded-2xl border border-accent/25 bg-bg-elevated/50 p-6 sm:p-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(43,201,168,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(43,201,168,0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      {[
        "left-3 top-3 border-l border-t",
        "right-3 top-3 border-r border-t",
        "left-3 bottom-3 border-l border-b",
        "right-3 bottom-3 border-r border-b",
      ].map((pos) => (
        <span key={pos} className={`absolute size-3 border-accent/50 ${pos}`} aria-hidden />
      ))}

      <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        Método QARVON — sistema proprietário
      </p>

      {children}
    </div>
  );
}
