import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";
import { TrendingUp, Trophy, Users, Calendar, AlertTriangle, Phone, ExternalLink, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { getFlagUrl } from "@/lib/flags";
import { apiUrl } from "@/lib/apiConfig";

// Server-side row shape returned by /api/tournament-odds.
interface ApiOddsRow {
  id: number;
  teamName: string;
  odds: string; // American format, e.g. "+485" or "-200"
  source: string;
  updatedAt: string;
}

interface TeamOdds {
  team: string;
  odds: string;
  impliedProbability: string;
}

/**
 * Convert American odds to implied probability (no-vig).
 *   +500 → 100/(500+100) = 16.7%
 *   -200 → 200/(200+100) = 66.7%
 */
function americanToImplied(odds: string): string {
  const n = parseInt(odds.replace(/[^-\d]/g, ""), 10);
  if (!Number.isFinite(n) || n === 0) return "—";
  const prob = n > 0 ? 100 / (n + 100) : Math.abs(n) / (Math.abs(n) + 100);
  return `${(prob * 100).toFixed(1)}%`;
}

/**
 * Numeric value of American odds (lower number = bigger favorite), used for sorting.
 */
function oddsRank(odds: string): number {
  const n = parseInt(odds.replace(/[^-\d]/g, ""), 10);
  if (!Number.isFinite(n)) return Number.MAX_SAFE_INTEGER;
  return n < 0 ? n : n; // negative numbers (favorites) come first naturally
}

function formatLastUpdated(rows: ApiOddsRow[]): string {
  if (!rows.length) return "—";
  const newest = rows
    .map((r) => new Date(r.updatedAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];
  return newest.toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function TournamentOdds() {
  const { t } = useTranslation();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [showHelpResources, setShowHelpResources] = useState(false);

  // Live odds from server — refreshed daily by The Odds API cron job.
  // refetchOnMount keeps the page snappy after navigation; staleTime caps API churn.
  const { data: oddsRows = [], isLoading: oddsLoading } = useQuery<ApiOddsRow[]>({
    queryKey: ["/api/tournament-odds"],
    queryFn: async () => {
      const res = await fetch(apiUrl("/api/tournament-odds"));
      if (!res.ok) throw new Error("Failed to load odds");
      return res.json();
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const championshipOdds: TeamOdds[] = oddsRows
    .filter((r) => r.odds && r.odds !== "N/A")
    .map((r) => ({
      team: r.teamName,
      odds: r.odds,
      impliedProbability: americanToImplied(r.odds),
    }))
    .sort((a, b) => oddsRank(a.odds) - oddsRank(b.odds));

  const oddsLastUpdated = formatLastUpdated(oddsRows);
  const oddsSource = oddsRows[0]?.source || "Live odds";

  const helpResources = [
    { nameKey: "odds.helpResources.ncpg", phone: "1-800-522-4700", url: "https://www.ncpgambling.org" },
    { nameKey: "odds.helpResources.gamblersAnonymous", phone: null, url: "https://www.gamblersanonymous.org" },
    { nameKey: "odds.helpResources.gamcare", phone: "0808-8020-133", url: "https://www.gamcare.org.uk" },
    { nameKey: "odds.helpResources.gamblingHelpAustralia", phone: "1800-858-858", url: "https://www.gamblinghelponline.org.au" },
    { nameKey: "odds.helpResources.adiccionesEspana", phone: "900-200-225", url: "https://www.adicciones.es" },
  ];

  return (
    <Layout pageTitle="odds.title">
      <div className="pt-12 px-6 pb-20">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">{t("odds.title")}</h1>
        </div>
        <p className="text-muted-foreground mb-6">{t("odds.subtitle")}</p>

        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2 mb-4">
          <span className="text-xs text-muted-foreground">Odds source: {oddsSource}</span>
          <span className="text-xs font-medium text-primary flex items-center gap-1.5">
            {oddsLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
            Updated: {oddsLastUpdated}
          </span>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-200 font-medium mb-1">{t("odds.disclaimer")}</p>
              <p className="text-xs text-amber-200/70">{t("odds.disclaimerDetail")}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-display font-bold text-white">{t("odds.championshipOdds")}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{t("odds.championshipDescription")}</p>
          
          {oddsLoading && championshipOdds.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Loading latest odds…</div>
          ) : championshipOdds.length === 0 ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center text-amber-200 text-sm">
              Odds are refreshing. New data will appear automatically once the daily sync completes.
            </div>
          ) : (
            <div className="space-y-2">
              {championshipOdds.map((team, index) => (
                <div
                  key={team.team}
                  className={`bg-card border border-white/5 rounded-xl p-4 flex items-center justify-between ${index < 3 ? 'border-l-4 border-l-primary' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-muted-foreground font-mono text-sm w-6">{index + 1}</span>
                    <img
                      src={getFlagUrl(team.team)}
                      alt={team.team}
                      className="w-8 h-6 object-cover rounded"
                    />
                    <span className="font-medium text-white">{team.team}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${team.odds.startsWith('+') ? 'text-primary' : 'text-white'}`}>
                      {team.odds}
                    </span>
                    <p className="text-xs text-muted-foreground">{team.impliedProbability}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-display font-bold text-white">{t("odds.matchOdds")}</h2>
          </div>
          <div className="bg-card/50 border border-white/10 rounded-xl p-6 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-white font-medium mb-2">{t("odds.matchOddsComingSoon")}</p>
            <p className="text-sm text-muted-foreground">{t("odds.matchOddsDescription")}</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-start space-x-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-200 font-bold mb-1">{t("odds.responsibleGambling")}</p>
              <p className="text-xs text-red-200/80 mb-3">{t("odds.responsibleGamblingMessage")}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowHelpResources(!showHelpResources)}
            className="w-full flex items-center justify-between py-2 px-3 bg-red-500/20 rounded-lg text-red-200 text-sm font-medium hover:bg-red-500/30 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{t("odds.getHelp")}</span>
            </span>
            {showHelpResources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showHelpResources && (
            <div className="mt-3 space-y-2">
              {helpResources.map((resource) => (
                <a
                  key={resource.nameKey}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{t(resource.nameKey)}</p>
                      {resource.phone && (
                        <p className="text-primary text-xs font-mono">{resource.phone}</p>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
