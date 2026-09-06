"use client";

import { useRef, useState, type MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";

const MILESTONES = [25, 50, 75] as const;

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

/**
 * Play/pause only, no scrub. Native controls are off — everything here is
 * a deliberate re-implementation, not a styled version of the browser's
 * own video UI. See the request that introduced this: no seek, no
 * fullscreen, no PiP, no playback-rate menu — just watch it.
 */
export function CustomVideoPlayer({
  src,
  title,
  posterEyebrow,
  posterTitle,
  trackingId,
  aspectRatio = "16/9",
}: {
  src: string;
  title: string;
  posterEyebrow?: string;
  posterTitle?: string;
  trackingId: string;
  /** CSS aspect-ratio value, e.g. "16/9" (landscape) or "9/16" (vertical/story). Must match the source file's real dimensions or the video gets cropped/stretched by object-cover. */
  aspectRatio?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const firedRef = useRef<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  function fireOnce(key: string, eventName: string) {
    if (firedRef.current.has(key)) return;
    firedRef.current.add(key);
    trackEvent(eventName, { content_name: trackingId });
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function handlePlay() {
    setIsPlaying(true);
    setHasStarted(true);
    trackEvent("video_play", { content_name: trackingId });
  }

  function handlePause() {
    setIsPlaying(false);
    const video = videoRef.current;
    // Don't double-fire pause right at natural completion — "ended" covers that.
    if (video && video.duration && video.currentTime >= video.duration - 0.25) return;
    trackEvent("video_pause", { content_name: trackingId });
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const pct = (video.currentTime / video.duration) * 100;
    setProgress(pct);

    for (const milestone of MILESTONES) {
      if (pct >= milestone) fireOnce(`m${milestone}`, `video_${milestone}`);
    }
  }

  function handleEnded() {
    setIsPlaying(false);
    setProgress(100);
    fireOnce("complete", "video_complete");
  }

  function handleContextMenu(e: MouseEvent) {
    // UX layer only — a determined visitor can still save the file. This
    // just keeps the right-click menu from breaking the custom-player
    // illusion, it's not a download-prevention mechanism.
    e.preventDefault();
  }

  function handleDoubleClick(e: MouseEvent) {
    // Some browsers fullscreen a <video> on double-click even without the
    // native controls attribute — block that explicitly.
    e.preventDefault();
  }

  return (
    <div
      className="group relative w-full cursor-pointer select-none overflow-hidden rounded-xl bg-black"
      style={{ aspectRatio }}
      onClick={togglePlay}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? `Pausar: ${title}` : `Assistir: ${title}`}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          togglePlay();
        }
      }}
    >
      <video
        ref={videoRef}
        src={src}
        title={title}
        className="h-full w-full object-cover"
        controls={false}
        controlsList="nodownload noplaybackrate nofullscreen"
        disablePictureInPicture
        disableRemotePlayback
        playsInline
        preload="metadata"
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Pre-play cover: cinematic placeholder until a real poster frame exists. */}
      {!hasStarted && (
        <div
          aria-hidden={hasStarted}
          className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(120%_100%_at_50%_0%,#123229_0%,#050605_75%)] p-4 transition-opacity duration-300 sm:p-6"
        >
          {posterEyebrow ? (
            <span className="self-start rounded-full border border-accent/50 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-accent">
              {posterEyebrow}
            </span>
          ) : (
            <span />
          )}
          {posterTitle ? (
            <p className="max-w-xs text-sm font-medium leading-snug text-fg sm:text-base">{posterTitle}</p>
          ) : (
            <span />
          )}
        </div>
      )}

      {/* Play/pause control: large + centered while paused, small + corner while playing. */}
      <div
        className={`pointer-events-none absolute flex items-center justify-center rounded-full border border-accent/60 bg-black/40 text-accent backdrop-blur-sm transition-all duration-300 ${
          isPlaying
            ? "bottom-4 left-4 size-9 opacity-70 group-hover:opacity-100"
            : "inset-0 m-auto size-16 opacity-100 group-hover:scale-105 sm:size-20"
        }`}
      >
        {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="ml-1 size-7 sm:size-9" />}
      </div>

      {/* Progress bar: informative only, never a seek control. */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
        <div
          className="h-full bg-accent transition-[width] duration-200 ease-linear"
          style={{ width: `${progress}%`, boxShadow: "0 0 8px rgba(43,201,168,0.7)" }}
        />
      </div>
    </div>
  );
}
