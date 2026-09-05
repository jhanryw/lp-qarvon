import { TodoContent } from "./TodoContent";

/**
 * Renders a 16:9 video from an env-provided URL (mp4 file or YouTube/Vimeo
 * embed link). Falls back to a TODO_CONTENT placeholder in development and
 * disappears in production when the URL isn't configured yet, so the page
 * never ships a broken or fabricated player.
 */
export function VideoEmbed({
  src,
  title,
  todoLabel,
}: {
  src: string | undefined;
  title: string;
  todoLabel: string;
}) {
  if (!src) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-border-strong bg-bg-elevated p-4">
        <TodoContent label={todoLabel} />
      </div>
    );
  }

  const isDirectFile = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border-strong bg-bg-elevated">
      {isDirectFile ? (
        <video className="h-full w-full" controls playsInline preload="metadata" title={title}>
          <source src={src} />
        </video>
      ) : (
        <iframe
          className="h-full w-full"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}
