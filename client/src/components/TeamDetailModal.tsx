import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Trophy, Target, Calendar, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
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

interface TeamDetailModalProps {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
}

export const teamSeasonData: Record<string, {
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
  "USA": {
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
  "Algeria": {
    wins: 6, ties: 3, losses: 2,
    highlights: "Les Fennecs showed strong form in African qualifying. A balanced squad combined technical skill with physical presence to secure their spot in the tournament.",
    recentMatches: [
      { opponent: "Nigeria", result: "D", score: "1-1" },
      { opponent: "Cameroon", result: "W", score: "2-1" },
      { opponent: "Senegal", result: "L", score: "0-1" },
      { opponent: "Egypt", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Islam Slimani", goals: 4 },
      { name: "Riyad Mahrez", goals: 3 },
      { name: "Said Benrahma", goals: 2 },
    ]
  },
  "Morocco": {
    wins: 7, ties: 2, losses: 1,
    highlights: "The Atlas Lions built on their historic 2022 World Cup run. Achraf Hakimi and Hakim Ziyech continued to shine as Morocco established themselves among Africa's elite.",
    recentMatches: [
      { opponent: "Egypt", result: "W", score: "2-1" },
      { opponent: "Senegal", result: "D", score: "1-1" },
      { opponent: "Nigeria", result: "W", score: "1-0" },
      { opponent: "Ivory Coast", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Youssef En-Nesyri", goals: 5 },
      { name: "Hakim Ziyech", goals: 3 },
      { name: "Sofiane Boufal", goals: 2 },
    ]
  },
  "Senegal": {
    wins: 6, ties: 3, losses: 2,
    highlights: "The Lions of Teranga continued their strong African presence. Despite losing Sadio Mané to injury at times, depth in the squad proved vital.",
    recentMatches: [
      { opponent: "Morocco", result: "D", score: "1-1" },
      { opponent: "Egypt", result: "W", score: "2-0" },
      { opponent: "Algeria", result: "W", score: "1-0" },
      { opponent: "Cameroon", result: "D", score: "0-0" },
    ],
    topScorers: [
      { name: "Sadio Mané", goals: 4 },
      { name: "Ismaila Sarr", goals: 3 },
      { name: "Boulaye Dia", goals: 3 },
    ]
  },
  "Nigeria": {
    wins: 5, ties: 4, losses: 2,
    highlights: "The Super Eagles showed resilience in a competitive African qualifying group. Victor Osimhen led the attack with world-class finishing.",
    recentMatches: [
      { opponent: "Algeria", result: "D", score: "1-1" },
      { opponent: "Morocco", result: "L", score: "0-1" },
      { opponent: "Cameroon", result: "W", score: "2-1" },
      { opponent: "Ghana", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Victor Osimhen", goals: 6 },
      { name: "Samuel Chukwueze", goals: 2 },
      { name: "Ademola Lookman", goals: 2 },
    ]
  },
  "Egypt": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The Pharaohs qualified with Mohamed Salah leading from the front. The Liverpool star remained the focal point of Egypt's attacking play.",
    recentMatches: [
      { opponent: "Morocco", result: "L", score: "1-2" },
      { opponent: "Senegal", result: "L", score: "0-2" },
      { opponent: "Algeria", result: "L", score: "0-2" },
      { opponent: "Tunisia", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Mohamed Salah", goals: 5 },
      { name: "Mostafa Mohamed", goals: 3 },
      { name: "Omar Marmoush", goals: 2 },
    ]
  },
  "Cameroon": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The Indomitable Lions showed their fighting spirit in qualifying. A blend of experienced campaigners and emerging talents kept them competitive.",
    recentMatches: [
      { opponent: "Nigeria", result: "L", score: "1-2" },
      { opponent: "Algeria", result: "L", score: "1-2" },
      { opponent: "Senegal", result: "D", score: "0-0" },
      { opponent: "Ivory Coast", result: "W", score: "1-0" },
    ],
    topScorers: [
      { name: "Eric Maxim Choupo-Moting", goals: 4 },
      { name: "Bryan Mbeumo", goals: 3 },
      { name: "Karl Toko Ekambi", goals: 2 },
    ]
  },
  "South Africa": {
    wins: 5, ties: 4, losses: 2,
    highlights: "Bafana Bafana qualified for their first World Cup since 2010. A new generation of talent emerged under Hugo Broos' guidance.",
    recentMatches: [
      { opponent: "Nigeria", result: "D", score: "1-1" },
      { opponent: "Morocco", result: "L", score: "0-2" },
      { opponent: "Ghana", result: "W", score: "2-1" },
      { opponent: "Zimbabwe", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Percy Tau", goals: 4 },
      { name: "Themba Zwane", goals: 3 },
      { name: "Evidence Makgopa", goals: 2 },
    ]
  },
  "Tunisia": {
    wins: 4, ties: 5, losses: 2,
    highlights: "The Eagles of Carthage showed tactical discipline throughout qualifying. Their organized defensive structure proved difficult to break down.",
    recentMatches: [
      { opponent: "Egypt", result: "L", score: "0-2" },
      { opponent: "Morocco", result: "D", score: "0-0" },
      { opponent: "Algeria", result: "D", score: "1-1" },
      { opponent: "Libya", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Wahbi Khazri", goals: 3 },
      { name: "Youssef Msakni", goals: 3 },
      { name: "Seifeddine Jaziri", goals: 2 },
    ]
  },
  "Iran": {
    wins: 6, ties: 3, losses: 2,
    highlights: "Team Melli continued their Asian dominance. Mehdi Taremi and Sardar Azmoun formed a lethal attacking partnership in qualifying.",
    recentMatches: [
      { opponent: "Japan", result: "L", score: "1-2" },
      { opponent: "South Korea", result: "D", score: "1-1" },
      { opponent: "Australia", result: "D", score: "1-1" },
      { opponent: "Qatar", result: "W", score: "3-1" },
    ],
    topScorers: [
      { name: "Mehdi Taremi", goals: 5 },
      { name: "Sardar Azmoun", goals: 4 },
      { name: "Alireza Jahanbakhsh", goals: 2 },
    ]
  },
  "Indonesia": {
    wins: 5, ties: 4, losses: 3,
    highlights: "Garuda made history by qualifying for their first-ever World Cup. Naturalized players and emerging local talents combined to achieve the nation's greatest footballing moment.",
    recentMatches: [
      { opponent: "Australia", result: "D", score: "1-1" },
      { opponent: "Japan", result: "L", score: "0-3" },
      { opponent: "Saudi Arabia", result: "D", score: "1-1" },
      { opponent: "Bahrain", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Ragnar Oratmangoen", goals: 4 },
      { name: "Marselino Ferdinan", goals: 3 },
      { name: "Rafael Struick", goals: 2 },
    ]
  },
  "Saudi Arabia": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The Green Falcons built on their shock 2022 World Cup win over Argentina. Investment in domestic talent development showed positive results.",
    recentMatches: [
      { opponent: "Japan", result: "D", score: "1-1" },
      { opponent: "Australia", result: "L", score: "0-2" },
      { opponent: "Oman", result: "W", score: "3-0" },
      { opponent: "China", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Salem Al-Dawsari", goals: 4 },
      { name: "Firas Al-Buraikan", goals: 3 },
      { name: "Saleh Al-Shehri", goals: 2 },
    ]
  },
  "Qatar": {
    wins: 4, ties: 4, losses: 3,
    highlights: "The 2022 World Cup hosts showed improvement in Asian qualifying. Home tournament experience provided valuable lessons for the squad.",
    recentMatches: [
      { opponent: "South Korea", result: "L", score: "0-3" },
      { opponent: "Iran", result: "L", score: "1-3" },
      { opponent: "UAE", result: "W", score: "2-0" },
      { opponent: "Bahrain", result: "W", score: "3-1" },
    ],
    topScorers: [
      { name: "Akram Afif", goals: 4 },
      { name: "Almoez Ali", goals: 3 },
      { name: "Hassan Al-Haydos", goals: 2 },
    ]
  },
  "Uzbekistan": {
    wins: 5, ties: 4, losses: 2,
    highlights: "The White Wolves qualified for their first World Cup. A golden generation finally achieved the breakthrough after years of near-misses.",
    recentMatches: [
      { opponent: "Iran", result: "D", score: "1-1" },
      { opponent: "Qatar", result: "W", score: "2-1" },
      { opponent: "UAE", result: "W", score: "3-0" },
      { opponent: "Thailand", result: "W", score: "4-0" },
    ],
    topScorers: [
      { name: "Eldor Shomurodov", goals: 5 },
      { name: "Jaloliddin Masharipov", goals: 3 },
      { name: "Abbosbek Fayzullaev", goals: 2 },
    ]
  },
  "Croatia": {
    wins: 6, ties: 3, losses: 2,
    highlights: "The Vatreni continued their remarkable tournament pedigree. Despite an aging core, quality in midfield remained world-class.",
    recentMatches: [
      { opponent: "Italy", result: "D", score: "1-1" },
      { opponent: "Spain", result: "L", score: "0-2" },
      { opponent: "Portugal", result: "D", score: "1-1" },
      { opponent: "Poland", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Andrej Kramarić", goals: 4 },
      { name: "Bruno Petković", goals: 3 },
      { name: "Luka Modrić", goals: 2 },
    ]
  },
  "Denmark": {
    wins: 6, ties: 2, losses: 3,
    highlights: "Danish Dynamite remained competitive in European qualifying. The team showed tactical versatility under Kasper Hjulmand.",
    recentMatches: [
      { opponent: "England", result: "L", score: "1-2" },
      { opponent: "Germany", result: "D", score: "1-1" },
      { opponent: "Finland", result: "W", score: "3-0" },
      { opponent: "Sweden", result: "W", score: "2-1" },
    ],
    topScorers: [
      { name: "Rasmus Højlund", goals: 5 },
      { name: "Christian Eriksen", goals: 3 },
      { name: "Jonas Wind", goals: 2 },
    ]
  },
  "Switzerland": {
    wins: 5, ties: 4, losses: 2,
    highlights: "The Nati showed their typical consistency in European qualifying. Granit Xhaka's leadership from midfield proved invaluable.",
    recentMatches: [
      { opponent: "Germany", result: "D", score: "2-2" },
      { opponent: "Italy", result: "L", score: "1-2" },
      { opponent: "Hungary", result: "W", score: "2-0" },
      { opponent: "Romania", result: "W", score: "3-1" },
    ],
    topScorers: [
      { name: "Breel Embolo", goals: 4 },
      { name: "Noah Okafor", goals: 3 },
      { name: "Xherdan Shaqiri", goals: 2 },
    ]
  },
  "Austria": {
    wins: 6, ties: 2, losses: 3,
    highlights: "Das Team impressed with attacking football under Ralf Rangnick. High pressing and quick transitions defined their style.",
    recentMatches: [
      { opponent: "Germany", result: "L", score: "1-2" },
      { opponent: "Belgium", result: "W", score: "2-0" },
      { opponent: "Sweden", result: "W", score: "3-1" },
      { opponent: "Norway", result: "D", score: "1-1" },
    ],
    topScorers: [
      { name: "Marko Arnautović", goals: 4 },
      { name: "Michael Gregoritsch", goals: 3 },
      { name: "Christoph Baumgartner", goals: 3 },
    ]
  },
  "Poland": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The White Eagles qualified with Robert Lewandowski still leading the line. The Barcelona striker remained Poland's most important player.",
    recentMatches: [
      { opponent: "Croatia", result: "L", score: "0-2" },
      { opponent: "Netherlands", result: "L", score: "0-2" },
      { opponent: "Czech Republic", result: "W", score: "2-1" },
      { opponent: "Sweden", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Robert Lewandowski", goals: 6 },
      { name: "Arkadiusz Milik", goals: 2 },
      { name: "Piotr Zieliński", goals: 2 },
    ]
  },
  "Serbia": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The Eagles showed attacking flair in qualifying. Dušan Vlahović and Aleksandar Mitrović formed a dangerous strike partnership.",
    recentMatches: [
      { opponent: "Portugal", result: "D", score: "1-1" },
      { opponent: "Hungary", result: "W", score: "2-1" },
      { opponent: "Sweden", result: "W", score: "3-2" },
      { opponent: "Norway", result: "L", score: "1-2" },
    ],
    topScorers: [
      { name: "Aleksandar Mitrović", goals: 5 },
      { name: "Dušan Vlahović", goals: 4 },
      { name: "Dušan Tadić", goals: 2 },
    ]
  },
  "Ukraine": {
    wins: 5, ties: 4, losses: 2,
    highlights: "Despite immense challenges off the pitch, Ukraine showed remarkable spirit. The team united a nation through their qualifying campaign.",
    recentMatches: [
      { opponent: "Poland", result: "D", score: "1-1" },
      { opponent: "Czech Republic", result: "W", score: "2-1" },
      { opponent: "Iceland", result: "W", score: "2-0" },
      { opponent: "North Macedonia", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Artem Dovbyk", goals: 5 },
      { name: "Mykhailo Mudryk", goals: 3 },
      { name: "Andriy Yarmolenko", goals: 2 },
    ]
  },
  "Turkey": {
    wins: 6, ties: 2, losses: 3,
    highlights: "The Crescent-Stars showed exciting attacking play. Young talents like Arda Güler emerged as key players for the future.",
    recentMatches: [
      { opponent: "Portugal", result: "L", score: "0-3" },
      { opponent: "Czech Republic", result: "W", score: "2-1" },
      { opponent: "Georgia", result: "W", score: "3-1" },
      { opponent: "Austria", result: "L", score: "1-2" },
    ],
    topScorers: [
      { name: "Cenk Tosun", goals: 4 },
      { name: "Arda Güler", goals: 3 },
      { name: "Kerem Aktürkoğlu", goals: 3 },
    ]
  },
  "Scotland": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The Tartan Army qualified for back-to-back major tournaments. John McGinn and Scott McTominay drove the team forward.",
    recentMatches: [
      { opponent: "England", result: "L", score: "1-3" },
      { opponent: "Spain", result: "L", score: "0-2" },
      { opponent: "Norway", result: "W", score: "2-1" },
      { opponent: "Ireland", result: "D", score: "1-1" },
    ],
    topScorers: [
      { name: "Scott McTominay", goals: 4 },
      { name: "John McGinn", goals: 3 },
      { name: "Che Adams", goals: 2 },
    ]
  },
  "Hungary": {
    wins: 5, ties: 4, losses: 2,
    highlights: "The Magyars continued their impressive run under Marco Rossi. Dominik Szoboszlai emerged as one of Europe's brightest talents.",
    recentMatches: [
      { opponent: "Germany", result: "D", score: "1-1" },
      { opponent: "Serbia", result: "L", score: "1-2" },
      { opponent: "Switzerland", result: "L", score: "0-2" },
      { opponent: "Montenegro", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Dominik Szoboszlai", goals: 4 },
      { name: "Barnabás Varga", goals: 3 },
      { name: "Roland Sallai", goals: 2 },
    ]
  },
  "Czech Republic": {
    wins: 4, ties: 5, losses: 2,
    highlights: "The Czech Lions showed solid defensive organization. Patrik Schick remained the team's primary goal threat.",
    recentMatches: [
      { opponent: "Poland", result: "L", score: "1-2" },
      { opponent: "Ukraine", result: "L", score: "1-2" },
      { opponent: "Turkey", result: "L", score: "1-2" },
      { opponent: "Albania", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Patrik Schick", goals: 4 },
      { name: "Adam Hložek", goals: 2 },
      { name: "Tomáš Souček", goals: 2 },
    ]
  },
  "Slovenia": {
    wins: 5, ties: 4, losses: 2,
    highlights: "Slovenia qualified for their first World Cup since 2010. Jan Oblak's goalkeeping excellence anchored the team's defense.",
    recentMatches: [
      { opponent: "Denmark", result: "D", score: "1-1" },
      { opponent: "Serbia", result: "L", score: "0-2" },
      { opponent: "Finland", result: "W", score: "2-1" },
      { opponent: "Kazakhstan", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Benjamin Šeško", goals: 4 },
      { name: "Andraž Šporar", goals: 3 },
      { name: "Adam Gnezda Čerin", goals: 2 },
    ]
  },
  "Wales": {
    wins: 4, ties: 4, losses: 3,
    highlights: "The Dragons qualified through determination and team spirit. Despite Gareth Bale's retirement, new leaders emerged.",
    recentMatches: [
      { opponent: "England", result: "L", score: "0-3" },
      { opponent: "Poland", result: "D", score: "0-0" },
      { opponent: "Finland", result: "W", score: "2-0" },
      { opponent: "Latvia", result: "W", score: "4-0" },
    ],
    topScorers: [
      { name: "Daniel James", goals: 3 },
      { name: "Brennan Johnson", goals: 3 },
      { name: "Kieffer Moore", goals: 2 },
    ]
  },
  "Uruguay": {
    wins: 6, ties: 3, losses: 2,
    highlights: "La Celeste showed their traditional fighting spirit. Darwin Núñez led the line while veterans provided experience.",
    recentMatches: [
      { opponent: "Argentina", result: "D", score: "1-1" },
      { opponent: "Brazil", result: "W", score: "2-0" },
      { opponent: "Colombia", result: "D", score: "1-1" },
      { opponent: "Ecuador", result: "W", score: "3-1" },
    ],
    topScorers: [
      { name: "Darwin Núñez", goals: 5 },
      { name: "Luis Suárez", goals: 3 },
      { name: "Facundo Pellistri", goals: 2 },
    ]
  },
  "Colombia": {
    wins: 6, ties: 3, losses: 2,
    highlights: "Los Cafeteros returned to form in South American qualifying. Luis Díaz dazzled on the wing with exceptional performances.",
    recentMatches: [
      { opponent: "Argentina", result: "L", score: "0-3" },
      { opponent: "Brazil", result: "D", score: "0-0" },
      { opponent: "Uruguay", result: "D", score: "1-1" },
      { opponent: "Peru", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Luis Díaz", goals: 4 },
      { name: "Rafael Santos Borré", goals: 3 },
      { name: "James Rodríguez", goals: 2 },
    ]
  },
  "Ecuador": {
    wins: 5, ties: 4, losses: 2,
    highlights: "La Tri continued their South American emergence. Young talents combined with experienced players for consistent performances.",
    recentMatches: [
      { opponent: "Uruguay", result: "L", score: "1-3" },
      { opponent: "Chile", result: "W", score: "2-0" },
      { opponent: "Paraguay", result: "W", score: "3-1" },
      { opponent: "Venezuela", result: "D", score: "1-1" },
    ],
    topScorers: [
      { name: "Enner Valencia", goals: 4 },
      { name: "Moisés Caicedo", goals: 2 },
      { name: "Jeremy Sarmiento", goals: 2 },
    ]
  },
  "Paraguay": {
    wins: 4, ties: 5, losses: 2,
    highlights: "La Albirroja qualified through disciplined performances. The team showed improved organization under new management.",
    recentMatches: [
      { opponent: "Ecuador", result: "L", score: "1-3" },
      { opponent: "Venezuela", result: "W", score: "2-1" },
      { opponent: "Bolivia", result: "W", score: "3-0" },
      { opponent: "Peru", result: "D", score: "1-1" },
    ],
    topScorers: [
      { name: "Miguel Almirón", goals: 4 },
      { name: "Julio Enciso", goals: 3 },
      { name: "Antonio Sanabria", goals: 2 },
    ]
  },
  "Chile": {
    wins: 4, ties: 4, losses: 3,
    highlights: "La Roja navigated a challenging transition period. A new generation began to establish themselves in the squad.",
    recentMatches: [
      { opponent: "Argentina", result: "L", score: "0-2" },
      { opponent: "Ecuador", result: "L", score: "0-2" },
      { opponent: "Peru", result: "W", score: "2-0" },
      { opponent: "Bolivia", result: "W", score: "3-1" },
    ],
    topScorers: [
      { name: "Alexis Sánchez", goals: 3 },
      { name: "Ben Brereton Díaz", goals: 3 },
      { name: "Darío Osorio", goals: 2 },
    ]
  },
  "Peru": {
    wins: 4, ties: 4, losses: 3,
    highlights: "La Blanquirroja showed fighting spirit in qualifying. Paolo Guerrero provided veteran leadership to a developing squad.",
    recentMatches: [
      { opponent: "Brazil", result: "L", score: "0-4" },
      { opponent: "Colombia", result: "L", score: "0-2" },
      { opponent: "Chile", result: "L", score: "0-2" },
      { opponent: "Venezuela", result: "W", score: "2-1" },
    ],
    topScorers: [
      { name: "Gianluca Lapadula", goals: 3 },
      { name: "Paolo Guerrero", goals: 2 },
      { name: "Bryan Reyna", goals: 2 },
    ]
  },
  "Venezuela": {
    wins: 4, ties: 3, losses: 4,
    highlights: "La Vinotinto made history qualifying for their first World Cup. A breakthrough moment for Venezuelan football.",
    recentMatches: [
      { opponent: "Brazil", result: "L", score: "1-2" },
      { opponent: "Ecuador", result: "D", score: "1-1" },
      { opponent: "Paraguay", result: "L", score: "1-2" },
      { opponent: "Bolivia", result: "W", score: "4-0" },
    ],
    topScorers: [
      { name: "Salomón Rondón", goals: 4 },
      { name: "Josef Martínez", goals: 2 },
      { name: "Yeferson Soteldo", goals: 2 },
    ]
  },
  "Costa Rica": {
    wins: 5, ties: 3, losses: 3,
    highlights: "Los Ticos showed their tournament experience in CONCACAF qualifying. Solid defensive structure remained their trademark.",
    recentMatches: [
      { opponent: "Mexico", result: "L", score: "0-3" },
      { opponent: "USA", result: "L", score: "0-2" },
      { opponent: "Panama", result: "W", score: "2-1" },
      { opponent: "Honduras", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Joel Campbell", goals: 3 },
      { name: "Manfred Ugalde", goals: 3 },
      { name: "Johan Venegas", goals: 2 },
    ]
  },
  "Panama": {
    wins: 4, ties: 4, losses: 3,
    highlights: "Los Canaleros qualified for their second World Cup. Physical presence and set-piece prowess remained key strengths.",
    recentMatches: [
      { opponent: "Mexico", result: "L", score: "1-2" },
      { opponent: "Canada", result: "L", score: "0-2" },
      { opponent: "Costa Rica", result: "L", score: "1-2" },
      { opponent: "Honduras", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "José Fajardo", goals: 3 },
      { name: "Édgar Bárcenas", goals: 2 },
      { name: "Rolando Blackburn", goals: 2 },
    ]
  },
  "Honduras": {
    wins: 4, ties: 3, losses: 4,
    highlights: "La H qualified through determination and team effort. The Central American side showed improvement in their campaign.",
    recentMatches: [
      { opponent: "Costa Rica", result: "L", score: "0-3" },
      { opponent: "Panama", result: "L", score: "0-2" },
      { opponent: "Jamaica", result: "W", score: "2-1" },
      { opponent: "El Salvador", result: "W", score: "3-0" },
    ],
    topScorers: [
      { name: "Alberth Elis", goals: 3 },
      { name: "Romell Quioto", goals: 3 },
      { name: "Jorge Benguché", goals: 2 },
    ]
  },
  "Jamaica": {
    wins: 3, ties: 5, losses: 3,
    highlights: "The Reggae Boyz qualified through a strong defensive record. The team showed improved tactical discipline throughout.",
    recentMatches: [
      { opponent: "USA", result: "L", score: "0-4" },
      { opponent: "Honduras", result: "L", score: "1-2" },
      { opponent: "El Salvador", result: "W", score: "2-0" },
      { opponent: "Trinidad", result: "D", score: "1-1" },
    ],
    topScorers: [
      { name: "Michail Antonio", goals: 3 },
      { name: "Bobby Decordova-Reid", goals: 2 },
      { name: "Leon Bailey", goals: 2 },
    ]
  },
  "New Zealand": {
    wins: 5, ties: 3, losses: 2,
    highlights: "The All Whites dominated Oceania qualifying. Chris Wood led the attack with crucial goals throughout the campaign.",
    recentMatches: [
      { opponent: "Fiji", result: "W", score: "4-0" },
      { opponent: "Papua New Guinea", result: "W", score: "3-0" },
      { opponent: "Solomon Islands", result: "W", score: "5-0" },
      { opponent: "Tahiti", result: "W", score: "3-1" },
    ],
    topScorers: [
      { name: "Chris Wood", goals: 6 },
      { name: "Matthew Garbett", goals: 2 },
      { name: "Alex Greive", goals: 2 },
    ]
  },
  "Bolivia": {
    wins: 3, ties: 4, losses: 4,
    highlights: "La Verde used home altitude advantage effectively. The team showed resilience in South American qualifying.",
    recentMatches: [
      { opponent: "Paraguay", result: "L", score: "0-3" },
      { opponent: "Chile", result: "L", score: "1-3" },
      { opponent: "Venezuela", result: "L", score: "0-4" },
      { opponent: "Peru", result: "D", score: "1-1" },
    ],
    topScorers: [
      { name: "Marcelo Moreno Martins", goals: 3 },
      { name: "Bruno Miranda", goals: 2 },
      { name: "César Menacho", goals: 1 },
    ]
  },
  "DR Congo": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The Leopards qualified for their first World Cup since 1974. A historic achievement for Congolese football.",
    recentMatches: [
      { opponent: "Morocco", result: "L", score: "1-3" },
      { opponent: "Egypt", result: "D", score: "1-1" },
      { opponent: "Guinea", result: "W", score: "2-0" },
      { opponent: "Mali", result: "W", score: "2-1" },
    ],
    topScorers: [
      { name: "Cédric Bakambu", goals: 4 },
      { name: "Yoane Wissa", goals: 3 },
      { name: "Silas Katompa", goals: 2 },
    ]
  },
  "Iraq": {
    wins: 4, ties: 4, losses: 3,
    highlights: "The Lions of Mesopotamia showed promising form. A blend of youth and experience drove their qualifying campaign.",
    recentMatches: [
      { opponent: "Iran", result: "L", score: "1-2" },
      { opponent: "Japan", result: "L", score: "0-2" },
      { opponent: "Syria", result: "W", score: "3-0" },
      { opponent: "Lebanon", result: "W", score: "2-0" },
    ],
    topScorers: [
      { name: "Aymen Hussein", goals: 4 },
      { name: "Mohanad Ali", goals: 3 },
      { name: "Amjad Attwan", goals: 2 },
    ]
  },
  "Jordan": {
    wins: 8, ties: 2, losses: 1,
    highlights: "Al-Nashama made history by qualifying for their first-ever FIFA World Cup. Under coach Jamal Sellami, Jordan reached the 2025 FIFA Arab Cup final and dominated Asian qualification with clinical performances.",
    recentMatches: [
      { opponent: "Oman", result: "W", score: "3-0" },
      { opponent: "Saudi Arabia", result: "W", score: "1-0" },
      { opponent: "Iraq", result: "W", score: "1-0" },
      { opponent: "Morocco", result: "L", score: "2-3" },
    ],
    topScorers: [
      { name: "Yazan Al-Naimat", goals: 5 },
      { name: "Mousa Al-Taamari", goals: 4 },
      { name: "Ahmad Ersan", goals: 3 },
    ]
  },
  "Cape Verde": {
    wins: 5, ties: 3, losses: 2,
    highlights: "The Blue Sharks made history by qualifying for their first FIFA World Cup. The island nation showed remarkable organization and team spirit throughout African qualifying.",
    recentMatches: [
      { opponent: "Nigeria", result: "D", score: "1-1" },
      { opponent: "Libya", result: "W", score: "2-0" },
      { opponent: "Lesotho", result: "W", score: "3-0" },
      { opponent: "Rwanda", result: "W", score: "2-1" },
    ],
    topScorers: [
      { name: "Garry Rodrigues", goals: 4 },
      { name: "Júlio Tavares", goals: 3 },
      { name: "Ryan Mendes", goals: 2 },
    ]
  },
  "Curaçao": {
    wins: 4, ties: 4, losses: 3,
    highlights: "The Caribbean nation qualified for their first World Cup through impressive performances in CONCACAF. A blend of Dutch-based players provided quality throughout the squad.",
    recentMatches: [
      { opponent: "Costa Rica", result: "D", score: "1-1" },
      { opponent: "Honduras", result: "W", score: "2-1" },
      { opponent: "El Salvador", result: "W", score: "3-1" },
      { opponent: "Guatemala", result: "D", score: "0-0" },
    ],
    topScorers: [
      { name: "Elson Hooi", goals: 4 },
      { name: "Rangelo Janga", goals: 3 },
      { name: "Leandro Bacuna", goals: 2 },
    ]
  },
  "Ghana": {
    wins: 5, ties: 3, losses: 3,
    highlights: "The Black Stars qualified with a mix of experienced European-based players and emerging talents. Strong performances in key African qualifiers secured their spot.",
    recentMatches: [
      { opponent: "Nigeria", result: "D", score: "1-1" },
      { opponent: "South Africa", result: "L", score: "1-2" },
      { opponent: "Mali", result: "W", score: "2-1" },
      { opponent: "Central African Republic", result: "W", score: "4-0" },
    ],
    topScorers: [
      { name: "Mohammed Kudus", goals: 5 },
      { name: "Jordan Ayew", goals: 3 },
      { name: "Iñaki Williams", goals: 2 },
    ]
  },
  "Haiti": {
    wins: 4, ties: 4, losses: 3,
    highlights: "Les Grenadiers qualified through determination in CONCACAF. Despite challenges, the team united to achieve a historic World Cup qualification.",
    recentMatches: [
      { opponent: "Canada", result: "L", score: "0-2" },
      { opponent: "Panama", result: "D", score: "1-1" },
      { opponent: "Trinidad", result: "W", score: "2-0" },
      { opponent: "Bermuda", result: "W", score: "4-0" },
    ],
    topScorers: [
      { name: "Duckens Nazon", goals: 4 },
      { name: "Frantzdy Pierrot", goals: 3 },
      { name: "Derrick Etienne Jr.", goals: 2 },
    ]
  },
  "Ivory Coast": {
    wins: 6, ties: 2, losses: 3,
    highlights: "The Elephants qualified as 2024 Africa Cup of Nations champions. A golden generation continued to deliver with Sébastien Haller leading the attack.",
    recentMatches: [
      { opponent: "Cameroon", result: "L", score: "0-1" },
      { opponent: "Morocco", result: "L", score: "0-3" },
      { opponent: "Gabon", result: "W", score: "2-0" },
      { opponent: "Kenya", result: "W", score: "3-1" },
    ],
    topScorers: [
      { name: "Sébastien Haller", goals: 5 },
      { name: "Nicolas Pépé", goals: 3 },
      { name: "Simon Adingra", goals: 3 },
    ]
  },
  "Norway": {
    wins: 6, ties: 2, losses: 3,
    highlights: "Norway qualified for their first World Cup since 1998. Erling Haaland's prolific goalscoring was instrumental in their European qualifying campaign.",
    recentMatches: [
      { opponent: "Scotland", result: "L", score: "1-2" },
      { opponent: "Serbia", result: "W", score: "2-1" },
      { opponent: "Georgia", result: "W", score: "3-1" },
      { opponent: "Kazakhstan", result: "W", score: "4-0" },
    ],
    topScorers: [
      { name: "Erling Haaland", goals: 8 },
      { name: "Alexander Sørloth", goals: 4 },
      { name: "Martin Ødegaard", goals: 3 },
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
        
        <DialogHeader className="pb-4 border-b border-gray-700 pr-8">
          <div className="flex items-center gap-3">
            <img 
              src={getFlagUrl(team.name)} 
              alt={`${team.name} flag`}
              className="w-14 h-10 object-cover rounded shadow-sm border border-gray-600"
            />
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-white">
                {team.teamName}
              </DialogTitle>
              <p className="text-gray-400">{team.name}</p>
            </div>
          </div>
          <div className="mt-3">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-sm font-bold px-3 py-1 rounded-full">
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
                  {t(`teamHighlights.${team.name}`)}
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
