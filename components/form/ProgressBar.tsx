export function ProgressBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  const percent = Math.round(((step + 1) / totalSteps) * 100);

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-fg-subtle">
        <span>
          Etapa {step + 1} de {totalSteps}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-elevated-2">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
