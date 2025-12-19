import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Trophy, Target, Calendar, TrendingUp } from "lucide-react";
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

interface TeamDetailModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
}

const teamSeasonData: Record<string, {
  wins: number;
  ties: number;
  losses: number;
  highlights: string;
  recentMatches: { opponent: string; result: "W" | "D" | "L"; score: string }[];
  topScorers: { name: string; goals: number }[];
}> = {
  "Argentina": {
    wins: 8, ties: 2, losses: 1,
    highlights: "Defending World Cup champions continued their dominance in South American qualifiers. Lionel Messi led the team with exceptional performances, while emerging talents like Julian Alvarez proved crucial.",
    recentMatches: [
      { opponent: "Brazil", result: "W", score: "2-1" },
      { opponent: "Uruguay", result: "D", score: "1-1" },
      { opponent: "Colombia", result: "W", score: "3-0" },
      { opponent: "Chile", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Lionel Messi", goals: 6 },
      { name: "Julián Álvarez", goals: 4 },
      { name: "Lautaro Martínez", goals: 3 },
    ]
  },
  "France": {
    wins: 7, ties: 3, losses: 1,
    highlights: "Les Bleus showed strong form in European qualifiers. Kylian Mbappé continued his prolific scoring run while the defense remained solid under Didier Deschamps' tactical setup.",
    recentMatches: [
      { opponent: "Germany", result: "W", score: "2-0" },
      { opponent: "Netherlands", result: "D", score: "2-2" },
      { opponent: "Belgium", result: "W", score: "3-1" },
      { opponent: "Italy", result: "W", score: "1-0" },
    ],
    topScorers: [
      { name: "Kylian Mbappé", goals: 8 },
      { name: "Olivier Giroud", goals: 3 },
      { name: "Antoine Griezmann", goals: 2 },
    ]
  },
  "Brazil": {
    wins: 6, ties: 4, losses: 2,
    highlights: "A Seleção experienced a rebuilding phase under new management. Young talents like Endrick and Rodrygo stepped up while veterans provided crucial experience in tight matches.",
    recentMatches: [
      { opponent: "Argentina", result: "L", score: "1-2" },
      { opponent: "Colombia", result: "D", score: "0-0" },
      { opponent: "Peru", result: "W", score: "4-0" },
      { opponent: "Venezuela", result: "W", score: "2-1" },
    ],
    topScorers: [
      { name: "Vinicius Jr.", goals: 5 },
      { name: "Rodrygo", goals: 4 },
      { name: "Endrick", goals: 3 },
    ]
  },
  "England": {
    wins: 7, ties: 2, losses: 2,
    highlights: "The Three Lions showed improved tactical flexibility. Harry Kane remained the team's talisman while Jude Bellingham emerged as a world-class midfielder orchestrating play.",
    recentMatches: [
      { opponent: "Germany", result: "D", score: "1-1" },
      { opponent: "Italy", result: "W", score: "2-1" },
      { opponent: "France", result: "L", score: "1-2" },
      { opponent: "Spain", result: "W", score: "3-2" },
    ],
    topScorers: [
      { name: "Harry Kane", goals: 7 },
      { name: "Jude Bellingham", goals: 4 },
      { name: "Bukayo Saka", goals: 3 },
    ]
  },
  "Germany": {
    wins: 6, ties: 3, losses: 2,
    highlights: "Die Mannschaft focused on integrating young talent with experienced players. Florian Wirtz and Jamal Musiala formed an exciting creative partnership in midfield.",
    recentMatches: [
      { opponent: "France", result: "L", score: "0-2" },
      { opponent: "Netherlands", result: "W", score: "2-1" },
      { opponent: "England", result: "D", score: "1-1" },
      { opponent: "Italy", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Niclas Füllkrug", goals: 5 },
      { name: "Florian Wirtz", goals: 4 },
      { name: "Jamal Musiala", goals: 3 },
    ]
  },
  "Spain": {
    wins: 8, ties: 1, losses: 1,
    highlights: "La Roja dominated European qualification with their trademark possession-based football. Young stars Pedri and Gavi controlled midfield while veteran leaders provided stability.",
    recentMatches: [
      { opponent: "Portugal", result: "W", score: "2-0" },
      { opponent: "Italy", result: "D", score: "1-1" },
      { opponent: "France", result: "W", score: "2-1" },
      { opponent: "England", result: "L", score: "2-3" },
    ],
    topScorers: [
      { name: "Álvaro Morata", goals: 6 },
      { name: "Ferran Torres", goals: 4 },
      { name: "Dani Olmo", goals: 3 },
    ]
  },
  "Netherlands": {
    wins: 6, ties: 4, losses: 1,
    highlights: "Oranje showed solid defensive organization while maintaining attacking flair. Cody Gakpo emerged as a key player with crucial goals in qualifying.",
    recentMatches: [
      { opponent: "France", result: "D", score: "2-2" },
      { opponent: "Germany", result: "L", score: "1-2" },
      { opponent: "Belgium", result: "W", score: "3-0" },
      { opponent: "Poland", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Cody Gakpo", goals: 5 },
      { name: "Memphis Depay", goals: 4 },
      { name: "Wout Weghorst", goals: 2 },
    ]
  },
  "Portugal": {
    wins: 7, ties: 2, losses: 2,
    highlights: "A Seleção balanced experienced stars with exciting young talent. Cristiano Ronaldo continued his incredible international goal-scoring record while Rafael Leão dazzled on the wing.",
    recentMatches: [
      { opponent: "Spain", result: "L", score: "0-2" },
      { opponent: "Croatia", result: "W", score: "2-1" },
      { opponent: "Poland", result: "W", score: "3-1" },
      { opponent: "Serbia", result: "D", score: "1-1" },
    ],
    topScorers: [
      { name: "Cristiano Ronaldo", goals: 6 },
      { name: "Rafael Leão", goals: 3 },
      { name: "Bruno Fernandes", goals: 3 },
    ]
  },
  "Belgium": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The Red Devils underwent a generational transition. While golden generation stars remained important, new faces began establishing themselves in the squad.",
    recentMatches: [
      { opponent: "France", result: "L", score: "1-3" },
      { opponent: "Netherlands", result: "L", score: "0-3" },
      { opponent: "Germany", result: "D", score: "2-2" },
      { opponent: "Austria", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Romelu Lukaku", goals: 5 },
      { name: "Kevin De Bruyne", goals: 3 },
      { name: "Jérémy Doku", goals: 2 },
    ]
  },
  "Italy": {
    wins: 6, ties: 3, losses: 2,
    highlights: "Gli Azzurri continued their tactical excellence under Luciano Spalletti. Strong defensive foundations combined with creative midfield play characterized their campaign.",
    recentMatches: [
      { opponent: "Spain", result: "D", score: "1-1" },
      { opponent: "Germany", result: "L", score: "0-3" },
      { opponent: "England", result: "L", score: "1-2" },
      { opponent: "Croatia", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Gianluca Scamacca", goals: 4 },
      { name: "Federico Chiesa", goals: 3 },
      { name: "Nicolò Barella", goals: 2 },
    ]
  },
  "Mexico": {
    wins: 7, ties: 2, losses: 2,
    highlights: "El Tri topped the CONCACAF qualifying round. A blend of Liga MX stars and European-based players provided depth, with Santiago Giménez leading the attack.",
    recentMatches: [
      { opponent: "USA", result: "D", score: "1-1" },
      { opponent: "Canada", result: "W", score: "2-0" },
      { opponent: "Costa Rica", result: "W", score: "3-0" },
      { opponent: "Panama", result: "W", score: "2-1" },
    ],
    topScorers: [
      { name: "Santiago Giménez", goals: 6 },
      { name: "Hirving Lozano", goals: 4 },
      { name: "Raúl Jiménez", goals: 3 },
    ]
  },
  "United States": {
    wins: 6, ties: 3, losses: 2,
    highlights: "The USMNT showcased their golden generation on home soil qualification. Christian Pulisic starred while the team built momentum heading into hosting the tournament.",
    recentMatches: [
      { opponent: "Mexico", result: "D", score: "1-1" },
      { opponent: "Canada", result: "W", score: "3-1" },
      { opponent: "Costa Rica", result: "W", score: "2-0" },
      { opponent: "Jamaica", result: "W", score: "4-0" },
    ],
    topScorers: [
      { name: "Christian Pulisic", goals: 5 },
      { name: "Ricardo Pepi", goals: 4 },
      { name: "Timothy Weah", goals: 3 },
    ]
  },
  "Canada": {
    wins: 5, ties: 4, losses: 2,
    highlights: "Les Rouges continued their remarkable rise in world football. Alphonso Davies led from the back while Jonathan David provided consistent goal-scoring.",
    recentMatches: [
      { opponent: "USA", result: "L", score: "1-3" },
      { opponent: "Mexico", result: "L", score: "0-2" },
      { opponent: "Panama", result: "W", score: "2-0" },
      { opponent: "Costa Rica", result: "D", score: "1-1" },
    ],
    topScorers: [
      { name: "Jonathan David", goals: 6 },
      { name: "Cyle Larin", goals: 3 },
      { name: "Alphonso Davies", goals: 2 },
    ]
  },
  "Japan": {
    wins: 7, ties: 2, losses: 1,
    highlights: "Samurai Blue impressed in Asian qualification with technical excellence. A wealth of European-based talent provided quality throughout the squad.",
    recentMatches: [
      { opponent: "Australia", result: "W", score: "2-0" },
      { opponent: "Saudi Arabia", result: "D", score: "1-1" },
      { opponent: "South Korea", result: "W", score: "3-1" },
      { opponent: "Iran", result: "W", score: "2-1" },
    ],
    topScorers: [
      { name: "Takumi Minamino", goals: 5 },
      { name: "Kaoru Mitoma", goals: 4 },
      { name: "Daichi Kamada", goals: 3 },
    ]
  },
  "South Korea": {
    wins: 6, ties: 3, losses: 2,
    highlights: "Taegeuk Warriors showed resilience in Asian qualifying. Son Heung-min captained the team while young talents stepped up in crucial moments.",
    recentMatches: [
      { opponent: "Japan", result: "L", score: "1-3" },
      { opponent: "Australia", result: "W", score: "2-1" },
      { opponent: "Iran", result: "D", score: "1-1" },
      { opponent: "Qatar", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Son Heung-min", goals: 7 },
      { name: "Hwang Hee-chan", goals: 3 },
      { name: "Cho Gue-sung", goals: 2 },
    ]
  },
  "Australia": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The Socceroos battled through a tough Asian qualifying campaign. A mix of experienced campaigners and rising stars kept World Cup dreams alive.",
    recentMatches: [
      { opponent: "Japan", result: "L", score: "0-2" },
      { opponent: "South Korea", result: "L", score: "1-2" },
      { opponent: "Saudi Arabia", result: "W", score: "2-0" },
      { opponent: "Iran", result: "D", score: "1-1" },
    ],
    topScorers: [
      { name: "Jamie Maclaren", goals: 4 },
      { name: "Mitchell Duke", goals: 3 },
      { name: "Craig Goodwin", goals: 2 },
    ]
  },
};

export function TeamDetailModal({ team, isOpen, onClose }: TeamDetailModalProps) {
  const { t } = useTranslation();

  if (!team) return null;

  const seasonData = teamSeasonData[team.name];

  const getResultColor = (result: "W" | "D" | "L") => {
    switch (result) {
      case "W": return "bg-green-500";
      case "D": return "bg-yellow-500";
      case "L": return "bg-red-500";
    }
  };

  const getResultText = (result: "W" | "D" | "L") => {
    switch (result) {
      case "W": return t("teamDetail.win");
      case "D": return t("teamDetail.tie");
      case "L": return t("teamDetail.loss");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-gray-900 border-gray-700">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors z-10"
          aria-label={t("teamDetail.close")}
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
        
        <DialogHeader className="pb-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{team.flag}</div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {team.teamName}
              </DialogTitle>
              <p className="text-gray-400">{team.name}</p>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4" />
              {team.rank === 99 ? t("status.tbd") : `${t("status.rank")} #${team.rank}`}
            </span>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {seasonData ? (
            <>
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary mb-3">
                  <TrendingUp className="w-5 h-5" />
                  {t("teamDetail.seasonHighlights")}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {seasonData.highlights}
                </p>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary mb-3">
                  <Calendar className="w-5 h-5" />
                  {t("teamDetail.record")}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{seasonData.wins}</div>
                    <div className="text-xs text-gray-400">{t("teamDetail.wins")}</div>
                  </div>
                  <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{seasonData.ties}</div>
                    <div className="text-xs text-gray-400">{t("teamDetail.ties")}</div>
                  </div>
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-400">{seasonData.losses}</div>
                    <div className="text-xs text-gray-400">{t("teamDetail.losses")}</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary mb-3">
                  <Calendar className="w-5 h-5" />
                  {t("teamDetail.recentMatches")}
                </h3>
                <div className="space-y-2">
                  {seasonData.recentMatches.map((match, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2">
                      <span className="text-gray-300">
                        {t("teamDetail.vs")} {match.opponent}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium">{match.score}</span>
                        <span className={`${getResultColor(match.result)} text-white text-xs font-bold px-2 py-0.5 rounded`}>
                          {getResultText(match.result)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-primary mb-3">
                  <Target className="w-5 h-5" />
                  {t("teamDetail.topScorers")}
                </h3>
                <div className="space-y-2">
                  {seasonData.topScorers.map((scorer, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2">
                      <span className="text-gray-300">{scorer.name}</span>
                      <span className="text-primary font-bold">
                        {scorer.goals} {t("teamDetail.goals")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">{t("teamDetail.noData")}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
