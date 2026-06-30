import { useCallback, useEffect, useState } from "react";
import { MATCHES, type Match } from "./matches";
import { fetchLiveMatches } from "./matchesSource";

const CACHE_KEY = "wc2026:matches:v1";

type CacheShape = {
  fetchedAt: number;
  matches: Match[];
};

export type RefreshState = "idle" | "loading" | "ok" | "error";

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>(MATCHES);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [state, setState] = useState<RefreshState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Hydrate from cache on mount
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CACHE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CacheShape;
      if (Array.isArray(parsed?.matches) && parsed.matches.length > 0) {
        setMatches(parsed.matches);
        setFetchedAt(parsed.fetchedAt ?? null);
      }
    } catch {}
  }, []);

  const refresh = useCallback(async () => {
    setState("loading");
    setError(null);
    try {
      const next = await fetchLiveMatches();
      const stamp = Date.now();
      setMatches(next);
      setFetchedAt(stamp);
      try {
        window.localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ fetchedAt: stamp, matches: next } satisfies CacheShape),
        );
      } catch {}
      setState("ok");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refresh");
      setState("error");
    }
  }, []);

  return { matches, fetchedAt, refresh, state, error };
}
