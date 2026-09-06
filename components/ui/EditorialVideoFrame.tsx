import type { ReactNode } from "react";

/**
 * Restrained frame for real, premium proof footage — thin border, soft
 * shadow, a small "CASE REAL" label. Deliberately not the monitor/CRT bezel
 * (CrtFrame) used for the still-unrecorded VSL: that device chrome is a
 * fitting metaphor for a system-in-progress, but overkill/gimmicky for
 * footage that's simply real and doesn't need dramatizing. See the request
 * that introduced this: "evitar estética cyberpunk exagerada".
 */
export function EditorialVideoFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-accent/50 bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-accent backdrop-blur-sm">
        {label}
      </span>
      {children}
    </div>
  );
}
