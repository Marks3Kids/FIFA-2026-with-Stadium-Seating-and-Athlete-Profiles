import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Trophy, 
  Check, 
  RotateCcw, 
  Download,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from "lucide-react";
import { getFlagUrl } from "@/lib/flags";

interface Team {
  id: number;
  name: string;
  flag: string;
}

interface KnockoutMatch {
  id: number;
  stage: string;
  matchNumber: number;
  bracketSide: string;
  team1Slot: string;
  team2Slot: string;
  stadium: string;
  city: string;
}

interface BracketPredictions {
  round_of_32: { [matchNumber: number]: { team1: number | null; team2: number | null; winner: number | null } };
  round_of_16: { [matchNumber: number]: number | null };
  quarterfinal: { [matchNumber: number]: number | null };
  semifinal: { [matchNumber: number]: number | null };
  final: number | null;
}

const STORAGE_KEY = "bracket_challenge_2026";

const ROUNDS = ["round_of_32", "round_of_16", "quarterfinal", "semifinal", "final"];

export default function BracketChallenge() {
  const { t } = useTranslation();
  const [expandedRound, setExpandedRound] = useState<string>("round_of_32");
  const [predictions, setPredictions] = useState<BracketPredictions>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getEmptyPredictions();
      }
    }
    return getEmptyPredictions();
  });

  function getEmptyPredictions(): BracketPredictions {
    return {
      round_of_32: {},
      round_of_16: {},
      quarterfinal: {},
      semifinal: {},
      final: null
    };
  }

  const { data: teamsData } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/teams");
      return res.json();
    }
  });

  const { data: bracketsData } = useQuery<KnockoutMatch[]>({
    queryKey: ["/api/knockout-brackets"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/knockout-brackets");
      return res.json();
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions));
  }, [predictions]);

  const teams = teamsData || [];
  const brackets = bracketsData || [];

  const matchesByRound = useMemo(() => {
    const grouped: { [stage: string]: KnockoutMatch[] } = {};
    brackets.forEach(match => {
      if (!grouped[match.stage]) grouped[match.stage] = [];
      grouped[match.stage].push(match);
    });
    Object.keys(grouped).forEach(stage => {
      grouped[stage].sort((a, b) => a.matchNumber - b.matchNumber);
    });
    return grouped;
  }, [brackets]);

  const getTeamById = (id: number | null): Team | null => {
    if (!id) return null;
    return teams.find(t => t.id === id) || null;
  };

  const getR32Team = (matchNum: number, position: 'team1' | 'team2'): Team | null => {
    const match = predictions.round_of_32[matchNum];
    if (!match) return null;
    return getTeamById(match[position]);
  };

  const getR32Winner = (matchNum: number): Team | null => {
    const match = predictions.round_of_32[matchNum];
    if (!match || !match.winner) return null;
    return getTeamById(match.winner);
  };

  const getR16Contenders = (matchNum: number): [Team | null, Team | null] => {
    const r32Match1 = matchNum * 2 - 1;
    const r32Match2 = matchNum * 2;
    return [getR32Winner(r32Match1), getR32Winner(r32Match2)];
  };

  const getR16Winner = (matchNum: number): Team | null => {
    return getTeamById(predictions.round_of_16[matchNum] ?? null);
  };

  const getQFContenders = (matchNum: number): [Team | null, Team | null] => {
    const r16Match1 = matchNum * 2 - 1;
    const r16Match2 = matchNum * 2;
    return [getR16Winner(r16Match1), getR16Winner(r16Match2)];
  };

  const getQFWinner = (matchNum: number): Team | null => {
    return getTeamById(predictions.quarterfinal[matchNum] ?? null);
  };

  const getSFContenders = (matchNum: number): [Team | null, Team | null] => {
    const qfMatch1 = matchNum * 2 - 1;
    const qfMatch2 = matchNum * 2;
    return [getQFWinner(qfMatch1), getQFWinner(qfMatch2)];
  };

  const getSFWinner = (matchNum: number): Team | null => {
    return getTeamById(predictions.semifinal[matchNum] ?? null);
  };

  const getFinalContenders = (): [Team | null, Team | null] => {
    return [getSFWinner(1), getSFWinner(2)];
  };

  const clearDependentPicks = (
    predictions: BracketPredictions,
    fromRound: 'round_of_32' | 'round_of_16' | 'quarterfinal' | 'semifinal',
    matchNum: number,
    oldWinnerId: number | null
  ): BracketPredictions => {
    if (!oldWinnerId) return predictions;
    
    let result = { ...predictions };
    
    if (fromRound === 'round_of_32') {
      const r16MatchNum = Math.ceil(matchNum / 2);
      if (result.round_of_16[r16MatchNum] === oldWinnerId) {
        result.round_of_16 = { ...result.round_of_16, [r16MatchNum]: null };
        result = clearDependentPicks(result, 'round_of_16', r16MatchNum, oldWinnerId);
      }
    }
    
    if (fromRound === 'round_of_16') {
      const qfMatchNum = Math.ceil(matchNum / 2);
      if (result.quarterfinal[qfMatchNum] === oldWinnerId) {
        result.quarterfinal = { ...result.quarterfinal, [qfMatchNum]: null };
        result = clearDependentPicks(result, 'quarterfinal', qfMatchNum, oldWinnerId);
      }
    }
    
    if (fromRound === 'quarterfinal') {
      const sfMatchNum = Math.ceil(matchNum / 2);
      if (result.semifinal[sfMatchNum] === oldWinnerId) {
        result.semifinal = { ...result.semifinal, [sfMatchNum]: null };
        result = clearDependentPicks(result, 'semifinal', sfMatchNum, oldWinnerId);
      }
    }
    
    if (fromRound === 'semifinal') {
      if (result.final === oldWinnerId) {
        result.final = null;
      }
    }
    
    return result;
  };

  const handleSetR32Team = (matchNum: number, position: 'team1' | 'team2', teamId: number) => {
    setPredictions(prev => {
      const existing = prev.round_of_32[matchNum] || { team1: null, team2: null, winner: null };
      const oldTeamId = existing[position];
      const updated = { ...existing, [position]: teamId };
      
      if (updated.winner === oldTeamId) {
        updated.winner = null;
      }
      
      let result = {
        ...prev,
        round_of_32: { ...prev.round_of_32, [matchNum]: updated }
      };
      
      if (existing.winner === oldTeamId && oldTeamId) {
        result = clearDependentPicks(result, 'round_of_32', matchNum, oldTeamId);
      }
      
      return result;
    });
  };

  const handleSetR32Winner = (matchNum: number, teamId: number) => {
    setPredictions(prev => {
      const existing = prev.round_of_32[matchNum] || { team1: null, team2: null, winner: null };
      const oldWinnerId = existing.winner;
      
      let result = {
        ...prev,
        round_of_32: { ...prev.round_of_32, [matchNum]: { ...existing, winner: teamId } }
      };
      
      if (oldWinnerId && oldWinnerId !== teamId) {
        result = clearDependentPicks(result, 'round_of_32', matchNum, oldWinnerId);
      }
      
      return result;
    });
  };

  const handleSetR16Winner = (matchNum: number, teamId: number) => {
    setPredictions(prev => {
      const oldWinnerId = prev.round_of_16[matchNum];
      
      let result = {
        ...prev,
        round_of_16: { ...prev.round_of_16, [matchNum]: teamId }
      };
      
      if (oldWinnerId && oldWinnerId !== teamId) {
        result = clearDependentPicks(result, 'round_of_16', matchNum, oldWinnerId);
      }
      
      return result;
    });
  };

  const handleSetQFWinner = (matchNum: number, teamId: number) => {
    setPredictions(prev => {
      const oldWinnerId = prev.quarterfinal[matchNum];
      
      let result = {
        ...prev,
        quarterfinal: { ...prev.quarterfinal, [matchNum]: teamId }
      };
      
      if (oldWinnerId && oldWinnerId !== teamId) {
        result = clearDependentPicks(result, 'quarterfinal', matchNum, oldWinnerId);
      }
      
      return result;
    });
  };

  const handleSetSFWinner = (matchNum: number, teamId: number) => {
    setPredictions(prev => {
      const oldWinnerId = prev.semifinal[matchNum];
      
      let result = {
        ...prev,
        semifinal: { ...prev.semifinal, [matchNum]: teamId }
      };
      
      if (oldWinnerId && oldWinnerId !== teamId) {
        result = clearDependentPicks(result, 'semifinal', matchNum, oldWinnerId);
      }
      
      return result;
    });
  };

  const handleSetFinalWinner = (teamId: number) => {
    setPredictions(prev => ({
      ...prev,
      final: teamId
    }));
  };

  const handleReset = () => {
    if (confirm(t("bracket.confirmReset"))) {
      setPredictions(getEmptyPredictions());
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getCompletionPercentage = (): number => {
    let completed = 0;
    let total = 31;
    
    for (let i = 1; i <= 16; i++) {
      const m = predictions.round_of_32[i];
      if (m?.team1 && m?.team2 && m?.winner) completed++;
    }
    
    for (let i = 1; i <= 8; i++) {
      if (predictions.round_of_16[i]) completed++;
    }
    
    for (let i = 1; i <= 4; i++) {
      if (predictions.quarterfinal[i]) completed++;
    }
    
    for (let i = 1; i <= 2; i++) {
      if (predictions.semifinal[i]) completed++;
    }
    
    if (predictions.final) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getRoundLabel = (round: string) => {
    switch (round) {
      case "round_of_32": return t("bracket.roundOf32");
      case "round_of_16": return t("bracket.roundOf16");
      case "quarterfinal": return t("bracket.quarterfinals");
      case "semifinal": return t("bracket.semifinals");
      case "final": return t("bracket.final");
      default: return round;
    }
  };

  const getMatchesForRound = (round: string): number => {
    switch (round) {
      case "round_of_32": return 16;
      case "round_of_16": return 8;
      case "quarterfinal": return 4;
      case "semifinal": return 2;
      case "final": return 1;
      default: return 0;
    }
  };

  const getCompletedForRound = (round: string): number => {
    let count = 0;
    if (round === "round_of_32") {
      for (let i = 1; i <= 16; i++) {
        const m = predictions.round_of_32[i];
        if (m?.team1 && m?.team2 && m?.winner) count++;
      }
    } else if (round === "round_of_16") {
      for (let i = 1; i <= 8; i++) {
        if (predictions.round_of_16[i]) count++;
      }
    } else if (round === "quarterfinal") {
      for (let i = 1; i <= 4; i++) {
        if (predictions.quarterfinal[i]) count++;
      }
    } else if (round === "semifinal") {
      for (let i = 1; i <= 2; i++) {
        if (predictions.semifinal[i]) count++;
      }
    } else if (round === "final") {
      if (predictions.final) count = 1;
    }
    return count;
  };

  const champion = getTeamById(predictions.final);

  const TeamButton = ({ 
    team, 
    isSelected, 
    onClick, 
    disabled = false,
    placeholder = ""
  }: { 
    team: Team | null; 
    isSelected: boolean; 
    onClick: () => void;
    disabled?: boolean;
    placeholder?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled || !team}
      className={`flex items-center gap-2 p-2 rounded-lg border transition-all w-full ${
        isSelected 
          ? "border-primary bg-primary/20" 
          : team
            ? "border-white/10 hover:border-white/30"
            : "border-white/5 bg-white/5"
      } ${disabled || !team ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {team ? (
        <>
          <img 
            src={getFlagUrl(team.name)} 
            alt={team.name}
            className="w-6 h-4 object-cover rounded shadow-sm"
          />
          <span className={`text-sm truncate ${isSelected ? "text-primary font-medium" : "text-white"}`}>
            {team.name}
          </span>
          {isSelected && <Check className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
        </>
      ) : (
        <span className="text-xs text-muted-foreground italic">{placeholder || "TBD"}</span>
      )}
    </button>
  );

  const TeamSelector = ({ 
    selectedTeamId, 
    onSelect,
    usedTeamIds = []
  }: { 
    selectedTeamId: number | null;
    onSelect: (teamId: number) => void;
    usedTeamIds?: number[];
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedTeam = getTeamById(selectedTeamId);
    
    const availableTeams = teams.filter(t => !usedTeamIds.includes(t.id) || t.id === selectedTeamId);
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 p-2 rounded-lg border w-full transition-all ${
            selectedTeam ? "border-primary/50 bg-primary/10" : "border-white/10 bg-white/5"
          }`}
        >
          {selectedTeam ? (
            <>
              <img 
                src={getFlagUrl(selectedTeam.name)} 
                alt={selectedTeam.name}
                className="w-6 h-4 object-cover rounded shadow-sm"
              />
              <span className="text-sm text-white truncate">{selectedTeam.name}</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">{t("bracket.selectTeam")}</span>
          )}
          <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-card border border-white/10 rounded-lg shadow-xl">
            {availableTeams.map(team => (
              <button
                key={team.id}
                onClick={() => {
                  onSelect(team.id);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 p-2 w-full hover:bg-white/10 transition-colors"
              >
                <img 
                  src={getFlagUrl(team.name)} 
                  alt={team.name}
                  className="w-5 h-3 object-cover rounded"
                />
                <span className="text-sm text-white">{team.name}</span>
                {team.id === selectedTeamId && <Check className="w-3 h-3 text-primary ml-auto" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getUsedTeamIds = (): number[] => {
    const used: number[] = [];
    Object.values(predictions.round_of_32).forEach(m => {
      if (m?.team1) used.push(m.team1);
      if (m?.team2) used.push(m.team2);
    });
    return used;
  };

  return (
    <Layout pageTitle={t("bracket.title")}>
      <div className="px-4 pb-24 pt-4">
        <div className="bg-gradient-to-br from-primary/20 to-yellow-500/20 rounded-2xl p-4 mb-6 border border-primary/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-white">{t("bracket.yourPick")}</h2>
                <p className="text-sm text-muted-foreground">{t("bracket.champion2026")}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{getCompletionPercentage()}%</span>
              <p className="text-xs text-muted-foreground">{t("bracket.complete")}</p>
            </div>
          </div>
          
          {champion ? (
            <div className="flex items-center gap-3 bg-card/50 rounded-xl p-3">
              <img 
                src={getFlagUrl(champion.name)} 
                alt={champion.name}
                className="w-10 h-7 object-cover rounded shadow"
              />
              <span className="text-lg font-bold text-white">{champion.name}</span>
              <Check className="w-5 h-5 text-primary ml-auto" />
            </div>
          ) : (
            <div className="bg-card/50 rounded-xl p-3 text-center text-muted-foreground">
              {t("bracket.selectChampion")}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={handleReset}
            className="flex-1 flex items-center justify-center gap-2 bg-card border border-white/10 rounded-xl py-3 text-sm text-muted-foreground hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t("bracket.reset")}
          </button>
          <a
            href="/downloads/world-cup-2026-bracket.html"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-2 bg-card border border-white/10 rounded-xl py-3 text-sm text-muted-foreground hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t("bracket.downloadPDF")}
          </a>
        </div>

        <div className="space-y-3">
          {ROUNDS.map((round) => {
            const totalMatches = getMatchesForRound(round);
            const completedMatches = getCompletedForRound(round);
            const isExpanded = expandedRound === round;
            
            return (
              <div key={round} className="bg-card border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedRound(isExpanded ? "" : round)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      completedMatches === totalMatches ? "bg-primary/20" : "bg-white/5"
                    }`}>
                      {completedMatches === totalMatches ? (
                        <Check className="w-5 h-5 text-primary" />
                      ) : (
                        <span className="text-sm font-bold text-muted-foreground">
                          {completedMatches}/{totalMatches}
                        </span>
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-display font-bold text-white">{getRoundLabel(round)}</h3>
                      <p className="text-xs text-muted-foreground">
                        {totalMatches} {t("bracket.matches")}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="border-t border-white/5 p-4 space-y-4">
                    {round === "round_of_32" && Array.from({ length: 16 }, (_, i) => {
                      const matchNum = i + 1;
                      const match = predictions.round_of_32[matchNum] || { team1: null, team2: null, winner: null };
                      const team1 = getTeamById(match.team1);
                      const team2 = getTeamById(match.team2);
                      const usedIds = getUsedTeamIds();
                      
                      return (
                        <div key={matchNum} className="bg-background/50 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                            <span className="bg-white/10 px-2 py-0.5 rounded">{t("bracket.match")} {matchNum}</span>
                          </div>
                          
                          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center mb-3">
                            <TeamSelector
                              selectedTeamId={match.team1}
                              onSelect={(id) => handleSetR32Team(matchNum, 'team1', id)}
                              usedTeamIds={usedIds}
                            />
                            <span className="text-xs text-muted-foreground px-2">vs</span>
                            <TeamSelector
                              selectedTeamId={match.team2}
                              onSelect={(id) => handleSetR32Team(matchNum, 'team2', id)}
                              usedTeamIds={usedIds}
                            />
                          </div>
                          
                          {team1 && team2 && (
                            <div className="pt-2 border-t border-white/10">
                              <div className="text-xs text-muted-foreground mb-2">{t("bracket.pickWinner")}:</div>
                              <div className="grid grid-cols-2 gap-2">
                                <TeamButton
                                  team={team1}
                                  isSelected={match.winner === match.team1}
                                  onClick={() => handleSetR32Winner(matchNum, match.team1!)}
                                />
                                <TeamButton
                                  team={team2}
                                  isSelected={match.winner === match.team2}
                                  onClick={() => handleSetR32Winner(matchNum, match.team2!)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {round === "round_of_16" && Array.from({ length: 8 }, (_, i) => {
                      const matchNum = i + 1;
                      const [team1, team2] = getR16Contenders(matchNum);
                      const winner = getR16Winner(matchNum);
                      
                      return (
                        <div key={matchNum} className="bg-background/50 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                            <span className="bg-white/10 px-2 py-0.5 rounded">{t("bracket.match")} {matchNum}</span>
                            <span className="text-xs opacity-60">
                              (R32 #{matchNum * 2 - 1} vs #{matchNum * 2})
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <TeamButton
                              team={team1}
                              isSelected={winner?.id === team1?.id}
                              onClick={() => team1 && handleSetR16Winner(matchNum, team1.id)}
                              placeholder={`${t("bracket.winnerOf")} R32 #${matchNum * 2 - 1}`}
                            />
                            <TeamButton
                              team={team2}
                              isSelected={winner?.id === team2?.id}
                              onClick={() => team2 && handleSetR16Winner(matchNum, team2.id)}
                              placeholder={`${t("bracket.winnerOf")} R32 #${matchNum * 2}`}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {round === "quarterfinal" && Array.from({ length: 4 }, (_, i) => {
                      const matchNum = i + 1;
                      const [team1, team2] = getQFContenders(matchNum);
                      const winner = getQFWinner(matchNum);
                      
                      return (
                        <div key={matchNum} className="bg-background/50 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-3">
                            <span className="bg-white/10 px-2 py-0.5 rounded">{t("bracket.match")} {matchNum}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <TeamButton
                              team={team1}
                              isSelected={winner?.id === team1?.id}
                              onClick={() => team1 && handleSetQFWinner(matchNum, team1.id)}
                              placeholder={`${t("bracket.winnerOf")} R16 #${matchNum * 2 - 1}`}
                            />
                            <TeamButton
                              team={team2}
                              isSelected={winner?.id === team2?.id}
                              onClick={() => team2 && handleSetQFWinner(matchNum, team2.id)}
                              placeholder={`${t("bracket.winnerOf")} R16 #${matchNum * 2}`}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {round === "semifinal" && Array.from({ length: 2 }, (_, i) => {
                      const matchNum = i + 1;
                      const [team1, team2] = getSFContenders(matchNum);
                      const winner = getSFWinner(matchNum);
                      
                      return (
                        <div key={matchNum} className="bg-background/50 rounded-xl p-3">
                          <div className="text-xs text-muted-foreground mb-3">
                            <span className="bg-white/10 px-2 py-0.5 rounded">{t("bracket.match")} {matchNum}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <TeamButton
                              team={team1}
                              isSelected={winner?.id === team1?.id}
                              onClick={() => team1 && handleSetSFWinner(matchNum, team1.id)}
                              placeholder={`${t("bracket.winnerOf")} QF #${matchNum * 2 - 1}`}
                            />
                            <TeamButton
                              team={team2}
                              isSelected={winner?.id === team2?.id}
                              onClick={() => team2 && handleSetSFWinner(matchNum, team2.id)}
                              placeholder={`${t("bracket.winnerOf")} QF #${matchNum * 2}`}
                            />
                          </div>
                        </div>
                      );
                    })}

                    {round === "final" && (() => {
                      const [team1, team2] = getFinalContenders();
                      
                      return (
                        <div className="bg-gradient-to-br from-yellow-500/10 to-primary/10 rounded-xl p-4 border border-yellow-500/20">
                          <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <span className="font-display font-bold text-white">{t("bracket.worldCupFinal")}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <TeamButton
                              team={team1}
                              isSelected={champion?.id === team1?.id}
                              onClick={() => team1 && handleSetFinalWinner(team1.id)}
                              placeholder={`${t("bracket.winnerOf")} SF #1`}
                            />
                            <TeamButton
                              team={team2}
                              isSelected={champion?.id === team2?.id}
                              onClick={() => team2 && handleSetFinalWinner(team2.id)}
                              placeholder={`${t("bracket.winnerOf")} SF #2`}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-card/50 border border-white/5 rounded-xl">
          <p className="text-xs text-muted-foreground text-center">
            {t("bracket.disclaimer")}
          </p>
        </div>
      </div>
    </Layout>
  );
}
