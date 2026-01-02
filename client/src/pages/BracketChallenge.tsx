import { useState, useEffect, useMemo, useRef } from "react";
import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Check, 
  RotateCcw, 
  Download,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  X
} from "lucide-react";
import { getFlagUrl } from "@/lib/flags";

interface Team {
  id: number;
  name: string;
  flag: string;
}

interface BracketPredictions {
  round_of_32: { [matchNumber: number]: { team1: number | null; team2: number | null; winner: number | null } };
  round_of_16: { [matchNumber: number]: number | null };
  quarterfinal: { [matchNumber: number]: number | null };
  semifinal: { [matchNumber: number]: number | null };
  final: number | null;
}

const STORAGE_KEY = "bracket_challenge_2026";

const ROUNDS = [
  { key: "round_of_32", matches: 16, label: "roundOf32" },
  { key: "round_of_16", matches: 8, label: "roundOf16" },
  { key: "quarterfinal", matches: 4, label: "quarterfinals" },
  { key: "semifinal", matches: 2, label: "semifinals" },
  { key: "final", matches: 1, label: "final" }
];

export default function BracketChallenge() {
  const { t } = useTranslation();
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(predictions));
  }, [predictions]);

  const teams = teamsData || [];

  const getTeamById = (id: number | null): Team | null => {
    if (!id) return null;
    return teams.find(t => t.id === id) || null;
  };

  const getR32Winner = (matchNum: number): Team | null => {
    const match = predictions.round_of_32[matchNum];
    if (!match || !match.winner) return null;
    return getTeamById(match.winner);
  };

  const getR16Winner = (matchNum: number): Team | null => {
    return getTeamById(predictions.round_of_16[matchNum] ?? null);
  };

  const getQFWinner = (matchNum: number): Team | null => {
    return getTeamById(predictions.quarterfinal[matchNum] ?? null);
  };

  const getSFWinner = (matchNum: number): Team | null => {
    return getTeamById(predictions.semifinal[matchNum] ?? null);
  };

  const getMatchContenders = (round: string, matchNum: number): [Team | null, Team | null] => {
    if (round === "round_of_32") {
      const match = predictions.round_of_32[matchNum];
      return [getTeamById(match?.team1 ?? null), getTeamById(match?.team2 ?? null)];
    }
    if (round === "round_of_16") {
      return [getR32Winner(matchNum * 2 - 1), getR32Winner(matchNum * 2)];
    }
    if (round === "quarterfinal") {
      return [getR16Winner(matchNum * 2 - 1), getR16Winner(matchNum * 2)];
    }
    if (round === "semifinal") {
      return [getQFWinner(matchNum * 2 - 1), getQFWinner(matchNum * 2)];
    }
    if (round === "final") {
      return [getSFWinner(1), getSFWinner(2)];
    }
    return [null, null];
  };

  const getMatchWinner = (round: string, matchNum: number): Team | null => {
    if (round === "round_of_32") return getR32Winner(matchNum);
    if (round === "round_of_16") return getR16Winner(matchNum);
    if (round === "quarterfinal") return getQFWinner(matchNum);
    if (round === "semifinal") return getSFWinner(matchNum);
    if (round === "final") return getTeamById(predictions.final);
    return null;
  };

  const clearDependentPicks = (
    preds: BracketPredictions,
    fromRound: string,
    matchNum: number,
    oldWinnerId: number | null
  ): BracketPredictions => {
    if (!oldWinnerId) return preds;
    let result = { ...preds };
    
    if (fromRound === "round_of_32") {
      const r16Match = Math.ceil(matchNum / 2);
      if (result.round_of_16[r16Match] === oldWinnerId) {
        result.round_of_16 = { ...result.round_of_16, [r16Match]: null };
        result = clearDependentPicks(result, "round_of_16", r16Match, oldWinnerId);
      }
    }
    if (fromRound === "round_of_16") {
      const qfMatch = Math.ceil(matchNum / 2);
      if (result.quarterfinal[qfMatch] === oldWinnerId) {
        result.quarterfinal = { ...result.quarterfinal, [qfMatch]: null };
        result = clearDependentPicks(result, "quarterfinal", qfMatch, oldWinnerId);
      }
    }
    if (fromRound === "quarterfinal") {
      const sfMatch = Math.ceil(matchNum / 2);
      if (result.semifinal[sfMatch] === oldWinnerId) {
        result.semifinal = { ...result.semifinal, [sfMatch]: null };
        result = clearDependentPicks(result, "semifinal", sfMatch, oldWinnerId);
      }
    }
    if (fromRound === "semifinal") {
      if (result.final === oldWinnerId) {
        result.final = null;
      }
    }
    return result;
  };

  const handleSelectWinner = (round: string, matchNum: number, teamId: number) => {
    setPredictions(prev => {
      let result = { ...prev };
      
      if (round === "round_of_32") {
        const existing = prev.round_of_32[matchNum] || { team1: null, team2: null, winner: null };
        const oldWinner = existing.winner;
        result.round_of_32 = { ...prev.round_of_32, [matchNum]: { ...existing, winner: teamId } };
        if (oldWinner && oldWinner !== teamId) {
          result = clearDependentPicks(result, round, matchNum, oldWinner);
        }
      } else if (round === "round_of_16") {
        const oldWinner = prev.round_of_16[matchNum];
        result.round_of_16 = { ...prev.round_of_16, [matchNum]: teamId };
        if (oldWinner && oldWinner !== teamId) {
          result = clearDependentPicks(result, round, matchNum, oldWinner);
        }
      } else if (round === "quarterfinal") {
        const oldWinner = prev.quarterfinal[matchNum];
        result.quarterfinal = { ...prev.quarterfinal, [matchNum]: teamId };
        if (oldWinner && oldWinner !== teamId) {
          result = clearDependentPicks(result, round, matchNum, oldWinner);
        }
      } else if (round === "semifinal") {
        const oldWinner = prev.semifinal[matchNum];
        result.semifinal = { ...prev.semifinal, [matchNum]: teamId };
        if (oldWinner && oldWinner !== teamId) {
          result = clearDependentPicks(result, round, matchNum, oldWinner);
        }
      } else if (round === "final") {
        result.final = teamId;
      }
      
      return result;
    });
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
        result = clearDependentPicks(result, "round_of_32", matchNum, oldTeamId);
      }
      
      return result;
    });
  };

  const handleReset = () => {
    if (confirm(t("bracket.confirmReset"))) {
      setPredictions(getEmptyPredictions());
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const getCompletionPercentage = (): number => {
    let completed = 0;
    for (let i = 1; i <= 16; i++) {
      const m = predictions.round_of_32[i];
      if (m?.team1 && m?.team2 && m?.winner) completed++;
    }
    for (let i = 1; i <= 8; i++) if (predictions.round_of_16[i]) completed++;
    for (let i = 1; i <= 4; i++) if (predictions.quarterfinal[i]) completed++;
    for (let i = 1; i <= 2; i++) if (predictions.semifinal[i]) completed++;
    if (predictions.final) completed++;
    return Math.round((completed / 31) * 100);
  };

  const getUsedTeamIds = (): number[] => {
    const used: number[] = [];
    Object.values(predictions.round_of_32).forEach(m => {
      if (m?.team1) used.push(m.team1);
      if (m?.team2) used.push(m.team2);
    });
    return used;
  };

  const currentRound = ROUNDS[currentRoundIndex];
  const champion = getTeamById(predictions.final);

  const goToNextRound = () => {
    if (currentRoundIndex < ROUNDS.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
    }
  };

  const goToPrevRound = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
    }
  };

  const TeamSlot = ({ 
    team, 
    isWinner, 
    onClick,
    isSelectable,
    position
  }: { 
    team: Team | null;
    isWinner: boolean;
    onClick: () => void;
    isSelectable: boolean;
    position: 'top' | 'bottom';
  }) => (
    <button
      onClick={onClick}
      disabled={!isSelectable || !team}
      className={`
        w-full flex items-center gap-2 px-3 py-2 transition-all
        ${position === 'top' ? 'rounded-t-lg border-b border-white/5' : 'rounded-b-lg'}
        ${isWinner 
          ? 'bg-primary/20 border-primary/50' 
          : team 
            ? 'bg-card hover:bg-white/10' 
            : 'bg-card/50'
        }
        ${!isSelectable || !team ? 'cursor-default' : 'cursor-pointer'}
      `}
    >
      {team ? (
        <>
          <img 
            src={getFlagUrl(team.name)} 
            alt={team.name}
            className="w-6 h-4 object-cover rounded shadow-sm flex-shrink-0"
          />
          <span className={`text-sm truncate flex-1 text-left ${isWinner ? 'text-primary font-semibold' : 'text-white'}`}>
            {team.name}
          </span>
          {isWinner && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
        </>
      ) : (
        <span className="text-xs text-muted-foreground italic">TBD</span>
      )}
    </button>
  );

  const TeamSelector = ({ 
    matchNum, 
    position,
    currentTeamId
  }: { 
    matchNum: number;
    position: 'team1' | 'team2';
    currentTeamId: number | null;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentTeam = getTeamById(currentTeamId);
    const usedIds = getUsedTeamIds();
    const availableTeams = teams.filter(t => !usedIds.includes(t.id) || t.id === currentTeamId);

    return (
      <div className={`relative ${position === 'team1' ? 'rounded-t-lg border-b border-white/5' : 'rounded-b-lg'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center gap-2 px-3 py-2 transition-all
            ${currentTeam ? 'bg-card' : 'bg-card/50'}
            ${position === 'team1' ? 'rounded-t-lg' : 'rounded-b-lg'}
            hover:bg-white/10
          `}
        >
          {currentTeam ? (
            <>
              <img 
                src={getFlagUrl(currentTeam.name)} 
                alt={currentTeam.name}
                className="w-6 h-4 object-cover rounded shadow-sm"
              />
              <span className="text-sm text-white truncate flex-1 text-left">{currentTeam.name}</span>
            </>
          ) : (
            <span className="text-xs text-muted-foreground">{t("bracket.selectTeam")}</span>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
        
        {isOpen && (
          <div className="absolute z-[100] left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-card border border-white/20 rounded-lg shadow-xl">
            {availableTeams.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">No teams available</div>
            ) : null}
            {availableTeams.map(team => (
              <button
                key={team.id}
                onClick={() => {
                  handleSetR32Team(matchNum, position, team.id);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 w-full hover:bg-white/10 transition-colors"
              >
                <img 
                  src={getFlagUrl(team.name)} 
                  alt={team.name}
                  className="w-5 h-3 object-cover rounded"
                />
                <span className="text-sm text-white truncate">{team.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const MatchCard = ({ 
    round, 
    matchNum 
  }: { 
    round: string;
    matchNum: number;
  }) => {
    const [team1, team2] = getMatchContenders(round, matchNum);
    const winner = getMatchWinner(round, matchNum);
    const isR32 = round === "round_of_32";
    const match = isR32 ? predictions.round_of_32[matchNum] : null;

    return (
      <div className="relative">
        <div className="text-xs text-muted-foreground mb-1 text-center">
          {t("bracket.match")} {matchNum}
        </div>
        <div className="w-44 bg-card/80 border border-white/10 rounded-lg overflow-hidden shadow-lg">
          {isR32 ? (
            <>
              <TeamSelector matchNum={matchNum} position="team1" currentTeamId={match?.team1 ?? null} />
              <TeamSelector matchNum={matchNum} position="team2" currentTeamId={match?.team2 ?? null} />
              
              {match?.team1 && match?.team2 && (
                <div className="border-t border-white/10 p-2">
                  <div className="text-[10px] text-muted-foreground mb-1 text-center">{t("bracket.pickWinner")}</div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSelectWinner(round, matchNum, match.team1!)}
                      className={`flex-1 py-1 px-2 rounded text-xs transition-all ${
                        match.winner === match.team1 
                          ? 'bg-primary text-white' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {getTeamById(match.team1)?.name.slice(0, 3).toUpperCase()}
                    </button>
                    <button
                      onClick={() => handleSelectWinner(round, matchNum, match.team2!)}
                      className={`flex-1 py-1 px-2 rounded text-xs transition-all ${
                        match.winner === match.team2 
                          ? 'bg-primary text-white' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {getTeamById(match.team2)?.name.slice(0, 3).toUpperCase()}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <TeamSlot 
                team={team1} 
                isWinner={winner?.id === team1?.id}
                onClick={() => team1 && handleSelectWinner(round, matchNum, team1.id)}
                isSelectable={!!team1 && !!team2}
                position="top"
              />
              <TeamSlot 
                team={team2} 
                isWinner={winner?.id === team2?.id}
                onClick={() => team2 && handleSelectWinner(round, matchNum, team2.id)}
                isSelectable={!!team1 && !!team2}
                position="bottom"
              />
            </>
          )}
        </div>
        
        {currentRoundIndex < ROUNDS.length - 1 && (
          <div className="absolute top-1/2 -right-4 w-4 h-px bg-white/20" />
        )}
      </div>
    );
  };

  const getRoundCompletedCount = (roundKey: string): number => {
    let count = 0;
    if (roundKey === "round_of_32") {
      for (let i = 1; i <= 16; i++) {
        const m = predictions.round_of_32[i];
        if (m?.team1 && m?.team2 && m?.winner) count++;
      }
    } else if (roundKey === "round_of_16") {
      for (let i = 1; i <= 8; i++) if (predictions.round_of_16[i]) count++;
    } else if (roundKey === "quarterfinal") {
      for (let i = 1; i <= 4; i++) if (predictions.quarterfinal[i]) count++;
    } else if (roundKey === "semifinal") {
      for (let i = 1; i <= 2; i++) if (predictions.semifinal[i]) count++;
    } else if (roundKey === "final") {
      if (predictions.final) count = 1;
    }
    return count;
  };

  return (
    <Layout pageTitle={t("bracket.title")}>
      <div className="px-4 pb-24 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-display font-bold text-white">{t("bracket.title")}</h1>
            <p className="text-sm text-muted-foreground">{getCompletionPercentage()}% {t("bracket.complete")}</p>
            <p className="text-xs text-muted-foreground/70 italic">{t("common.dataDisclaimer")}</p>
          </div>
          {champion && (
            <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-lg px-3 py-2">
              <img 
                src={getFlagUrl(champion.name)} 
                alt={champion.name}
                className="w-6 h-4 object-cover rounded"
              />
              <span className="text-sm font-bold text-primary">{champion.name}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-card border border-white/10 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t("bracket.reset")}
          </button>
          <a
            href="/world-cup-2026-bracket.html"
            target="_blank"
            className="flex items-center justify-center gap-2 bg-card border border-white/10 rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t("bracket.downloadPDF")}
          </a>
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center justify-center gap-2 bg-primary/20 border border-primary/30 rounded-lg px-4 py-2 text-sm text-primary hover:bg-primary/30 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            {t("bracket.howItWorks")}
          </button>
        </div>

        {showHelp && (
          <div className="fixed inset-0 bg-black/70 z-[200] flex items-center justify-center p-4" onClick={() => setShowHelp(false)}>
            <div 
              className="bg-card border border-white/20 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="font-display font-bold text-white">{t("bracket.howItWorks")}</h3>
                <button onClick={() => setShowHelp(false)} className="text-muted-foreground hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                  <h4 className="font-bold text-primary text-sm mb-2">{t("bracket.step1Title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("bracket.step1Desc")}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <h4 className="font-bold text-white text-sm mb-2">{t("bracket.step2Title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("bracket.step2Desc")}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <h4 className="font-bold text-white text-sm mb-2">{t("bracket.step3Title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("bracket.step3Desc")}</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <h4 className="font-bold text-yellow-400 text-sm mb-2">{t("bracket.noteTitle")}</h4>
                  <p className="text-xs text-muted-foreground">{t("bracket.noteDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
          {ROUNDS.map((round, idx) => {
            const completed = getRoundCompletedCount(round.key);
            const isActive = idx === currentRoundIndex;
            const isComplete = completed === round.matches;
            
            return (
              <button
                key={round.key}
                onClick={() => setCurrentRoundIndex(idx)}
                className={`
                  flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-primary text-white' 
                    : isComplete 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'bg-card text-muted-foreground border border-white/10'
                  }
                `}
              >
                {t(`bracket.${round.label}`)}
                <span className="ml-1 opacity-70">({completed}/{round.matches})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevRound}
            disabled={currentRoundIndex === 0}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${
              currentRoundIndex === 0 
                ? 'opacity-30 cursor-not-allowed' 
                : 'bg-card border border-white/10 hover:bg-white/10'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {t("common.previous")}
          </button>
          
          <div className="text-center">
            <h2 className="font-display font-bold text-white">{t(`bracket.${currentRound.label}`)}</h2>
            <p className="text-xs text-muted-foreground">{currentRound.matches} {t("bracket.matches")}</p>
          </div>
          
          <button
            onClick={goToNextRound}
            disabled={currentRoundIndex === ROUNDS.length - 1}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all ${
              currentRoundIndex === ROUNDS.length - 1 
                ? 'opacity-30 cursor-not-allowed' 
                : 'bg-card border border-white/10 hover:bg-white/10'
            }`}
          >
            {t("common.next")}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="overflow-x-auto pb-4"
        >
          <div className={`
            grid gap-4 min-w-max
            ${currentRound.matches === 16 ? 'grid-cols-4' : ''}
            ${currentRound.matches === 8 ? 'grid-cols-4' : ''}
            ${currentRound.matches === 4 ? 'grid-cols-2' : ''}
            ${currentRound.matches === 2 ? 'grid-cols-2' : ''}
            ${currentRound.matches === 1 ? 'grid-cols-1 justify-center' : ''}
          `}>
            {Array.from({ length: currentRound.matches }, (_, i) => (
              <MatchCard 
                key={`${currentRound.key}-${i + 1}`}
                round={currentRound.key}
                matchNum={i + 1}
              />
            ))}
          </div>
        </div>

        {currentRound.key !== "final" && (
          <div className="mt-4 p-3 bg-card/50 border border-white/5 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              {t("bracket.selectWinnersToAdvance")}
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-card/50 border border-white/5 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            {t("bracket.disclaimer")}
          </p>
        </div>
      </div>
    </Layout>
  );
}
