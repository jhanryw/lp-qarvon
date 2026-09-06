/**
 * Shared atmosphere layer for every section: dot-grid + two blurred glow
 * orbs at different depths, plus grain on top. Gives dark panels depth
 * without photography we don't have. Purely decorative — sits behind
 * content at z-0, content must use `relative z-10`.
 */
import { GrainOverlay } from "./GrainOverlay";

/**
 * Not every section gets this — repeating identical background art across
 * many sections in a row reads as templated (see SELF-CRITIQUE.md #3).
 * `flip` mirrors the orb layout so consecutive uses don't look copy-pasted.
 */
export function DepthBackground({
  variant = "default",
  flip = false,
}: {
  variant?: "default" | "dim";
  flip?: boolean;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(rgba(43,201,168,0.16) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        className={`absolute -top-20 h-72 w-72 rounded-full opacity-50 blur-[60px] ${flip ? "-right-16" : "-left-16"}`}
        style={{ background: "radial-gradient(circle, #1fae90, transparent 70%)" }}
      />
      <div
        className={`absolute -bottom-16 h-64 w-64 rounded-full opacity-40 blur-[60px] ${flip ? "-left-10" : "-right-10"}`}
        style={{
          background:
            variant === "dim"
              ? "radial-gradient(circle, #1a1a1a, transparent 70%)"
              : "radial-gradient(circle, #0d6b56, transparent 70%)",
        }}
      />
      <GrainOverlay />
    </div>
  );
}
