import { VideoEmbed } from "./VideoEmbed";

/**
 * Monitor/console bezel around a real video (VSL or testimonial). This is
 * the single "expensive-looking" treatment reused everywhere we show the
 * one real video asset we have — consistency here reads as "system", not
 * just a styled <video> tag.
 */
export function CrtFrame({
  src,
  title,
  todoLabel,
  label,
}: {
  src: string | undefined;
  title: string;
  todoLabel: string;
  label: string;
}) {
  return (
    <div className="rounded-[26px] bg-black p-3 shadow-[0_0_0_1px_rgba(43,201,168,0.3),0_24px_70px_rgba(0,0,0,0.55)]">
      <div className="relative overflow-hidden rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#123229_0%,#050605_70%)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-4 top-3 z-10 font-mono text-[10px] tracking-wide text-fg-subtle">
          {label}
        </div>
        <VideoEmbed src={src} title={title} todoLabel={todoLabel} />
      </div>
      <div className="mt-3 flex justify-center gap-2.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2.5 rounded-full border border-white/15"
            style={{ background: "radial-gradient(circle at 35% 30%, #333, #0a0a0a)" }}
          />
        ))}
      </div>
    </div>
  );
}
