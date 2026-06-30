import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { STAGES, type Match, type Stage } from "@/lib/matches";
import { useWatched } from "@/lib/useWatched";
import { useMatches, type RefreshState } from "@/lib/useMatches";
import { flagUrl, flagSrcSet } from "@/lib/flags";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "World Cup 2026 — Watched Tracker" },
      { name: "description", content: "Mark off every FIFA World Cup 2026 match. 104 fixtures, your local time, saved on your device." },
    ],
  }),
  component: HomePage,
});

type Filter = "all" | "watched" | "unwatched" | "upcoming";
type TZ = "local" | "UTC";
const PREFS_KEY = "wc2026:prefs:v1";

type Prefs = {
  filter: Filter;
  stage: Stage | "All";
  query: string;
  tz: TZ;
};

const DEFAULT_PREFS: Prefs = { filter: "all", stage: "All", query: "", tz: "local" };

function HomePage() {
  const { watched, toggle, reset, ready } = useWatched();
  const { matches: MATCHES, fetchedAt, refresh, state: refreshState, error: refreshError } = useMatches();
  // Start from defaults on both server and first client render to avoid SSR hydration mismatch.
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [prefsReady, setPrefsReady] = useState(false);
  const [localTz, setLocalTz] = useState("Local");
  const [now, setNow] = useState(() => Date.now());

  // Hydrate persisted prefs + resolve local timezone on the client only
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Prefs>;
        setPrefs({
          filter: (["all", "watched", "unwatched", "upcoming"] as const).includes(parsed.filter as Filter)
            ? (parsed.filter as Filter)
            : "all",
          stage: parsed.stage && (parsed.stage === "All" || (STAGES as readonly string[]).includes(parsed.stage))
            ? (parsed.stage as Stage | "All")
            : "All",
          query: typeof parsed.query === "string" ? parsed.query : "",
          tz: parsed.tz === "UTC" ? "UTC" : "local",
        });
      }
    } catch {}
    try {
      setLocalTz(Intl.DateTimeFormat().resolvedOptions().timeZone || "Local");
    } catch {}
    setPrefsReady(true);
  }, []);

  // Persist prefs whenever they change (after hydration)
  useEffect(() => {
    if (!prefsReady) return;
    try { window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch {}
  }, [prefs, prefsReady]);

  const { filter, stage, query, tz } = prefs;
  const setFilter = (filter: Filter) => setPrefs((p) => ({ ...p, filter }));
  const setStage = (stage: Stage | "All") => setPrefs((p) => ({ ...p, stage }));
  const setQuery = (query: string) => setPrefs((p) => ({ ...p, query }));
  const setTz = (tz: TZ) => setPrefs((p) => ({ ...p, tz }));

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);


  const filtered = useMemo(() => {
    return MATCHES.filter((m) => {
      if (stage !== "All" && m.stage !== stage) return false;
      const isW = watched.has(m.id);
      if (filter === "watched" && !isW) return false;
      if (filter === "unwatched" && isW) return false;
      if (filter === "upcoming" && new Date(m.kickoffUTC).getTime() < now) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !m.teamA.toLowerCase().includes(q) &&
          !m.teamB.toLowerCase().includes(q) &&
          !m.city.toLowerCase().includes(q) &&
          !m.venue.toLowerCase().includes(q) &&
          !(m.group ?? "").toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [MATCHES, filter, stage, query, watched, now]);

  const grouped = useMemo(() => {
    const map = new Map<string, Match[]>();
    const dateOpts: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      ...(tz === "UTC" ? { timeZone: "UTC" } : {}),
    };
    for (const m of filtered) {
      const key = new Date(m.kickoffUTC).toLocaleDateString(undefined, dateOpts);
      const arr = map.get(key) ?? [];
      arr.push(m);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [filtered, tz]);


  const total = MATCHES.length;
  const watchedCount = watched.size;
  const pct = Math.round((watchedCount / total) * 100);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBlobs />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <Header pct={pct} watchedCount={watchedCount} total={total} onReset={reset} />

        <Controls
          filter={filter}
          setFilter={setFilter}
          stage={stage}
          setStage={setStage}
          query={query}
          setQuery={setQuery}
          tz={tz}
          setTz={setTz}
          localTz={localTz}
          onRefresh={refresh}
          refreshState={refreshState}
          refreshError={refreshError}
          fetchedAt={fetchedAt}
        />


        {!ready ? (
          <div className="mt-16 text-center text-muted-foreground">Loading your matches…</div>
        ) : grouped.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mt-10 space-y-12">
            {grouped.map(([dateLabel, matches], gi) => (
              <section key={dateLabel} className="animate-float-up" style={{ animationDelay: `${gi * 60}ms` }}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{dateLabel}</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                  <span className="chip">{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {matches.map((m, i) => (
                    <MatchCard
                      key={m.id}
                      match={m}
                      watched={watched.has(m.id)}
                      onToggle={() => toggle(m.id)}
                      now={now}
                      index={i}
                      tz={tz}
                    />
                  ))}

                </div>
              </section>
            ))}
          </div>
        )}

        <footer className="mt-20 border-t border-border/50 pt-8 text-center text-xs text-muted-foreground">
          <p>Saved locally on this device. Clear browser data to reset.</p>
          <p className="mt-1 opacity-60">Times shown in {tz === "UTC" ? "UTC" : `your local timezone (${localTz})`} · 104 matches · USA · Canada · Mexico</p>
        </footer>
      </div>
    </main>
  );
}

/* ───────── Header + Progress ───────── */
function Header({
  pct,
  watchedCount,
  total,
  onReset,
}: {
  pct: number;
  watchedCount: number;
  total: number;
  onReset: () => void;
}) {
  return (
    <header className="animate-float-up">
      <div className="flex flex-wrap items-center gap-3">
        <span className="chip">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          FIFA World Cup 2026
        </span>
        <span className="chip">🇺🇸 🇨🇦 🇲🇽</span>
      </div>

      <h1 className="mt-4 text-4xl font-bold leading-[1.05] sm:text-6xl">
        <span className="text-gradient">Mark every match.</span>
        <br />
        <span className="text-foreground/90">Own the tournament.</span>
      </h1>

      <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
        104 matches across 3 host nations. Tap to mark watched — your progress lives on your device, no account needed.
      </p>

      {/* Progress card */}
      <div className="glass-strong card-hover mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl p-5 sm:flex sm:flex-wrap sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Your progress</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums text-gradient sm:text-4xl">
              {watchedCount}
            </span>
            <span className="text-sm text-muted-foreground">/ {total} matches · {pct}%</span>
          </div>
        </div>
        <button
          onClick={() => {
            if (watchedCount === 0) return;
            if (confirm("Reset all watched matches?")) onReset();
          }}
          className="shrink-0 rounded-full border border-border bg-white/5 px-4 py-2 text-xs font-medium text-foreground/90 transition hover:border-primary/60 hover:bg-primary/10 hover:text-foreground active:scale-95"
        >
          Reset
        </button>
        <div className="col-span-2 sm:w-full">
          <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, var(--primary), var(--accent), var(--success))",
                boxShadow: "0 0 20px -4px var(--primary)",
              }}
            />
            {pct > 0 && pct < 100 && (
              <div className="absolute inset-y-0 left-0 animate-shimmer rounded-full" style={{ width: `${pct}%` }} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ───────── Controls ───────── */
function Controls({
  filter,
  setFilter,
  stage,
  setStage,
  query,
  setQuery,
  tz,
  setTz,
  localTz,
  onRefresh,
  refreshState,
  refreshError,
  fetchedAt,
}: {
  filter: Filter;
  setFilter: (f: Filter) => void;
  stage: Stage | "All";
  setStage: (s: Stage | "All") => void;
  query: string;
  setQuery: (q: string) => void;
  tz: TZ;
  setTz: (t: TZ) => void;
  localTz: string;
  onRefresh: () => void;
  refreshState: RefreshState;
  refreshError: string | null;
  fetchedAt: number | null;
}) {
  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "watched", label: "Watched" },
    { key: "unwatched", label: "To watch" },
  ];
  const loading = refreshState === "loading";
  const lastSync =
    fetchedAt
      ? new Date(fetchedAt).toLocaleString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "bundled";
  const syncLabel =
    refreshState === "error"
      ? `Update failed${refreshError ? ` — ${refreshError}` : ""}`
      : refreshState === "ok"
        ? `Updated ${lastSync}`
        : fetchedAt
          ? `Last updated ${lastSync}`
          : "Using bundled schedule";
  return (
    <div className="mt-8 space-y-3 animate-float-up" style={{ animationDelay: "80ms" }}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="glass flex flex-1 items-center gap-2 rounded-full px-4 py-2">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search team, city, group…"
            className="min-w-0 flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="rounded-full px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          title={syncLabel}
          className={[
            "glass relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition active:scale-95",
            refreshState === "error"
              ? "border-destructive/40 text-destructive hover:bg-destructive/10"
              : "hover:border-primary/60 hover:bg-primary/10",
            loading ? "opacity-70" : "",
          ].join(" ")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={["h-3.5 w-3.5", loading ? "animate-spin" : ""].join(" ")}
            aria-hidden
          >
            <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
            <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M3 21v-5h5" />
          </svg>
          <span className="hidden sm:inline">
            {loading ? "Refreshing…" : "Refresh matches"}
          </span>
          <span className="sm:hidden">{loading ? "…" : "Refresh"}</span>
        </button>

        {/* Timezone toggle */}
        <div
          className="glass relative flex shrink-0 items-center rounded-full p-1 text-xs font-medium"
          role="tablist"
          aria-label="Timezone"
          title={tz === "local" ? `Local time · ${localTz}` : "Coordinated Universal Time"}
        >
          <span
            aria-hidden
            className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-primary/20 ring-1 ring-primary/50 shadow-[0_0_20px_-4px_var(--primary)] transition-transform duration-300 ease-out"
            style={{ transform: tz === "UTC" ? "translateX(100%)" : "translateX(0%)" }}
          />
          <button
            role="tab"
            aria-selected={tz === "local"}
            onClick={() => setTz("local")}
            className={[
              "relative z-10 rounded-full px-3 py-1.5 transition-colors",
              tz === "local" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            Local
          </button>
          <button
            role="tab"
            aria-selected={tz === "UTC"}
            onClick={() => setTz("UTC")}
            className={[
              "relative z-10 rounded-full px-3 py-1.5 transition-colors",
              tz === "UTC" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          >
            UTC
          </button>
        </div>
      </div>

      <div
        className={[
          "text-xs",
          refreshState === "error" ? "text-destructive" : "text-muted-foreground/70",
        ].join(" ")}
      >
        {syncLabel}
      </div>


      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Pill key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
            {f.label}
          </Pill>
        ))}
        <div className="mx-1 h-6 w-px self-center bg-border" />
        <Pill active={stage === "All"} onClick={() => setStage("All")}>All stages</Pill>
        {STAGES.map((s) => (
          <Pill key={s} active={stage === s} onClick={() => setStage(s)}>
            {s}
          </Pill>
        ))}
      </div>
    </div>
  );
}


function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-300 active:scale-95",
        active
          ? "border border-primary/50 bg-primary/15 text-foreground shadow-[0_0_20px_-4px_var(--primary)]"
          : "border border-border bg-white/5 text-muted-foreground hover:border-white/25 hover:bg-white/10 hover:text-foreground",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ───────── Match card ───────── */
function MatchCard({
  match,
  watched,
  onToggle,
  now,
  index,
  tz,
}: {
  match: Match;
  watched: boolean;
  onToggle: () => void;
  now: number;
  index: number;
  tz: TZ;
}) {
  const kickoff = new Date(match.kickoffUTC);
  const ts = kickoff.getTime();
  const isLive = ts <= now && now < ts + 2 * 60 * 60 * 1000;
  const isPast = ts + 2 * 60 * 60 * 1000 <= now;
  const hasScore = typeof match.scoreA === "number" && typeof match.scoreB === "number";

  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    ...(tz === "UTC" ? { timeZone: "UTC", hour12: false } : {}),
  };
  const tzNameOpts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    ...(tz === "UTC" ? { timeZone: "UTC", hour12: false } : {}),
  };
  const time = kickoff.toLocaleTimeString(undefined, timeOpts);
  const tzLabel =
    tz === "UTC"
      ? "UTC"
      : kickoff.toLocaleTimeString(undefined, tzNameOpts).split(" ").pop();


  return (
    <button
      onClick={onToggle}
      className={[
        "group relative w-full overflow-hidden rounded-2xl p-5 text-left animate-scale-in card-hover",
        "hover:card-hover-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        watched ? "glass-strong" : "glass",
      ].join(" ")}
      style={{ animationDelay: `${index * 40}ms` }}
      aria-pressed={watched}
    >
      {/* Hover sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />

      {/* Watched accent border */}
      {watched && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-success/60"
          style={{ boxShadow: "inset 0 0 40px -8px oklch(0.82 0.2 145 / 0.4)" }}
        />
      )}

      {/* Top row */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="chip">
            {match.stage}
            {match.group ? ` · ${match.group}` : ""}
          </span>
          {isLive && (
            <span className="chip animate-pulse-glow border-primary/60 bg-primary/20 text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> LIVE
            </span>
          )}
        </div>
        <Checkmark active={watched} />
      </div>

      {/* Teams */}
      <div className="relative mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <TeamBlock flag={match.flagA} name={match.teamA} align="end" dim={hasScore && match.scoreA! < match.scoreB!} />
        <div className="flex flex-col items-center">
          {hasScore ? (
            <>
              <div className="text-[0.6rem] uppercase tracking-widest text-success">Full time</div>
              <div className="mt-0.5 rounded-full border border-success/50 bg-success/10 px-3 py-1 text-sm font-bold tabular-nums text-foreground shadow-[0_0_20px_-6px_var(--success)]">
                {match.scoreA} <span className="text-muted-foreground">–</span> {match.scoreB}
              </div>
              <div className="mt-1 text-[0.6rem] text-muted-foreground tabular-nums">{time} {tzLabel}</div>
            </>
          ) : (
            <>
              <div className="text-[0.6rem] uppercase tracking-widest text-muted-foreground">vs</div>
              <div className="mt-0.5 rounded-full border border-border bg-black/30 px-2.5 py-1 text-xs font-semibold tabular-nums text-foreground">
                {time}
              </div>
              <div className="mt-1 text-[0.6rem] text-muted-foreground">{tzLabel}</div>
            </>
          )}
        </div>
        <TeamBlock flag={match.flagB} name={match.teamB} align="start" dim={hasScore && match.scoreB! < match.scoreA!} />
      </div>

      {/* Footer */}
      <div className="relative mt-5 flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1.5 truncate">
          <PinIcon />
          <span className="truncate">{match.venue} · {match.city}</span>
        </span>
        <span className={isPast && !watched ? "text-primary/80" : ""}>
          {isPast && !watched ? "Catch up" : isLive ? "Now" : relTime(ts - now)}
        </span>
      </div>
    </button>
  );
}

function TeamBlock({ flag, name, align, dim = false }: { flag: string; name: string; align: "start" | "end"; dim?: boolean }) {
  const url = flagUrl(name);
  const srcSet = flagSrcSet(name);
  const FlagEl = url ? (
    <img
      src={url}
      srcSet={srcSet ?? undefined}
      alt={`${name} flag`}
      loading="lazy"
      width={44}
      height={30}
      className="h-7 w-10 shrink-0 rounded-[4px] object-cover ring-1 ring-white/15 shadow-[0_4px_12px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-110 sm:h-8 sm:w-11"
    />
  ) : (
    <span className="text-3xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-110">
      {flag}
    </span>
  );
  return (
    <div className={["flex min-w-0 items-center gap-2.5 transition-opacity", align === "end" ? "justify-end" : "justify-start", dim ? "opacity-50" : ""].join(" ")}>
      {align === "start" && FlagEl}
      <span className="min-w-0 truncate text-sm font-semibold sm:text-base">{name}</span>
      {align === "end" && FlagEl}
    </div>
  );
}

function Checkmark({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-300",
        active
          ? "border-success bg-success text-success-foreground shadow-[0_0_20px_-4px_var(--success)]"
          : "border-border bg-white/5 text-transparent group-hover:border-white/40 group-hover:text-white/30",
      ].join(" ")}
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
}

/* ───────── Background blobs ───────── */
function AnimatedBlobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.22 340 / 0.7), transparent 70%)" }}
      />
      <div
        className="absolute -right-40 top-1/4 h-[480px] w-[480px] rounded-full opacity-40 blur-3xl animate-blob-slow"
        style={{ background: "radial-gradient(circle, oklch(0.78 0.16 200 / 0.7), transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[380px] w-[380px] rounded-full opacity-40 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle, oklch(0.82 0.2 145 / 0.6), transparent 70%)" }}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="glass mt-12 rounded-2xl p-12 text-center animate-scale-in">
      <div className="text-5xl">🔍</div>
      <h3 className="mt-4 text-lg font-semibold">No matches found</h3>
      <p className="mt-1 text-sm text-muted-foreground">Try clearing filters or your search.</p>
    </div>
  );
}

/* ───────── Tiny helpers ───────── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function relTime(ms: number) {
  if (ms < 0) return "Finished";
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `in ${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `in ${hrs}h`;
  const days = Math.round(hrs / 24);
  return `in ${days}d`;
}
