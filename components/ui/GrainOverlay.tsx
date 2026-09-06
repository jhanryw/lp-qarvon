/**
 * Film-grain texture, not decoration: it's what makes flat dark panels read
 * as "produced" instead of "CSS gradient". Pure SVG noise, no image asset.
 */
export function GrainOverlay({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        opacity,
        mixBlendMode: "overlay",
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='90' height='90' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}
