export function RadioCardGroup({
  name,
  options,
  value,
  onChange,
  columns = 1,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  columns?: 1 | 2;
}) {
  return (
    <div
      className={`grid gap-2 ${columns === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}
      role="radiogroup"
    >
      {options.map((option) => {
        const checked = value === option;
        return (
          <label
            key={option}
            className={`flex min-h-[44px] cursor-pointer items-center rounded-xl border px-4 py-3 text-sm transition-colors ${
              checked
                ? "border-accent bg-accent/10 text-fg"
                : "border-border-strong bg-bg-elevated text-fg-muted hover:border-accent/40"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={checked}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option}
          </label>
        );
      })}
    </div>
  );
}
