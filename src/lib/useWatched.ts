import { useEffect, useState, useCallback } from "react";

const KEY = "wc2026:watched:v1";

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function write(set: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
}

export function useWatched() {
  const [watched, setWatched] = useState<Set<string>>(() => new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setWatched(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setWatched(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggle = useCallback((id: string) => {
    setWatched((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setWatched(new Set());
    write(new Set());
  }, []);

  return { watched, toggle, reset, ready };
}
