import { Layout } from "@/components/Layout";
import { LivePricingBanner } from "@/components/LivePricingBanner";
import { Plane, Clock, ArrowLeft, Globe, Star, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { getAirlineUrl } from "@/lib/airlines";
import { useTranslation } from "react-i18next";

interface Airport {
  city: string;
  cityKey: string;
  country: string;
  countryKey: string;
  countryCode: string;
  airportName: string;
  airportNameKey: string;
  code: string;
  airlines: string[];
  continentConnections: {
    continent: string;
    continentKey: string;
    routes: {
      from: string;
      fromKey: string;
      flightTime: string;
      economy: string;
      business: string;
      firstClass: string;
    }[];
  }[];
}

const airports: Airport[] = [
  {
    city: "New York / New Jersey",
    cityKey: "newYorkNewJersey",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "John F. Kennedy International / Newark Liberty",
    airportNameKey: "jfkNewark",
    code: "JFK / EWR",
    airlines: ["Delta", "United", "American", "JetBlue", "British Airways", "Emirates", "Lufthansa", "Air France", "Qatar Airways"],
    continentConnections: [
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "7h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "7h 45m", economy: "—", business: "—", firstClass: "—" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "8h 15m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "South America",
        continentKey: "southAmerica",
        routes: [
          { from: "São Paulo (GRU)", fromKey: "saoPauloGRU", flightTime: "9h 45m", economy: "—", business: "—", firstClass: "—" },
          { from: "Buenos Aires (EZE)", fromKey: "buenosAiresEZE", flightTime: "10h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Dubai (DXB)", fromKey: "dubaiDXB", flightTime: "13h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Doha (DOH)", fromKey: "dohaDOH", flightTime: "13h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Asia",
        continentKey: "asia",
        routes: [
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "14h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Seoul (ICN)", fromKey: "seoulICN", flightTime: "14h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Los Angeles",
    cityKey: "losAngeles",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "Los Angeles International Airport",
    airportNameKey: "losAngelesInternational",
    code: "LAX",
    airlines: ["Delta", "American", "United", "Qantas", "Singapore Airlines", "Cathay Pacific", "ANA", "Korean Air", "Air New Zealand"],
    continentConnections: [
      {
        continent: "Asia Pacific",
        continentKey: "asiaPacific",
        routes: [
          { from: "Sydney (SYD)", fromKey: "sydneySYD", flightTime: "15h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "11h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Singapore (SIN)", fromKey: "singaporeSIN", flightTime: "17h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Oceania",
        continentKey: "oceania",
        routes: [
          { from: "Auckland (AKL)", fromKey: "aucklandAKL", flightTime: "12h 45m", economy: "—", business: "—", firstClass: "—" },
          { from: "Melbourne (MEL)", fromKey: "melbourneMEL", flightTime: "15h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "10h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "11h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Miami",
    cityKey: "miami",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "Miami International Airport",
    airportNameKey: "miamiInternational",
    code: "MIA",
    airlines: ["American", "LATAM", "Avianca", "Copa Airlines", "Iberia", "British Airways", "Lufthansa", "Air France"],
    continentConnections: [
      {
        continent: "South America",
        continentKey: "southAmerica",
        routes: [
          { from: "São Paulo (GRU)", fromKey: "saoPauloGRU", flightTime: "8h 15m", economy: "—", business: "—", firstClass: "—" },
          { from: "Buenos Aires (EZE)", fromKey: "buenosAiresEZE", flightTime: "9h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Bogotá (BOG)", fromKey: "bogotaBOG", flightTime: "3h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "Madrid (MAD)", fromKey: "madridMAD", flightTime: "8h 45m", economy: "—", business: "—", firstClass: "—" },
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "9h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Caribbean",
        continentKey: "caribbean",
        routes: [
          { from: "San Juan (SJU)", fromKey: "sanJuanSJU", flightTime: "2h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Havana (HAV)", fromKey: "havanaHAV", flightTime: "1h 15m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Dallas",
    cityKey: "dallas",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "Dallas/Fort Worth International Airport",
    airportNameKey: "dallasFortWorth",
    code: "DFW",
    airlines: ["American", "Southwest", "United", "Qatar Airways", "Emirates", "Lufthansa", "British Airways", "Japan Airlines"],
    continentConnections: [
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "9h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "10h 15m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Doha (DOH)", fromKey: "dohaDOH", flightTime: "15h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Dubai (DXB)", fromKey: "dubaiDXB", flightTime: "15h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Asia",
        continentKey: "asia",
        routes: [
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "13h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Seoul (ICN)", fromKey: "seoulICN", flightTime: "13h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Atlanta",
    cityKey: "atlanta",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "Hartsfield-Jackson Atlanta International",
    airportNameKey: "hartsfieldJackson",
    code: "ATL",
    airlines: ["Delta", "Southwest", "United", "Air France", "KLM", "Lufthansa", "British Airways", "Korean Air"],
    continentConnections: [
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "9h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Amsterdam (AMS)", fromKey: "amsterdamAMS", flightTime: "9h 15m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Africa",
        continentKey: "africa",
        routes: [
          { from: "Johannesburg (JNB)", fromKey: "johannesburgJNB", flightTime: "16h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Lagos (LOS)", fromKey: "lagosLOS", flightTime: "11h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Mexico City",
    cityKey: "mexicoCity",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    airportName: "Mexico City International (Benito Juárez)",
    airportNameKey: "mexicoCityInternational",
    code: "MEX",
    airlines: ["Aeroméxico", "Volaris", "United", "American", "Delta", "Iberia", "Air France", "Lufthansa", "British Airways"],
    continentConnections: [
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "Madrid (MAD)", fromKey: "madridMAD", flightTime: "10h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "11h 15m", economy: "—", business: "—", firstClass: "—" },
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "10h 45m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "South America",
        continentKey: "southAmerica",
        routes: [
          { from: "São Paulo (GRU)", fromKey: "saoPauloGRU", flightTime: "9h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Buenos Aires (EZE)", fromKey: "buenosAiresEZE", flightTime: "10h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Lima (LIM)", fromKey: "limaLIM", flightTime: "5h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Toronto",
    cityKey: "toronto",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    airportName: "Toronto Pearson International",
    airportNameKey: "torontoPearson",
    code: "YYZ",
    airlines: ["Air Canada", "WestJet", "United", "American", "British Airways", "Lufthansa", "Air France", "Emirates", "Turkish Airlines"],
    continentConnections: [
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "7h 15m", economy: "—", business: "—", firstClass: "—" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "7h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "8h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Dubai (DXB)", fromKey: "dubaiDXB", flightTime: "13h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Istanbul (IST)", fromKey: "istanbulIST", flightTime: "10h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Vancouver",
    cityKey: "vancouver",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    airportName: "Vancouver International Airport",
    airportNameKey: "vancouverInternational",
    code: "YVR",
    airlines: ["Air Canada", "WestJet", "United", "Cathay Pacific", "ANA", "Japan Airlines", "Korean Air", "Air China"],
    continentConnections: [
      {
        continent: "Asia Pacific",
        continentKey: "asiaPacific",
        routes: [
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "9h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Hong Kong (HKG)", fromKey: "hongKongHKG", flightTime: "12h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Seoul (ICN)", fromKey: "seoulICN", flightTime: "10h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Oceania",
        continentKey: "oceania",
        routes: [
          { from: "Sydney (SYD)", fromKey: "sydneySYD", flightTime: "15h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Auckland (AKL)", fromKey: "aucklandAKL", flightTime: "13h 15m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Guadalajara",
    cityKey: "guadalajara",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    airportName: "Guadalajara International (Miguel Hidalgo)",
    airportNameKey: "guadalajaraInternational",
    code: "GDL",
    airlines: ["Aeroméxico", "Volaris", "VivaAerobus", "United", "American", "Delta", "Alaska Airlines"],
    continentConnections: [
      {
        continent: "North America",
        continentKey: "northAmerica",
        routes: [
          { from: "Los Angeles (LAX)", fromKey: "losAngelesLAX", flightTime: "3h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Dallas (DFW)", fromKey: "dallasDFW", flightTime: "2h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Houston (IAH)", fromKey: "houstonIAH", flightTime: "2h 15m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Central America",
        continentKey: "centralAmerica",
        routes: [
          { from: "San José (SJO)", fromKey: "sanJoseSJO", flightTime: "3h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Panama City (PTY)", fromKey: "panamaCityPTY", flightTime: "4h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Monterrey",
    cityKey: "monterrey",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    airportName: "Monterrey International (Gen. Mariano Escobedo)",
    airportNameKey: "monterreyInternational",
    code: "MTY",
    airlines: ["Aeroméxico", "Volaris", "VivaAerobus", "United", "American", "Delta"],
    continentConnections: [
      {
        continent: "North America",
        continentKey: "northAmerica",
        routes: [
          { from: "Houston (IAH)", fromKey: "houstonIAH", flightTime: "1h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Dallas (DFW)", fromKey: "dallasDFW", flightTime: "1h 45m", economy: "—", business: "—", firstClass: "—" },
          { from: "Chicago (ORD)", fromKey: "chicagoORD", flightTime: "3h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Houston",
    cityKey: "houston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "George Bush Intercontinental Airport",
    airportNameKey: "georgeBushIntercontinental",
    code: "IAH",
    airlines: ["United", "Southwest", "American", "Spirit", "Emirates", "Qatar Airways", "Lufthansa", "British Airways"],
    continentConnections: [
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "9h 45m", economy: "—", business: "—", firstClass: "—" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "10h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Doha (DOH)", fromKey: "dohaDOH", flightTime: "15h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Dubai (DXB)", fromKey: "dubaiDXB", flightTime: "16h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "South America",
        continentKey: "southAmerica",
        routes: [
          { from: "São Paulo (GRU)", fromKey: "saoPauloGRU", flightTime: "10h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Bogotá (BOG)", fromKey: "bogotaBOG", flightTime: "4h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Seattle",
    cityKey: "seattle",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "Seattle-Tacoma International Airport",
    airportNameKey: "seattleTacoma",
    code: "SEA",
    airlines: ["Alaska Airlines", "Delta", "United", "Emirates", "Korean Air", "ANA", "Lufthansa", "British Airways"],
    continentConnections: [
      {
        continent: "Asia Pacific",
        continentKey: "asiaPacific",
        routes: [
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "10h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Seoul (ICN)", fromKey: "seoulICN", flightTime: "10h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "9h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "10h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "San Francisco Bay Area",
    cityKey: "sanFrancisco",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "San Francisco International / San Jose",
    airportNameKey: "sanFranciscoInternational",
    code: "SFO / SJC",
    airlines: ["United", "Alaska Airlines", "Southwest", "Singapore Airlines", "Cathay Pacific", "ANA", "Korean Air", "Lufthansa"],
    continentConnections: [
      {
        continent: "Asia Pacific",
        continentKey: "asiaPacific",
        routes: [
          { from: "Singapore (SIN)", fromKey: "singaporeSIN", flightTime: "16h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Hong Kong (HKG)", fromKey: "hongKongHKG", flightTime: "13h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "11h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "10h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "11h 15m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Boston",
    cityKey: "boston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "Boston Logan International Airport",
    airportNameKey: "bostonLogan",
    code: "BOS",
    airlines: ["JetBlue", "Delta", "American", "United", "British Airways", "Lufthansa", "Aer Lingus", "Icelandair"],
    continentConnections: [
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "6h 45m", economy: "—", business: "—", firstClass: "—" },
          { from: "Dublin (DUB)", fromKey: "dublinDUB", flightTime: "6h 00m", economy: "—", business: "—", firstClass: "—" },
          { from: "Reykjavik (KEF)", fromKey: "reykjavikKEF", flightTime: "5h 00m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Philadelphia",
    cityKey: "philadelphia",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "Philadelphia International Airport",
    airportNameKey: "philadelphiaInternational",
    code: "PHL",
    airlines: ["American", "Southwest", "Frontier", "Spirit", "British Airways", "Lufthansa", "Qatar Airways"],
    continentConnections: [
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "7h 15m", economy: "—", business: "—", firstClass: "—" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "7h 45m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Doha (DOH)", fromKey: "dohaDOH", flightTime: "12h 30m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
  {
    city: "Kansas City",
    cityKey: "kansasCity",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "Kansas City International Airport",
    airportNameKey: "kansasCityInternational",
    code: "MCI",
    airlines: ["Southwest", "United", "American", "Delta", "Frontier", "Alaska Airlines"],
    continentConnections: [
      {
        continent: "North America Hubs",
        continentKey: "northAmericaHubs",
        routes: [
          { from: "Chicago (ORD)", fromKey: "chicagoORD", flightTime: "1h 30m", economy: "—", business: "—", firstClass: "—" },
          { from: "Dallas (DFW)", fromKey: "dallasDFW", flightTime: "1h 45m", economy: "—", business: "—", firstClass: "—" },
          { from: "Denver (DEN)", fromKey: "denverDEN", flightTime: "1h 40m", economy: "—", business: "—", firstClass: "—" },
        ]
      },
    ]
  },
];

export default function InternationalFlights() {
  const { t } = useTranslation();
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  if (selectedAirport) {
    return (
      <Layout>
        <div className="px-6 pt-4"><LivePricingBanner /></div>
        {/* Airport Detail View */}
        <div className="pt-6 px-6 pb-24">
          <button 
            onClick={() => setSelectedAirport(null)}
            className="flex items-center space-x-2 text-primary mb-6 hover:text-primary/80 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 rtl-flip" />
            <span className="text-sm font-medium">{t("transportation.internationalFlights.backToAirports")}</span>
          </button>

          {/* Airport Header */}
          <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0">
                <img 
                  src={`https://flagcdn.com/w160/${selectedAirport.countryCode}.png`}
                  alt={`${t(`cities.countries.${selectedAirport.countryKey}`)} flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-white mb-1" data-testid="text-airport-city">
                  {t(`cities.cityNames.${selectedAirport.cityKey}`)}
                </h1>
                <p className="text-primary font-bold text-lg mb-1" data-testid="text-airport-code">
                  {selectedAirport.code}
                </p>
                <p className="text-sm text-muted-foreground">{t(`transportation.airportNames.${selectedAirport.airportNameKey}`)}</p>
              </div>
            </div>
          </div>

          {/* Airlines */}
          <div className="mb-6">
            <h2 className="text-lg font-display font-bold text-white mb-3">{t("transportation.internationalFlights.majorAirlines")}</h2>
            <div className="flex flex-wrap gap-2">
              {selectedAirport.airlines.map((airline, index) => {
                const url = getAirlineUrl(airline);
                if (url) {
                  return (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-card border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:bg-primary/20 hover:border-primary/30 hover:text-white transition-all flex items-center gap-1.5 group"
                      data-testid={`link-airline-${index}`}
                    >
                      {airline}
                      <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                    </a>
                  );
                }
                return (
                  <span 
                    key={index}
                    className="px-3 py-1.5 bg-card border border-white/10 rounded-full text-xs font-medium text-gray-300"
                  >
                    {airline}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Routes by Continent */}
          <div className="space-y-6">
            {selectedAirport.continentConnections.map((continent, cIndex) => (
              <div key={cIndex}>
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-display font-bold text-white">{t(`transportation.continents.${continent.continentKey}`)}</h2>
                </div>
                
                <div className="space-y-3">
                  {continent.routes.map((route, rIndex) => (
                    <div 
                      key={rIndex}
                      className="bg-card border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-colors"
                      data-testid={`card-route-${cIndex}-${rIndex}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Plane className="w-4 h-4 text-primary" />
                          <span className="font-bold text-white">{t(`transportation.routeOrigins.${route.fromKey}`)}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">{route.flightTime}</span>
                        </div>
                      </div>

                      <a
                        href={`https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${route.from} to ${selectedAirport.code}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
                        data-testid={`link-flight-search-${cIndex}-${rIndex}`}
                      >
                        Check live prices on Google Flights
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Note */}
          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("transportation.internationalFlights.pricingNote")}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-6 pt-4"><LivePricingBanner /></div>
        {/* Header */}
      <div className="pt-8 px-6 pb-6">
        <Link href="/transportation" className="flex items-center space-x-2 text-primary mb-4 hover:text-primary/80 transition-colors">
          <ArrowLeft className="w-4 h-4 rtl-flip" />
          <span className="text-sm font-medium">{t("transportation.backToTransportation")}</span>
        </Link>

        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Plane className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white" data-testid="text-page-title">
              {t("transportation.internationalFlights.title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("transportation.internationalFlights.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Airport List */}
      <div className="px-6 pb-24">
        <h2 className="text-lg font-display font-bold text-white mb-4">{t("transportation.internationalFlights.selectAirport")}</h2>
        
        <div className="space-y-3">
          {airports.map((airport, index) => (
            <button
              key={index}
              onClick={() => setSelectedAirport(airport)}
              className="w-full bg-card border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-all group text-left"
              data-testid={`button-airport-${index}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img 
                      src={`https://flagcdn.com/w80/${airport.countryCode}.png`}
                      alt={`${t(`cities.countries.${airport.countryKey}`)} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{t(`cities.cityNames.${airport.cityKey}`)}</h3>
                    <p className="text-sm text-primary font-mono">{airport.code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">{airport.continentConnections.length} {t("transportation.internationalFlights.regions")}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors rtl-flip" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
