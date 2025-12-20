import { Layout } from "@/components/Layout";
import { Plane, Clock, ArrowLeft, MapPin, Star, ChevronRight, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { getAirlineUrl } from "@/lib/airlines";
import { useTranslation } from "react-i18next";

interface DomesticRoute {
  to: string;
  toKey: string;
  toCode: string;
  flightTime: string;
  economy: string;
  business: string;
  firstClass: string;
}

interface CityHub {
  city: string;
  cityKey: string;
  country: string;
  countryKey: string;
  countryCode: string;
  airportName: string;
  airportNameKey: string;
  code: string;
  airlines: string[];
  routes: DomesticRoute[];
}

const cityHubs: CityHub[] = [
  {
    city: "New York / New Jersey",
    cityKey: "newYorkNewJersey",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    airportName: "John F. Kennedy International / Newark Liberty",
    airportNameKey: "jfkNewark",
    code: "JFK / EWR",
    airlines: ["Delta", "United", "American", "JetBlue", "Southwest", "Spirit"],
    routes: [
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "5h 30m", economy: "$150-380 USD", business: "$450-850 USD", firstClass: "$900-1,800 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "3h 15m", economy: "$120-280 USD", business: "$350-650 USD", firstClass: "$700-1,400 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "3h 45m", economy: "$130-300 USD", business: "$380-700 USD", firstClass: "$750-1,500 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "2h 30m", economy: "$100-240 USD", business: "$300-550 USD", firstClass: "$600-1,200 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "3h 50m", economy: "$130-310 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "5h 45m", economy: "$160-400 USD", business: "$470-900 USD", firstClass: "$950-1,900 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "5h 40m", economy: "$155-390 USD", business: "$460-880 USD", firstClass: "$920-1,850 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "1h 20m", economy: "$80-180 USD", business: "$220-420 USD", firstClass: "$450-900 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "1h 15m", economy: "$70-160 USD", business: "$200-380 USD", firstClass: "$400-800 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "3h 20m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "1h 40m", economy: "$150-320 USD", business: "$400-750 USD", firstClass: "$800-1,600 USD" },
      { to: "Vancouver", toKey: "vancouver", toCode: "YVR", flightTime: "5h 50m", economy: "$200-450 USD", business: "$550-1,000 USD", firstClass: "$1,100-2,200 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "4h 50m", economy: "$180-400 USD", business: "$500-950 USD", firstClass: "$1,000-2,000 USD" },
      { to: "Guadalajara", toKey: "guadalajara", toCode: "GDL", flightTime: "5h 00m", economy: "$200-420 USD", business: "$520-980 USD", firstClass: "$1,050-2,100 USD" },
      { to: "Monterrey", toKey: "monterrey", toCode: "MTY", flightTime: "4h 20m", economy: "$180-380 USD", business: "$480-900 USD", firstClass: "$960-1,900 USD" },
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
    airlines: ["Delta", "American", "United", "Southwest", "Alaska Airlines", "JetBlue"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "5h 30m", economy: "$150-380 USD", business: "$450-850 USD", firstClass: "$900-1,800 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "5h 00m", economy: "$140-350 USD", business: "$420-800 USD", firstClass: "$840-1,680 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "3h 10m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "4h 05m", economy: "$130-310 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "3h 25m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "2h 45m", economy: "$90-220 USD", business: "$270-500 USD", firstClass: "$540-1,080 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "1h 20m", economy: "$70-170 USD", business: "$200-380 USD", firstClass: "$400-800 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "5h 40m", economy: "$160-400 USD", business: "$470-900 USD", firstClass: "$950-1,900 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "5h 20m", economy: "$150-370 USD", business: "$440-840 USD", firstClass: "$880-1,760 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "3h 00m", economy: "$100-250 USD", business: "$300-570 USD", firstClass: "$600-1,200 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "4h 40m", economy: "$180-400 USD", business: "$500-950 USD", firstClass: "$1,000-2,000 USD" },
      { to: "Vancouver", toKey: "vancouver", toCode: "YVR", flightTime: "2h 50m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "3h 40m", economy: "$150-340 USD", business: "$420-800 USD", firstClass: "$840-1,680 USD" },
      { to: "Guadalajara", toKey: "guadalajara", toCode: "GDL", flightTime: "3h 00m", economy: "$130-300 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Monterrey", toKey: "monterrey", toCode: "MTY", flightTime: "3h 15m", economy: "$140-320 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
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
    airlines: ["American", "Delta", "United", "JetBlue", "Spirit", "Southwest"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "3h 15m", economy: "$120-280 USD", business: "$350-650 USD", firstClass: "$700-1,400 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "5h 00m", economy: "$140-350 USD", business: "$420-800 USD", firstClass: "$840-1,680 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "3h 00m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "1h 50m", economy: "$80-190 USD", business: "$240-450 USD", firstClass: "$480-960 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "2h 45m", economy: "$100-240 USD", business: "$300-560 USD", firstClass: "$600-1,200 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "6h 00m", economy: "$170-420 USD", business: "$500-960 USD", firstClass: "$1,000-2,000 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "5h 30m", economy: "$155-390 USD", business: "$460-880 USD", firstClass: "$920-1,840 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "3h 20m", economy: "$120-290 USD", business: "$360-680 USD", firstClass: "$720-1,440 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "2h 50m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "3h 30m", economy: "$130-310 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "3h 20m", economy: "$160-360 USD", business: "$450-860 USD", firstClass: "$900-1,800 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "3h 00m", economy: "$140-320 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
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
    airlines: ["American", "Southwest", "United", "Delta", "Spirit", "Frontier"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "3h 45m", economy: "$130-300 USD", business: "$380-700 USD", firstClass: "$750-1,500 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "3h 10m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "3h 00m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "2h 10m", economy: "$90-210 USD", business: "$270-500 USD", firstClass: "$540-1,080 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "1h 05m", economy: "$60-150 USD", business: "$180-340 USD", firstClass: "$360-720 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "4h 00m", economy: "$130-320 USD", business: "$390-740 USD", firstClass: "$780-1,560 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "3h 30m", economy: "$120-290 USD", business: "$360-680 USD", firstClass: "$720-1,440 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "3h 50m", economy: "$130-310 USD", business: "$390-740 USD", firstClass: "$780-1,560 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "3h 20m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "1h 40m", economy: "$70-170 USD", business: "$210-400 USD", firstClass: "$420-840 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "3h 10m", economy: "$150-340 USD", business: "$430-820 USD", firstClass: "$860-1,720 USD" },
      { to: "Vancouver", toKey: "vancouver", toCode: "YVR", flightTime: "4h 20m", economy: "$160-380 USD", business: "$470-900 USD", firstClass: "$940-1,880 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "2h 30m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Guadalajara", toKey: "guadalajara", toCode: "GDL", flightTime: "2h 30m", economy: "$130-300 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Monterrey", toKey: "monterrey", toCode: "MTY", flightTime: "1h 45m", economy: "$100-240 USD", business: "$300-560 USD", firstClass: "$600-1,200 USD" },
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
    airlines: ["Delta", "Southwest", "American", "United", "Spirit", "Frontier"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "2h 30m", economy: "$100-240 USD", business: "$300-550 USD", firstClass: "$600-1,200 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "4h 05m", economy: "$130-310 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "1h 50m", economy: "$80-190 USD", business: "$240-450 USD", firstClass: "$480-960 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "2h 10m", economy: "$90-210 USD", business: "$270-500 USD", firstClass: "$540-1,080 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "2h 00m", economy: "$85-200 USD", business: "$255-480 USD", firstClass: "$510-1,020 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "5h 00m", economy: "$150-370 USD", business: "$440-840 USD", firstClass: "$880-1,760 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "4h 40m", economy: "$140-340 USD", business: "$410-780 USD", firstClass: "$820-1,640 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "2h 40m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "2h 00m", economy: "$90-210 USD", business: "$270-500 USD", firstClass: "$540-1,080 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "2h 20m", economy: "$100-240 USD", business: "$300-560 USD", firstClass: "$600-1,200 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "2h 15m", economy: "$140-320 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "3h 30m", economy: "$160-360 USD", business: "$450-860 USD", firstClass: "$900-1,800 USD" },
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
    airlines: ["United", "Southwest", "American", "Delta", "Spirit", "Frontier"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "3h 50m", economy: "$130-310 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "3h 25m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "2h 45m", economy: "$100-240 USD", business: "$300-560 USD", firstClass: "$600-1,200 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "1h 05m", economy: "$60-150 USD", business: "$180-340 USD", firstClass: "$360-720 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "2h 00m", economy: "$85-200 USD", business: "$255-480 USD", firstClass: "$510-1,020 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "4h 20m", economy: "$140-340 USD", business: "$410-780 USD", firstClass: "$820-1,640 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "3h 50m", economy: "$130-310 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "4h 00m", economy: "$140-330 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "3h 30m", economy: "$125-300 USD", business: "$370-700 USD", firstClass: "$740-1,480 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "2h 10m", economy: "$90-220 USD", business: "$270-510 USD", firstClass: "$540-1,080 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "3h 30m", economy: "$160-370 USD", business: "$460-880 USD", firstClass: "$920-1,840 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "2h 15m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Guadalajara", toKey: "guadalajara", toCode: "GDL", flightTime: "2h 15m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Monterrey", toKey: "monterrey", toCode: "MTY", flightTime: "1h 30m", economy: "$90-210 USD", business: "$270-500 USD", firstClass: "$540-1,080 USD" },
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
    airlines: ["Alaska Airlines", "Delta", "United", "Southwest", "American", "JetBlue"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "5h 45m", economy: "$160-400 USD", business: "$470-900 USD", firstClass: "$950-1,900 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "2h 45m", economy: "$90-220 USD", business: "$270-500 USD", firstClass: "$540-1,080 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "6h 00m", economy: "$170-420 USD", business: "$500-960 USD", firstClass: "$1,000-2,000 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "4h 00m", economy: "$130-320 USD", business: "$390-740 USD", firstClass: "$780-1,560 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "5h 00m", economy: "$150-370 USD", business: "$440-840 USD", firstClass: "$880-1,760 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "4h 20m", economy: "$140-340 USD", business: "$410-780 USD", firstClass: "$820-1,640 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "2h 10m", economy: "$80-200 USD", business: "$240-450 USD", firstClass: "$480-960 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "5h 50m", economy: "$165-410 USD", business: "$480-920 USD", firstClass: "$960-1,920 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "5h 30m", economy: "$155-390 USD", business: "$460-880 USD", firstClass: "$920-1,840 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "3h 30m", economy: "$120-290 USD", business: "$360-680 USD", firstClass: "$720-1,440 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "4h 40m", economy: "$180-420 USD", business: "$520-1,000 USD", firstClass: "$1,040-2,080 USD" },
      { to: "Vancouver", toKey: "vancouver", toCode: "YVR", flightTime: "0h 50m", economy: "$60-150 USD", business: "$180-340 USD", firstClass: "$360-720 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "5h 00m", economy: "$180-420 USD", business: "$520-1,000 USD", firstClass: "$1,040-2,080 USD" },
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
    airlines: ["United", "Alaska Airlines", "Southwest", "Delta", "American", "JetBlue"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "5h 40m", economy: "$155-390 USD", business: "$460-880 USD", firstClass: "$920-1,850 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "1h 20m", economy: "$70-170 USD", business: "$200-380 USD", firstClass: "$400-800 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "5h 30m", economy: "$155-390 USD", business: "$460-880 USD", firstClass: "$920-1,840 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "3h 30m", economy: "$120-290 USD", business: "$360-680 USD", firstClass: "$720-1,440 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "4h 40m", economy: "$140-340 USD", business: "$410-780 USD", firstClass: "$820-1,640 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "3h 50m", economy: "$130-310 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "2h 10m", economy: "$80-200 USD", business: "$240-450 USD", firstClass: "$480-960 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "5h 50m", economy: "$160-400 USD", business: "$470-900 USD", firstClass: "$940-1,880 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "5h 30m", economy: "$150-380 USD", business: "$450-860 USD", firstClass: "$900-1,800 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "3h 15m", economy: "$110-270 USD", business: "$330-620 USD", firstClass: "$660-1,320 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "5h 00m", economy: "$190-440 USD", business: "$550-1,050 USD", firstClass: "$1,100-2,200 USD" },
      { to: "Vancouver", toKey: "vancouver", toCode: "YVR", flightTime: "2h 20m", economy: "$100-240 USD", business: "$300-560 USD", firstClass: "$600-1,200 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "4h 30m", economy: "$170-390 USD", business: "$490-940 USD", firstClass: "$980-1,960 USD" },
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
    airlines: ["JetBlue", "Delta", "American", "United", "Southwest", "Spirit"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "1h 20m", economy: "$80-180 USD", business: "$220-420 USD", firstClass: "$450-900 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "5h 40m", economy: "$160-400 USD", business: "$470-900 USD", firstClass: "$950-1,900 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "3h 20m", economy: "$120-290 USD", business: "$360-680 USD", firstClass: "$720-1,440 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "3h 50m", economy: "$130-310 USD", business: "$390-740 USD", firstClass: "$780-1,560 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "2h 40m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "4h 00m", economy: "$140-330 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "5h 50m", economy: "$165-410 USD", business: "$480-920 USD", firstClass: "$960-1,920 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "5h 50m", economy: "$160-400 USD", business: "$470-900 USD", firstClass: "$940-1,880 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "1h 30m", economy: "$80-190 USD", business: "$240-450 USD", firstClass: "$480-960 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "3h 40m", economy: "$125-300 USD", business: "$370-700 USD", firstClass: "$740-1,480 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "1h 45m", economy: "$140-320 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
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
    airlines: ["American", "Southwest", "Frontier", "Spirit", "Delta", "United"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "1h 15m", economy: "$70-160 USD", business: "$200-380 USD", firstClass: "$400-800 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "5h 20m", economy: "$150-370 USD", business: "$440-840 USD", firstClass: "$880-1,760 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "2h 50m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "3h 20m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "2h 00m", economy: "$90-210 USD", business: "$270-500 USD", firstClass: "$540-1,080 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "3h 30m", economy: "$125-300 USD", business: "$370-700 USD", firstClass: "$740-1,480 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "5h 30m", economy: "$155-390 USD", business: "$460-880 USD", firstClass: "$920-1,840 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "5h 30m", economy: "$150-380 USD", business: "$450-860 USD", firstClass: "$900-1,800 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "1h 30m", economy: "$80-190 USD", business: "$240-450 USD", firstClass: "$480-960 USD" },
      { to: "Kansas City", toKey: "kansasCity", toCode: "MCI", flightTime: "3h 00m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "1h 40m", economy: "$130-300 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
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
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "3h 20m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "3h 00m", economy: "$100-250 USD", business: "$300-570 USD", firstClass: "$600-1,200 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "3h 30m", economy: "$130-310 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "1h 40m", economy: "$70-170 USD", business: "$210-400 USD", firstClass: "$420-840 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "2h 20m", economy: "$100-240 USD", business: "$300-560 USD", firstClass: "$600-1,200 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "2h 10m", economy: "$90-220 USD", business: "$270-510 USD", firstClass: "$540-1,080 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "3h 30m", economy: "$120-290 USD", business: "$360-680 USD", firstClass: "$720-1,440 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "3h 15m", economy: "$110-270 USD", business: "$330-620 USD", firstClass: "$660-1,320 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "3h 40m", economy: "$125-300 USD", business: "$370-700 USD", firstClass: "$740-1,480 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "3h 00m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Denver", toKey: "denver", toCode: "DEN", flightTime: "1h 40m", economy: "$70-170 USD", business: "$210-400 USD", firstClass: "$420-840 USD" },
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
    airlines: ["Air Canada", "WestJet", "United", "American", "Delta", "Porter Airlines"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "1h 40m", economy: "$150-320 USD", business: "$400-750 USD", firstClass: "$800-1,600 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "4h 40m", economy: "$180-400 USD", business: "$500-950 USD", firstClass: "$1,000-2,000 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "3h 20m", economy: "$160-360 USD", business: "$450-860 USD", firstClass: "$900-1,800 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "3h 10m", economy: "$150-340 USD", business: "$430-820 USD", firstClass: "$860-1,720 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "2h 15m", economy: "$140-320 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "3h 30m", economy: "$160-370 USD", business: "$460-880 USD", firstClass: "$920-1,840 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "4h 40m", economy: "$180-420 USD", business: "$520-1,000 USD", firstClass: "$1,040-2,080 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "5h 00m", economy: "$190-440 USD", business: "$550-1,050 USD", firstClass: "$1,100-2,200 USD" },
      { to: "Boston", toKey: "boston", toCode: "BOS", flightTime: "1h 45m", economy: "$140-320 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
      { to: "Philadelphia", toKey: "philadelphia", toCode: "PHL", flightTime: "1h 40m", economy: "$130-300 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Vancouver", toKey: "vancouver", toCode: "YVR", flightTime: "4h 45m", economy: "$170-380 USD", business: "$480-920 USD", firstClass: "$960-1,920 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "4h 30m", economy: "$200-450 USD", business: "$560-1,080 USD", firstClass: "$1,120-2,240 USD" },
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
    airlines: ["Air Canada", "WestJet", "United", "Alaska Airlines", "American", "Delta"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "5h 50m", economy: "$200-450 USD", business: "$550-1,000 USD", firstClass: "$1,100-2,200 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "2h 50m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "4h 20m", economy: "$160-380 USD", business: "$470-900 USD", firstClass: "$940-1,880 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "0h 50m", economy: "$60-150 USD", business: "$180-340 USD", firstClass: "$360-720 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "2h 20m", economy: "$100-240 USD", business: "$300-560 USD", firstClass: "$600-1,200 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "4h 45m", economy: "$170-380 USD", business: "$480-920 USD", firstClass: "$960-1,920 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "5h 30m", economy: "$220-490 USD", business: "$600-1,150 USD", firstClass: "$1,200-2,400 USD" },
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
    airlines: ["Aeroméxico", "Volaris", "VivaAerobus", "United", "American", "Delta"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "4h 50m", economy: "$180-400 USD", business: "$500-950 USD", firstClass: "$1,000-2,000 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "3h 40m", economy: "$150-340 USD", business: "$420-800 USD", firstClass: "$840-1,680 USD" },
      { to: "Miami", toKey: "miami", toCode: "MIA", flightTime: "3h 00m", economy: "$140-320 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "2h 30m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Atlanta", toKey: "atlanta", toCode: "ATL", flightTime: "3h 30m", economy: "$160-360 USD", business: "$450-860 USD", firstClass: "$900-1,800 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "2h 15m", economy: "$110-260 USD", business: "$320-600 USD", firstClass: "$640-1,280 USD" },
      { to: "Seattle", toKey: "seattle", toCode: "SEA", flightTime: "5h 00m", economy: "$180-420 USD", business: "$520-1,000 USD", firstClass: "$1,040-2,080 USD" },
      { to: "San Francisco", toKey: "sanFrancisco", toCode: "SFO", flightTime: "4h 30m", economy: "$170-390 USD", business: "$490-940 USD", firstClass: "$980-1,960 USD" },
      { to: "Toronto", toKey: "toronto", toCode: "YYZ", flightTime: "4h 30m", economy: "$200-450 USD", business: "$560-1,080 USD", firstClass: "$1,120-2,240 USD" },
      { to: "Vancouver", toKey: "vancouver", toCode: "YVR", flightTime: "5h 30m", economy: "$220-490 USD", business: "$600-1,150 USD", firstClass: "$1,200-2,400 USD" },
      { to: "Guadalajara", toKey: "guadalajara", toCode: "GDL", flightTime: "1h 10m", economy: "$50-120 USD", business: "$150-280 USD", firstClass: "$300-600 USD" },
      { to: "Monterrey", toKey: "monterrey", toCode: "MTY", flightTime: "1h 30m", economy: "$60-140 USD", business: "$180-340 USD", firstClass: "$360-700 USD" },
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
    airlines: ["Aeroméxico", "Volaris", "VivaAerobus", "United", "American", "Alaska Airlines"],
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "5h 00m", economy: "$200-420 USD", business: "$520-980 USD", firstClass: "$1,050-2,100 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "3h 00m", economy: "$130-300 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "2h 30m", economy: "$130-300 USD", business: "$380-720 USD", firstClass: "$760-1,520 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "2h 15m", economy: "$120-280 USD", business: "$350-660 USD", firstClass: "$700-1,400 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "1h 10m", economy: "$50-120 USD", business: "$150-280 USD", firstClass: "$300-600 USD" },
      { to: "Monterrey", toKey: "monterrey", toCode: "MTY", flightTime: "1h 20m", economy: "$55-130 USD", business: "$165-310 USD", firstClass: "$330-660 USD" },
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
    routes: [
      { to: "New York", toKey: "newYorkNewJersey", toCode: "JFK", flightTime: "4h 20m", economy: "$180-380 USD", business: "$480-900 USD", firstClass: "$960-1,900 USD" },
      { to: "Los Angeles", toKey: "losAngeles", toCode: "LAX", flightTime: "3h 15m", economy: "$140-320 USD", business: "$400-760 USD", firstClass: "$800-1,600 USD" },
      { to: "Dallas", toKey: "dallas", toCode: "DFW", flightTime: "1h 45m", economy: "$100-240 USD", business: "$300-560 USD", firstClass: "$600-1,200 USD" },
      { to: "Houston", toKey: "houston", toCode: "IAH", flightTime: "1h 30m", economy: "$90-210 USD", business: "$270-500 USD", firstClass: "$540-1,080 USD" },
      { to: "Mexico City", toKey: "mexicoCity", toCode: "MEX", flightTime: "1h 30m", economy: "$60-140 USD", business: "$180-340 USD", firstClass: "$360-700 USD" },
      { to: "Guadalajara", toKey: "guadalajara", toCode: "GDL", flightTime: "1h 20m", economy: "$55-130 USD", business: "$165-310 USD", firstClass: "$330-660 USD" },
    ]
  },
];

export default function DomesticFlights() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState<CityHub | null>(null);

  if (selectedCity) {
    return (
      <Layout>
        <div className="pt-6 px-6 pb-24">
          <button 
            onClick={() => setSelectedCity(null)}
            className="flex items-center space-x-2 text-primary mb-6 hover:text-primary/80 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 rtl-flip" />
            <span className="text-sm font-medium">{t("transportation.domesticFlights.backToCities")}</span>
          </button>

          <div className="bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 rounded-2xl p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0">
                <img 
                  src={`https://flagcdn.com/w160/${selectedCity.countryCode}.png`}
                  alt={`${t(`cities.countries.${selectedCity.countryKey}`)} flag`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-display font-bold text-white mb-1" data-testid="text-city-name">
                  {t(`cities.cityNames.${selectedCity.cityKey}`)}
                </h1>
                <p className="text-primary font-bold text-lg mb-1" data-testid="text-city-code">
                  {selectedCity.code}
                </p>
                <p className="text-sm text-muted-foreground">{t(`transportation.airportNames.${selectedCity.airportNameKey}`)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-display font-bold text-white mb-3">{t("transportation.domesticFlights.majorAirlines")}</h2>
            <div className="flex flex-wrap gap-2">
              {selectedCity.airlines.map((airline, index) => {
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

          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-display font-bold text-white">{t("transportation.domesticFlights.connections")}</h2>
            </div>
            
            <div className="space-y-3">
              {selectedCity.routes.map((route, index) => (
                <div 
                  key={index}
                  className="bg-card border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-colors"
                  data-testid={`card-route-${index}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Plane className="w-4 h-4 text-primary" />
                      <span className="font-bold text-white">{t(`cities.cityNames.${route.toKey}`)}</span>
                      <span className="text-xs text-muted-foreground font-mono">({route.toCode})</span>
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
              {t("transportation.domesticFlights.title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("transportation.domesticFlights.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24">
        <h2 className="text-lg font-display font-bold text-white mb-4">{t("transportation.domesticFlights.selectCity")}</h2>
        
        <div className="space-y-3">
          {cityHubs.map((city, index) => (
            <button
              key={index}
              onClick={() => setSelectedCity(city)}
              className="w-full bg-card border border-white/5 rounded-xl p-4 hover:border-primary/30 transition-all group text-left"
              data-testid={`button-city-${index}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                    <img 
                      src={`https://flagcdn.com/w80/${city.countryCode}.png`}
                      alt={`${t(`cities.countries.${city.countryKey}`)} flag`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{t(`cities.cityNames.${city.cityKey}`)}</h3>
                    <p className="text-sm text-primary font-mono">{city.code}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">{city.routes.length} {t("transportation.domesticFlights.routes")}</span>
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
