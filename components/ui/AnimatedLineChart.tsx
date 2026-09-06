/**
 * Draws a smooth curve between exactly two real data points (never more —
 * we don't have intermediate figures, so we don't imply a fabricated
 * week-by-week trajectory). The animation is the "quebra visual", not a
 * claim about the shape of the path in between.
 */
export function AnimatedLineChart({
  startLabel,
  endLabel,
}: {
  startLabel: string;
  endLabel: string;
}) {
  return (
    <div>
      <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="h-20 w-full">
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2bc9a8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2bc9a8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,68 C110,68 160,20 300,8 L300,80 L0,80 Z" fill="url(#chart-fill)" />
        <path
          d="M0,68 C110,68 160,20 300,8"
          fill="none"
          stroke="#2bc9a8"
          strokeWidth="3"
          strokeLinecap="round"
          className="animate-draw-line"
          style={{ filter: "drop-shadow(0 0 6px rgba(43,201,168,0.6))" }}
        />
      </svg>
      <div className="mt-1 flex justify-between font-mono text-[11px] text-fg-subtle">
        <span>{startLabel}</span>
        <span className="text-accent">{endLabel}</span>
      </div>
    </div>
  );
}
