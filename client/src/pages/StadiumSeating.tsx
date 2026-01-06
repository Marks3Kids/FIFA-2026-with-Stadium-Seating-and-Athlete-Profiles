import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { MapPin, DollarSign, Users, Star, Eye, ChevronDown, ExternalLink, Ticket, Info, X } from "lucide-react";

interface StadiumSection {
  id: number;
  stadiumName: string;
  cityName: string;
  sectionName: string;
  sectionType: string;
  level: string;
  basePriceUsd: number;
  premiumPriceUsd: number | null;
  capacity: number | null;
  viewQuality: string | null;
  amenities: string[] | null;
}

const stadiumData = [
  { name: "MetLife Stadium", fifaName: "New York/New Jersey Stadium", city: "New York/New Jersey", country: "USA", capacity: "82,500", image: "🏟️" },
  { name: "SoFi Stadium", fifaName: "Los Angeles Stadium FIFA", city: "Los Angeles", country: "USA", capacity: "70,240", image: "🏟️" },
  { name: "AT&T Stadium", fifaName: "Dallas Stadium FIFA", city: "Dallas", country: "USA", capacity: "80,000", image: "🏟️" },
  { name: "Hard Rock Stadium", fifaName: "Miami Stadium FIFA", city: "Miami", country: "USA", capacity: "65,326", image: "🏟️" },
  { name: "Levi's Stadium", fifaName: "San Francisco Bay Area Stadium", city: "San Francisco Bay Area", country: "USA", capacity: "68,500", image: "🏟️" },
  { name: "Mercedes-Benz Stadium", fifaName: "Atlanta Stadium FIFA", city: "Atlanta", country: "USA", capacity: "71,000", image: "🏟️" },
  { name: "NRG Stadium", fifaName: "Houston Stadium", city: "Houston", country: "USA", capacity: "72,220", image: "🏟️" },
  { name: "Lincoln Financial Field", fifaName: "Philadelphia Stadium", city: "Philadelphia", country: "USA", capacity: "69,796", image: "🏟️" },
  { name: "Arrowhead Stadium", fifaName: "Kansas City Stadium FIFA", city: "Kansas City", country: "USA", capacity: "76,416", image: "🏟️" },
  { name: "Gillette Stadium", fifaName: "Boston Stadium FIFA", city: "Boston", country: "USA", capacity: "65,878", image: "🏟️" },
  { name: "Lumen Field", fifaName: "Seattle Stadium FIFA", city: "Seattle", country: "USA", capacity: "68,740", image: "🏟️" },
  { name: "Estadio Azteca", fifaName: "Estadio Ciudad de México", city: "Mexico City", country: "Mexico", capacity: "87,523", image: "🏟️" },
  { name: "Estadio BBVA", fifaName: "Estadio Monterrey", city: "Monterrey", country: "Mexico", capacity: "51,348", image: "🏟️" },
  { name: "Estadio Akron", fifaName: "Estadio Guadalajara", city: "Guadalajara", country: "Mexico", capacity: "45,370", image: "🏟️" },
  { name: "BC Place", fifaName: "Vancouver Stadium", city: "Vancouver", country: "Canada", capacity: "54,500", image: "🏟️" },
  { name: "BMO Field", fifaName: "Toronto Stadium", city: "Toronto", country: "Canada", capacity: "45,736", image: "🏟️" },
];

const sectionColors: Record<string, { bg: string; border: string; text: string }> = {
  category1: { bg: "bg-amber-500/20", border: "border-amber-500/50", text: "text-amber-400" },
  category2: { bg: "bg-purple-500/20", border: "border-purple-500/50", text: "text-purple-400" },
  category3: { bg: "bg-blue-500/20", border: "border-blue-500/50", text: "text-blue-400" },
  category4: { bg: "bg-green-500/20", border: "border-green-500/50", text: "text-green-400" },
};

const categoryDescriptions: Record<string, { location: string; view: string; priceRange: string }> = {
  category1: { location: "Lower tier, center sidelines", view: "Best views - closest to field", priceRange: "$250 - $6,730 USD" },
  category2: { location: "Upper tier sidelines + lower corners", view: "Good overall views", priceRange: "$165 - $4,210 USD" },
  category3: { location: "Upper tier behind goals", view: "Goal-line perspective", priceRange: "$110 - $2,790 USD" },
  category4: { location: "Upper tier corners", view: "Most affordable option", priceRange: "$60 - $1,825 USD" },
};

