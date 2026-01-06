import { Layout } from "@/components/Layout";
import { MapPin, Calendar, Info, Users, ExternalLink, Globe, Train, Shield, Heart, Utensils, Church, Car, Accessibility, Building, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { cityVaults } from "@/data/cityVaults";

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

  const getSpiritualIcon = (type: string) => {
    switch(type) {
      case 'catholic': return '⛪';
      case 'protestant': return '✝️';
      case 'islamic': return '🕌';
      case 'jewish': return '✡️';
      case 'chapel': return '🙏';
      default: return '🙏';
    }
  };

  const cities = [
    { key: "newYork", countryKey: "usa", capacity: "82,500", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Round of 16", "Final (July 19)"] },
    { key: "dallas", countryKey: "usa", capacity: "80,000", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Round of 16", "Round of 16", "Semi-Final (July 14)"] },
    { key: "losAngeles", countryKey: "usa", capacity: "70,240", matches: ["USA Opening Match (June 12)", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Round of 32", "Quarter-Final"] },
    { key: "atlanta", countryKey: "usa", capacity: "71,000", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Round of 16", "Semi-Final (July 15)"] },
    { key: "miami", countryKey: "usa", capacity: "64,767", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Quarter-Final", "Bronze Final (July 18)"] },
    { key: "sanFrancisco", countryKey: "usa", capacity: "68,500", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32"] },
    { key: "seattle", countryKey: "usa", capacity: "69,000", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Round of 16"] },
    { key: "houston", countryKey: "usa", capacity: "72,220", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Round of 16"] },
    { key: "philadelphia", countryKey: "usa", capacity: "67,594", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 16"] },
    { key: "kansasCity", countryKey: "usa", capacity: "76,416", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Quarter-Final"] },
    { key: "boston", countryKey: "usa", capacity: "65,878", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Quarter-Final"] },
    { key: "mexicoCity", countryKey: "mexico", capacity: "87,523", matches: ["Opening Match (June 11)", "Group Stage Match", "Group Stage Match", "Round of 32", "Round of 16"] },
    { key: "monterrey", countryKey: "mexico", capacity: "53,500", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32"] },
    { key: "guadalajara", countryKey: "mexico", capacity: "49,850", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match"] },
    { key: "toronto", countryKey: "canada", capacity: "45,500", matches: ["Canada Opening Match (June 12)", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32"] },
    { key: "vancouver", countryKey: "canada", capacity: "54,500", matches: ["Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Group Stage Match", "Round of 32", "Round of 16"] },
  ];

  return (
    <Layout pageTitle="nav.hostCities">
      <div className="pt-12 px-6 pb-24">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2">{t("cities.title")}</h1>
        <p className="text-muted-foreground mb-2">{t("cities.subtitle")}</p>
        <p className="text-xs text-muted-foreground/70 mb-8 italic">{t("common.dataDisclaimer")}</p>
        
        <div className="space-y-4">
          {cities.map((city, i) => {
            const vault = cityVaults.find(v => v.cityKey === city.key);
            
            return (
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
                      <p className="text-[10px] text-accent/90 mt-0.5">FIFA: {t(`cities.fifaStadiums.${city.key}`)}</p>
                      {vault && (
                        <p className="text-[10px] text-primary/80 mt-1 italic">"{t(`cities.vault.mottos.${city.key}`, vault.motto)}"</p>
                      )}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10 text-white max-h-[85vh] max-w-lg p-0 flex flex-col">
                  <div className="p-4 pb-2 border-b border-white/10">
                    <DialogHeader>
                      <div className="flex items-center space-x-2 text-primary mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wider font-bold">{t(`cities.countries.${city.countryKey}`)}</span>
                      </div>
                      <DialogTitle className="text-2xl font-display font-bold">{t(`cities.cityNames.${city.key}`)}</DialogTitle>
                      <DialogDescription className="text-muted-foreground text-sm">
                        {t(`cities.vault.mottos.${city.key}`, vault?.motto || '')}
                      </DialogDescription>
                    </DialogHeader>
                  </div>

                  <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid grid-cols-5 mx-4 mt-2 bg-white/5">
                      <TabsTrigger value="overview" className="text-xs">{t("cities.vault.tabs.overview")}</TabsTrigger>
                      <TabsTrigger value="logistics" className="text-xs">{t("cities.vault.tabs.transit")}</TabsTrigger>
                      <TabsTrigger value="safety" className="text-xs">{t("cities.vault.tabs.safety")}</TabsTrigger>
                      <TabsTrigger value="spiritual" className="text-xs">{t("cities.vault.tabs.faith")}</TabsTrigger>
                      <TabsTrigger value="comfort" className="text-xs">{t("cities.vault.tabs.culture")}</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="flex-1 min-h-0 overflow-y-auto">
                      <div className="p-4">
                      <TabsContent value="overview" className="mt-0 space-y-3">
                        <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">{t(`cities.stadiums.${city.key}`)} • {city.capacity}</p>
                              <p className="text-xs text-accent">FIFA: {t(`cities.fifaStadiums.${city.key}`)}</p>
                            </div>
                            {vault?.stadiumAccess?.adaGates && (
                              <span className="text-[10px] bg-accent/20 text-accent px-2 py-1 rounded">ADA: {vault.stadiumAccess.adaGates.length} gates</span>
                            )}
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                          <div className="flex items-center space-x-2 mb-3 text-accent">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-wide">{t("cities.matchSchedule")}</span>
                          </div>
                          <ul className="space-y-1.5">
                            {city.matches.map((match, idx) => (
                              <li key={idx} className="text-sm text-gray-300 flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-2"></span>
                                {translateMatch(match)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {vault && vault.watchParties.length > 0 && (
                          <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                            <div className="flex items-center space-x-2 mb-3 text-primary">
                              <Users className="w-4 h-4" />
                              <span className="text-sm font-bold uppercase tracking-wide">{t("cities.vault.labels.watchParties")}</span>
                            </div>
                            {vault.watchParties.map((wp, idx) => (
                              <a
                                key={idx}
                                href={wp.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between bg-background/50 rounded-lg p-3 mb-2 last:mb-0 hover:bg-primary/20 transition-colors"
                              >
                                <div>
                                  <p className="text-sm font-bold text-white">{wp.name}</p>
                                  <p className="text-xs text-muted-foreground">{wp.type === 'vibe' ? `🎉 ${t("cities.vault.labels.officialFestival")}` : wp.type === 'energy' ? `⚡ ${t("cities.vault.labels.highEnergy")}` : `🏠 ${t("cities.vault.labels.localSecret")}`} • {wp.capacity}</p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                              </a>
                            ))}
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="logistics" className="mt-0 space-y-4">
                        {vault && (
                          <>
                            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                              <div className="flex items-center space-x-2 mb-2 text-red-400">
                                <Info className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-wide">{t("cities.vault.labels.theTrap")}</span>
                              </div>
                              <p className="text-sm text-gray-300">{t(`cities.vault.logistics.${city.key}.trap`, vault.logistics.trap)}</p>
                            </div>

                            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                              <div className="flex items-center space-x-2 mb-2 text-green-400">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-wide">{t("cities.vault.labels.theSolution")}</span>
                              </div>
                              <p className="text-sm text-gray-300">{t(`cities.vault.logistics.${city.key}.solution`, vault.logistics.solution)}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                              <div className="flex items-center space-x-2 mb-3 text-accent">
                                <Train className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-wide">{t("cities.vault.labels.localTransit")}</span>
                              </div>
                              <ul className="space-y-2">
                                {vault.logistics.localTransit.map((transit, idx) => (
                                  <li key={idx} className="text-sm text-gray-300 flex items-start">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mr-2 mt-1.5 flex-shrink-0"></span>
                                    {t(`cities.vault.transit.${city.key}.${idx}`, transit)}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {vault.stadiumAccess?.rideshareZones && vault.stadiumAccess.rideshareZones.length > 0 && (
                              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                                <div className="flex items-center space-x-2 mb-3 text-purple-400">
                                  <Car className="w-4 h-4" />
                                  <span className="text-sm font-bold uppercase tracking-wide">{t("cities.vault.labels.rideshareZones", "Rideshare Zones")}</span>
                                </div>
                                {vault.stadiumAccess.rideshareZones.map((zone, idx) => (
                                  <a
                                    key={idx}
                                    href={zone.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between bg-background/50 rounded-lg p-3 mb-2 last:mb-0 hover:bg-purple-500/20 transition-colors"
                                  >
                                    <div>
                                      <p className="text-sm font-bold text-white">{t(`cities.vault.rideshare.${city.key}.${idx}.name`, zone.name)}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {zone.type === 'pickup' ? `🚗 ${t("cities.vault.labels.pickupOnly")}` : zone.type === 'dropoff' ? `📍 ${t("cities.vault.labels.dropoffOnly")}` : `🚗📍 ${t("cities.vault.labels.pickupDropoff")}`} • {t(`cities.vault.rideshare.${city.key}.${idx}.description`, zone.description)}
                                      </p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            )}

                            {vault.stadiumAccess?.adaGates && vault.stadiumAccess.adaGates.length > 0 && (
                              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                                <div className="flex items-center space-x-2 mb-3 text-blue-400">
                                  <Accessibility className="w-4 h-4" />
                                  <span className="text-sm font-bold uppercase tracking-wide">{t("cities.vault.labels.adaAccessibleGates", "ADA Accessible Gates")}</span>
                                </div>
                                {vault.stadiumAccess.adaGates.map((gate, idx) => (
                                  <a
                                    key={idx}
                                    href={gate.mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between bg-background/50 rounded-lg p-3 mb-2 last:mb-0 hover:bg-blue-500/20 transition-colors"
                                  >
                                    <div>
                                      <p className="text-sm font-bold text-white">{t(`cities.vault.adaGates.${city.key}.${idx}.name`, gate.name)}</p>
                                      <p className="text-xs text-muted-foreground">♿ {t(`cities.vault.adaGates.${city.key}.${idx}.description`, gate.description)}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-blue-400 flex-shrink-0" />
                                  </a>
                                ))}
                              </div>
                            )}

                            {vault.logistics.departmentOfTransportation && vault.logistics.departmentOfTransportation.length > 0 && (
                              <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
                                <div className="flex items-center space-x-2 mb-2 text-amber-400">
                                  <Building className="w-4 h-4" />
                                  <span className="text-sm font-bold uppercase tracking-wide">{t("cities.vault.labels.departmentOfTransportation", "Dept. of Transportation")}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">{t("cities.vault.labels.dotDescription", "Check for traffic alerts, road closures, and construction updates.")}</p>
                                {vault.logistics.departmentOfTransportation.map((dot, idx) => (
                                  <div
                                    key={idx}
                                    className="bg-background/50 rounded-lg p-3 mb-2 last:mb-0"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div>
                                        <p className="text-sm font-bold text-white">{dot.abbreviation}</p>
                                        <p className="text-xs text-muted-foreground">{dot.name}</p>
                                        {dot.state && <p className="text-xs text-amber-400/70">{dot.state}</p>}
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <a
                                        href={dot.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded hover:bg-amber-500/30 transition-colors"
                                      >
                                        <Globe className="w-3 h-3" />
                                        {t("cities.vault.labels.website", "Website")}
                                      </a>
                                      <a
                                        href={`tel:${dot.phone}`}
                                        className="inline-flex items-center gap-1 text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded hover:bg-amber-500/30 transition-colors"
                                      >
                                        <Phone className="w-3 h-3" />
                                        {dot.phone}
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </TabsContent>

                      <TabsContent value="safety" className="mt-0 space-y-4">
                        {vault && (
                          <>
                            <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                              <div className="flex items-center space-x-2 mb-2 text-blue-400">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-wide">{t("cities.vault.labels.internationalHospital")}</span>
                              </div>
                              <a
                                href={vault.safety.internationalHospital.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:bg-blue-500/10 rounded-lg p-2 -mx-2 transition-colors"
                              >
                                <p className="text-sm font-bold text-white">{t(`cities.vault.safety.${city.key}.hospital.name`, vault.safety.internationalHospital.name)}</p>
                                <p className="text-xs text-muted-foreground">{t(`cities.vault.safety.${city.key}.hospital.specialty`, vault.safety.internationalHospital.specialty)}</p>
                                <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" /> {t("cities.vault.labels.openInMaps")}
                                </p>
                              </a>
                            </div>

                            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                              <div className="flex items-center space-x-2 mb-2 text-red-400">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-wide">{t("cities.vault.labels.emergencyTraumaCenter")}</span>
                              </div>
                              <a
                                href={vault.safety.emergencyHub.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block hover:bg-red-500/10 rounded-lg p-2 -mx-2 transition-colors"
                              >
                                <p className="text-sm font-bold text-white">{t(`cities.vault.safety.${city.key}.emergency.name`, vault.safety.emergencyHub.name)}</p>
                                <p className="text-xs text-muted-foreground">{t(`cities.vault.safety.${city.key}.emergency.description`, vault.safety.emergencyHub.description)}</p>
                                <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" /> {t("cities.vault.labels.openInMaps")}
                                </p>
                              </a>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                              <p className="text-lg font-bold text-white">{t("cities.vault.labels.emergency")}: {vault.safety.emergencyNumber}</p>
                              <p className="text-xs text-muted-foreground">{t("cities.vault.labels.tapToCall")}</p>
                            </div>
                          </>
                        )}
                      </TabsContent>

                      <TabsContent value="spiritual" className="mt-0 space-y-3">
                        {vault && vault.spiritual.map((service, idx) => (
                          <a
                            key={idx}
                            href={service.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white/5 rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">{getSpiritualIcon(service.type)}</span>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-white">{t(`cities.vault.faith.${city.key}.${idx}.name`, service.name)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{t(`cities.vault.faith.${city.key}.${idx}.description`, service.description)}</p>
                                <p className="text-xs text-primary mt-2 flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" /> {t("cities.vault.labels.openInMaps")}
                                </p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </TabsContent>

                      <TabsContent value="comfort" className="mt-0 space-y-4">
                        {vault && vault.comfort.map((category, idx) => (
                          <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="flex items-center space-x-2 mb-3 text-accent">
                              <Utensils className="w-4 h-4" />
                              <span className="text-sm font-bold uppercase tracking-wide">{t(`cities.vault.cuisine.${city.key}.${idx}.category`, category.category)}</span>
                            </div>
                            <div className="space-y-2">
                              {category.recommendations.map((rec, ridx) => (
                                <a
                                  key={ridx}
                                  href={rec.mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between bg-background/50 rounded-lg p-3 hover:bg-primary/10 transition-colors"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-white">{t(`cities.vault.cuisine.${city.key}.${idx}.items.${ridx}.name`, rec.name)}</p>
                                    <p className="text-xs text-muted-foreground">{t(`cities.vault.cuisine.${city.key}.${idx}.items.${ridx}.description`, rec.description)}</p>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-primary flex-shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </TabsContent>
                      </div>
                    </ScrollArea>
                  </Tabs>
                </DialogContent>
              </Dialog>
            );
          })}
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
