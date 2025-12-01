import { Layout } from "@/components/Layout";
import { Search, Users, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

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
  const { data: teams = [], isLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    queryFn: async () => {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-12 px-6 pb-20 flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">{t("teams.loading")}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-12 px-6 pb-20">
        <h1 className="text-4xl font-display font-bold text-white mb-6">{t("teams.title")}</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input 
            type="text" 
            placeholder={t("teams.searchPlaceholder")}
            className="w-full bg-card border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-card border border-white/5 rounded-xl p-5 hover:border-primary/50 transition-colors group cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 border border-white/10">
                    <img 
                      src={`https://flagcdn.com/w80/${team.flag}.png`}
                      alt={`${team.name} flag`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://flagcdn.com/w80/${team.flag.split('-')[0]}.png`;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-white leading-none mb-1">
                      {team.name} <span className="text-muted-foreground font-normal text-base">• {team.teamName}</span>
                    </h3>
                    <span className="text-[10px] text-primary uppercase tracking-wider font-bold bg-primary/10 px-2 py-0.5 rounded-full">{t("teams.rank", { rank: team.rank })}</span>
                  </div>
                </div>
                <div className="text-right">
                   <span className="block text-2xl font-display font-bold text-white/20 group-hover:text-white/40 transition-colors">{team.points}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                 <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-1.5 text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-wider">{t("teams.headCoach")}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-200">{team.coach}</span>
                 </div>
                 <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-1.5 text-muted-foreground">
                        <Activity className="w-3 h-3" />
                        <span className="text-[10px] uppercase tracking-wider">{t("teams.record2025")}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-200">{team.record} <span className="text-[10px] text-muted-foreground">{t("teams.recordFormat")}</span></span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