export default function StadiumSeating() {
  const { t } = useTranslation();
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null);
  const [showStadiumList, setShowStadiumList] = useState(false);
  const [selectedSection, setSelectedSection] = useState<StadiumSection | null>(null);

  const { data: sections = [], isLoading } = useQuery<StadiumSection[]>({
    queryKey: ["/api/stadiums/sections", selectedStadium],
    queryFn: async () => {
      const url = selectedStadium
        ? `/api/stadiums/sections?stadium=${encodeURIComponent(selectedStadium)}`
        : "/api/stadiums/sections";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch stadium sections");
      return response.json();
    },
    enabled: !!selectedStadium,
  });

  const currentStadium = stadiumData.find(s => s.name === selectedStadium);

  const getSectionsByLevel = (level: string) => 
    sections.filter(s => s.level === level).sort((a, b) => b.basePriceUsd - a.basePriceUsd);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading && selectedStadium) {
    return (
      <Layout pageTitle="nav.stadiumSeating">
        <div className="pt-12 px-6 pb-20 flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">{t("stadiumSeating.loading")}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="nav.stadiumSeating">
      <div className="pt-12 px-6 pb-20">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2">{t("stadiumSeating.title")}</h1>
        <p className="text-muted-foreground mb-6">{t("stadiumSeating.subtitle")}</p>

        <div className="relative mb-6">
          <button
            onClick={() => setShowStadiumList(!showStadiumList)}
            className="w-full bg-card border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
            data-testid="button-select-stadium"
          >
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-white font-medium">
                {selectedStadium || t("stadiumSeating.selectStadium")}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${showStadiumList ? "rotate-180" : ""}`} />
          </button>

          {showStadiumList && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 rounded-xl overflow-hidden z-20 max-h-80 overflow-y-auto">
              {stadiumData.map((stadium) => (
                <button
                  key={stadium.name}
                  onClick={() => {
                    setSelectedStadium(stadium.name);
                    setShowStadiumList(false);
                  }}
                  className={`w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 ${
                    selectedStadium === stadium.name ? "bg-primary/10" : ""
                  }`}
                  data-testid={`button-stadium-${stadium.name.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{stadium.image}</span>
                    <div className="text-left">
                      <p className="text-white font-medium">{stadium.name}</p>
                      <p className="text-[10px] text-accent/80">FIFA: {stadium.fifaName}</p>
                      <p className="text-xs text-muted-foreground">{stadium.city}, {stadium.country}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{stadium.capacity}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!selectedStadium ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-white mb-2">{t("stadiumSeating.selectPrompt")}</h3>
            <p className="text-muted-foreground text-sm">{t("stadiumSeating.selectDescription")}</p>
          </div>
        ) : (
          <>
            {currentStadium && (
              <div className="bg-gradient-to-br from-primary/20 to-transparent rounded-2xl p-6 mb-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentStadium.name}</h2>
                    <p className="text-sm text-accent/90">FIFA: {currentStadium.fifaName}</p>
                    <p className="text-muted-foreground">{currentStadium.city}, {currentStadium.country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{currentStadium.capacity}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t("stadiumSeating.capacity")}</p>
                  </div>
                </div>

                <div className="bg-card/50 rounded-xl p-4 border border-white/5">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-white font-medium mb-1">{t("stadiumSeating.pricingNote")}</p>
                      <p className="text-xs text-muted-foreground">{t("stadiumSeating.pricingDisclaimer")}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{t("stadiumSeating.sectionLegend")}</h3>
                <a
                  href="https://gpcustomersupportfwc2026.tickets.fifa.com/hc/en-gb/articles/28784010437021"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {t("stadiumSeating.viewOfficialMaps")}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(sectionColors).map(([type, colors]) => {
                  const desc = categoryDescriptions[type];
                  return (
                    <div key={type} className={`${colors.bg} ${colors.border} border rounded-lg p-3`} data-testid={`legend-${type}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${colors.text.replace("text-", "bg-")}`} />
                          <span className={`text-sm font-bold ${colors.text}`}>
                            {t(`stadiumSeating.sectionTypes.${type}`)}
                          </span>
                        </div>
                        {desc && (
                          <span className="text-xs font-semibold text-white">{desc.priceRange}</span>
                        )}
                      </div>
                      {desc && (
                        <div className="ml-5">
                          <p className="text-xs text-white">{t(`stadiumSeating.categoryLocations.${type}`)}</p>
                          <p className="text-xs text-muted-foreground">{t(`stadiumSeating.categoryViews.${type}`)}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-white">{t("stadiumSeating.allSections")}</h3>
              {sections.map((section) => {
                const colors = sectionColors[section.sectionType] || sectionColors.standard;
                return (
                  <div
                    key={section.id}
                    onClick={() => setSelectedSection(section)}
                    className={`${colors.bg} border ${colors.border} rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all`}
                    data-testid={`card-section-${section.id}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-white">{section.sectionName}</h4>
                        <p className="text-xs text-muted-foreground">{section.level} Level</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">{formatPrice(section.basePriceUsd)}</p>
                        {section.premiumPriceUsd && (
                          <p className="text-xs text-muted-foreground">
                            {t("stadiumSeating.upTo")} {formatPrice(section.premiumPriceUsd)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                      {section.capacity && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-white">{section.capacity.toLocaleString()}</span>
                        </div>
                      )}
                      {section.viewQuality && (
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-white">{section.viewQuality}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-muted-foreground" />
                        <span className={`text-sm capitalize ${colors.text}`}>{section.sectionType}</span>
                      </div>
                    </div>

                    {section.amenities && section.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {section.amenities.map((amenity, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-white/10 text-white px-2 py-1 rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-card rounded-xl p-6 border border-white/10">
              <div className="flex items-start space-x-4">
                <Ticket className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{t("stadiumSeating.buyTickets")}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t("stadiumSeating.ticketDisclaimer")}</p>
                  <a
                    href="https://www.fifa.com/fifaplus/en/tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-primary text-black px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
                    data-testid="link-fifa-tickets"
                  >
                    <span>{t("stadiumSeating.visitFifa")}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedSection && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center">
            <div className="bg-card w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-t-3xl md:rounded-3xl border border-white/10">
              <div className="sticky top-0 bg-card border-b border-white/10 p-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-white">{t("stadiumSeating.sectionDetails")}</h2>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  data-testid="button-close-section-modal"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="p-6">
                <div className={`${sectionColors[selectedSection.sectionType]?.bg || "bg-white/5"} rounded-xl p-6 mb-6 border ${sectionColors[selectedSection.sectionType]?.border || "border-white/10"}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedSection.sectionName}</h3>
                      <p className="text-muted-foreground">{selectedSection.stadiumName}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full capitalize font-medium text-sm ${sectionColors[selectedSection.sectionType]?.text || "text-white"} ${sectionColors[selectedSection.sectionType]?.bg || "bg-white/10"}`} data-testid="badge-section-type">
                      {selectedSection.sectionType}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("stadiumSeating.basePrice")}</p>
                      <p className="text-2xl font-bold text-white">{formatPrice(selectedSection.basePriceUsd)}</p>
                    </div>
                    {selectedSection.premiumPriceUsd && (
                      <div className="bg-black/20 rounded-xl p-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{t("stadiumSeating.premiumPrice")}</p>
                        <p className="text-2xl font-bold text-white">{formatPrice(selectedSection.premiumPriceUsd)}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("stadiumSeating.level")}</p>
                    </div>
                    <p className="text-white font-medium">{selectedSection.level}</p>
                  </div>
                  {selectedSection.viewQuality && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center space-x-2 mb-2">
                        <Eye className="w-4 h-4 text-primary" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("stadiumSeating.viewQuality")}</p>
                      </div>
                      <p className="text-white font-medium">{selectedSection.viewQuality}</p>
                    </div>
                  )}
                  {selectedSection.capacity && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-4 h-4 text-primary" />
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("stadiumSeating.seatCapacity")}</p>
                      </div>
                      <p className="text-white font-medium">{selectedSection.capacity.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {selectedSection.amenities && selectedSection.amenities.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white mb-3">{t("stadiumSeating.amenities")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSection.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="bg-primary/20 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/30"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <a
                  href="https://www.fifa.com/fifaplus/en/tickets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 bg-primary text-black px-6 py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                  data-testid="link-buy-tickets-modal"
                >
                  <Ticket className="w-5 h-5" />
                  <span>{t("stadiumSeating.checkAvailability")}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
