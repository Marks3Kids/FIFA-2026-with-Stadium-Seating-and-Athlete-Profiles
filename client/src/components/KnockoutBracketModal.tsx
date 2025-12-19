import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Trophy, MapPin, Calendar, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getFlagUrl } from "@/lib/flags";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KnockoutBracket {
  id: number;
  stage: string;
  matchNumber: number;
  bracketSide: string;
  team1Slot: string;
  team2Slot: string;
  team1Id: number | null;
  team2Id: number | null;
  stadium: string;
  city: string;
  country: string;
  matchDate: string | null;
  matchTime: string | null;
  status: string;
  winnerId: number | null;
  score: string | null;
}

interface KnockoutBracketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const stageOrder = ["round_of_32", "round_of_16", "quarterfinal", "semifinal", "third_place", "final"];

const stageLabels: Record<string, string> = {
  round_of_32: "bracket.roundOf32",
  round_of_16: "bracket.roundOf16",
  quarterfinal: "bracket.quarterfinals",
  semifinal: "bracket.semifinals",
  third_place: "bracket.thirdPlace",
  final: "bracket.final",
};

const stageMatchCounts: Record<string, number> = {
  round_of_32: 16,
  round_of_16: 8,
  quarterfinal: 4,
  semifinal: 2,
  third_place: 1,
  final: 1,
};

export function KnockoutBracketModal({ isOpen, onClose }: KnockoutBracketModalProps) {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language?.split("-")[0] || "en";

  const { data: brackets = [], isLoading } = useQuery<KnockoutBracket[]>({
    queryKey: ["/api/knockout-brackets", currentLocale],
    queryFn: async () => {
      const response = await fetch(`/api/knockout-brackets?locale=${currentLocale}`);
      if (!response.ok) throw new Error("Failed to fetch brackets");
      return response.json();
    },
    enabled: isOpen,
  });

  const groupedBrackets = stageOrder.reduce((acc, stage) => {
    acc[stage] = brackets.filter((b) => b.stage === stage).sort((a, b) => a.matchNumber - b.matchNumber);
    return acc;
  }, {} as Record<string, KnockoutBracket[]>);

  const getCountryFlag = (country: string) => {
    const countryMap: Record<string, string> = {
      USA: "us",
      Mexico: "mx",
      Canada: "ca",
    };
    return countryMap[country] || "us";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-gray-900 border-gray-700">
        <DialogHeader className="p-6 pb-2 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-display font-bold text-white">
                  {t("bracket.title", "Knockout Brackets")}
                </DialogTitle>
                <p className="text-sm text-gray-400 mt-1">
                  {t("bracket.subtitle", "2026 FIFA World Cup Tournament Structure")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-400">{t("common.loading", "Loading...")}</div>
            </div>
          ) : brackets.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">{t("bracket.noData", "Bracket data not available yet")}</p>
              <p className="text-sm text-gray-500">
                {t("bracket.drawPending", "The official draw will determine team positions")}
              </p>
            </div>
          ) : (
            <Tabs defaultValue="round_of_32" className="w-full">
              <TabsList className="w-full bg-gray-800 p-1 mb-4 grid grid-cols-3 md:grid-cols-6 gap-1">
                {stageOrder.map((stage) => (
                  <TabsTrigger
                    key={stage}
                    value={stage}
                    className="text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {t(stageLabels[stage], stage.replace(/_/g, " ").toUpperCase())}
                  </TabsTrigger>
                ))}
              </TabsList>

              {stageOrder.map((stage) => (
                <TabsContent key={stage} value={stage} className="mt-0">
                  <ScrollArea className="h-[50vh]">
                    <div className="space-y-3">
                      {stage === "final" && (
                        <div className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 rounded-xl p-4 mb-4">
                          <div className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                            <Trophy className="w-5 h-5" />
                            {t("bracket.finalMatch", "The Final")}
                          </div>
                          <p className="text-sm text-gray-300">
                            {t("bracket.finalInfo", "The championship match will be held at MetLife Stadium in New York/New Jersey")}
                          </p>
                        </div>
                      )}

                      <div className="grid gap-3 md:grid-cols-2">
                        {groupedBrackets[stage]?.map((match) => (
                          <div
                            key={match.id}
                            className={`bg-gray-800 rounded-xl p-4 border ${
                              stage === "final"
                                ? "border-yellow-500/50"
                                : stage === "semifinal"
                                ? "border-primary/50"
                                : "border-gray-700"
                            } hover:border-primary/30 transition-colors`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                {t("bracket.match", "Match")} {match.matchNumber}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  match.status === "completed"
                                    ? "bg-green-500/20 text-green-400"
                                    : match.status === "scheduled"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-gray-700 text-gray-400"
                                }`}
                              >
                                {match.status === "pending"
                                  ? t("bracket.pending", "Pending")
                                  : match.status === "scheduled"
                                  ? t("bracket.scheduled", "Scheduled")
                                  : t("bracket.completed", "Completed")}
                              </span>
                            </div>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
                                <div className="w-8 h-6 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">
                                  {match.team1Id ? (
                                    <img
                                      src={getFlagUrl(match.team1Slot)}
                                      alt=""
                                      className="w-8 h-6 object-cover rounded"
                                    />
                                  ) : (
                                    "?"
                                  )}
                                </div>
                                <span className="flex-1 text-sm text-white font-medium truncate">
                                  {match.team1Slot}
                                </span>
                                {match.score && (
                                  <span className="text-lg font-bold text-white">
                                    {match.score.split("-")[0]}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-center">
                                <span className="text-xs text-gray-500 px-2">vs</span>
                              </div>

                              <div className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg">
                                <div className="w-8 h-6 bg-gray-600 rounded flex items-center justify-center text-xs text-gray-400">
                                  {match.team2Id ? (
                                    <img
                                      src={getFlagUrl(match.team2Slot)}
                                      alt=""
                                      className="w-8 h-6 object-cover rounded"
                                    />
                                  ) : (
                                    "?"
                                  )}
                                </div>
                                <span className="flex-1 text-sm text-white font-medium truncate">
                                  {match.team2Slot}
                                </span>
                                {match.score && (
                                  <span className="text-lg font-bold text-white">
                                    {match.score.split("-")[1]}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="border-t border-gray-700 pt-3 space-y-1.5">
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate">{match.stadium}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <img
                                  src={`https://flagcdn.com/24x18/${getCountryFlag(match.country)}.png`}
                                  alt={match.country}
                                  className="w-4 h-3 rounded-sm"
                                />
                                <span>
                                  {match.city}, {match.country}
                                </span>
                              </div>
                              {match.matchDate && (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>
                                    {match.matchDate} {match.matchTime && `at ${match.matchTime}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {groupedBrackets[stage]?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>{t("bracket.noMatches", "No matches in this stage yet")}</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          )}

          <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
            <h4 className="text-sm font-medium text-white mb-2">
              {t("bracket.aboutTitle", "About the Knockout Stage")}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t(
                "bracket.aboutDescription",
                "The 2026 FIFA World Cup knockout stage begins after the group stage, featuring 32 teams competing in single-elimination matches across 16 host cities in the USA, Canada, and Mexico. Team positions will be determined by the official FIFA draw."
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
