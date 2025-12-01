import { Layout } from "@/components/Layout";
import { Train, Clock, ArrowLeft, MapPin, DollarSign, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface RailRoute {
  to: string;
  toKey: string;
  duration: string;
  frequency: string;
  frequencyKey: string;
  economy: string;
  business: string;
  firstClass?: string;
}

interface RailHub {
  city: string;
  cityKey: string;
  country: string;
  countryKey: string;
  countryCode: string;
  station: string;
  stationKey: string;
  operators: { name: string; url: string }[];
  routes: RailRoute[];
  localTransit: { name: string; url: string; description: string; descriptionKey: string }[];
}

const railHubs: RailHub[] = [
  {
    city: "New York / New Jersey",
    cityKey: "newYorkNewJersey",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Penn Station / Newark Penn Station",
    stationKey: "pennStationNewark",
    operators: [
      { name: "Amtrak", url: "https://www.amtrak.com" },
      { name: "NJ Transit", url: "https://www.njtransit.com" },
      { name: "LIRR", url: "https://new.mta.info/agency/long-island-rail-road" },
      { name: "Metro-North", url: "https://new.mta.info/agency/metro-north-railroad" },
    ],
    routes: [
      { to: "Boston", toKey: "boston", duration: "3h 30m", frequency: "Hourly", frequencyKey: "hourly", economy: "$49-89", business: "$89-159", firstClass: "$159-299" },
      { to: "Philadelphia", toKey: "philadelphia", duration: "1h 10m", frequency: "Every 30 min", frequencyKey: "every30Min", economy: "$29-59", business: "$59-99", firstClass: "$99-179" },
      { to: "Washington DC", toKey: "washingtonDc", duration: "2h 50m", frequency: "Hourly", frequencyKey: "hourly", economy: "$49-99", business: "$99-179", firstClass: "$179-329" },
    ],
    localTransit: [
      { name: "NYC Subway", url: "https://new.mta.info", description: "24/7 subway service to MetLife Stadium area", descriptionKey: "nycSubwayDesc" },
      { name: "PATH Train", url: "https://www.panynj.gov/path", description: "NJ/NY connection", descriptionKey: "pathTrainDesc" },
      { name: "NJ Transit Rail", url: "https://www.njtransit.com", description: "Direct to MetLife Stadium", descriptionKey: "njTransitRailDesc" },
    ]
  },
  {
    city: "Boston",
    cityKey: "boston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "South Station / Back Bay",
    stationKey: "southStationBackBay",
    operators: [
      { name: "Amtrak", url: "https://www.amtrak.com" },
      { name: "MBTA", url: "https://www.mbta.com" },
    ],
    routes: [
      { to: "New York", toKey: "newYork", duration: "3h 30m", frequency: "Hourly", frequencyKey: "hourly", economy: "$49-89", business: "$89-159", firstClass: "$159-299" },
      { to: "Philadelphia", toKey: "philadelphia", duration: "5h 00m", frequency: "Every 2 hours", frequencyKey: "every2Hours", economy: "$69-119", business: "$119-199", firstClass: "$199-349" },
      { to: "Providence", toKey: "providence", duration: "0h 40m", frequency: "Hourly", frequencyKey: "hourly", economy: "$15-29", business: "$29-49" },
    ],
    localTransit: [
      { name: "MBTA Subway (T)", url: "https://www.mbta.com", description: "Subway and commuter rail to Gillette Stadium", descriptionKey: "mbtaSubwayDesc" },
      { name: "Commuter Rail", url: "https://www.mbta.com/schedules/commuter-rail", description: "Providence Line to Foxborough", descriptionKey: "commuterRailDesc" },
    ]
  },
  {
    city: "Philadelphia",
    cityKey: "philadelphia",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "30th Street Station",
    stationKey: "thirtiethStreetStation",
    operators: [
      { name: "Amtrak", url: "https://www.amtrak.com" },
      { name: "SEPTA", url: "https://www.septa.org" },
    ],
    routes: [
      { to: "New York", toKey: "newYork", duration: "1h 10m", frequency: "Every 30 min", frequencyKey: "every30Min", economy: "$29-59", business: "$59-99", firstClass: "$99-179" },
      { to: "Washington DC", toKey: "washingtonDc", duration: "1h 40m", frequency: "Hourly", frequencyKey: "hourly", economy: "$39-79", business: "$79-139", firstClass: "$139-249" },
      { to: "Boston", toKey: "boston", duration: "5h 00m", frequency: "Every 2 hours", frequencyKey: "every2Hours", economy: "$69-119", business: "$119-199", firstClass: "$199-349" },
    ],
    localTransit: [
      { name: "SEPTA Regional Rail", url: "https://www.septa.org", description: "Service to stadium area", descriptionKey: "septaRegionalDesc" },
      { name: "SEPTA Subway", url: "https://www.septa.org", description: "Broad Street & Market-Frankford Lines", descriptionKey: "septaSubwayDesc" },
    ]
  },
  {
    city: "Miami",
    cityKey: "miami",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "MiamiCentral / Miami Station",
    stationKey: "miamiCentral",
    operators: [
      { name: "Brightline", url: "https://www.gobrightline.com" },
      { name: "Tri-Rail", url: "https://www.tri-rail.com" },
      { name: "Amtrak", url: "https://www.amtrak.com" },
    ],
    routes: [
      { to: "Fort Lauderdale", toKey: "fortLauderdale", duration: "0h 30m", frequency: "Every 30 min", frequencyKey: "every30Min", economy: "$15-29", business: "$39-59" },
      { to: "West Palm Beach", toKey: "westPalmBeach", duration: "1h 00m", frequency: "Hourly", frequencyKey: "hourly", economy: "$25-49", business: "$59-89" },
      { to: "Orlando", toKey: "orlando", duration: "3h 15m", frequency: "Hourly", frequencyKey: "hourly", economy: "$79-129", business: "$149-199" },
    ],
    localTransit: [
      { name: "Metrorail", url: "https://www.miamidade.gov/transit", description: "Rapid transit to Hard Rock Stadium area", descriptionKey: "metrorailDesc" },
      { name: "Metromover", url: "https://www.miamidade.gov/transit", description: "Free downtown circulator", descriptionKey: "metromoverDesc" },
    ]
  },
  {
    city: "Los Angeles",
    cityKey: "losAngeles",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Union Station",
    stationKey: "laUnionStation",
    operators: [
      { name: "Amtrak", url: "https://www.amtrak.com" },
      { name: "Metrolink", url: "https://metrolinktrains.com" },
      { name: "LA Metro", url: "https://www.metro.net" },
    ],
    routes: [
      { to: "San Diego", toKey: "sanDiego", duration: "2h 45m", frequency: "12x daily", frequencyKey: "twelvexDaily", economy: "$37-59", business: "$59-99" },
      { to: "Santa Barbara", toKey: "santaBarbara", duration: "2h 30m", frequency: "5x daily", frequencyKey: "fivexDaily", economy: "$31-49", business: "$49-79" },
      { to: "San Francisco", toKey: "sanFrancisco", duration: "9h 30m", frequency: "1x daily", frequencyKey: "onexDaily", economy: "$59-99", business: "$99-179" },
    ],
    localTransit: [
      { name: "LA Metro Rail", url: "https://www.metro.net", description: "Expo, Blue, and other lines", descriptionKey: "laMetroRailDesc" },
      { name: "Metrolink", url: "https://metrolinktrains.com", description: "Regional commuter rail", descriptionKey: "metrolinkDesc" },
    ]
  },
  {
    city: "San Francisco Bay Area",
    cityKey: "sanFrancisco",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "San Francisco / Oakland / San Jose Stations",
    stationKey: "sfOaklandSanJose",
    operators: [
      { name: "Amtrak", url: "https://www.amtrak.com" },
      { name: "Caltrain", url: "https://www.caltrain.com" },
      { name: "BART", url: "https://www.bart.gov" },
    ],
    routes: [
      { to: "Sacramento", toKey: "sacramento", duration: "2h 00m", frequency: "6x daily", frequencyKey: "sixxDaily", economy: "$29-49", business: "$49-79" },
      { to: "San Jose", toKey: "sanJose", duration: "1h 00m", frequency: "Hourly", frequencyKey: "hourly", economy: "$10-19", business: "$19-35" },
      { to: "Los Angeles", toKey: "losAngeles", duration: "9h 30m", frequency: "1x daily", frequencyKey: "onexDaily", economy: "$59-99", business: "$99-179" },
    ],
    localTransit: [
      { name: "BART", url: "https://www.bart.gov", description: "Bay Area rapid transit to Levi's Stadium", descriptionKey: "bartDesc" },
      { name: "Caltrain", url: "https://www.caltrain.com", description: "SF to San Jose corridor", descriptionKey: "caltrainDesc" },
      { name: "VTA Light Rail", url: "https://www.vta.org", description: "Santa Clara Valley service", descriptionKey: "vtaLightRailDesc" },
    ]
  },
  {
    city: "Seattle",
    cityKey: "seattle",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "King Street Station",
    stationKey: "kingStreetStation",
    operators: [
      { name: "Amtrak", url: "https://www.amtrak.com" },
      { name: "Sound Transit", url: "https://www.soundtransit.org" },
      { name: "Sounder", url: "https://www.soundtransit.org/ride-with-us/sounder" },
    ],
    routes: [
      { to: "Portland", toKey: "portland", duration: "3h 30m", frequency: "4x daily", frequencyKey: "fourxDaily", economy: "$35-59", business: "$59-99" },
      { to: "Vancouver BC", toKey: "vancouverBc", duration: "4h 00m", frequency: "2x daily", frequencyKey: "twoxDaily", economy: "$45-79", business: "$79-129" },
    ],
    localTransit: [
      { name: "Link Light Rail", url: "https://www.soundtransit.org", description: "Stadium station available", descriptionKey: "linkLightRailDesc" },
      { name: "Sounder Train", url: "https://www.soundtransit.org", description: "Commuter rail service", descriptionKey: "sounderTrainDesc" },
    ]
  },
  {
    city: "Toronto",
    cityKey: "toronto",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    station: "Union Station",
    stationKey: "torontoUnionStation",
    operators: [
      { name: "VIA Rail", url: "https://www.viarail.ca" },
      { name: "GO Transit", url: "https://www.gotransit.com" },
      { name: "UP Express", url: "https://www.upexpress.com" },
    ],
    routes: [
      { to: "Montreal", toKey: "montreal", duration: "5h 00m", frequency: "5x daily", frequencyKey: "fivexDaily", economy: "CAD $59-129", business: "CAD $149-249" },
      { to: "Ottawa", toKey: "ottawa", duration: "4h 30m", frequency: "6x daily", frequencyKey: "sixxDaily", economy: "CAD $49-99", business: "CAD $119-199" },
      { to: "Niagara Falls", toKey: "niagaraFalls", duration: "2h 00m", frequency: "2x daily", frequencyKey: "twoxDaily", economy: "CAD $29-49", business: "CAD $59-89" },
    ],
    localTransit: [
      { name: "TTC Subway", url: "https://www.ttc.ca", description: "Toronto Transit Commission", descriptionKey: "ttcSubwayDesc" },
      { name: "GO Transit", url: "https://www.gotransit.com", description: "Regional rail to BMO Field", descriptionKey: "goTransitDesc" },
      { name: "UP Express", url: "https://www.upexpress.com", description: "Airport express", descriptionKey: "upExpressDesc" },
    ]
  },
  {
    city: "Vancouver",
    cityKey: "vancouver",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    station: "Pacific Central Station",
    stationKey: "pacificCentralStation",
    operators: [
      { name: "VIA Rail", url: "https://www.viarail.ca" },
      { name: "Rocky Mountaineer", url: "https://www.rockymountaineer.com" },
    ],
    routes: [
      { to: "Seattle", toKey: "seattle", duration: "4h 00m", frequency: "2x daily", frequencyKey: "twoxDaily", economy: "CAD $59-99", business: "CAD $99-159" },
      { to: "Jasper (Rocky Mountaineer)", toKey: "jasper", duration: "2 days", frequency: "Seasonal", frequencyKey: "seasonal", economy: "CAD $1,500+", business: "CAD $2,500+" },
    ],
    localTransit: [
      { name: "SkyTrain", url: "https://www.translink.ca", description: "Rapid transit to BC Place", descriptionKey: "skyTrainDesc" },
      { name: "Canada Line", url: "https://www.translink.ca", description: "Airport to downtown", descriptionKey: "canadaLineDesc" },
      { name: "West Coast Express", url: "https://www.translink.ca", description: "Commuter rail", descriptionKey: "westCoastExpressDesc" },
    ]
  },
  {
    city: "Mexico City",
    cityKey: "mexicoCity",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    station: "Buenavista Station / Various",
    stationKey: "buenavistaStation",
    operators: [
      { name: "Tren Suburbano", url: "https://www.fsuburbanos.com" },
      { name: "Mexico City Metro", url: "https://www.metro.cdmx.gob.mx" },
    ],
    routes: [
      { to: "Cuautitlán", toKey: "cuautitlan", duration: "0h 25m", frequency: "Every 10 min", frequencyKey: "every10Min", economy: "MXN $17", business: "N/A" },
      { to: "Toluca (future)", toKey: "toluca", duration: "0h 40m", frequency: "TBD", frequencyKey: "tbd", economy: "TBD", business: "TBD" },
    ],
    localTransit: [
      { name: "Mexico City Metro", url: "https://www.metro.cdmx.gob.mx", description: "12 lines, Azteca station nearby", descriptionKey: "mexicoCityMetroDesc" },
      { name: "Metrobús", url: "https://www.metrobus.cdmx.gob.mx", description: "BRT system", descriptionKey: "metrobusDesc" },
      { name: "Tren Ligero", url: "https://www.ste.cdmx.gob.mx", description: "Light rail in south", descriptionKey: "trenLigeroDesc" },
    ]
  },
  {
    city: "Dallas",
    cityKey: "dallas",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Dallas Union Station",
    stationKey: "dallasUnionStation",
    operators: [
      { name: "Amtrak", url: "https://www.amtrak.com" },
      { name: "TRE", url: "https://trinityrailwayexpress.org" },
      { name: "DART", url: "https://www.dart.org" },
    ],
    routes: [
      { to: "Fort Worth", toKey: "fortWorth", duration: "0h 50m", frequency: "Every 30 min", frequencyKey: "every30Min", economy: "$5-10", business: "N/A" },
      { to: "Austin", toKey: "austin", duration: "6h 00m", frequency: "1x daily", frequencyKey: "onexDaily", economy: "$29-49", business: "$49-79" },
      { to: "San Antonio", toKey: "sanAntonio", duration: "8h 00m", frequency: "1x daily", frequencyKey: "onexDaily", economy: "$35-59", business: "$59-99" },
    ],
    localTransit: [
      { name: "DART Rail", url: "https://www.dart.org", description: "Light rail throughout DFW", descriptionKey: "dartRailDesc" },
      { name: "TRE", url: "https://trinityrailwayexpress.org", description: "Dallas-Fort Worth commuter rail", descriptionKey: "treDesc" },
    ]
  },
  {
    city: "Atlanta",
    cityKey: "atlanta",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Peachtree Station",
    stationKey: "peachtreeStation",
    operators: [
      { name: "Amtrak", url: "https://www.amtrak.com" },
      { name: "MARTA", url: "https://www.itsmarta.com" },
    ],
    routes: [
      { to: "Charlotte", toKey: "charlotte", duration: "4h 00m", frequency: "1x daily", frequencyKey: "onexDaily", economy: "$29-49", business: "$49-79" },
      { to: "New Orleans", toKey: "newOrleans", duration: "9h 00m", frequency: "1x daily", frequencyKey: "onexDaily", economy: "$49-89", business: "$89-149" },
    ],
    localTransit: [
      { name: "MARTA Rail", url: "https://www.itsmarta.com", description: "Dome/GWCC Station for Mercedes-Benz Stadium", descriptionKey: "martaRailDesc" },
    ]
  },
  {
    city: "Houston",
    cityKey: "houston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Houston Amtrak Station",
    stationKey: "houstonAmtrakStation",
    operators: [
      { name: "Amtrak", url: "https://www.amtrak.com" },
      { name: "METRORail", url: "https://www.ridemetro.org" },
    ],
    routes: [
      { to: "New Orleans", toKey: "newOrleans", duration: "9h 00m", frequency: "3x weekly", frequencyKey: "threexWeekly", economy: "$35-59", business: "$59-99" },
      { to: "San Antonio", toKey: "sanAntonio", duration: "4h 30m", frequency: "1x daily", frequencyKey: "onexDaily", economy: "$25-45", business: "$45-75" },
    ],
    localTransit: [
      { name: "METRORail", url: "https://www.ridemetro.org", description: "Red, Green, Purple lines to NRG Stadium", descriptionKey: "metroRailHoustonDesc" },
    ]
  },
];

export default function RailServices() {
  const { t } = useTranslation();
  const [selectedHub, setSelectedHub] = useState<RailHub | null>(null);

  if (selectedHub) {
    return (
      <Layout>
        <div className="pt-6 px-6 pb-24">
          <button 
            onClick={() => setSelectedHub(null)}
            className="flex items-center space-x-2 text-primary mb-6 hover:text-primary/80 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 rtl-flip" />
            <span className="text-sm font-medium">{t("transportation.railServices.backToCities")}</span>
          </button>

          <div className="bg-gradient-to-br from-blue-500/20 to-primary/10 border border-blue-500/20 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0">
                <img 
                  src={`https://flagcdn.com/w160/${selectedHub.countryCode}.png`}
                  alt={`${t(`cities.countries.${selectedHub.countryKey}`)} flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-white mb-1" data-testid="text-city-name">
                  {t(`cities.cityNames.${selectedHub.cityKey}`)}
                </h1>
                <p className="text-blue-400 font-medium text-sm mb-1">
                  <Train className="w-4 h-4 inline mr-1" />
                  {t(`transportation.stations.${selectedHub.stationKey}`)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-display font-bold text-white mb-3">{t("transportation.railServices.railOperators")}</h2>
            <div className="flex flex-wrap gap-2">
              {selectedHub.operators.map((operator, index) => (
                <a
                  key={index}
                  href={operator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-card border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-white transition-all flex items-center gap-1.5 group"
                  data-testid={`link-rail-operator-${operator.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {operator.name}
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          {selectedHub.routes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-display font-bold text-white">{t("transportation.railServices.intercityRoutes")}</h2>
              </div>
              
              <div className="space-y-3">
                {selectedHub.routes.map((route, index) => (
                  <div 
                    key={index}
                    className="bg-card border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-colors"
                    data-testid={`card-rail-route-${route.to.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Train className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-white">{t(`transportation.railServices.destinations.${route.toKey}`)}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-muted-foreground text-xs">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{route.duration}</span>
                        </div>
                        <span className="text-blue-400">{t(`transportation.railServices.frequencies.${route.frequencyKey}`)}</span>
                      </div>
                    </div>

                    <div className={`grid ${route.firstClass ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
                      <div className="bg-background/50 rounded-lg p-3 text-center">
                        <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("transportation.internationalFlights.economy")}</span>
                        <span className="block text-sm font-bold text-white">{route.economy}</span>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                        <span className="block text-[10px] uppercase tracking-wider text-blue-400 mb-1">{t("transportation.internationalFlights.business")}</span>
                        <span className="block text-sm font-bold text-blue-400">{route.business}</span>
                      </div>
                      {route.firstClass && (
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-center">
                          <span className="block text-[10px] uppercase tracking-wider text-accent mb-1">{t("transportation.internationalFlights.firstClass")}</span>
                          <span className="block text-sm font-bold text-accent">{route.firstClass}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-display font-bold text-white mb-3">{t("transportation.railServices.localTransit")}</h2>
            <div className="space-y-3">
              {selectedHub.localTransit.map((transit, index) => (
                <a
                  key={index}
                  href={transit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-card border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-colors group"
                  data-testid={`link-transit-${transit.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-primary transition-colors flex items-center gap-2">
                        {transit.name}
                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      </h3>
                      <p className="text-sm text-muted-foreground">{t(`transportation.railServices.transitDescriptions.${transit.descriptionKey}`)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary rtl-flip" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("transportation.railServices.pricingNote")}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-8 px-6 pb-6">
        <Link href="/transportation" className="flex items-center space-x-2 text-primary mb-4 hover:text-primary/80 transition-colors">
          <ArrowLeft className="w-4 h-4 rtl-flip" />
          <span className="text-sm font-medium">{t("transportation.backToTransportation")}</span>
        </Link>

        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Train className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white" data-testid="text-page-title">
              {t("transportation.railServices.title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("transportation.railServices.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24">
        <h2 className="text-lg font-display font-bold text-white mb-4">{t("transportation.railServices.selectCity")}</h2>
        
        <div className="space-y-3">
          {railHubs.map((hub, index) => (
            <button
              key={index}
              onClick={() => setSelectedHub(hub)}
              className="w-full bg-card border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-all group text-left"
              data-testid={`button-rail-city-${hub.countryCode}-${index}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img 
                      src={`https://flagcdn.com/w80/${hub.countryCode}.png`}
                      alt={`${t(`cities.countries.${hub.countryKey}`)} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{t(`cities.cityNames.${hub.cityKey}`)}</h3>
                    <p className="text-sm text-muted-foreground">{t(`transportation.stations.${hub.stationKey}`)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">{hub.routes.length} {t("transportation.railServices.routes")}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-400 transition-colors rtl-flip" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
