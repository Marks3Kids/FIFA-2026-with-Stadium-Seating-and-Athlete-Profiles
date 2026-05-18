/**
 * football-data.org integration for FIFA World Cup 2026.
 *
 * Free tier ("Free tier - tier_one"):
 *   - Provides: match schedule, results, group standings for WORLD CUP
 *   - Rate limit: 10 requests/minute. We refresh every 30 minutes so this
 *     is comfortable; even bursts of multiple syncs/day stay well below limits.
 *   - Auth: X-Auth-Token header.
 *
 * Sign up: https://www.football-data.org/client/register
 * After signup, the token is emailed; put it in FOOTBALL_DATA_API_TOKEN.
 *
 * If the token is missing or the API fails, sync functions log a warning and
 * return without throwing — so a missing key never crashes the server.
 */
import { db } from "../../db";
import { matches, teams } from "@shared/schema";
import { eq, and } from "drizzle-orm";

const API_BASE = "https://api.football-data.org/v4";
// football-data.org competition code for the FIFA World Cup. The 2026 edition
// reuses the "WC" competition slug — confirmed against their public docs.
const WC_COMPETITION_CODE = "WC";

interface FdTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}

interface FdMatch {
  id: number;
  utcDate: string;
  status: "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | "POSTPONED" | "SUSPENDED" | "CANCELLED";
  stage?: string;
  group?: string | null;
  homeTeam: FdTeam | null;
  awayTeam: FdTeam | null;
  score: {
    fullTime: { home: number | null; away: number | null };
  };
  venue?: string;
}

interface FdMatchesResponse {
  count: number;
  matches: FdMatch[];
}

function getApiToken(): string | null {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  if (!token || token.startsWith("YOUR_") || token.length < 10) return null;
  return token;
}

async function callFd<T>(path: string): Promise<T | null> {
  const token = getApiToken();
  if (!token) {
    console.warn("[fifaDataService] FOOTBALL_DATA_API_TOKEN not configured — skipping fetch");
    return null;
  }
  const url = `${API_BASE}${path}`;
  try {
    const res = await fetch(url, { headers: { "X-Auth-Token": token } });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[fifaDataService] ${path} → HTTP ${res.status} ${body.slice(0, 200)}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`[fifaDataService] ${path} → fetch failed:`, err?.message || err);
    return null;
  }
}

/**
 * Normalize team name to a canonical form for cross-source matching.
 * football-data.org and our DB sometimes use different conventions
 * (e.g. "Korea Republic" vs "South Korea", "United States" vs "USA").
 */
function normalizeTeamName(raw: string | null | undefined): string {
  if (!raw) return "";
  const aliases: Record<string, string> = {
    "korea republic": "south korea",
    "korea, republic of": "south korea",
    "republic of korea": "south korea",
    "united states": "usa",
    "united states of america": "usa",
    "cabo verde": "cape verde",
    "türkiye": "turkey",
    "ir iran": "iran",
    "islamic republic of iran": "iran",
    "côte d'ivoire": "ivory coast",
    "cote d'ivoire": "ivory coast",
    "congo dr": "dr congo",
    "democratic republic of the congo": "dr congo",
  };
  const lower = raw.trim().toLowerCase();
  return aliases[lower] ?? lower;
}

/** A team-1 / team-2 pair is a "placeholder" if either side is a draw placeholder
 * (UEFA Playoff Winner, Group X Winner, etc.) instead of a real qualified team. */
function hasPlaceholder(teamName: string | null | undefined): boolean {
  const t = (teamName || "").toLowerCase();
  return (
    t.includes("playoff") ||
    t.includes("winner") ||
    t.includes("runner") ||
    t.includes("tbd") ||
    /^group [a-l]/.test(t)
  );
}

function normalizeStatus(fdStatus: FdMatch["status"]): string {
  switch (fdStatus) {
    case "SCHEDULED":
    case "TIMED":
      return "SCHEDULED";
    case "IN_PLAY":
    case "PAUSED":
      return "LIVE";
    case "FINISHED":
      return "FINISHED";
    case "POSTPONED":
    case "SUSPENDED":
      return "POSTPONED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return "SCHEDULED";
  }
}

/**
 * Pulls every WC match from football-data.org and updates matching rows in
 * our `matches` table by fd_match_id. Rows that don't yet have a fd_match_id
 * are matched once by (team1, team2, date) and tagged for future syncs.
 *
 * Returns counts so the caller can log/return them.
 */
