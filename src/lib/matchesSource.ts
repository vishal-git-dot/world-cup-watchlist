// Fetch + normalize the live FIFA World Cup 2026 schedule from the
// community-maintained openfootball dataset.
//
// Source: https://github.com/openfootball/world-cup.json
// CORS is enabled on raw.githubusercontent.com so we can call this directly
// from the browser without a proxy.

import type { Match, Stage } from "./matches";

const SOURCE_URL =
  "https://raw.githubusercontent.com/openfootball/world-cup.json/master/2026/worldcup.json";

type RawScore = {
  ft?: [number, number] | number[];
  et?: [number, number] | number[];
  p?: [number, number] | number[];
};

type RawMatch = {
  round: string;
  num?: number;
  date: string;
  time?: string;
  team1: string;
  team2: string;
  group?: string;
  ground?: string;
  score?: RawScore;
  score1?: number;
  score2?: number;
};

type RawData = {
  name?: string;
  matches: RawMatch[];
};

// Loose host-city → country map. Keys are matched as case-insensitive
// substrings against the openfootball `ground` field.
const CITY_COUNTRY: { match: string; country: Match["country"] }[] = [
  { match: "mexico city", country: "Mexico" },
  { match: "guadalajara", country: "Mexico" },
  { match: "zapopan", country: "Mexico" },
  { match: "monterrey", country: "Mexico" },
  { match: "toronto", country: "Canada" },
  { match: "vancouver", country: "Canada" },
  // Everything else defaults to USA below.
];

// Minimal team-name → emoji fallback. The real per-team flag image is
// resolved by src/lib/flags.ts; this is only used when that lookup misses.
const EMOJI: Record<string, string> = {
  Mexico: "🇲🇽",
  Canada: "🇨🇦",
  USA: "🇺🇸",
};

function emojiFor(team: string): string {
  return EMOJI[team] ?? "🏳️";
}

function countryFor(ground: string): Match["country"] {
  const g = ground.toLowerCase();
  for (const { match, country } of CITY_COUNTRY) {
    if (g.includes(match)) return country;
  }
  return "USA";
}

function mapStage(round: string): Stage {
  if (/^matchday/i.test(round)) return "Group Stage";
  if (/round of 32/i.test(round)) return "Round of 32";
  if (/round of 16/i.test(round)) return "Round of 16";
  if (/quarter/i.test(round)) return "Quarter-final";
  if (/semi/i.test(round)) return "Semi-final";
  if (/third/i.test(round)) return "Third Place";
  if (/final/i.test(round)) return "Final";
  return "Group Stage";
}

// "13:00 UTC-6" + "2026-06-11" → ISO UTC string.
function toUtcIso(date: string, time: string | undefined): string {
  if (!time) return `${date}T00:00:00Z`;
  const m = /^(\d{1,2}):(\d{2})(?:\s*UTC([+-]\d{1,2})(?::?(\d{2}))?)?/i.exec(
    time.trim(),
  );
  if (!m) return `${date}T00:00:00Z`;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  const offH = m[3] ? Number(m[3]) : 0;
  const offM = m[4] ? Number(m[4]) : 0;
  // local = UTC + offset  →  UTC = local - offset
  const totalMin = hh * 60 + mm - (offH * 60 + Math.sign(offH || 1) * offM);
  const base = new Date(`${date}T00:00:00Z`).getTime();
  const utc = new Date(base + totalMin * 60_000);
  return utc.toISOString();
}

function shortGroup(g: string | undefined): string | undefined {
  if (!g) return undefined;
  const m = /group\s+([a-l])/i.exec(g);
  return m ? m[1].toUpperCase() : g;
}

function extractScore(r: RawMatch): { scoreA?: number; scoreB?: number } {
  // openfootball uses { score: { ft: [a,b] } } when finished; some forks use score1/score2.
  const s = r.score;
  const pick = s?.ft ?? s?.et ?? s?.p;
  if (Array.isArray(pick) && pick.length >= 2 && typeof pick[0] === "number" && typeof pick[1] === "number") {
    return { scoreA: pick[0], scoreB: pick[1] };
  }
  if (typeof r.score1 === "number" && typeof r.score2 === "number") {
    return { scoreA: r.score1, scoreB: r.score2 };
  }
  return {};
}

export function normalize(raw: RawData): Match[] {
  return raw.matches.map((r, i): Match => {
    const ground = r.ground ?? "TBD";
    return {
      id: String(r.num ?? i + 1),
      stage: mapStage(r.round),
      group: shortGroup(r.group),
      teamA: r.team1,
      teamB: r.team2,
      flagA: emojiFor(r.team1),
      flagB: emojiFor(r.team2),
      kickoffUTC: toUtcIso(r.date, r.time),
      venue: ground,
      city: ground,
      country: countryFor(ground),
      ...extractScore(r),
    };
  });
}

export async function fetchLiveMatches(): Promise<Match[]> {
  const res = await fetch(SOURCE_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Source returned ${res.status}`);
  const raw = (await res.json()) as RawData;
  if (!Array.isArray(raw?.matches)) throw new Error("Unexpected data shape");
  const matches = normalize(raw);
  if (matches.length === 0) throw new Error("No matches in source");
  return matches;
}
