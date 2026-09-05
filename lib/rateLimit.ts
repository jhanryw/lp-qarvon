/**
 * Best-effort in-memory rate limit. Resets on cold start / across serverless
 * instances, so it's a spam speed-bump, not a guarantee — fine for a single
 * lead-gen form endpoint. Swap for a shared store (Upstash/Redis) if abuse
 * becomes an issue in production.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > MAX_REQUESTS_PER_WINDOW;
}
