"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
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

function SoundOffIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5 6 9H3v6h3l5 4V5z" strokeLinejoin="round" />
      <path d="M23 9l-6 6M17 9l6 6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Autoplays muted + looping the moment it scrolls into view — a moving
 * preview is more attention-grabbing than a static thumbnail. A single tap
 * anywhere "activates" it: unmutes, restarts from zero, and switches to the
 * normal single-play experience (play/pause only, no scrub/fullscreen/PiP).
 * Analytics only count real engagement — the silent ambient loop never
 * fires video_play/pause/milestones, only the activated watch-through does.
 */
export function CustomVideoPlayer({
  src,
  title,
  posterTitle,
  trackingId,
  aspectRatio = "16/9",
}: {
  src: string;
  title: string;
  posterTitle?: string;
  trackingId: string;
  /** CSS aspect-ratio value, e.g. "16/9" (landscape) or "9/16" (vertical/story). Must match the source file's real dimensions or the video gets cropped/stretched by object-cover. */
  aspectRatio?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const firedRef = useRef<Set<string>>(new Set());
  const isActivatedRef = useRef(false);
  const justActivatedRef = useRef(false);

  const [isActivated, setIsActivated] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Silent ambient preview: play while visible, pause once scrolled away —
  // only before activation. After activation, playback is fully manual.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.5,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isActivated) return;
    const video = videoRef.current;
    if (!video) return;
    if (isInView) {
      video.muted = true;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView, isActivated]);

  function fireOnce(key: string, eventName: string) {
    if (firedRef.current.has(key)) return;
    firedRef.current.add(key);
    trackEvent(eventName, { content_name: trackingId });
  }

  function handleActivate() {
    const video = videoRef.current;
    if (!video || isActivatedRef.current) return;
    isActivatedRef.current = true;
    justActivatedRef.current = true;
    video.muted = false;
    video.loop = false;
    video.currentTime = 0;
    setIsActivated(true);
    video.play().catch(() => {});
    trackEvent("video_play", { content_name: trackingId });
  }

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function handleClick() {
    if (!isActivatedRef.current) {
      handleActivate();
    } else {
      togglePlay();
    }
  }

  function handlePlay() {
    setIsPlaying(true);
    if (!isActivatedRef.current) return; // muted ambient loop — not engagement
    if (justActivatedRef.current) {
      // Already tracked in handleActivate — this is that same transition,
      // if the browser even fires a redundant "play" for it.
      justActivatedRef.current = false;
      return;
    }
    trackEvent("video_play", { content_name: trackingId });
  }

  function handlePause() {
    setIsPlaying(false);
    if (!isActivatedRef.current) return; // our own pause-when-scrolled-away, not the user
    const video = videoRef.current;
    // Don't double-fire pause right at natural completion — "ended" covers that.
    if (video && video.duration && video.currentTime >= video.duration - 0.25) return;
    trackEvent("video_pause", { content_name: trackingId });
  }

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);

    if (!isActivatedRef.current) return; // don't count milestones during the silent loop
    const pct = (video.currentTime / video.duration) * 100;
    for (const milestone of MILESTONES) {
      if (pct >= milestone) fireOnce(`m${milestone}`, `video_${milestone}`);
    }
  }

  function handleEnded() {
    setIsPlaying(false);
    if (!isActivatedRef.current) return; // loop=true during preview, shouldn't reach here anyway
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
      ref={containerRef}
      className="group relative w-full cursor-pointer select-none overflow-hidden rounded-xl bg-black"
      style={{ aspectRatio }}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      role="button"
      tabIndex={0}
      aria-label={!isActivated ? `Ativar som: ${title}` : isPlaying ? `Pausar: ${title}` : `Assistir: ${title}`}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleClick();
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
        muted={!isActivated}
        loop={!isActivated}
        preload="metadata"
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Legibility scrim + caption while still in silent-preview mode. */}
      {!isActivated && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-4 sm:p-6">
          {posterTitle && (
            <p className="max-w-xs text-sm font-medium leading-snug text-fg sm:text-base">{posterTitle}</p>
          )}
        </div>
      )}

      {/* Control: "ativar som" pill while muted, play/pause icon once activated. */}
      {!isActivated ? (
        <div className="pointer-events-none absolute inset-0 m-auto flex h-fit w-fit items-center gap-2 rounded-full border border-accent/60 bg-black/50 px-4 py-2.5 text-accent backdrop-blur-sm transition-transform duration-300 group-hover:scale-105">
          <SoundOffIcon className="size-5 shrink-0" />
          <span className="whitespace-nowrap text-sm font-medium">Ativar som</span>
        </div>
      ) : (
        <div
          className={`pointer-events-none absolute flex items-center justify-center rounded-full border border-accent/60 bg-black/40 text-accent backdrop-blur-sm transition-all duration-300 ${
            isPlaying
              ? "bottom-4 left-4 size-9 opacity-70 group-hover:opacity-100"
              : "inset-0 m-auto size-16 opacity-100 group-hover:scale-105 sm:size-20"
          }`}
        >
          {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="ml-1 size-7 sm:size-9" />}
        </div>
      )}

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
