import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Search, Users, Star, Trophy, Video, ExternalLink, ChevronRight, X, Target, Award } from "lucide-react";

interface Team {
  id: number;
  name: string;
  teamName: string;
  flag: string;
  rank: number;
}

interface Player {
  id: number;
  teamId: number;
  name: string;
  position: string;
  number: number | null;
  dateOfBirth: string | null;
  height: string | null;
  currentClub: string | null;
  imageUrl: string | null;
  isCaptain: number;
  internationalCaps: number;
  internationalGoals: number;
  clubCareerGoals: number;
  clubCareerAssists: number;
  highlightVideoUrl: string | null;
  wikiUrl: string | null;
}

export default function Players() {
  const { t } = useTranslation();
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: teams = [], isLoading: teamsLoading } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    queryFn: async () => {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      return response.json();
    },
  });

  const { data: players = [], isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["/api/players", selectedTeamId],
    queryFn: async () => {
      const url = selectedTeamId 
        ? `/api/players?teamId=${selectedTeamId}` 
        : "/api/players";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch players");
      return response.json();
    },
  });

  const sortedTeams = [...teams].sort((a, b) => a.rank - b.rank);
  
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.currentClub?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTeamById = (teamId: number) => teams.find(t => t.id === teamId);

  const calculateAge = (dob: string | null) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getPositionColor = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes("goalkeeper")) return "bg-yellow-500/20 text-yellow-400";
    if (pos.includes("defender")) return "bg-blue-500/20 text-blue-400";
    if (pos.includes("midfielder")) return "bg-green-500/20 text-green-400";
    return "bg-red-500/20 text-red-400";
  };

  if (teamsLoading || playersLoading) {
    return (
      <Layout pageTitle="nav.players">
        <div className="pt-12 px-6 pb-20 flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">{t("players.loading")}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="nav.players">
      <div className="pt-12 px-6 pb-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2">{t("players.title")}</h1>
        <p className="text-muted-foreground mb-4">{t("players.subtitle")}</p>

        <div className="bg-card/50 border border-white/10 rounded-xl p-3 mb-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-white">{t("players.key")}:</span>{" "}
            <span className="inline-flex items-center mx-1">
              <span className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center mr-1">
                <span className="text-[8px] font-bold text-black">C</span>
              </span>
              = {t("players.keyCaption")}
            </span>
            <span className="mx-2">|</span>
            <span className="font-medium text-white">{t("players.caps")}</span> = {t("players.keyCaps")}
            <span className="mx-2">|</span>
            <span className="font-medium text-white">{t("players.intlGoals")}</span> = {t("players.keyIntlGoals")}
          </p>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-6">
          <p className="text-xs text-primary/90">
            {t("players.rosterNotice")}
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            placeholder={t("players.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            data-testid="input-player-search"
          />
        </div>

        <div className="mb-6 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => setSelectedTeamId(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTeamId === null
                  ? "bg-primary text-black"
                  : "bg-card border border-white/10 text-white hover:border-primary/50"
              }`}
              data-testid="button-all-teams"
            >
              {t("players.allTeams")}
            </button>
            {sortedTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeamId(team.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-2 ${
                  selectedTeamId === team.id
                    ? "bg-primary text-black"
                    : "bg-card border border-white/10 text-white hover:border-primary/50"
                }`}
                data-testid={`button-team-${team.id}`}
              >
                <img
                  src={`https://flagcdn.com/w20/${team.flag}.png`}
                  alt={team.name}
                  className="w-5 h-4 object-cover rounded-sm"
                  onError={(e) => {
                    e.currentTarget.src = `https://flagcdn.com/w20/${team.flag.split('-')[0]}.png`;
                  }}
                />
                <span>{team.name}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("players.noPlayersFound")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredPlayers.map((player) => {
              const team = getTeamById(player.teamId);
              return (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className="bg-card border border-white/5 rounded-xl p-4 hover:border-primary/50 transition-all cursor-pointer group"
                  data-testid={`card-player-${player.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-white/10">
                          {player.number ? (
                            <span className="text-xl font-bold text-primary">{player.number}</span>
                          ) : (
                            <Users className="w-6 h-6 text-primary/50" />
                          )}
                        </div>
                        {player.isCaptain === 1 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-black">C</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-lg text-white">{player.name}</h3>
                          {team && (
                            <img
                              src={`https://flagcdn.com/w20/${team.flag}.png`}
                              alt={team.name}
                              className="w-5 h-4 object-cover rounded-sm"
                              onError={(e) => {
                                e.currentTarget.src = `https://flagcdn.com/w20/${team.flag.split('-')[0]}.png`;
                              }}
                            />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPositionColor(player.position)}`}>
                            {player.position}
                          </span>
                          {player.currentClub && (
                            <span className="text-xs text-muted-foreground">{player.currentClub}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/5">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{player.internationalCaps}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("players.caps")}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-primary">{player.internationalGoals}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("players.intlGoals")}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{player.clubCareerGoals}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("players.clubGoals")}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedPlayer && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
            <div className="bg-card w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-3xl border border-white/10">
              <div className="sticky top-0 bg-card border-b border-white/10 p-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-white">{t("players.playerProfile")}</h2>
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  data-testid="button-close-player-modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center border-2 border-primary/30">
                      {selectedPlayer.number ? (
                        <span className="text-3xl font-bold text-primary">{selectedPlayer.number}</span>
                      ) : (
                        <Users className="w-10 h-10 text-primary/50" />
                      )}
                    </div>
                    {selectedPlayer.isCaptain === 1 && (
                      <div className="absolute -top-1 -right-1 w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-card">
                        <span className="text-sm font-bold text-black">C</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedPlayer.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getPositionColor(selectedPlayer.position)}`} data-testid="badge-player-position">
                        {selectedPlayer.position}
                      </span>
                      {(() => {
                        const team = getTeamById(selectedPlayer.teamId);
                        return team ? (
                          <div className="flex items-center space-x-1">
                            <img
                              src={`https://flagcdn.com/w20/${team.flag}.png`}
                              alt={team.name}
                              className="w-5 h-4 object-cover rounded-sm"
                              onError={(e) => {
                                e.currentTarget.src = `https://flagcdn.com/w20/${team.flag.split('-')[0]}.png`;
                              }}
                            />
                            <span className="text-sm text-muted-foreground">{team.name}</span>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedPlayer.currentClub && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("players.currentClub")}</p>
                      <p className="text-white font-medium">{selectedPlayer.currentClub}</p>
                    </div>
                  )}
                  {selectedPlayer.dateOfBirth && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("players.age")}</p>
                      <p className="text-white font-medium">{calculateAge(selectedPlayer.dateOfBirth)} {t("players.yearsOld")}</p>
                    </div>
                  )}
                  {selectedPlayer.height && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("players.height")}</p>
                      <p className="text-white font-medium">{selectedPlayer.height}</p>
                    </div>
                  )}
                  {selectedPlayer.number && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("players.shirtNumber")}</p>
                      <p className="text-white font-medium">#{selectedPlayer.number}</p>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Trophy className="w-4 h-4 mr-2 text-primary" />
                    {t("players.internationalCareer")}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-primary/20 to-transparent rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="w-4 h-4 text-primary" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("players.caps")}</p>
                      </div>
                      <p className="text-3xl font-bold text-white">{selectedPlayer.internationalCaps}</p>
                    </div>
                    <div className="bg-gradient-to-br from-primary/20 to-transparent rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="w-4 h-4 text-primary" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("players.goals")}</p>
                      </div>
                      <p className="text-3xl font-bold text-white">{selectedPlayer.internationalGoals}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-primary" />
                    {t("players.clubCareer")}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("players.totalGoals")}</p>
                      <p className="text-2xl font-bold text-white">{selectedPlayer.clubCareerGoals}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("players.totalAssists")}</p>
                      <p className="text-2xl font-bold text-white">{selectedPlayer.clubCareerAssists}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedPlayer.highlightVideoUrl && (
                    <a
                      href={selectedPlayer.highlightVideoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-red-500/20 hover:bg-red-500/30 rounded-xl p-4 transition-colors border border-red-500/20"
                      data-testid="link-player-highlights"
                    >
                      <div className="flex items-center space-x-3">
                        <Video className="w-5 h-5 text-red-400" />
                        <span className="font-medium text-white">{t("players.watchHighlights")}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-red-400" />
                    </a>
                  )}
                  {selectedPlayer.wikiUrl && (
                    <a
                      href={selectedPlayer.wikiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-blue-500/20 hover:bg-blue-500/30 rounded-xl p-4 transition-colors border border-blue-500/20"
                      data-testid="link-player-wiki"
                    >
                      <div className="flex items-center space-x-3">
                        <ExternalLink className="w-5 h-5 text-blue-400" />
                        <span className="font-medium text-white">{t("players.fullBiography")}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-blue-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
