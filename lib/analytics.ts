declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Thin wrapper over the Meta Pixel already loaded in app/layout.tsx — the
 * only analytics layer this project has. Custom events (video_play, etc.)
 * go through `trackCustom` so they never collide with standard Pixel events
 * like the "Lead" one fired in components/form/LeadForm.tsx.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.fbq?.("trackCustom", eventName, params);
}
