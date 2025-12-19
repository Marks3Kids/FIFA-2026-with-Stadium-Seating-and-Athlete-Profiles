import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface Match {
  id: number;
  team1: string;
  team2: string;
  time: string;
  date: string;
  stadium: string;
  city: string;
  stage: string;
}

export default function Matches() {
  const { t } = useTranslation();
  const stages = [
    { key: "Group Stage", label: t("matches.stages.groupStage") },
    { key: "Round of 32", label: t("matches.stages.roundOf32") },
    { key: "Round of 16", label: t("matches.stages.roundOf16") },
    { key: "Quarter-finals", label: t("matches.stages.quarterFinals") },
  ];
  
  const { data: allMatches = [], isLoading } = useQuery<Match[]>({
    queryKey: ["/api/matches"],
    queryFn: async () => {
      const response = await fetch("/api/matches");
      if (!response.ok) throw new Error("Failed to fetch matches");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Layout pageTitle="nav.matches">
        <div className="pt-12 px-6 flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">{t("matches.loading")}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="nav.matches">
      <div className="pt-12 px-6 pb-6">
        <h1 className="text-4xl font-display font-bold text-white mb-6">{t("matches.title")}</h1>
        
        <Tabs defaultValue="Group Stage" className="w-full">
          <TabsList className="w-full bg-transparent border-b border-white/10 rounded-none h-auto p-0 justify-start overflow-x-auto mb-6 space-x-6 no-scrollbar">
            {stages.map((stage) => (
              <TabsTrigger 
                key={stage.key} 
                value={stage.key}
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-2 text-muted-foreground uppercase tracking-wider text-xs font-bold bg-transparent border-b-2 border-transparent transition-all"
              >
                {stage.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {stages.map((stage) => {
            const matches = allMatches.filter((m) => m.stage === stage.key);
            return (
              <TabsContent key={stage.key} value={stage.key} className="space-y-4 mt-0">
                {matches.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    {t("matches.noMatches")}
                  </div>
                ) : (
                  matches.map((match) => (
                    <div key={match.id} className="bg-card border border-white/5 rounded-xl p-0 overflow-hidden group">
                      <div className="bg-white/5 px-4 py-2 flex justify-between items-center border-b border-white/5">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{match.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-wider">{match.city}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex flex-col items-center w-1/3">
                          <div className="w-12 h-12 rounded-full bg-white/10 mb-2 flex items-center justify-center text-lg">⚽</div>
                          <span className="text-sm font-bold text-white">{match.team1}</span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center w-1/3">
                          <div className="bg-white/5 px-3 py-1 rounded text-xs font-mono text-primary mb-1">
                            {match.time}
                          </div>
                          <span className="text-[10px] text-muted-foreground uppercase">{t("matches.localTime")}</span>
                        </div>
                        
                        <div className="flex flex-col items-center w-1/3">
                          <div className="w-12 h-12 rounded-full bg-white/10 mb-2 flex items-center justify-center text-lg">⚽</div>
                          <span className="text-sm font-bold text-white">{match.team2}</span>
                        </div>
                      </div>
                      
                      <div className="bg-primary/10 h-1 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </div>
                  ))
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </Layout>
  );
}
