import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useTranslation } from "react-i18next";
import { TrendingUp, Trophy, Users, Calendar, AlertTriangle, Phone, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { getFlagUrl } from "@/lib/flags";

interface TeamOdds {
  team: string;
  countryCode: string;
  odds: string;
  impliedProbability: string;
}

interface GroupOdds {
  group: string;
  teams: { team: string; countryCode: string; odds: string }[];
}

export default function TournamentOdds() {
  const { t } = useTranslation();
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [showHelpResources, setShowHelpResources] = useState(false);

  const championshipOdds: TeamOdds[] = [
    { team: "France", countryCode: "fr", odds: "+450", impliedProbability: "18.2%" },
    { team: "England", countryCode: "gb-eng", odds: "+500", impliedProbability: "16.7%" },
    { team: "Argentina", countryCode: "ar", odds: "+550", impliedProbability: "15.4%" },
    { team: "Brazil", countryCode: "br", odds: "+700", impliedProbability: "12.5%" },
    { team: "Spain", countryCode: "es", odds: "+750", impliedProbability: "11.8%" },
    { team: "Germany", countryCode: "de", odds: "+900", impliedProbability: "10.0%" },
    { team: "Portugal", countryCode: "pt", odds: "+1200", impliedProbability: "7.7%" },
    { team: "Netherlands", countryCode: "nl", odds: "+1400", impliedProbability: "6.7%" },
    { team: "Belgium", countryCode: "be", odds: "+2000", impliedProbability: "4.8%" },
    { team: "Italy", countryCode: "it", odds: "+2500", impliedProbability: "3.8%" },
    { team: "United States", countryCode: "us", odds: "+3000", impliedProbability: "3.2%" },
    { team: "Croatia", countryCode: "hr", odds: "+4000", impliedProbability: "2.4%" },
    { team: "Denmark", countryCode: "dk", odds: "+5000", impliedProbability: "2.0%" },
    { team: "Uruguay", countryCode: "uy", odds: "+5000", impliedProbability: "2.0%" },
    { team: "Mexico", countryCode: "mx", odds: "+6000", impliedProbability: "1.6%" },
    { team: "Japan", countryCode: "jp", odds: "+8000", impliedProbability: "1.2%" },
  ];

  const groupOdds: GroupOdds[] = [
    { group: "A", teams: [
      { team: "Argentina", countryCode: "ar", odds: "-250" },
      { team: "Morocco", countryCode: "ma", odds: "+350" },
      { team: "Ecuador", countryCode: "ec", odds: "+600" },
      { team: "Saudi Arabia", countryCode: "sa", odds: "+1200" },
    ]},
    { group: "B", teams: [
      { team: "Spain", countryCode: "es", odds: "-200" },
      { team: "Netherlands", countryCode: "nl", odds: "+250" },
      { team: "Uruguay", countryCode: "uy", odds: "+400" },
      { team: "Ghana", countryCode: "gh", odds: "+1500" },
    ]},
    { group: "C", teams: [
      { team: "England", countryCode: "gb-eng", odds: "-300" },
      { team: "Denmark", countryCode: "dk", odds: "+400" },
      { team: "Serbia", countryCode: "rs", odds: "+600" },
      { team: "Slovenia", countryCode: "si", odds: "+2000" },
    ]},
    { group: "D", teams: [
      { team: "France", countryCode: "fr", odds: "-350" },
      { team: "Austria", countryCode: "at", odds: "+450" },
      { team: "Poland", countryCode: "pl", odds: "+500" },
      { team: "Tunisia", countryCode: "tn", odds: "+1800" },
    ]},
    { group: "E", teams: [
      { team: "Germany", countryCode: "de", odds: "-280" },
      { team: "Japan", countryCode: "jp", odds: "+350" },
      { team: "Mexico", countryCode: "mx", odds: "+400" },
      { team: "Costa Rica", countryCode: "cr", odds: "+2500" },
    ]},
    { group: "F", teams: [
      { team: "Brazil", countryCode: "br", odds: "-400" },
      { team: "Colombia", countryCode: "co", odds: "+400" },
      { team: "Senegal", countryCode: "sn", odds: "+600" },
      { team: "Cameroon", countryCode: "cm", odds: "+1500" },
    ]},
  ];

  const helpResources = [
    { nameKey: "odds.helpResources.ncpg", phone: "1-800-522-4700", url: "https://www.ncpgambling.org" },
    { nameKey: "odds.helpResources.gamblersAnonymous", phone: null, url: "https://www.gamblersanonymous.org" },
    { nameKey: "odds.helpResources.gamcare", phone: "0808-8020-133", url: "https://www.gamcare.org.uk" },
    { nameKey: "odds.helpResources.gamblingHelpAustralia", phone: "1800-858-858", url: "https://www.gamblinghelponline.org.au" },
    { nameKey: "odds.helpResources.adiccionesEspana", phone: "900-200-225", url: "https://www.adicciones.es" },
  ];

  return (
    <Layout pageTitle="odds.title">
      <div className="pt-12 px-6 pb-20">
        <div className="flex items-center space-x-3 mb-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">{t("odds.title")}</h1>
        </div>
        <p className="text-muted-foreground mb-6">{t("odds.subtitle")}</p>

        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-200 font-medium mb-1">{t("odds.disclaimer")}</p>
              <p className="text-xs text-amber-200/70">{t("odds.disclaimerDetail")}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-display font-bold text-white">{t("odds.championshipOdds")}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{t("odds.championshipDescription")}</p>
          
          <div className="space-y-2">
            {championshipOdds.map((team, index) => (
              <div 
                key={team.team}
                className={`bg-card border border-white/5 rounded-xl p-4 flex items-center justify-between ${index < 3 ? 'border-l-4 border-l-primary' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-muted-foreground font-mono text-sm w-6">{index + 1}</span>
                  <img
                    src={getFlagUrl(team.team)}
                    alt={team.team}
                    className="w-8 h-6 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = `https://flagcdn.com/w40/${team.countryCode.split('-')[0]}.png`;
                    }}
                  />
                  <span className="font-medium text-white">{team.team}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${team.odds.startsWith('+') ? 'text-primary' : 'text-white'}`}>
                    {team.odds}
                  </span>
                  <p className="text-xs text-muted-foreground">{team.impliedProbability}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-display font-bold text-white">{t("odds.groupWinners")}</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{t("odds.groupDescription")}</p>
          
          <div className="space-y-3">
            {groupOdds.map((group) => (
              <div key={group.group} className="bg-card border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedGroup(expandedGroup === group.group ? null : group.group)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white">{t("odds.group")} {group.group}</span>
                  {expandedGroup === group.group ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                {expandedGroup === group.group && (
                  <div className="border-t border-white/5 p-4 space-y-2">
                    {group.teams.map((team, idx) => (
                      <div key={team.team} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}>
                            {idx + 1}
                          </span>
                          <img
                            src={getFlagUrl(team.team)}
                            alt={team.team}
                            className="w-6 h-4 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = `https://flagcdn.com/w40/${team.countryCode.split('-')[0]}.png`;
                            }}
                          />
                          <span className="text-white text-sm">{team.team}</span>
                        </div>
                        <span className={`font-mono font-bold ${team.odds.startsWith('-') ? 'text-yellow-400' : 'text-primary'}`}>
                          {team.odds}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-display font-bold text-white">{t("odds.matchOdds")}</h2>
          </div>
          <div className="bg-card/50 border border-white/10 rounded-xl p-6 text-center">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-white font-medium mb-2">{t("odds.matchOddsComingSoon")}</p>
            <p className="text-sm text-muted-foreground">{t("odds.matchOddsDescription")}</p>
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-start space-x-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-200 font-bold mb-1">{t("odds.responsibleGambling")}</p>
              <p className="text-xs text-red-200/80 mb-3">{t("odds.responsibleGamblingMessage")}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowHelpResources(!showHelpResources)}
            className="w-full flex items-center justify-between py-2 px-3 bg-red-500/20 rounded-lg text-red-200 text-sm font-medium hover:bg-red-500/30 transition-colors"
          >
            <span className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{t("odds.getHelp")}</span>
            </span>
            {showHelpResources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showHelpResources && (
            <div className="mt-3 space-y-2">
              {helpResources.map((resource) => (
                <a
                  key={resource.nameKey}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{t(resource.nameKey)}</p>
                      {resource.phone && (
                        <p className="text-primary text-xs font-mono">{resource.phone}</p>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
