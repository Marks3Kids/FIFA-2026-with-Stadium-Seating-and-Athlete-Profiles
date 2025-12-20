import { Layout } from "@/components/Layout";
import { Bus, Clock, ArrowLeft, MapPin, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface BusRoute {
  to: string;
  toKey: string;
  duration: string;
  price: string;
}

interface BusHub {
  city: string;
  cityKey: string;
  country: string;
  countryKey: string;
  countryCode: string;
  station: string;
  stationKey: string;
  operators: { name: string; url: string }[];
  routes: BusRoute[];
  matchDayServices?: { name: string; description: string; descriptionKey: string }[];
}

const busHubs: BusHub[] = [
  {
    city: "New York / New Jersey",
    cityKey: "newYorkNewJersey",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Port Authority Bus Terminal / Newark Penn Station",
    stationKey: "portAuthorityNewark",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "Megabus", url: "https://www.megabus.com" },
      { name: "Peter Pan", url: "https://peterpanbus.com" },
      { name: "NJ Transit Bus", url: "https://www.njtransit.com" },
    ],
    routes: [
      { to: "Boston", toKey: "boston", duration: "4h 15m", price: "$15-45 USD" },
      { to: "Philadelphia", toKey: "philadelphia", duration: "2h 00m", price: "$10-30 USD" },
      { to: "Washington DC", toKey: "washingtonDc", duration: "4h 30m", price: "$20-50 USD" },
      { to: "Baltimore", toKey: "baltimore", duration: "3h 30m", price: "$15-40 USD" },
      { to: "Atlantic City", toKey: "atlanticCity", duration: "2h 30m", price: "$10-25 USD" },
    ],
    matchDayServices: [
      { name: "NJ Transit Express", description: "NJ Transit express buses to MetLife Stadium", descriptionKey: "njTransitMetLife" },
      { name: "Private Charter", description: "Private charter shuttles from Manhattan", descriptionKey: "charterManhattan" },
      { name: "Park & Ride", description: "Park & Ride services from various NJ locations", descriptionKey: "parkRideNj" },
    ]
  },
  {
    city: "Los Angeles",
    cityKey: "losAngeles",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Union Station / Downtown LA",
    stationKey: "unionStationLa",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "Megabus", url: "https://www.megabus.com" },
      { name: "LA Metro Bus", url: "https://www.metro.net" },
    ],
    routes: [
      { to: "San Diego", toKey: "sanDiego", duration: "2h 30m", price: "$12-35 USD" },
      { to: "Las Vegas", toKey: "lasVegas", duration: "5h 00m", price: "$20-55 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", duration: "7h 00m", price: "$25-65 USD" },
      { to: "Phoenix", toKey: "phoenix", duration: "6h 00m", price: "$25-55 USD" },
    ],
    matchDayServices: [
      { name: "Metro Express", description: "Metro express buses to SoFi Stadium", descriptionKey: "metroSofi" },
      { name: "LAX FlyAway", description: "LAX FlyAway shuttle connections", descriptionKey: "laxFlyAway" },
      { name: "Hotel Charter", description: "Private charter services from major hotels", descriptionKey: "hotelCharter" },
    ]
  },
  {
    city: "Miami",
    cityKey: "miami",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Miami Central Station",
    stationKey: "miamiCentral",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "RedCoach", url: "https://www.redcoachusa.com" },
      { name: "Miami-Dade Transit", url: "https://www.miamidade.gov/transit" },
    ],
    routes: [
      { to: "Orlando", toKey: "orlando", duration: "4h 00m", price: "$15-40 USD" },
      { to: "Tampa", toKey: "tampa", duration: "5h 00m", price: "$20-50 USD" },
      { to: "Fort Lauderdale", toKey: "fortLauderdale", duration: "0h 45m", price: "$5-15 USD" },
      { to: "West Palm Beach", toKey: "westPalmBeach", duration: "1h 30m", price: "$10-25 USD" },
    ],
    matchDayServices: [
      { name: "Stadium Express", description: "Express shuttles to Hard Rock Stadium", descriptionKey: "expressHardRock" },
      { name: "Park & Ride", description: "Park & Ride from Aventura and FIU", descriptionKey: "parkRideAventura" },
      { name: "Beach Resort Shuttle", description: "Beach resort shuttle packages", descriptionKey: "beachResortShuttle" },
    ]
  },
  {
    city: "Dallas",
    cityKey: "dallas",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Dallas Greyhound Station",
    stationKey: "dallasGreyhound",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "Megabus", url: "https://www.megabus.com" },
      { name: "DART Bus", url: "https://www.dart.org" },
    ],
    routes: [
      { to: "Houston", toKey: "houston", duration: "4h 00m", price: "$15-40 USD" },
      { to: "Austin", toKey: "austin", duration: "3h 30m", price: "$15-35 USD" },
      { to: "San Antonio", toKey: "sanAntonio", duration: "5h 00m", price: "$20-45 USD" },
      { to: "Oklahoma City", toKey: "oklahomaCity", duration: "3h 30m", price: "$20-40 USD" },
    ],
    matchDayServices: [
      { name: "DART Express", description: "DART express routes to AT&T Stadium", descriptionKey: "dartAttStadium" },
      { name: "Arlington Shuttle", description: "Arlington shuttle from Downtown Dallas", descriptionKey: "arlingtonShuttle" },
      { name: "TRE Connection", description: "TRE connection with shuttle service", descriptionKey: "treConnection" },
    ]
  },
  {
    city: "Atlanta",
    cityKey: "atlanta",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Atlanta Greyhound Station",
    stationKey: "atlantaGreyhound",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "Megabus", url: "https://www.megabus.com" },
      { name: "MARTA Bus", url: "https://www.itsmarta.com" },
    ],
    routes: [
      { to: "Charlotte", toKey: "charlotte", duration: "4h 00m", price: "$20-45 USD" },
      { to: "Nashville", toKey: "nashville", duration: "4h 00m", price: "$20-45 USD" },
      { to: "Birmingham", toKey: "birmingham", duration: "2h 30m", price: "$15-35 USD" },
      { to: "Jacksonville", toKey: "jacksonville", duration: "5h 30m", price: "$25-50 USD" },
    ],
    matchDayServices: [
      { name: "MARTA Rail", description: "MARTA rail + shuttle to Mercedes-Benz Stadium", descriptionKey: "martaMercedesBenz" },
      { name: "GWCC Station", description: "Georgia Dome/GWCC station nearby", descriptionKey: "gwccStation" },
      { name: "Hotel Shuttle", description: "Hotel shuttle packages from Buckhead", descriptionKey: "buckheadShuttle" },
    ]
  },
  {
    city: "Houston",
    cityKey: "houston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Houston Greyhound Station",
    stationKey: "houstonGreyhound",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "Megabus", url: "https://www.megabus.com" },
      { name: "METRO Bus", url: "https://www.ridemetro.org" },
    ],
    routes: [
      { to: "Dallas", toKey: "dallas", duration: "4h 00m", price: "$15-40 USD" },
      { to: "San Antonio", toKey: "sanAntonio", duration: "3h 00m", price: "$15-35 USD" },
      { to: "Austin", toKey: "austin", duration: "2h 45m", price: "$15-35 USD" },
      { to: "New Orleans", toKey: "newOrleans", duration: "5h 30m", price: "$25-55 USD" },
    ],
    matchDayServices: [
      { name: "METRORail", description: "METRORail to NRG Stadium", descriptionKey: "metroRailNrg" },
      { name: "Park & Ride Express", description: "Park & Ride express shuttles", descriptionKey: "parkRideExpress" },
      { name: "Galleria Shuttle", description: "Galleria area hotel shuttles", descriptionKey: "galleriaShuttle" },
    ]
  },
  {
    city: "Seattle",
    cityKey: "seattle",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Seattle Greyhound Station",
    stationKey: "seattleGreyhound",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "BoltBus", url: "https://www.boltbus.com" },
      { name: "King County Metro", url: "https://kingcounty.gov/metro" },
    ],
    routes: [
      { to: "Portland", toKey: "portland", duration: "3h 30m", price: "$15-35 USD" },
      { to: "Vancouver BC", toKey: "vancouverBc", duration: "4h 00m", price: "$25-50 USD" },
      { to: "Spokane", toKey: "spokane", duration: "5h 00m", price: "$25-50 USD" },
    ],
    matchDayServices: [
      { name: "Sound Transit", description: "Sound Transit express to Lumen Field", descriptionKey: "soundTransitLumen" },
      { name: "Stadium Light Rail", description: "Stadium station light rail", descriptionKey: "stadiumLightRail" },
      { name: "Eastside Shuttle", description: "Eastside shuttle from Bellevue", descriptionKey: "eastsideBellevue" },
    ]
  },
  {
    city: "San Francisco Bay Area",
    cityKey: "sanFranciscoBayArea",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "San Francisco Transbay Terminal",
    stationKey: "sfTransbay",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "Megabus", url: "https://www.megabus.com" },
      { name: "AC Transit", url: "https://www.actransit.org" },
    ],
    routes: [
      { to: "Los Angeles", toKey: "losAngeles", duration: "7h 00m", price: "$25-60 USD" },
      { to: "Sacramento", toKey: "sacramento", duration: "2h 00m", price: "$10-30 USD" },
      { to: "San Jose", toKey: "sanJose", duration: "1h 15m", price: "$8-20 USD" },
      { to: "Reno", toKey: "reno", duration: "4h 30m", price: "$20-45 USD" },
    ],
    matchDayServices: [
      { name: "VTA Express", description: "VTA express to Levi's Stadium", descriptionKey: "vtaLevis" },
      { name: "BART Connection", description: "BART connection from SF to Milpitas", descriptionKey: "bartMilpitas" },
      { name: "Caltrain Shuttle", description: "Caltrain + shuttle service", descriptionKey: "caltrainShuttle" },
    ]
  },
  {
    city: "Toronto",
    cityKey: "toronto",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    station: "Toronto Coach Terminal",
    stationKey: "torontoCoach",
    operators: [
      { name: "Greyhound Canada", url: "https://www.greyhound.ca" },
      { name: "FlixBus", url: "https://www.flixbus.ca" },
      { name: "Megabus", url: "https://ca.megabus.com" },
      { name: "GO Bus", url: "https://www.gotransit.com" },
    ],
    routes: [
      { to: "Montreal", toKey: "montreal", duration: "6h 00m", price: "CAD $35-75" },
      { to: "Ottawa", toKey: "ottawa", duration: "5h 00m", price: "CAD $30-65" },
      { to: "Niagara Falls", toKey: "niagaraFalls", duration: "2h 00m", price: "CAD $15-35" },
      { to: "Buffalo", toKey: "buffalo", duration: "2h 30m", price: "CAD $25-50" },
    ],
    matchDayServices: [
      { name: "TTC Streetcar", description: "TTC streetcar to BMO Field", descriptionKey: "ttcBmoField" },
      { name: "GO Transit", description: "GO Transit from Union Station", descriptionKey: "goTransitUnion" },
      { name: "Pearson Express", description: "Express shuttles from Pearson Airport", descriptionKey: "pearsonExpress" },
    ]
  },
  {
    city: "Vancouver",
    cityKey: "vancouver",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    station: "Pacific Central Station",
    stationKey: "pacificCentral",
    operators: [
      { name: "Greyhound Canada", url: "https://www.greyhound.ca" },
      { name: "FlixBus", url: "https://www.flixbus.ca" },
      { name: "BC Transit", url: "https://www.bctransit.com" },
      { name: "TransLink", url: "https://www.translink.ca" },
    ],
    routes: [
      { to: "Seattle", toKey: "seattle", duration: "4h 00m", price: "CAD $30-60" },
      { to: "Whistler", toKey: "whistler", duration: "2h 30m", price: "CAD $25-50" },
      { to: "Victoria (via ferry)", toKey: "victoriaFerry", duration: "4h 00m", price: "CAD $40-70" },
    ],
    matchDayServices: [
      { name: "SkyTrain", description: "SkyTrain to BC Place Stadium Station", descriptionKey: "skytrainBcPlace" },
      { name: "Event Shuttles", description: "Event shuttles from Park & Rides", descriptionKey: "eventShuttlesParkRide" },
      { name: "YVR Express", description: "YVR airport express connection", descriptionKey: "yvrExpress" },
    ]
  },
  {
    city: "Mexico City",
    cityKey: "mexicoCity",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    station: "TAPO / Terminal Norte / Sur / Poniente",
    stationKey: "tapoTerminals",
    operators: [
      { name: "ADO", url: "https://www.ado.com.mx" },
      { name: "ETN", url: "https://www.etn.com.mx" },
      { name: "Primera Plus", url: "https://www.primeraplus.com.mx" },
      { name: "Estrella Roja", url: "https://www.estrellaroja.com.mx" },
    ],
    routes: [
      { to: "Guadalajara", toKey: "guadalajara", duration: "7h 00m", price: "MXN $800-1,400" },
      { to: "Monterrey", toKey: "monterrey", duration: "12h 00m", price: "MXN $1,200-2,000" },
      { to: "Puebla", toKey: "puebla", duration: "2h 00m", price: "MXN $200-400" },
      { to: "Querétaro", toKey: "queretaro", duration: "3h 00m", price: "MXN $350-600" },
    ],
    matchDayServices: [
      { name: "Metrobús", description: "Metrobús to Estadio Azteca area", descriptionKey: "metrobusAzteca" },
      { name: "Event Buses", description: "Special event buses from terminals", descriptionKey: "eventBusesTerminals" },
      { name: "Hotel Shuttles", description: "Hotel shuttle services", descriptionKey: "hotelShuttlesMx" },
    ]
  },
  {
    city: "Guadalajara",
    cityKey: "guadalajara",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    station: "Central Vieja / Nueva Central",
    stationKey: "centralViejaNueva",
    operators: [
      { name: "ETN", url: "https://www.etn.com.mx" },
      { name: "Primera Plus", url: "https://www.primeraplus.com.mx" },
      { name: "Omnibus de Mexico", url: "https://www.odm.com.mx" },
    ],
    routes: [
      { to: "Mexico City", toKey: "mexicoCity", duration: "7h 00m", price: "MXN $800-1,400" },
      { to: "Monterrey", toKey: "monterrey", duration: "10h 00m", price: "MXN $1,000-1,800" },
      { to: "Puerto Vallarta", toKey: "puertoVallarta", duration: "5h 00m", price: "MXN $500-900" },
    ],
    matchDayServices: [
      { name: "SITEUR", description: "SITEUR buses to Estadio Akron", descriptionKey: "siteurAkron" },
      { name: "Macrobús", description: "Macrobús rapid transit connection", descriptionKey: "macrobusRapid" },
      { name: "Zona Rosa Shuttle", description: "Shuttle from Zona Rosa hotels", descriptionKey: "zonaRosaShuttle" },
    ]
  },
  {
    city: "Monterrey",
    cityKey: "monterrey",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    station: "Central de Autobuses",
    stationKey: "centralAutobuses",
    operators: [
      { name: "ETN", url: "https://www.etn.com.mx" },
      { name: "Omnibus de Mexico", url: "https://www.odm.com.mx" },
      { name: "Senda", url: "https://www.senda.com.mx" },
    ],
    routes: [
      { to: "Mexico City", toKey: "mexicoCity", duration: "12h 00m", price: "MXN $1,200-2,000" },
      { to: "Guadalajara", toKey: "guadalajara", duration: "10h 00m", price: "MXN $1,000-1,800" },
      { to: "Saltillo", toKey: "saltillo", duration: "1h 30m", price: "MXN $150-300" },
    ],
    matchDayServices: [
      { name: "Metrorrey", description: "Metrorrey connection to stadium", descriptionKey: "metroreyStadium" },
      { name: "Ecovía BRT", description: "Ecovía BRT service", descriptionKey: "ecoviaBrt" },
      { name: "Hotel District", description: "Hotel district shuttles", descriptionKey: "hotelDistrictMty" },
    ]
  },
  {
    city: "Boston",
    cityKey: "boston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "South Station Bus Terminal",
    stationKey: "southStation",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "Peter Pan", url: "https://peterpanbus.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "MBTA Bus", url: "https://www.mbta.com" },
    ],
    routes: [
      { to: "New York", toKey: "newYork", duration: "4h 15m", price: "$15-45 USD" },
      { to: "Providence", toKey: "providence", duration: "1h 00m", price: "$10-25 USD" },
      { to: "Hartford", toKey: "hartford", duration: "2h 00m", price: "$15-30 USD" },
    ],
    matchDayServices: [
      { name: "MBTA Shuttle", description: "MBTA buses to Gillette Stadium shuttle", descriptionKey: "mbtaGillette" },
      { name: "Foxborough Express", description: "Foxborough express from South Station", descriptionKey: "foxboroughExpress" },
      { name: "Providence Line", description: "Providence Line bus bridge", descriptionKey: "providenceLine" },
    ]
  },
  {
    city: "Philadelphia",
    cityKey: "philadelphia",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Philadelphia Greyhound Terminal",
    stationKey: "philadelphiaGreyhound",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "Megabus", url: "https://www.megabus.com" },
      { name: "SEPTA Bus", url: "https://www.septa.org" },
    ],
    routes: [
      { to: "New York", toKey: "newYork", duration: "2h 00m", price: "$10-30 USD" },
      { to: "Washington DC", toKey: "washingtonDc", duration: "3h 00m", price: "$15-35 USD" },
      { to: "Baltimore", toKey: "baltimore", duration: "2h 00m", price: "$12-30 USD" },
    ],
    matchDayServices: [
      { name: "SEPTA Express", description: "SEPTA stadium express buses", descriptionKey: "septaStadium" },
      { name: "Sports Complex Shuttle", description: "Sports Complex shuttle from Center City", descriptionKey: "sportsComplexShuttle" },
      { name: "Broad Street Subway", description: "Broad Street Subway connection", descriptionKey: "broadStreetSubway" },
    ]
  },
  {
    city: "Kansas City",
    cityKey: "kansasCity",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    station: "Kansas City Bus Station",
    stationKey: "kansasCityBus",
    operators: [
      { name: "Greyhound", url: "https://www.greyhound.com" },
      { name: "FlixBus", url: "https://www.flixbus.com" },
      { name: "Burlington Trailways", url: "https://www.burlingtontrailways.com" },
    ],
    routes: [
      { to: "St. Louis", toKey: "stLouis", duration: "4h 00m", price: "$20-45 USD" },
      { to: "Omaha", toKey: "omaha", duration: "3h 00m", price: "$20-40 USD" },
      { to: "Denver", toKey: "denver", duration: "9h 00m", price: "$40-80 USD" },
    ],
    matchDayServices: [
      { name: "Arrowhead Express", description: "Express shuttles to Arrowhead Stadium", descriptionKey: "arrowheadExpress" },
      { name: "Power & Light Park & Ride", description: "Park & Ride from Power & Light District", descriptionKey: "powerLightParkRide" },
      { name: "Independence Avenue", description: "Independence Avenue corridor buses", descriptionKey: "independenceAvenue" },
    ]
  },
];

