import { Layout } from "@/components/Layout";
import { Globe, MapPin, Users, ExternalLink, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getFlagUrlByCode } from "@/lib/flags";
import { globalWatchHubs } from "@/data/globalWatchHubs";

export default function WatchHubs() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHubs = globalWatchHubs.filter(
    (hub) =>
      hub.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hub.primaryCity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const continentKeys = ["europe", "southAmerica", "northAmerica", "africa", "asia", "oceania"] as const;
  
  const groupByContinent = (hubs: typeof globalWatchHubs) => {
    const continents: Record<string, typeof globalWatchHubs> = {
      "europe": [],
      "southAmerica": [],
      "northAmerica": [],
      "africa": [],
      "asia": [],
      "oceania": []
    };

    const continentMap: Record<string, string> = {
      AR: "southAmerica", AU: "oceania", AT: "europe", BE: "europe", BR: "southAmerica",
      CM: "africa", CA: "northAmerica", CL: "southAmerica", CO: "southAmerica", HR: "europe",
      CZ: "europe", DK: "europe", EC: "southAmerica", EG: "africa", GB: "europe",
      FR: "europe", DE: "europe", HU: "europe", IR: "asia", IT: "europe",
      JP: "asia", KR: "asia", MX: "northAmerica", MA: "africa", NL: "europe",
      NG: "africa", PY: "southAmerica", PE: "southAmerica", PL: "europe", PT: "europe",
      QA: "asia", SA: "asia", RS: "europe", SN: "africa", SI: "europe",
      ZA: "africa", ES: "europe", CH: "europe", TN: "africa", TR: "europe",
      UA: "europe", US: "northAmerica", UY: "southAmerica", UZ: "asia", VE: "southAmerica",
      "GB-WLS": "europe", DZ: "africa", "GB-SCT": "europe"
    };

    hubs.forEach((hub) => {
      const continent = continentMap[hub.countryCode] || "europe";
      continents[continent].push(hub);
    });

    return continents;
  };

  const groupedHubs = groupByContinent(filteredHubs);

  return (
    <Layout pageTitle="watchHubs.title">
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Globe className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {t("watchHubs.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("watchHubs.subtitle")}
            </p>
          </div>
        </div>

        <div className="relative mt-6 mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("watchHubs.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-card border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="bg-card/50 border border-white/10 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold text-white">{t("watchHubs.infoTitle")}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("watchHubs.infoDescription")}
          </p>
        </div>

        {Object.entries(groupedHubs).map(([continentKey, hubs]) => 
          hubs.length > 0 && (
            <div key={continentKey} className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t(`watchHubs.continents.${continentKey}`)}
                <span className="text-sm font-normal text-muted-foreground">({hubs.length} {t("watchHubs.countries")})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hubs.map((hub) => (
                  <div
                    key={hub.countryCode}
                    className="bg-card border border-white/10 rounded-xl p-4 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={getFlagUrlByCode(hub.countryCode.split('-')[0].toLowerCase())}
                        alt={hub.countryName}
                        className="w-10 h-7 rounded object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-white">{hub.countryName}</h3>
                        <p className="text-xs text-muted-foreground">{hub.primaryCity}</p>
                      </div>
                    </div>
                    {hub.venues.map((venue, idx) => (
                      <a
                        key={idx}
                        href={venue.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-background/50 rounded-lg p-3 hover:bg-primary/10 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{venue.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {venue.city} - {t("watchHubs.capacity")}: {venue.capacity}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-primary" />
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {filteredHubs.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t("watchHubs.noResults")}</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
