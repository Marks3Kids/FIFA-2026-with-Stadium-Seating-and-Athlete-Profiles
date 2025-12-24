import { Layout } from "@/components/Layout";
import { MapPin, Calendar, Info, Users, ExternalLink, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { watchParties } from "@/data/watchParties";

export default function Cities() {
  const { t } = useTranslation();

  const translateMatch = (match: string): string => {
    const dateMatch = match.match(/\(([^)]+)\)/);
    const dateStr = dateMatch ? ` (${dateMatch[1]})` : "";
    
    if (match.includes("Group Stage Match")) return t("cities.stages.groupStageMatch");
    if (match.includes("Round of 32")) return t("cities.stages.roundOf32");
    if (match.includes("Round of 16")) return t("cities.stages.roundOf16");
    if (match.includes("Quarter-Final")) return t("cities.stages.quarterFinal") + dateStr;
    if (match.includes("Semi-Final")) return t("cities.stages.semiFinal") + dateStr;
    if (match.includes("Bronze Final")) return t("cities.stages.bronzeFinal") + dateStr;
    if (match.includes("Final") && !match.includes("Semi") && !match.includes("Bronze")) return t("cities.stages.final") + dateStr;
    if (match.includes("USA Opening Match")) return t("cities.stages.usaOpeningMatch") + dateStr;
    if (match.includes("Canada Opening Match")) return t("cities.stages.canadaOpeningMatch") + dateStr;
    if (match.includes("Opening Match")) return t("cities.stages.openingMatch") + dateStr;
    return match;
  };
  
  const cities = [
    { 
      key: "newYork",
      countryKey: "usa",
      capacity: "82,500", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", 
        "Round of 32", "Round of 16", "Final (July 19)"
      ]
    },
    { 
      key: "dallas",
      countryKey: "usa",
      capacity: "80,000", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Round of 16", "Round of 16", "Semi-Final (July 14)"
      ]
    },
    { 
      key: "losAngeles",
      countryKey: "usa",
      capacity: "70,240", 
      matches: [
        "USA Opening Match (June 12)", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Round of 32", "Quarter-Final"
      ]
    },
    { 
      key: "atlanta",
      countryKey: "usa",
      capacity: "71,000", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Round of 16", "Semi-Final (July 15)"
      ]
    },
    { 
      key: "miami",
      countryKey: "usa",
      capacity: "64,767", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Quarter-Final", "Bronze Final (July 18)"
      ]
    },
    { 
      key: "sanFrancisco",
      countryKey: "usa",
      capacity: "68,500", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32"
      ]
    },
    { 
      key: "seattle",
      countryKey: "usa",
      capacity: "69,000", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Round of 16"
      ]
    },
    { 
      key: "houston",
      countryKey: "usa",
      capacity: "72,220", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Round of 16"
      ]
    },
    { 
      key: "philadelphia",
      countryKey: "usa",
      capacity: "67,594", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 16"
      ]
    },
    { 
      key: "kansasCity",
      countryKey: "usa",
      capacity: "76,416", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Quarter-Final"
      ]
    },
    { 
      key: "boston",
      countryKey: "usa",
      capacity: "65,878", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Quarter-Final"
      ]
    },
    { 
      key: "mexicoCity",
      countryKey: "mexico",
      capacity: "87,523", 
      matches: [
        "Opening Match (June 11)", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Round of 16"
      ]
    },
    { 
      key: "monterrey",
      countryKey: "mexico",
      capacity: "53,500", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32"
      ]
    },
    { 
      key: "guadalajara",
      countryKey: "mexico",
      capacity: "49,850", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match"
      ]
    },
    { 
      key: "toronto",
      countryKey: "canada",
      capacity: "45,500", 
      matches: [
        "Canada Opening Match (June 12)", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32"
      ]
    },
    { 
      key: "vancouver",
      countryKey: "canada",
      capacity: "54,500", 
      matches: [
        "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match",
        "Round of 32", "Round of 16"
      ]
    },
  ];

  return (
    <Layout pageTitle="nav.hostCities">
      <div className="pt-12 px-6 pb-24">
        <h1 className="text-4xl font-display font-bold text-white mb-2">{t("cities.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("cities.subtitle")}</p>
        
        <div className="space-y-4">
          {cities.map((city, i) => (
            <Dialog key={i}>
              <DialogTrigger asChild>
                <div className="relative overflow-hidden rounded-xl h-40 group cursor-pointer border border-white/5 hover:border-primary/50 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                  <div className="absolute inset-0 bg-card z-0 group-hover:scale-105 transition-transform duration-700" /> 
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <div className="flex items-center space-x-2 text-primary mb-1">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[10px] uppercase tracking-wider font-bold">{t(`cities.countries.${city.countryKey}`)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-none mb-1">{t(`cities.cityNames.${city.key}`)}</h3>
                    <p className="text-xs text-gray-300">{t(`cities.stadiums.${city.key}`)} • {city.capacity}</p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 text-white max-h-[85vh] p-0 overflow-hidden flex flex-col">
                <div className="p-6 pb-0">
                  <DialogHeader>
                    <div className="flex items-center space-x-2 text-primary mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider font-bold">{t(`cities.countries.${city.countryKey}`)}</span>
                    </div>
                    <DialogTitle className="text-3xl font-display font-bold">{t(`cities.cityNames.${city.key}`)}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {t(`cities.stadiums.${city.key}`)} • {t("cities.capacity")}: {city.capacity}
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <ScrollArea className="flex-1 p-6 pt-4">
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center space-x-2 mb-3 text-accent">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wide">{t("cities.matchSchedule")}</span>
                      </div>
                      <ul className="space-y-2">
                        {city.matches.map((match, idx) => (
                          <li key={idx} className="text-sm text-gray-300 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-2"></span>
                            {translateMatch(match)}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {(() => {
                      const cityWatchParty = watchParties.find(wp => wp.cityKey === city.key);
                      if (!cityWatchParty) return null;
                      return (
                        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                          <div className="flex items-center space-x-2 mb-3 text-primary">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wide">{t("cities.watchParties")}</span>
                          </div>
                          {cityWatchParty.officialFanFest && (
                            <a
                              href={cityWatchParty.officialFanFest.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between bg-background/50 rounded-lg p-3 mb-2 hover:bg-primary/20 transition-colors"
                            >
                              <div>
                                <p className="text-sm font-bold text-white">{cityWatchParty.officialFanFest.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {t("cities.capacity")}: {cityWatchParty.officialFanFest.capacity}
                                </p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-primary" />
                            </a>
                          )}
                          {cityWatchParty.venues.slice(0, 2).map((venue, idx) => (
                            <a
                              key={idx}
                              href={venue.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between bg-background/50 rounded-lg p-3 mb-2 last:mb-0 hover:bg-primary/20 transition-colors"
                            >
                              <div>
                                <p className="text-sm font-medium text-white">{venue.name}</p>
                                <p className="text-xs text-muted-foreground">{venue.capacity}</p>
                              </div>
                              <ExternalLink className="w-4 h-4 text-primary" />
                            </a>
                          ))}
                        </div>
                      );
                    })()}

                    <div>
                      <div className="flex items-center space-x-2 mb-3 text-accent">
                        <Info className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-wide">{t("cities.aboutCity")}</span>
                      </div>
                      <div className="space-y-4 text-sm leading-relaxed text-gray-300">
                        {t(`cities.cityDescriptions.${city.key}`).split('\n\n').map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="mt-8 bg-card/50 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-bold text-white">{t("cities.globalWatchHubs")}</h3>
              <p className="text-xs text-muted-foreground">{t("cities.globalWatchHubsDesc")}</p>
            </div>
          </div>
          <Link href="/watch-hubs" className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold text-center transition-colors">
            {t("cities.viewGlobalHubs")}
          </Link>
        </div>
      </div>
    </Layout>
  );
}