export async function syncMatchesFromFootballData(): Promise<{ updated: number; skipped: number; total: number; placeholdersResolved: number }> {
  const data = await callFd<FdMatchesResponse>(`/competitions/${WC_COMPETITION_CODE}/matches`);
  if (!data) return { updated: 0, skipped: 0, total: 0, placeholdersResolved: 0 };

  const existing = await db.select().from(matches);
  let updated = 0;
  let skipped = 0;
  let placeholdersResolved = 0;

  for (const fdMatch of data.matches) {
    const homeName = fdMatch.homeTeam?.name;
    const awayName = fdMatch.awayTeam?.name;
    if (!homeName || !awayName) {
      skipped++;
      continue;
    }

    const homeScore = fdMatch.score.fullTime.home;
    const awayScore = fdMatch.score.fullTime.away;
    const status = normalizeStatus(fdMatch.status);
    const dateOnly = fdMatch.utcDate.slice(0, 10); // "YYYY-MM-DD"
    const normHome = normalizeTeamName(homeName);
    const normAway = normalizeTeamName(awayName);

    // Match priority:
    //   1) Previously-synced row (fd_match_id)
    //   2) Exact team-name match (any order), normalized for known aliases
    //   3) Date matches + one team matches (other side is a placeholder)
    //   4) Date matches AND both sides are placeholders for the same matchday
    let target = existing.find((m) => m.fdMatchId === fdMatch.id);
    let resolvedPlaceholder = false;

    if (!target) {
      target = existing.find((m) => {
        const t1 = normalizeTeamName(m.team1);
        const t2 = normalizeTeamName(m.team2);
        return (
          (t1 === normHome && t2 === normAway) ||
          (t1 === normAway && t2 === normHome)
        );
      });
    }

    // football-data.org group format: "GROUP_F" → normalize to "group f".
    const fdGroupNorm = (fdMatch.group || "").toLowerCase().replace(/_/g, " ");

    if (!target && fdGroupNorm) {
      // Stronger fallback: match by group letter + one real team + other is a placeholder.
      // This handles the case where our DB's date is stale (set before the real
      // schedule was published) but the group + one team still uniquely identifies the row.
      target = existing.find((m) => {
        const ourStage = (m.stage || "").toLowerCase().trim();
        if (ourStage !== fdGroupNorm) return false;
        const t1 = normalizeTeamName(m.team1);
        const t2 = normalizeTeamName(m.team2);
        const oneSideMatches =
          t1 === normHome || t2 === normHome || t1 === normAway || t2 === normAway;
        const otherSideIsPlaceholder = hasPlaceholder(m.team1) || hasPlaceholder(m.team2);
        return oneSideMatches && otherSideIsPlaceholder;
      });
      if (target) resolvedPlaceholder = true;
    }

    if (!target) {
      // Date-based fallback for matches that don't carry a group (older rows).
      target = existing.find((m) => {
        if (!datesMatch(m.date, dateOnly)) return false;
        const t1 = normalizeTeamName(m.team1);
        const t2 = normalizeTeamName(m.team2);
        const oneSideMatches =
          t1 === normHome || t2 === normHome || t1 === normAway || t2 === normAway;
        const otherSideIsPlaceholder = hasPlaceholder(m.team1) || hasPlaceholder(m.team2);
        return oneSideMatches && otherSideIsPlaceholder;
      });
      if (target) resolvedPlaceholder = true;
    }

    if (!target) {
      skipped++;
      continue;
    }

    const updateSet: Record<string, any> = {
      homeScore,
      awayScore,
      status,
      fdMatchId: fdMatch.id,
    };
    // When we matched via fallback (placeholder), also rewrite team names + date.
    // FIFA's published schedule is authoritative; our placeholder rows often have
    // stale dates from the original draw-day seed.
    if (resolvedPlaceholder) {
      updateSet.team1 = homeName;
      updateSet.team2 = awayName;
      // Convert FD's ISO date to the human-readable format the UI expects
      // (matches the existing seed format, e.g. "June 14, 2026").
      const d = new Date(fdMatch.utcDate);
      if (!Number.isNaN(d.getTime())) {
        const month = d.toLocaleString("en-US", { month: "long", timeZone: "UTC" });
        updateSet.date = `${month} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
      }
      placeholdersResolved++;
    }

    await db.update(matches).set(updateSet).where(eq(matches.id, target.id));
    updated++;
  }

  return { updated, skipped, total: data.matches.length, placeholdersResolved };
}

/**
 * Loose date matcher: handles both "YYYY-MM-DD" (from API) and human-formatted
 * strings like "June 14, 2026" (legacy DB rows).
 */
function datesMatch(dbDate: string, apiDateIso: string): boolean {
  if (!dbDate || !apiDateIso) return false;
  // Same ISO format: easy.
  if (dbDate === apiDateIso) return true;
  // Try parsing the DB date; if it parses, compare YYYY-MM-DD.
  const parsed = new Date(dbDate);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10) === apiDateIso;
  }
  return false;
}

/**
 * Returns the most recent sync result for diagnostics.
 * (Kept as a small helper so the admin UI can display last-sync info.)
 */
let lastSync: { at: Date; updated: number; skipped: number; total: number; placeholdersResolved: number } | null = null;
export async function refreshAndStoreFifaData(): Promise<typeof lastSync> {
  const result = await syncMatchesFromFootballData();
  lastSync = { at: new Date(), ...result };
  return lastSync;
}
export function getLastFifaSync(): typeof lastSync {
  return lastSync;
}
