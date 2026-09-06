import { CustomVideoPlayer } from "./CustomVideoPlayer";

/**
 * Renders a video from an env-provided URL (mp4 file or YouTube/Vimeo embed
 * link) at the given aspect ratio — must match the source file's real
 * dimensions (16:9 landscape vs. 9:16 vertical/story) or object-cover will
 * crop/zoom it wrong. Falls back to a poster-style placeholder in
 * development (never a red "error box" — see SELF-CRITIQUE.md #6) and
 * disappears entirely in production when the URL isn't configured, so the
 * page never ships a broken or fabricated player. Direct file sources get
 * the fully custom play/pause/progress player (no native controls) —
 * iframes (a hosted VSL, say) keep the provider's own player, since we
 * can't strip an iframe's native controls or read its playback state
 * without their SDK.
 */
export function VideoEmbed({
  src,
  title,
  todoLabel,
  posterTitle,
  trackingId,
  aspectRatio = "16/9",
}: {
  src: string | undefined;
  title: string;
  todoLabel: string;
  posterTitle?: string;
  trackingId?: string;
  aspectRatio?: string;
}) {
  if (!src) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        className="relative flex w-full items-center justify-center rounded-2xl bg-[radial-gradient(120%_100%_at_50%_0%,#123229_0%,#050605_70%)]"
        style={{ aspectRatio }}
      >
        <span className="flex size-14 items-center justify-center rounded-full border border-accent/50 bg-accent/10 text-accent">
          ▶
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-dashed border-fg-subtle/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-fg-subtle">
          ativo pendente
        </span>
        <p className="absolute inset-x-4 bottom-3 text-center text-[11px] leading-snug text-fg-subtle">
          {todoLabel}
        </p>
      </div>
    );
  }

  const isDirectFile = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border-strong bg-bg-elevated">
      {isDirectFile ? (
        <CustomVideoPlayer
          src={src}
          title={title}
          posterTitle={posterTitle}
          trackingId={trackingId ?? title}
          aspectRatio={aspectRatio}
        />
      ) : (
        <iframe
          className="w-full"
          style={{ aspectRatio }}
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
