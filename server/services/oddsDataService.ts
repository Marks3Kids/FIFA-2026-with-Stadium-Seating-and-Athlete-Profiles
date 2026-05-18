/**
 * The Odds API integration for FIFA World Cup outright winner odds.
 *
 * Free tier: 500 requests/month. We refresh daily (~30 req/month), well below
 * the limit. Auth: apiKey query parameter.
 *
 * Sign up: https://the-odds-api.com → Get API Key
 * Set ODDS_API_KEY in environment.
 *
 * The "consensus" odds we display are computed as the median American-odds
 * value across DraftKings, FanDuel, and BetMGM where available, so a single
 * outlier book doesn't skew the published number.
 */
import { db } from "../../db";
import { tournamentOdds } from "@shared/schema";

const API_BASE = "https://api.the-odds-api.com/v4";
// Sport key for FIFA World Cup outright (tournament) winner market.
const SPORT_KEY = "soccer_fifa_world_cup_winner";
const PREFERRED_BOOKMAKERS = ["draftkings", "fanduel", "betmgm"];

interface OddsApiOutcome {
  name: string; // team name
  price: number; // decimal odds (e.g. 5.50)
}
interface OddsApiMarket {
  key: string; // "outrights"
  outcomes: OddsApiOutcome[];
}
interface OddsApiBookmaker {
  key: string; // "draftkings"
  title: string;
  markets: OddsApiMarket[];
}
interface OddsApiEvent {
  id: string;
  sport_key: string;
  bookmakers: OddsApiBookmaker[];
}

function getApiKey(): string | null {
  const key = process.env.ODDS_API_KEY;
  if (!key || key.startsWith("YOUR_") || key.length < 10) return null;
  return key;
}

function decimalToAmerican(decimal: number): string {
  if (!decimal || decimal <= 1) return "N/A";
  if (decimal >= 2) return `+${Math.round((decimal - 1) * 100)}`;
  return `${Math.round(-100 / (decimal - 1))}`;
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Fetches outright winner odds and upserts the `tournament_odds` table.
 * Returns { updated, sources } for logging.
 */
export async function syncTournamentOdds(): Promise<{ updated: number; sources: string[]; total: number }> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[oddsDataService] ODDS_API_KEY not configured — skipping fetch");
    return { updated: 0, sources: [], total: 0 };
  }

  const url = `${API_BASE}/sports/${SPORT_KEY}/odds/?apiKey=${apiKey}&regions=us&markets=outrights&oddsFormat=decimal`;
  let events: OddsApiEvent[] = [];
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[oddsDataService] HTTP ${res.status} ${body.slice(0, 200)}`);
      return { updated: 0, sources: [], total: 0 };
    }
    events = (await res.json()) as OddsApiEvent[];
  } catch (err: any) {
    console.error("[oddsDataService] fetch failed:", err?.message || err);
    return { updated: 0, sources: [], total: 0 };
  }

  // Aggregate odds per team across our preferred bookmakers.
  // Map<teamName, number[]> of decimal odds.
  const decimalsByTeam = new Map<string, number[]>();
  const sourcesUsed = new Set<string>();

  for (const event of events) {
    for (const bookmaker of event.bookmakers) {
      if (!PREFERRED_BOOKMAKERS.includes(bookmaker.key)) continue;
      for (const market of bookmaker.markets) {
        if (market.key !== "outrights") continue;
        for (const outcome of market.outcomes) {
          if (!outcome.name || typeof outcome.price !== "number") continue;
          if (!decimalsByTeam.has(outcome.name)) decimalsByTeam.set(outcome.name, []);
          decimalsByTeam.get(outcome.name)!.push(outcome.price);
          sourcesUsed.add(bookmaker.title);
        }
      }
    }
  }

  if (decimalsByTeam.size === 0) {
    console.warn("[oddsDataService] No odds returned from preferred bookmakers");
    return { updated: 0, sources: [], total: events.length };
  }

  const sourceLabel = `${Array.from(sourcesUsed).join("/")} consensus`;
  let updated = 0;
  const teamEntries = Array.from(decimalsByTeam.entries());
  for (const [teamName, decimals] of teamEntries) {
    const consensusDecimal = median(decimals);
    const american = decimalToAmerican(consensusDecimal);
    // Upsert by unique team_name.
    await db
      .insert(tournamentOdds)
      .values({ teamName, odds: american, source: sourceLabel })
      .onConflictDoUpdate({
        target: tournamentOdds.teamName,
        set: { odds: american, source: sourceLabel, updatedAt: new Date() },
      });
    updated++;
  }

  return { updated, sources: Array.from(sourcesUsed), total: events.length };
}

let lastSync: { at: Date; updated: number; sources: string[]; total: number } | null = null;
export async function refreshAndStoreOdds(): Promise<typeof lastSync> {
  const result = await syncTournamentOdds();
  lastSync = { at: new Date(), ...result };
  return lastSync;
}
export function getLastOddsSync(): typeof lastSync {
  return lastSync;
}
