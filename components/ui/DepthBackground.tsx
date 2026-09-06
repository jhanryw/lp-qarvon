/**
 * Shared atmosphere layer for the page's few "moment" sections (hero,
 * reframe, final CTA) — a soft single-source vignette + two blurred glow
 * orbs. No repeating pattern: the previous version had an 18px dot-grid
 * tiled across the whole section, which at that scale reads as "the same
 * image repeated hundreds of times" rather than atmosphere. Purely
 * decorative — sits behind content at z-0, content must use `relative z-10`.
 */
import { GrainOverlay } from "./GrainOverlay";

/**
 * Deliberately used sparingly (see SELF-CRITIQUE.md #3) — most sections get
 * a plain background so these few stay distinctive instead of reading as
 * default section wallpaper. `flip` mirrors the layout and `scale` varies
 * size/intensity so repeat uses don't look like the exact same asset
 * copy-pasted down the page.
 */
export function DepthBackground({
  variant = "default",
  flip = false,
  scale = "lg",
}: {
  variant?: "default" | "dim";
  flip?: boolean;
  scale?: "lg" | "sm";
}) {
  const isLarge = scale === "lg";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 ${isLarge ? "opacity-70" : "opacity-40"}`}
        style={{
          background: `radial-gradient(${isLarge ? "70% 60%" : "50% 40%"} at ${flip ? "70%" : "30%"} 0%, rgba(43,201,168,0.14) 0%, transparent 65%)`,
        }}
      />
      <div
        className={`absolute rounded-full blur-[60px] ${isLarge ? "h-72 w-72 opacity-50" : "h-48 w-48 opacity-35"} -top-20 ${flip ? "-right-16" : "-left-16"}`}
        style={{ background: "radial-gradient(circle, #1fae90, transparent 70%)" }}
      />
      <div
        className={`absolute rounded-full blur-[60px] ${isLarge ? "h-64 w-64 opacity-40" : "h-40 w-40 opacity-25"} -bottom-16 ${flip ? "-left-10" : "-right-10"}`}
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
