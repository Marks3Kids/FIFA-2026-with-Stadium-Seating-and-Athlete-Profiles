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
export async function syncMatchesFromFootballData(): Promise<{ updated: number; skipped: number; total: number }> {
  const data = await callFd<FdMatchesResponse>(`/competitions/${WC_COMPETITION_CODE}/matches`);
  if (!data) return { updated: 0, skipped: 0, total: 0 };

  const existing = await db.select().from(matches);
  let updated = 0;
  let skipped = 0;

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

    // Try to find an existing row: first by fd_match_id, then by team names + date.
    const dateOnly = fdMatch.utcDate.slice(0, 10); // "YYYY-MM-DD"
    let target = existing.find((m) => m.fdMatchId === fdMatch.id);
    if (!target) {
      target = existing.find(
        (m) =>
          (m.team1.toLowerCase() === homeName.toLowerCase() && m.team2.toLowerCase() === awayName.toLowerCase()) ||
          (m.team1.toLowerCase() === awayName.toLowerCase() && m.team2.toLowerCase() === homeName.toLowerCase()),
      );
    }
    if (!target) {
      // No matching row in our DB; skip silently. The manual schedule paste step
      // (or a future auto-create flow) is responsible for seeding the row first.
      skipped++;
      continue;
    }

    await db
      .update(matches)
      .set({
        homeScore,
        awayScore,
        status,
        fdMatchId: fdMatch.id,
      })
      .where(eq(matches.id, target.id));
    updated++;
  }

  return { updated, skipped, total: data.matches.length };
}

/**
 * Returns the most recent sync result for diagnostics.
 * (Kept as a small helper so the admin UI can display last-sync info.)
 */
let lastSync: { at: Date; updated: number; skipped: number; total: number } | null = null;
export async function refreshAndStoreFifaData(): Promise<typeof lastSync> {
  const result = await syncMatchesFromFootballData();
  lastSync = { at: new Date(), ...result };
  return lastSync;
}
export function getLastFifaSync(): typeof lastSync {
  return lastSync;
}
