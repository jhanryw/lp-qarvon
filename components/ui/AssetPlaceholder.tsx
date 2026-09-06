/**
 * Stands in for a real photo/screenshot before it exists, at the right
 * aspect ratio and visual weight — so the page reads as "produced" even
 * before assets land, without ever pretending to be a real photo (see
 * SELF-CRITIQUE.md #6). A small "ativo pendente" tag keeps it honest;
 * everything else is abstract shape, never a fabricated face or screen.
 */
type Kind = "photo" | "dashboard" | "chat" | "creative-grid";

function PhotoAbstract() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(60% 50% at 50% 38%, rgba(43,201,168,0.16) 0%, transparent 70%), radial-gradient(80% 60% at 50% 100%, rgba(43,201,168,0.1) 0%, transparent 70%)",
      }}
    />
  );
}

function DashboardAbstract() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="size-1.5 rounded-full bg-white/20" />
        <span className="size-1.5 rounded-full bg-white/20" />
        <span className="size-1.5 rounded-full bg-white/20" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 p-4">
        {[80, 55, 68, 40].map((w, i) => (
          <span key={i} className="h-2 rounded-full bg-accent/15" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

function ChatAbstract() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 p-4">
      <span className="h-6 w-2/3 self-start rounded-2xl rounded-bl-sm bg-white/10" />
      <span className="h-6 w-1/2 self-end rounded-2xl rounded-br-sm bg-accent/20" />
      <span className="h-6 w-3/5 self-start rounded-2xl rounded-bl-sm bg-white/10" />
    </div>
  );
}

function CreativeGridAbstract() {
  return (
    <div className="absolute inset-0 grid grid-cols-3 gap-1 p-2">
      {[...Array(6)].map((_, i) => (
        <span key={i} className="rounded-sm bg-accent/10" />
      ))}
    </div>
  );
}

const ABSTRACTS: Record<Kind, () => ReturnType<typeof PhotoAbstract>> = {
  photo: PhotoAbstract,
  dashboard: DashboardAbstract,
  chat: ChatAbstract,
  "creative-grid": CreativeGridAbstract,
};

export function AssetPlaceholder({
  kind,
  aspect = "4/5",
  label,
  className = "",
}: {
  kind: Kind;
  aspect?: string;
  label: string;
  className?: string;
}) {
  const Abstract = ABSTRACTS[kind];

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className={`overflow-hidden rounded-2xl border border-border-strong bg-bg-elevated ${className}`}>
      <div className="relative" style={{ aspectRatio: aspect }}>
        <Abstract />
        <span className="absolute right-2 top-2 rounded-full border border-dashed border-fg-subtle/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-fg-subtle">
          ativo pendente
        </span>
      </div>
      <p className="border-t border-border px-3 py-2 text-[11px] leading-snug text-fg-subtle">{label}</p>
    </div>
  );
}
