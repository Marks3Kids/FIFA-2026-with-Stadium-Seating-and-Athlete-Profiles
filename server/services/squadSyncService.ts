/**
 * Sync player squads from football-data.org into the `players` table.
 *
 * Uses the same FOOTBALL_DATA_API_TOKEN as fifaDataService. The endpoint
 * `/v4/competitions/WC/teams` returns every team with a `squad` array per
 * team — typically 23-26 players each with name, position, dateOfBirth,
 * and nationality.
 *
 * Free tier covers this endpoint. Rate limit is 10 req/min; this service
 * makes one request per refresh so we stay well below the cap.
 *
 * The endpoint won't have data for every team (some smaller national sides
 * publish squads late). Teams that come back with no squad are left empty
 * and Mark can fill them later via the admin paste form.
 */
import { storage } from "../storage";
import type { InsertPlayer } from "@shared/schema";

const API_BASE = "https://api.football-data.org/v4";
const WC_COMPETITION_CODE = "WC";

interface FdPlayer {
  id: number;
  name: string;
  position?: string | null;
  dateOfBirth?: string | null;
  nationality?: string | null;
  shirtNumber?: number | null;
}

interface FdTeamWithSquad {
  id: number;
  name: string;
  squad?: FdPlayer[];
}

interface FdTeamsResponse {
  count: number;
  teams: FdTeamWithSquad[];
}

/**
 * Normalize a team name for matching against our DB (alias common variants).
 * Kept in sync with the alias map used by fifaDataService.
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
    "cape verde islands": "cape verde",
    "türkiye": "turkey",
    "ir iran": "iran",
    "islamic republic of iran": "iran",
    "côte d'ivoire": "ivory coast",
    "cote d'ivoire": "ivory coast",
    "congo dr": "dr congo",
    "democratic republic of the congo": "dr congo",
    "bosnia-herzegovina": "bosnia and herzegovina",
    "bosnia & herzegovina": "bosnia and herzegovina",
  };
  const lower = raw.trim().toLowerCase();
  return aliases[lower] ?? lower;
}

function getApiToken(): string | null {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;
  if (!token || token.startsWith("YOUR_") || token.length < 10) return null;
  return token;
}

interface SquadSyncResult {
  teamsWithSquads: number;
  teamsWithoutSquads: number;
  playersInserted: number;
  skippedTeams: string[];
  unmatchedFdTeams: string[];
}

/**
 * Pull squads for every team in the FIFA World Cup competition and replace
 * the `players` table with the merged result.
 *
 * Returns counts and which teams ended up empty so the admin UI can surface
 * "fill these manually" hints.
 */
export async function syncSquadsFromFootballData(): Promise<SquadSyncResult> {
  const empty: SquadSyncResult = {
    teamsWithSquads: 0,
    teamsWithoutSquads: 0,
    playersInserted: 0,
    skippedTeams: [],
    unmatchedFdTeams: [],
  };

  const token = getApiToken();
  if (!token) {
    console.warn("[squadSyncService] FOOTBALL_DATA_API_TOKEN not configured — skipping");
    return empty;
  }

  let data: FdTeamsResponse | null = null;
  try {
    const res = await fetch(`${API_BASE}/competitions/${WC_COMPETITION_CODE}/teams`, {
      headers: { "X-Auth-Token": token },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[squadSyncService] HTTP ${res.status} ${body.slice(0, 200)}`);
      return empty;
    }
    data = (await res.json()) as FdTeamsResponse;
  } catch (err: any) {
    console.error("[squadSyncService] fetch failed:", err?.message || err);
    return empty;
  }

  const ourTeams = await storage.getAllTeams();
  // Build a name → our team-id map (normalized).
  const ourTeamByName = new Map<string, { id: number; name: string }>();
  for (const t of ourTeams) {
    ourTeamByName.set(normalizeTeamName(t.name), { id: t.id, name: t.name });
  }

  const insertRows: InsertPlayer[] = [];
  const filledTeams = new Set<number>();

  for (const fdTeam of data.teams || []) {
    const ourTeam = ourTeamByName.get(normalizeTeamName(fdTeam.name));
    if (!ourTeam) {
      empty.unmatchedFdTeams.push(fdTeam.name);
      continue;
    }
    const squad = fdTeam.squad || [];
    if (squad.length === 0) {
      empty.skippedTeams.push(ourTeam.name);
      continue;
    }
    filledTeams.add(ourTeam.id);
    for (const p of squad) {
      insertRows.push({
        teamId: ourTeam.id,
        name: p.name,
        position: p.position || "Player",
        number: p.shirtNumber ?? null,
        dateOfBirth: p.dateOfBirth ?? null,
        height: null,
        currentClub: null,
        imageUrl: null,
        isCaptain: 0,
        internationalCaps: 0,
        internationalGoals: 0,
        clubCareerGoals: 0,
        clubCareerAssists: 0,
        highlightVideoUrl: null,
        wikiUrl: null,
      });
    }
  }

  // Replace the entire players table in one transaction.
  const result = await storage.replaceAllPlayers(insertRows);

  empty.teamsWithSquads = filledTeams.size;
  empty.teamsWithoutSquads = ourTeams.length - filledTeams.size;
  empty.playersInserted = result.inserted;
  return empty;
}

let lastSquadSync: { at: Date; result: SquadSyncResult } | null = null;
export async function refreshAndStoreSquads(): Promise<typeof lastSquadSync> {
  const result = await syncSquadsFromFootballData();
  lastSquadSync = { at: new Date(), result };
  return lastSquadSync;
}
export function getLastSquadSync(): typeof lastSquadSync {
  return lastSquadSync;
}
