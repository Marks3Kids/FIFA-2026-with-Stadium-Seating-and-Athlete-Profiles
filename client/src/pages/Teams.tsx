import { Layout } from "@/components/Layout";
import { TeamDetailModal, teamSeasonData } from "@/components/TeamDetailModal";
import { Search, Users, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { getFlagUrl } from "@/lib/flags";

interface Team {
  id: number;
  name: string;
  teamName: string;
  flag: string;
  rank: number;
  coach: string;
  record: string;
  points: string;
}

export default function Teams() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    queryFn: async () => {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      return response.json();
    },
  });

  const sortedAndFilteredTeams = useMemo(() => {
    let filtered = teams;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = teams.filter(
        (team) =>
          team.name.toLowerCase().includes(query) ||
          team.teamName.toLowerCase().includes(query) ||
          team.coach.toLowerCase().includes(query)
      );
    }
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [teams, searchQuery]);

  if (isLoading) {
    return (
      <Layout pageTitle="nav.teams">
        <div className="pt-12 px-6 pb-20 flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">{t("teams.loading")}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="nav.teams">
      <div className="pt-12 px-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary mb-2">{t("header.worldCup")} {t("header.year")}</h1>
          <h2 className="text-2xl font-bold text-white mb-4">{t("teams.title")}</h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            {t("teams.description", "Complete roster information, current season records, and match highlights for all competing nations. Updated regularly in December 2025, March 2026, and May 2026.")}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2 italic">
            {t("common.dataDisclaimer")}
          </p>
        </div>

        <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">{t("teams.qualifiedCount", "42 of 48 teams qualified")}</span>
            {" • "}
            {t("teams.playoffInfo", "The final 6 teams will be determined through the FIFA Play-Off Tournament in March 2026 featuring: Bolivia, Congo DR, Iraq, Jamaica, New Caledonia, and Suriname competing for the remaining spots.")}
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder={t("teams.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {sortedAndFilteredTeams.map((team) => (
            <div 
              key={team.id} 
              onClick={() => setSelectedTeam(team)}
              className="bg-white border-l-4 border-l-primary rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <img 
                    src={getFlagUrl(team.name)} 
                    alt={`${team.name} flag`}
                    className="w-12 h-8 object-cover rounded shadow-sm border border-gray-200"
                  />
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 leading-tight">
                      {team.teamName}
                    </h3>
                    <p className="text-sm text-gray-500">{team.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Trophy className="w-3 h-3" />
                    {team.rank === 99 ? t("status.tbd") : `${t("status.rank")} #${team.rank}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                <Users className="w-4 h-4" />
                <span className="text-xs">{t("teams.headCoach")}:</span>
                <span className="text-sm font-medium text-gray-700">{team.coach === "TBD" ? t("status.tbd") : team.coach}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <div>
                  <span className="font-medium">{t("teams.record2025")}:</span>{" "}
                  <span className="text-gray-700">
                    {teamSeasonData[team.name] 
                      ? `${teamSeasonData[team.name].wins}W-${teamSeasonData[team.name].ties}T-${teamSeasonData[team.name].losses}L`
                      : t("status.tbd")}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mt-3">
                <p className="text-sm font-bold text-gray-800">{t("teams.squad")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TeamDetailModal
        team={selectedTeam}
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
      />
    </Layout>
  );
}