export default function BusServices() {
  const { t } = useTranslation();
  const [selectedHub, setSelectedHub] = useState<BusHub | null>(null);

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
            <span className="text-sm font-medium">{t("transportation.busServices.backToCities")}</span>
          </button>

          <div className="bg-gradient-to-br from-orange-500/20 to-primary/10 border border-orange-500/20 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0">
                <img 
                  src={`https://flagcdn.com/w160/${selectedHub.countryCode}.png`}
                  alt={`${selectedHub.country} flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-white mb-1" data-testid="text-city-name">
                  {t(`cities.cityNames.${selectedHub.cityKey}`)}
                </h1>
                <p className="text-orange-400 font-medium text-sm mb-1">
                  <Bus className="w-4 h-4 inline mr-1" />
                  {t(`transportation.busStations.${selectedHub.stationKey}`)}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-display font-bold text-white mb-3">{t("transportation.busServices.busOperators")}</h2>
            <div className="flex flex-wrap gap-2">
              {selectedHub.operators.map((operator, index) => (
                <a
                  key={index}
                  href={operator.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-card border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:bg-orange-500/20 hover:border-orange-500/30 hover:text-white transition-all flex items-center gap-1.5 group"
                  data-testid={`link-bus-operator-${operator.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {operator.name}
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-display font-bold text-white">{t("transportation.busServices.intercityRoutes")}</h2>
            </div>
            
            <div className="space-y-3">
              {selectedHub.routes.map((route, index) => (
                <div 
                  key={index}
                  className="bg-card border border-white/5 rounded-xl p-4 hover:border-orange-500/30 transition-colors"
                  data-testid={`card-bus-route-${route.to.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Bus className="w-4 h-4 text-orange-400" />
                      <span className="font-bold text-white">{t(`cities.cityNames.${route.toKey}`)}</span>
                    </div>
                    <span className="text-lg font-bold text-orange-400">{route.price}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t("transportation.busServices.duration")}: {route.duration}</span>
                    </div>
                    <span className="text-orange-400/70">{t("transportation.busServices.price")}: {route.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-white mb-3">{t("transportation.busServices.matchDayServices")}</h2>
            <div className="bg-card border border-white/5 rounded-xl p-4">
              <ul className="space-y-2">
                {selectedHub.matchDayServices?.map((service, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-orange-400 mr-2">•</span>
                    {t(`transportation.busServices.matchDayDescriptions.${service.descriptionKey}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("transportation.busServices.priceDisclaimer")}
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
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Bus className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white" data-testid="text-page-title">
              {t("transportation.busServices.title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("transportation.busServices.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24">
        <h2 className="text-lg font-display font-bold text-white mb-4">{t("transportation.busServices.selectCity")}</h2>
        
        <div className="space-y-3">
          {busHubs.map((hub, index) => (
            <button
              key={index}
              onClick={() => setSelectedHub(hub)}
              className="w-full bg-card border border-white/5 rounded-xl p-4 hover:border-orange-500/30 transition-all group text-left"
              data-testid={`button-bus-city-${hub.countryCode}-${index}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img 
                      src={`https://flagcdn.com/w80/${hub.countryCode}.png`}
                      alt={`${hub.country} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">{t(`cities.cityNames.${hub.cityKey}`)}</h3>
                    <p className="text-sm text-muted-foreground truncate max-w-[180px]">{t(`transportation.busStations.${hub.stationKey}`)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">{hub.routes.length} {t("transportation.busServices.routes")}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-400 transition-colors rtl-flip" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
