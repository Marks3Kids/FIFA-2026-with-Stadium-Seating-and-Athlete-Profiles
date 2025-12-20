import { Layout } from "@/components/Layout";
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
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "7h 30m", economy: "$450-850 USD", business: "$3,500-6,000 USD", firstClass: "$8,000-15,000 USD" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "7h 45m", economy: "$500-900 USD", business: "$3,800-6,500 USD", firstClass: "$9,000-16,000 USD" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "8h 15m", economy: "$480-870 USD", business: "$3,600-6,200 USD", firstClass: "$8,500-14,500 USD" },
        ]
      },
      {
        continent: "South America",
        continentKey: "southAmerica",
        routes: [
          { from: "São Paulo (GRU)", fromKey: "saoPauloGRU", flightTime: "9h 45m", economy: "$600-1,100 USD", business: "$3,200-5,500 USD", firstClass: "$7,500-12,000 USD" },
          { from: "Buenos Aires (EZE)", fromKey: "buenosAiresEZE", flightTime: "10h 30m", economy: "$650-1,200 USD", business: "$3,400-5,800 USD", firstClass: "$8,000-13,000 USD" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Dubai (DXB)", fromKey: "dubaiDXB", flightTime: "13h 30m", economy: "$700-1,300 USD", business: "$4,500-8,000 USD", firstClass: "$12,000-22,000 USD" },
          { from: "Doha (DOH)", fromKey: "dohaDOH", flightTime: "13h 00m", economy: "$680-1,250 USD", business: "$4,200-7,500 USD", firstClass: "$11,000-20,000 USD" },
        ]
      },
      {
        continent: "Asia",
        continentKey: "asia",
        routes: [
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "14h 00m", economy: "$800-1,400 USD", business: "$5,000-9,000 USD", firstClass: "$14,000-25,000 USD" },
          { from: "Seoul (ICN)", fromKey: "seoulICN", flightTime: "14h 30m", economy: "$750-1,350 USD", business: "$4,800-8,500 USD", firstClass: "$13,000-23,000 USD" },
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
          { from: "Sydney (SYD)", fromKey: "sydneySYD", flightTime: "15h 00m", economy: "$900-1,600 USD", business: "$5,500-9,500 USD", firstClass: "$15,000-28,000 USD" },
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "11h 30m", economy: "$700-1,200 USD", business: "$4,500-8,000 USD", firstClass: "$12,000-22,000 USD" },
          { from: "Singapore (SIN)", fromKey: "singaporeSIN", flightTime: "17h 30m", economy: "$850-1,500 USD", business: "$5,200-9,000 USD", firstClass: "$14,000-26,000 USD" },
        ]
      },
      {
        continent: "Oceania",
        continentKey: "oceania",
        routes: [
          { from: "Auckland (AKL)", fromKey: "aucklandAKL", flightTime: "12h 45m", economy: "$800-1,400 USD", business: "$4,800-8,500 USD", firstClass: "$13,000-24,000 USD" },
          { from: "Melbourne (MEL)", fromKey: "melbourneMEL", flightTime: "15h 30m", economy: "$880-1,550 USD", business: "$5,400-9,200 USD", firstClass: "$14,500-27,000 USD" },
        ]
      },
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "10h 30m", economy: "$500-950 USD", business: "$4,000-7,000 USD", firstClass: "$10,000-18,000 USD" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "11h 00m", economy: "$550-1,000 USD", business: "$4,200-7,200 USD", firstClass: "$10,500-19,000 USD" },
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
          { from: "São Paulo (GRU)", fromKey: "saoPauloGRU", flightTime: "8h 15m", economy: "$500-900 USD", business: "$2,800-4,800 USD", firstClass: "$6,500-11,000 USD" },
          { from: "Buenos Aires (EZE)", fromKey: "buenosAiresEZE", flightTime: "9h 00m", economy: "$550-950 USD", business: "$3,000-5,200 USD", firstClass: "$7,000-12,000 USD" },
          { from: "Bogotá (BOG)", fromKey: "bogotaBOG", flightTime: "3h 30m", economy: "$300-550 USD", business: "$1,800-3,200 USD", firstClass: "$4,500-7,500 USD" },
        ]
      },
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "Madrid (MAD)", fromKey: "madridMAD", flightTime: "8h 45m", economy: "$480-880 USD", business: "$3,500-6,000 USD", firstClass: "$8,500-15,000 USD" },
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "9h 00m", economy: "$500-900 USD", business: "$3,700-6,300 USD", firstClass: "$9,000-16,000 USD" },
        ]
      },
      {
        continent: "Caribbean",
        continentKey: "caribbean",
        routes: [
          { from: "San Juan (SJU)", fromKey: "sanJuanSJU", flightTime: "2h 30m", economy: "$150-350 USD", business: "$800-1,500 USD", firstClass: "$2,000-3,500 USD" },
          { from: "Havana (HAV)", fromKey: "havanaHAV", flightTime: "1h 15m", economy: "$200-400 USD", business: "$900-1,600 USD", firstClass: "$2,200-4,000 USD" },
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
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "9h 30m", economy: "$500-920 USD", business: "$3,800-6,500 USD", firstClass: "$9,500-17,000 USD" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "10h 15m", economy: "$520-950 USD", business: "$4,000-6,800 USD", firstClass: "$10,000-18,000 USD" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Doha (DOH)", fromKey: "dohaDOH", flightTime: "15h 00m", economy: "$750-1,300 USD", business: "$5,500-9,500 USD", firstClass: "$14,000-25,000 USD" },
          { from: "Dubai (DXB)", fromKey: "dubaiDXB", flightTime: "15h 30m", economy: "$780-1,350 USD", business: "$5,800-9,800 USD", firstClass: "$15,000-27,000 USD" },
        ]
      },
      {
        continent: "Asia",
        continentKey: "asia",
        routes: [
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "13h 00m", economy: "$750-1,300 USD", business: "$4,800-8,500 USD", firstClass: "$13,000-24,000 USD" },
          { from: "Seoul (ICN)", fromKey: "seoulICN", flightTime: "13h 30m", economy: "$720-1,250 USD", business: "$4,600-8,200 USD", firstClass: "$12,500-23,000 USD" },
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
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "9h 00m", economy: "$520-950 USD", business: "$3,900-6,700 USD", firstClass: "$9,800-17,500 USD" },
          { from: "Amsterdam (AMS)", fromKey: "amsterdamAMS", flightTime: "9h 15m", economy: "$500-920 USD", business: "$3,800-6,500 USD", firstClass: "$9,500-17,000 USD" },
        ]
      },
      {
        continent: "Africa",
        continentKey: "africa",
        routes: [
          { from: "Johannesburg (JNB)", fromKey: "johannesburgJNB", flightTime: "16h 30m", economy: "$900-1,600 USD", business: "$5,500-9,500 USD", firstClass: "$15,000-28,000 USD" },
          { from: "Lagos (LOS)", fromKey: "lagosLOS", flightTime: "11h 00m", economy: "$800-1,400 USD", business: "$4,500-8,000 USD", firstClass: "$12,000-22,000 USD" },
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
          { from: "Madrid (MAD)", fromKey: "madridMAD", flightTime: "10h 30m", economy: "$550-1,000 USD", business: "$3,500-6,000 USD", firstClass: "$8,500-15,000 USD" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "11h 15m", economy: "$600-1,100 USD", business: "$3,800-6,500 USD", firstClass: "$9,500-17,000 USD" },
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "10h 45m", economy: "$580-1,050 USD", business: "$3,700-6,300 USD", firstClass: "$9,000-16,500 USD" },
        ]
      },
      {
        continent: "South America",
        continentKey: "southAmerica",
        routes: [
          { from: "São Paulo (GRU)", fromKey: "saoPauloGRU", flightTime: "9h 30m", economy: "$500-900 USD", business: "$2,800-4,800 USD", firstClass: "$6,500-11,000 USD" },
          { from: "Buenos Aires (EZE)", fromKey: "buenosAiresEZE", flightTime: "10h 00m", economy: "$550-950 USD", business: "$3,000-5,000 USD", firstClass: "$7,000-12,000 USD" },
          { from: "Lima (LIM)", fromKey: "limaLIM", flightTime: "5h 30m", economy: "$350-650 USD", business: "$2,000-3,500 USD", firstClass: "$5,000-8,500 USD" },
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
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "7h 15m", economy: "$500-920 USD", business: "$3,600-6,200 USD", firstClass: "$8,800-16,000 USD" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "7h 30m", economy: "$520-950 USD", business: "$3,800-6,500 USD", firstClass: "$9,200-17,000 USD" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "8h 00m", economy: "$480-890 USD", business: "$3,500-6,000 USD", firstClass: "$8,500-15,500 USD" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Dubai (DXB)", fromKey: "dubaiDXB", flightTime: "13h 00m", economy: "$700-1,250 USD", business: "$4,500-7,800 USD", firstClass: "$12,000-21,000 USD" },
          { from: "Istanbul (IST)", fromKey: "istanbulIST", flightTime: "10h 00m", economy: "$600-1,100 USD", business: "$3,800-6,500 USD", firstClass: "$9,500-17,000 USD" },
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
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "9h 30m", economy: "$650-1,150 USD", business: "$4,200-7,500 USD", firstClass: "$11,000-20,000 USD" },
          { from: "Hong Kong (HKG)", fromKey: "hongKongHKG", flightTime: "12h 00m", economy: "$700-1,250 USD", business: "$4,500-8,000 USD", firstClass: "$12,000-22,000 USD" },
          { from: "Seoul (ICN)", fromKey: "seoulICN", flightTime: "10h 30m", economy: "$680-1,200 USD", business: "$4,300-7,700 USD", firstClass: "$11,500-21,000 USD" },
        ]
      },
      {
        continent: "Oceania",
        continentKey: "oceania",
        routes: [
          { from: "Sydney (SYD)", fromKey: "sydneySYD", flightTime: "15h 30m", economy: "$850-1,500 USD", business: "$5,200-9,000 USD", firstClass: "$14,000-26,000 USD" },
          { from: "Auckland (AKL)", fromKey: "aucklandAKL", flightTime: "13h 15m", economy: "$780-1,380 USD", business: "$4,800-8,400 USD", firstClass: "$13,000-24,000 USD" },
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
          { from: "Los Angeles (LAX)", fromKey: "losAngelesLAX", flightTime: "3h 00m", economy: "$200-400 USD", business: "$800-1,500 USD", firstClass: "$2,000-3,800 USD" },
          { from: "Dallas (DFW)", fromKey: "dallasDFW", flightTime: "2h 30m", economy: "$180-350 USD", business: "$750-1,400 USD", firstClass: "$1,800-3,500 USD" },
          { from: "Houston (IAH)", fromKey: "houstonIAH", flightTime: "2h 15m", economy: "$170-330 USD", business: "$700-1,300 USD", firstClass: "$1,700-3,200 USD" },
        ]
      },
      {
        continent: "Central America",
        continentKey: "centralAmerica",
        routes: [
          { from: "San José (SJO)", fromKey: "sanJoseSJO", flightTime: "3h 30m", economy: "$250-450 USD", business: "$1,000-1,800 USD", firstClass: "$2,500-4,500 USD" },
          { from: "Panama City (PTY)", fromKey: "panamaCityPTY", flightTime: "4h 30m", economy: "$300-550 USD", business: "$1,200-2,200 USD", firstClass: "$3,000-5,500 USD" },
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
          { from: "Houston (IAH)", fromKey: "houstonIAH", flightTime: "1h 30m", economy: "$150-300 USD", business: "$600-1,100 USD", firstClass: "$1,500-2,800 USD" },
          { from: "Dallas (DFW)", fromKey: "dallasDFW", flightTime: "1h 45m", economy: "$160-320 USD", business: "$650-1,200 USD", firstClass: "$1,600-3,000 USD" },
          { from: "Chicago (ORD)", fromKey: "chicagoORD", flightTime: "3h 00m", economy: "$220-420 USD", business: "$850-1,600 USD", firstClass: "$2,100-4,000 USD" },
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
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "9h 45m", economy: "$520-960 USD", business: "$3,900-6,700 USD", firstClass: "$9,800-17,500 USD" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "10h 30m", economy: "$540-1,000 USD", business: "$4,100-7,000 USD", firstClass: "$10,200-18,500 USD" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Doha (DOH)", fromKey: "dohaDOH", flightTime: "15h 30m", economy: "$780-1,350 USD", business: "$5,700-9,700 USD", firstClass: "$14,500-26,000 USD" },
          { from: "Dubai (DXB)", fromKey: "dubaiDXB", flightTime: "16h 00m", economy: "$800-1,400 USD", business: "$5,900-10,000 USD", firstClass: "$15,000-27,000 USD" },
        ]
      },
      {
        continent: "South America",
        continentKey: "southAmerica",
        routes: [
          { from: "São Paulo (GRU)", fromKey: "saoPauloGRU", flightTime: "10h 00m", economy: "$580-1,050 USD", business: "$3,200-5,500 USD", firstClass: "$7,800-13,500 USD" },
          { from: "Bogotá (BOG)", fromKey: "bogotaBOG", flightTime: "4h 30m", economy: "$320-600 USD", business: "$1,800-3,200 USD", firstClass: "$4,500-8,000 USD" },
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
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "10h 00m", economy: "$700-1,200 USD", business: "$4,500-8,000 USD", firstClass: "$12,000-22,000 USD" },
          { from: "Seoul (ICN)", fromKey: "seoulICN", flightTime: "10h 30m", economy: "$680-1,180 USD", business: "$4,400-7,800 USD", firstClass: "$11,500-21,000 USD" },
        ]
      },
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "9h 30m", economy: "$520-950 USD", business: "$3,900-6,700 USD", firstClass: "$9,800-17,500 USD" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "10h 00m", economy: "$550-1,000 USD", business: "$4,100-7,000 USD", firstClass: "$10,200-18,500 USD" },
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
          { from: "Singapore (SIN)", fromKey: "singaporeSIN", flightTime: "16h 30m", economy: "$850-1,500 USD", business: "$5,200-9,000 USD", firstClass: "$14,000-26,000 USD" },
          { from: "Hong Kong (HKG)", fromKey: "hongKongHKG", flightTime: "13h 30m", economy: "$750-1,300 USD", business: "$4,700-8,300 USD", firstClass: "$12,500-23,000 USD" },
          { from: "Tokyo (NRT)", fromKey: "tokyoNRT", flightTime: "11h 00m", economy: "$700-1,200 USD", business: "$4,500-8,000 USD", firstClass: "$12,000-22,000 USD" },
        ]
      },
      {
        continent: "Europe",
        continentKey: "europe",
        routes: [
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "10h 30m", economy: "$520-950 USD", business: "$4,000-7,000 USD", firstClass: "$10,000-18,000 USD" },
          { from: "Frankfurt (FRA)", fromKey: "frankfurtFRA", flightTime: "11h 15m", economy: "$540-1,000 USD", business: "$4,200-7,300 USD", firstClass: "$10,500-19,000 USD" },
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
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "6h 45m", economy: "$450-850 USD", business: "$3,400-5,900 USD", firstClass: "$8,500-15,000 USD" },
          { from: "Dublin (DUB)", fromKey: "dublinDUB", flightTime: "6h 00m", economy: "$400-780 USD", business: "$3,000-5,200 USD", firstClass: "$7,500-13,500 USD" },
          { from: "Reykjavik (KEF)", fromKey: "reykjavikKEF", flightTime: "5h 00m", economy: "$350-680 USD", business: "$2,500-4,500 USD", firstClass: "$6,000-11,000 USD" },
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
          { from: "London (LHR)", fromKey: "londonLHR", flightTime: "7h 15m", economy: "$460-870 USD", business: "$3,500-6,000 USD", firstClass: "$8,700-15,500 USD" },
          { from: "Paris (CDG)", fromKey: "parisCDG", flightTime: "7h 45m", economy: "$500-920 USD", business: "$3,800-6,500 USD", firstClass: "$9,200-16,500 USD" },
        ]
      },
      {
        continent: "Middle East",
        continentKey: "middleEast",
        routes: [
          { from: "Doha (DOH)", fromKey: "dohaDOH", flightTime: "12h 30m", economy: "$700-1,250 USD", business: "$4,500-7,800 USD", firstClass: "$11,500-20,500 USD" },
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
          { from: "Chicago (ORD)", fromKey: "chicagoORD", flightTime: "1h 30m", economy: "$120-280 USD", business: "$500-950 USD", firstClass: "$1,200-2,200 USD" },
          { from: "Dallas (DFW)", fromKey: "dallasDFW", flightTime: "1h 45m", economy: "$140-300 USD", business: "$550-1,000 USD", firstClass: "$1,300-2,400 USD" },
          { from: "Denver (DEN)", fromKey: "denverDEN", flightTime: "1h 40m", economy: "$130-290 USD", business: "$520-980 USD", firstClass: "$1,250-2,300 USD" },
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

                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-background/50 rounded-lg p-3 text-center">
                          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("transportation.internationalFlights.economy")}</span>
                          <span className="block text-sm font-bold text-white">{route.economy}</span>
                        </div>
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                          <span className="block text-[10px] uppercase tracking-wider text-primary mb-1">{t("transportation.internationalFlights.business")}</span>
                          <span className="block text-sm font-bold text-primary">{route.business}</span>
                        </div>
                        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            <Star className="w-2.5 h-2.5 text-accent" />
                            <span className="text-[10px] uppercase tracking-wider text-accent">{t("transportation.internationalFlights.firstClass")}</span>
                          </div>
                          <span className="block text-sm font-bold text-accent">{route.firstClass}</span>
                        </div>
                      </div>
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
