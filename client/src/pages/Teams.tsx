import { Layout } from "@/components/Layout";
import { Search, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";

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
        <h1 className="text-4xl font-display font-bold text-white mb-6">{t("teams.title")}</h1>
        
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
            <div key={team.id} className="bg-white border-l-4 border-l-primary rounded-xl p-5 hover:shadow-lg transition-shadow group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 leading-tight">
                    {team.teamName}
                  </h3>
                  <p className="text-sm text-gray-500">{team.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    <Users className="w-3 h-3" />
                    {team.rank === 99 ? 'TBD' : `#${team.rank}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-gray-500 mb-3">
                <Users className="w-4 h-4" />
                <span className="text-xs">{t("teams.headCoach")}:</span>
                <span className="text-sm font-medium text-gray-700">{team.coach}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-100 pt-3">
                <div>
                  <span className="font-medium">{t("teams.record2025")}:</span>{" "}
                  <span className="text-gray-700">{team.record}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mt-3">
                <p className="text-sm font-bold text-gray-800">{t("qualifiedTeams.squad", "Squad")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
