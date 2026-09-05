import type { ReactNode } from "react";

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
      {children}
    </p>
  );
}

export function SectionHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}
