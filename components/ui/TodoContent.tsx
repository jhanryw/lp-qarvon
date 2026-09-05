import type { ReactNode } from "react";

/**
 * Wraps content that depends on a real asset we don't have yet (final VSL,
 * client logos, screenshots, privacy policy copy, etc — see
 * LP-QARVON-SPEC.md section 17). Renders a clearly-marked placeholder in
 * development and disappears entirely in production so nothing fabricated
 * ever ships. Once the real asset exists, replace the call site instead of
 * removing this wrapper.
 */
export function TodoContent({ label, children }: { label: string; children?: ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="rounded-xl border border-dashed border-danger/50 bg-danger/5 p-4 text-sm text-danger">
      <p className="font-semibold uppercase tracking-wide">TODO_CONTENT: {label}</p>
      {children ? <div className="mt-2 text-fg-muted">{children}</div> : null}
    </div>
  );
}
