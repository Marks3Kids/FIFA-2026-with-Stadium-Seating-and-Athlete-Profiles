import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { 
  AlertTriangle, Shield, Phone, DollarSign, Scale, Sun, 
  ChevronDown, ChevronUp, Heart, Gavel, Coffee, Plane, 
  ShieldCheck, Ban, Tv, Car, ExternalLink, Stamp, Anchor, Ship,
  MapPin, Thermometer, TicketX, AlertCircle, CheckCircle, XCircle, Lightbulb, ArrowLeft, Building2, Church, Cross, Moon, Star
} from "lucide-react";
import { getFlagUrlByCode, getFlagUrl } from "@/lib/flags";
import { useTranslation } from "react-i18next";
import { religiousServices } from "@/data/religiousServices";
import { CurrencyConverter } from "@/components/CurrencyConverter";

type InfoCategory = "safety" | "emergency" | "financial" | "legal" | "daily" | "religious";
type TravelCategory = "travel-entry" | "travel-safety" | "prohibited" | "tvguide" | "transport";

interface SafetyCard {
  id: string;
  title: string;
  description: string;
  preventionTips: string;
}

interface InfoCard {
  id: string;
  title: string;
  description: string;
}

interface InfoSection {
  id: string;
  title: string;
  icon: any;
  iconColor: string;
  items: InfoCard[];
}

const safetyData: SafetyCard[] = [
  {
    id: "unsafe-neighborhoods",
    title: "Unsafe Neighborhoods Near Stadium",
    description: "Stadium flanked by areas that vary in safety block-by-block.",
    preventionTips: "Stick to pedestrian crowds. Use designated ride-share lots. If crowd thins out, turn back."
  },
  {
    id: "follow-home-robberies",
    title: "Follow-Home Robberies (Luxury Items)",
    description: "Thieves target people wearing expensive jewelry/watches leaving venues.",
    preventionTips: "Dress down when leaving stadium. Tuck chains inside shirt, avoid flashing luxury watches."
  },
  {
    id: "pickpocketing",
    title: "Pickpocketing at Transit Hubs",
    description: "High-density choke points like entry gates, escalators, and crowded transit platforms.",
    preventionTips: "Keep valuables in front pockets or bags worn across body. Stay alert in crowded spaces."
  },
  {
    id: "ticket-scams",
    title: "Ticket and Merchandise Scams",
    description: "Fake tickets and counterfeit jerseys sold outside stadiums.",
    preventionTips: "Only buy from official apps (Ticketmaster, FIFA). Never buy from individuals on the street."
  },
  {
    id: "car-break-ins",
    title: "Car Break-Ins & Parking Lot Safety",
    description: "Thieves smash car windows to grab bags in seconds, often in broad daylight.",
    preventionTips: "Never leave anything visible in rental cars. Leave back seats folded down so thieves can see trunk is empty."
  },
  {
    id: "heat-warning",
    title: "Heat Warning",
    description: "Extreme heat and humidity in June/July. Heat exhaustion is a real risk.",
    preventionTips: "Drink water constantly, wear sunscreen, take breaks in shade, know heat stroke signs."
  }
];

interface MedicalFacility {
  id: string;
  name: string;
  type: "er" | "urgent";
  address: string;
  phone: string;
  distance: string;
  drivingTime: string;
  lat: number;
  lng: number;
  hours: string;
}

interface CityMedicalData {
  id: string;
  city: string;
  country: string;
  flag: string;
  stadium: string;
  stadiumLat: number;
  stadiumLng: number;
  facilities: MedicalFacility[];
}

const medicalFacilitiesData: CityMedicalData[] = [
  {
    id: "new-york",
    city: "New York/New Jersey",
    country: "USA",
    flag: "us",
    stadium: "MetLife Stadium",
    stadiumLat: 40.8135,
    stadiumLng: -74.0745,
    facilities: [
      { id: "ny-er-1", name: "Hackensack University Medical Center", type: "er", address: "30 Prospect Ave, Hackensack, NJ", phone: "+1 551-996-2000", distance: "5.2 mi", drivingTime: "12 min", lat: 40.8859, lng: -74.0435, hours: "24/7" },
      { id: "ny-er-2", name: "Holy Name Medical Center", type: "er", address: "718 Teaneck Rd, Teaneck, NJ", phone: "+1 201-833-3000", distance: "4.8 mi", drivingTime: "10 min", lat: 40.8885, lng: -74.0159, hours: "24/7" },
      { id: "ny-uc-1", name: "CityMD Secaucus", type: "urgent", address: "700 Plaza Dr, Secaucus, NJ", phone: "+1 201-210-8700", distance: "2.1 mi", drivingTime: "5 min", lat: 40.7891, lng: -74.0567, hours: "8am-10pm" },
      { id: "ny-uc-2", name: "AFC Urgent Care Lyndhurst", type: "urgent", address: "453 Valley Brook Ave, Lyndhurst, NJ", phone: "+1 201-345-3839", distance: "3.5 mi", drivingTime: "8 min", lat: 40.8120, lng: -74.1236, hours: "8am-8pm" }
    ]
  },
  {
    id: "los-angeles",
    city: "Los Angeles",
    country: "USA",
    flag: "us",
    stadium: "SoFi Stadium",
    stadiumLat: 33.9535,
    stadiumLng: -118.3392,
    facilities: [
      { id: "la-er-1", name: "Centinela Hospital Medical Center", type: "er", address: "555 E Hardy St, Inglewood, CA", phone: "+1 310-673-4660", distance: "1.8 mi", drivingTime: "5 min", lat: 33.9617, lng: -118.3530, hours: "24/7" },
      { id: "la-er-2", name: "UCLA Medical Center", type: "er", address: "757 Westwood Plaza, Los Angeles, CA", phone: "+1 310-825-9111", distance: "8.5 mi", drivingTime: "20 min", lat: 34.0663, lng: -118.4469, hours: "24/7" },
      { id: "la-uc-1", name: "CityMD Inglewood", type: "urgent", address: "3330 W Manchester Blvd, Inglewood, CA", phone: "+1 424-261-9191", distance: "1.2 mi", drivingTime: "4 min", lat: 33.9598, lng: -118.3480, hours: "8am-10pm" },
      { id: "la-uc-2", name: "ExperCARE Urgent Care", type: "urgent", address: "5100 W Goldleaf Cir, Los Angeles, CA", phone: "+1 323-292-4545", distance: "3.2 mi", drivingTime: "8 min", lat: 33.9847, lng: -118.3712, hours: "9am-9pm" }
    ]
  },
  {
    id: "miami",
    city: "Miami",
    country: "USA",
    flag: "us",
    stadium: "Hard Rock Stadium",
    stadiumLat: 25.9580,
    stadiumLng: -80.2389,
    facilities: [
      { id: "mia-er-1", name: "Memorial Regional Hospital", type: "er", address: "3501 Johnson St, Hollywood, FL", phone: "+1 954-987-2000", distance: "8.5 mi", drivingTime: "15 min", lat: 26.0226, lng: -80.1766, hours: "24/7" },
      { id: "mia-er-2", name: "Aventura Hospital", type: "er", address: "20900 Biscayne Blvd, Aventura, FL", phone: "+1 305-682-7000", distance: "5.2 mi", drivingTime: "10 min", lat: 25.9586, lng: -80.1411, hours: "24/7" },
      { id: "mia-uc-1", name: "Baptist Health Urgent Care", type: "urgent", address: "17801 NW 5th Ave, Miami Gardens, FL", phone: "+1 786-596-2299", distance: "2.8 mi", drivingTime: "6 min", lat: 25.9435, lng: -80.2073, hours: "8am-8pm" },
      { id: "mia-uc-2", name: "FastMed Urgent Care", type: "urgent", address: "3185 NE 163rd St, North Miami Beach, FL", phone: "+1 305-947-3335", distance: "4.1 mi", drivingTime: "9 min", lat: 25.9309, lng: -80.1622, hours: "8am-10pm" }
    ]
  },
  {
    id: "houston",
    city: "Houston",
    country: "USA",
    flag: "us",
    stadium: "NRG Stadium",
    stadiumLat: 29.6847,
    stadiumLng: -95.4107,
    facilities: [
      { id: "hou-er-1", name: "Houston Methodist Hospital", type: "er", address: "6565 Fannin St, Houston, TX", phone: "+1 713-790-3311", distance: "4.8 mi", drivingTime: "12 min", lat: 29.7108, lng: -95.3980, hours: "24/7" },
      { id: "hou-er-2", name: "Memorial Hermann Southwest", type: "er", address: "7600 Beechnut St, Houston, TX", phone: "+1 713-456-5000", distance: "3.2 mi", drivingTime: "8 min", lat: 29.6872, lng: -95.5016, hours: "24/7" },
      { id: "hou-uc-1", name: "NextLevel Urgent Care", type: "urgent", address: "9001 S Main St, Houston, TX", phone: "+1 832-429-1050", distance: "2.1 mi", drivingTime: "5 min", lat: 29.6721, lng: -95.3873, hours: "8am-9pm" },
      { id: "hou-uc-2", name: "CareNow Urgent Care", type: "urgent", address: "3100 Weslayan St, Houston, TX", phone: "+1 713-850-7500", distance: "4.5 mi", drivingTime: "10 min", lat: 29.7289, lng: -95.4378, hours: "8am-8pm" }
    ]
  },
  {
    id: "dallas",
    city: "Dallas",
    country: "USA",
    flag: "us",
    stadium: "AT&T Stadium",
    stadiumLat: 32.7473,
    stadiumLng: -97.0945,
    facilities: [
      { id: "dal-er-1", name: "Texas Health Arlington Memorial", type: "er", address: "800 W Randol Mill Rd, Arlington, TX", phone: "+1 817-548-6100", distance: "2.5 mi", drivingTime: "6 min", lat: 32.7572, lng: -97.1108, hours: "24/7" },
      { id: "dal-er-2", name: "Medical City Arlington", type: "er", address: "3301 Matlock Rd, Arlington, TX", phone: "+1 817-465-3241", distance: "4.8 mi", drivingTime: "12 min", lat: 32.6988, lng: -97.0933, hours: "24/7" },
      { id: "dal-uc-1", name: "CareNow Urgent Care Arlington", type: "urgent", address: "4001 S Cooper St, Arlington, TX", phone: "+1 817-468-7000", distance: "3.1 mi", drivingTime: "7 min", lat: 32.7002, lng: -97.1015, hours: "8am-9pm" },
      { id: "dal-uc-2", name: "MedStar Urgent Care", type: "urgent", address: "2141 N Collins St, Arlington, TX", phone: "+1 817-460-4055", distance: "2.8 mi", drivingTime: "6 min", lat: 32.7691, lng: -97.0933, hours: "8am-8pm" }
    ]
  },
  {
    id: "atlanta",
    city: "Atlanta",
    country: "USA",
    flag: "us",
    stadium: "Mercedes-Benz Stadium",
    stadiumLat: 33.7553,
    stadiumLng: -84.4006,
    facilities: [
      { id: "atl-er-1", name: "Grady Memorial Hospital", type: "er", address: "80 Jesse Hill Jr Dr SE, Atlanta, GA", phone: "+1 404-616-1000", distance: "1.2 mi", drivingTime: "4 min", lat: 33.7544, lng: -84.3804, hours: "24/7" },
      { id: "atl-er-2", name: "Emory University Hospital", type: "er", address: "1364 Clifton Rd NE, Atlanta, GA", phone: "+1 404-712-7021", distance: "5.5 mi", drivingTime: "15 min", lat: 33.7948, lng: -84.3234, hours: "24/7" },
      { id: "atl-uc-1", name: "WellStar Urgent Care", type: "urgent", address: "201 17th St NW, Atlanta, GA", phone: "+1 470-956-6500", distance: "0.8 mi", drivingTime: "3 min", lat: 33.7895, lng: -84.3893, hours: "8am-8pm" },
      { id: "atl-uc-2", name: "Piedmont Urgent Care", type: "urgent", address: "550 Peachtree St NE, Atlanta, GA", phone: "+1 404-605-2888", distance: "1.5 mi", drivingTime: "5 min", lat: 33.7701, lng: -84.3849, hours: "8am-8pm" }
    ]
  },
  {
    id: "seattle",
    city: "Seattle",
    country: "USA",
    flag: "us",
    stadium: "Lumen Field",
    stadiumLat: 47.5952,
    stadiumLng: -122.3316,
    facilities: [
      { id: "sea-er-1", name: "Harborview Medical Center", type: "er", address: "325 9th Ave, Seattle, WA", phone: "+1 206-744-3000", distance: "0.9 mi", drivingTime: "4 min", lat: 47.6043, lng: -122.3243, hours: "24/7" },
      { id: "sea-er-2", name: "Virginia Mason Medical Center", type: "er", address: "1100 9th Ave, Seattle, WA", phone: "+1 206-223-6600", distance: "1.2 mi", drivingTime: "5 min", lat: 47.6096, lng: -122.3310, hours: "24/7" },
      { id: "sea-uc-1", name: "ZoomCare Pioneer Square", type: "urgent", address: "315 1st Ave S, Seattle, WA", phone: "+1 503-684-8252", distance: "0.5 mi", drivingTime: "2 min", lat: 47.5997, lng: -122.3340, hours: "8am-10pm" },
      { id: "sea-uc-2", name: "UW Medicine Urgent Care", type: "urgent", address: "4245 Roosevelt Way NE, Seattle, WA", phone: "+1 206-520-5000", distance: "4.2 mi", drivingTime: "12 min", lat: 47.6593, lng: -122.3176, hours: "8am-8pm" }
    ]
  },
  {
    id: "san-francisco",
    city: "San Francisco Bay Area",
    country: "USA",
    flag: "us",
    stadium: "Levi's Stadium",
    stadiumLat: 37.4033,
    stadiumLng: -121.9695,
    facilities: [
      { id: "sf-er-1", name: "Stanford Health Care", type: "er", address: "300 Pasteur Dr, Palo Alto, CA", phone: "+1 650-723-4000", distance: "8.5 mi", drivingTime: "15 min", lat: 37.4346, lng: -122.1756, hours: "24/7" },
      { id: "sf-er-2", name: "El Camino Hospital", type: "er", address: "2500 Grant Rd, Mountain View, CA", phone: "+1 650-940-7000", distance: "5.2 mi", drivingTime: "12 min", lat: 37.3673, lng: -122.0797, hours: "24/7" },
      { id: "sf-uc-1", name: "GoHealth Urgent Care", type: "urgent", address: "4701 Great America Pkwy, Santa Clara, CA", phone: "+1 669-231-1755", distance: "0.8 mi", drivingTime: "3 min", lat: 37.4039, lng: -121.9774, hours: "8am-8pm" },
      { id: "sf-uc-2", name: "Sutter Express Care", type: "urgent", address: "2400 Samaritan Dr, San Jose, CA", phone: "+1 408-871-3900", distance: "4.5 mi", drivingTime: "10 min", lat: 37.3490, lng: -121.9478, hours: "9am-9pm" }
    ]
  },
  {
    id: "philadelphia",
    city: "Philadelphia",
    country: "USA",
    flag: "us",
    stadium: "Lincoln Financial Field",
    stadiumLat: 39.9008,
    stadiumLng: -75.1675,
    facilities: [
      { id: "phi-er-1", name: "Penn Medicine Hospital", type: "er", address: "3400 Spruce St, Philadelphia, PA", phone: "+1 215-662-4000", distance: "4.5 mi", drivingTime: "12 min", lat: 39.9497, lng: -75.1919, hours: "24/7" },
      { id: "phi-er-2", name: "Thomas Jefferson University Hospital", type: "er", address: "111 S 11th St, Philadelphia, PA", phone: "+1 215-955-6000", distance: "5.2 mi", drivingTime: "14 min", lat: 39.9493, lng: -75.1585, hours: "24/7" },
      { id: "phi-uc-1", name: "Vybe Urgent Care", type: "urgent", address: "2100 S Broad St, Philadelphia, PA", phone: "+1 215-376-8900", distance: "1.8 mi", drivingTime: "5 min", lat: 39.9248, lng: -75.1717, hours: "8am-8pm" },
      { id: "phi-uc-2", name: "AFC Urgent Care", type: "urgent", address: "319 S 10th St, Philadelphia, PA", phone: "+1 267-388-5720", distance: "4.8 mi", drivingTime: "12 min", lat: 39.9422, lng: -75.1570, hours: "8am-8pm" }
    ]
  },
  {
    id: "boston",
    city: "Boston",
    country: "USA",
    flag: "us",
    stadium: "Gillette Stadium",
    stadiumLat: 42.0909,
    stadiumLng: -71.2643,
    facilities: [
      { id: "bos-er-1", name: "Sturdy Memorial Hospital", type: "er", address: "211 Park St, Attleboro, MA", phone: "+1 508-222-5200", distance: "8.2 mi", drivingTime: "15 min", lat: 41.9427, lng: -71.2867, hours: "24/7" },
      { id: "bos-er-2", name: "Norwood Hospital", type: "er", address: "800 Washington St, Norwood, MA", phone: "+1 781-769-4000", distance: "10.5 mi", drivingTime: "18 min", lat: 42.1845, lng: -71.1958, hours: "24/7" },
      { id: "bos-uc-1", name: "CareWell Urgent Care", type: "urgent", address: "124 S Main St, Attleboro, MA", phone: "+1 508-761-5430", distance: "7.8 mi", drivingTime: "14 min", lat: 41.9420, lng: -71.2852, hours: "8am-8pm" },
      { id: "bos-uc-2", name: "AFC Urgent Care Wrentham", type: "urgent", address: "320 Franklin St, Wrentham, MA", phone: "+1 508-384-2279", distance: "5.2 mi", drivingTime: "10 min", lat: 42.0470, lng: -71.3389, hours: "8am-8pm" }
    ]
  },
  {
    id: "kansas-city",
    city: "Kansas City",
    country: "USA",
    flag: "us",
    stadium: "GEHA Field at Arrowhead Stadium",
    stadiumLat: 39.0489,
    stadiumLng: -94.4839,
    facilities: [
      { id: "kc-er-1", name: "Centerpoint Medical Center", type: "er", address: "19600 E 39th St S, Independence, MO", phone: "+1 816-698-7000", distance: "3.5 mi", drivingTime: "8 min", lat: 39.0192, lng: -94.4055, hours: "24/7" },
      { id: "kc-er-2", name: "Saint Luke's East Hospital", type: "er", address: "100 NE St Lukes Blvd, Lee's Summit, MO", phone: "+1 816-347-5000", distance: "8.2 mi", drivingTime: "15 min", lat: 38.9262, lng: -94.3825, hours: "24/7" },
      { id: "kc-uc-1", name: "Advent Health Urgent Care", type: "urgent", address: "4931 Bannister Rd, Kansas City, MO", phone: "+1 816-761-2622", distance: "5.8 mi", drivingTime: "12 min", lat: 38.9759, lng: -94.5540, hours: "8am-8pm" },
      { id: "kc-uc-2", name: "HCA Midwest Urgent Care", type: "urgent", address: "1200 NW Chipman Rd, Lee's Summit, MO", phone: "+1 816-347-3300", distance: "7.5 mi", drivingTime: "14 min", lat: 38.9462, lng: -94.3975, hours: "8am-8pm" }
    ]
  },
  {
    id: "mexico-city",
    city: "Mexico City",
    country: "Mexico",
    flag: "mx",
    stadium: "Estadio Azteca",
    stadiumLat: 19.3029,
    stadiumLng: -99.1505,
    facilities: [
      { id: "mex-er-1", name: "Hospital Angeles Pedregal", type: "er", address: "Camino a Sta Teresa 1055, CDMX", phone: "+52 55 5449 5500", distance: "4.2 mi", drivingTime: "15 min", lat: 19.2999, lng: -99.2058, hours: "24/7" },
      { id: "mex-er-2", name: "Hospital Medica Sur", type: "er", address: "Puente de Piedra 150, CDMX", phone: "+52 55 5424 7200", distance: "2.8 mi", drivingTime: "10 min", lat: 19.2867, lng: -99.1632, hours: "24/7" },
      { id: "mex-uc-1", name: "Doctoralia Clinic Coyoacan", type: "urgent", address: "Av Universidad 1810, CDMX", phone: "+52 55 4170 8000", distance: "3.5 mi", drivingTime: "12 min", lat: 19.3394, lng: -99.1775, hours: "8am-10pm" },
      { id: "mex-uc-2", name: "Salud Digna Tlalpan", type: "urgent", address: "Calz de Tlalpan 4585, CDMX", phone: "+52 55 4738 5100", distance: "2.1 mi", drivingTime: "8 min", lat: 19.2954, lng: -99.1418, hours: "7am-8pm" }
    ]
  },
  {
    id: "guadalajara",
    city: "Guadalajara",
    country: "Mexico",
    flag: "mx",
    stadium: "Estadio Akron",
    stadiumLat: 20.6802,
    stadiumLng: -103.4626,
    facilities: [
      { id: "gdl-er-1", name: "Hospital San Javier", type: "er", address: "Av Pablo Casals 640, Guadalajara", phone: "+52 33 3669 0222", distance: "5.8 mi", drivingTime: "18 min", lat: 20.6943, lng: -103.3846, hours: "24/7" },
      { id: "gdl-er-2", name: "Hospital Country 2000", type: "er", address: "Av Adolfo Lopez Mateos Sur 1401", phone: "+52 33 3854 2000", distance: "4.2 mi", drivingTime: "12 min", lat: 20.6511, lng: -103.4102, hours: "24/7" },
      { id: "gdl-uc-1", name: "Clinica Santa Maria", type: "urgent", address: "Av Vallarta 3233, Guadalajara", phone: "+52 33 3616 2424", distance: "6.5 mi", drivingTime: "20 min", lat: 20.6762, lng: -103.3927, hours: "8am-10pm" },
      { id: "gdl-uc-2", name: "Salud Digna Zapopan", type: "urgent", address: "Av Patria 2085, Zapopan", phone: "+52 33 4738 5100", distance: "3.8 mi", drivingTime: "10 min", lat: 20.7043, lng: -103.4285, hours: "7am-8pm" }
    ]
  },
  {
    id: "monterrey",
    city: "Monterrey",
    country: "Mexico",
    flag: "mx",
    stadium: "Estadio BBVA",
    stadiumLat: 25.6699,
    stadiumLng: -100.2438,
    facilities: [
      { id: "mty-er-1", name: "Hospital San Jose Tec de Monterrey", type: "er", address: "Av Ignacio Morones Prieto 3000", phone: "+52 81 8389 8888", distance: "4.5 mi", drivingTime: "12 min", lat: 25.6538, lng: -100.2890, hours: "24/7" },
      { id: "mty-er-2", name: "Christus Muguerza Hospital", type: "er", address: "Av Hidalgo 2525, Monterrey", phone: "+52 81 8399 3400", distance: "5.8 mi", drivingTime: "15 min", lat: 25.6704, lng: -100.3165, hours: "24/7" },
      { id: "mty-uc-1", name: "Doctoralia Clinic Monterrey", type: "urgent", address: "Av Constitucion 1500, Monterrey", phone: "+52 81 4170 8000", distance: "4.2 mi", drivingTime: "10 min", lat: 25.6732, lng: -100.3089, hours: "8am-10pm" },
      { id: "mty-uc-2", name: "Salud Digna Guadalupe", type: "urgent", address: "Av Pablo Livas 2560, Guadalupe", phone: "+52 81 4738 5100", distance: "2.5 mi", drivingTime: "6 min", lat: 25.6687, lng: -100.2156, hours: "7am-8pm" }
    ]
  },
  {
    id: "toronto",
    city: "Toronto",
    country: "Canada",
    flag: "ca",
    stadium: "BMO Field",
    stadiumLat: 43.6332,
    stadiumLng: -79.4185,
    facilities: [
      { id: "tor-er-1", name: "St. Michael's Hospital", type: "er", address: "36 Queen St E, Toronto, ON", phone: "+1 416-360-4000", distance: "3.2 mi", drivingTime: "10 min", lat: 43.6534, lng: -79.3773, hours: "24/7" },
      { id: "tor-er-2", name: "Toronto Western Hospital", type: "er", address: "399 Bathurst St, Toronto, ON", phone: "+1 416-603-5800", distance: "2.8 mi", drivingTime: "8 min", lat: 43.6535, lng: -79.4057, hours: "24/7" },
      { id: "tor-uc-1", name: "Appletree Medical Centre", type: "urgent", address: "790 Bay St, Toronto, ON", phone: "+1 416-955-0888", distance: "3.5 mi", drivingTime: "12 min", lat: 43.6618, lng: -79.3858, hours: "8am-8pm" },
      { id: "tor-uc-2", name: "Cleveland Clinic Walk-In", type: "urgent", address: "65 Queen St W, Toronto, ON", phone: "+1 416-521-6601", distance: "3.1 mi", drivingTime: "10 min", lat: 43.6517, lng: -79.3829, hours: "9am-9pm" }
    ]
  },
  {
    id: "vancouver",
    city: "Vancouver",
    country: "Canada",
    flag: "ca",
    stadium: "BC Place",
    stadiumLat: 49.2768,
    stadiumLng: -123.1120,
    facilities: [
      { id: "van-er-1", name: "St. Paul's Hospital", type: "er", address: "1081 Burrard St, Vancouver, BC", phone: "+1 604-682-2344", distance: "0.8 mi", drivingTime: "4 min", lat: 49.2808, lng: -123.1277, hours: "24/7" },
      { id: "van-er-2", name: "Vancouver General Hospital", type: "er", address: "899 W 12th Ave, Vancouver, BC", phone: "+1 604-875-4111", distance: "2.5 mi", drivingTime: "8 min", lat: 49.2609, lng: -123.1236, hours: "24/7" },
      { id: "van-uc-1", name: "Stein Medical Clinic", type: "urgent", address: "1055 W Georgia St, Vancouver, BC", phone: "+1 604-732-5233", distance: "0.5 mi", drivingTime: "3 min", lat: 49.2847, lng: -123.1203, hours: "8am-6pm" },
      { id: "van-uc-2", name: "Care Point Medical Centre", type: "urgent", address: "1175 Denman St, Vancouver, BC", phone: "+1 604-681-5338", distance: "1.8 mi", drivingTime: "6 min", lat: 49.2876, lng: -123.1396, hours: "9am-9pm" }
    ]
  }
];

const emergencyData: InfoSection[] = [
  {
    id: "health-emergency",
    title: "HEALTH & EMERGENCY",
    icon: Heart,
    iconColor: "text-red-400",
    items: [
      {
        id: "911",
        title: "911 Emergency Number",
        description: "Call 911 for Police/Fire/Ambulance (Life threatening emergencies only). Available 24/7."
      },
      {
        id: "988",
        title: "988 Crisis Hotline",
        description: "Call 988 for Suicide & Crisis Lifeline (Mental Health emergencies). Free and available to tourists 24/7."
      },
      {
        id: "311",
        title: "311 Non-Emergency",
        description: "Call 311 for non-emergency city services (noise complaints, lost property). Available in most host cities."
      },
      {
        id: "medical-locator",
        title: "Medical Facility Locator",
        description: "Find the nearest Emergency Rooms and Urgent Care centers near each stadium. Tap to open the Medical Locator with maps and directions."
      }
    ]
  }
];

const financialData: InfoSection[] = [
  {
    id: "financial-tips",
    title: "FINANCIAL",
    icon: DollarSign,
    iconColor: "text-green-400",
    items: [
      {
        id: "tipping",
        title: "Tipping is Mandatory",
        description: "18-22% for dining, $1-2 per drink at bars, $2-5 for hotel housekeeping per night. Use the app's tipping calculator."
      },
      {
        id: "sales-tax",
        title: "Sales Tax Not Included",
        description: "Prices on shelves are PRE-TAX. At the register, expect 6-10% higher. Unlike Europe/Asia, tourists CANNOT get a VAT/Sales Tax refund at the airport."
      },
      {
        id: "credit-holds",
        title: "Credit Card Holds",
        description: "Hotels and rental cars place $200-$500 \"holds\" on cards. This reduces your spending limit immediately. Avoid using debit cards as money actually leaves your account."
      }
    ]
  }
];

const legalData: InfoSection[] = [
  {
    id: "legal-info",
    title: "LEGAL",
    icon: Gavel,
    iconColor: "text-blue-400",
    items: [
      {
        id: "alcohol-age",
        title: "Alcohol Age 21 Strictly Enforced",
        description: "Drinking age is strictly 21. Passport is the only guaranteed accepted ID. Walking with open containers (beer) is illegal in almost all cities."
      },
      {
        id: "cannabis",
        title: "Cannabis Federal Crime Warning",
        description: "Marijuana is legal in many states (CA, NY, MA) but ILLEGAL FEDERALLY. Bringing it across state lines or into airports is a federal crime. Never have it on federal land."
      },
      {
        id: "right-turn",
        title: "Right Turn on Red",
        description: "Legal everywhere UNLESS sign says \"No Turn on Red\". Exception: Illegal in New York City. 4-way stops: First to arrive goes first."
      }
    ]
  }
];

const dailyLifeData: InfoSection[] = [
  {
    id: "daily-life-info",
    title: "DAILY LIFE",
    icon: Coffee,
    iconColor: "text-orange-400",
    items: [
      {
        id: "esim",
        title: "eSIM for Mobile Data",
        description: "US carriers shut down 3G. Phone must support VoLTE. Use Airalo or GigSky eSIM apps for data instead of expensive physical SIM cards."
      },
      {
        id: "metric",
        title: "Metric to Imperial Guide",
        description: "100°F = 38°C (Very Hot), 32°F = 0°C (Freezing). 1 Mile = 1.6 KM. Date format: MM/DD/YYYY (12/10/26 = December 10th)."
      },
      {
        id: "restrooms",
        title: "Public Restrooms Rare",
        description: "US cities have very few public toilets. Use hotel lobbies or large department stores. Check the app's restroom locator."
      }
    ]
  }
];

interface CitySafetyKey {
  id: string;
  city: string;
  country: string;
  heatLevel: "extreme" | "severe" | "high" | "moderate" | "low";
  safeAreaCount: number;
  localConcernsCount: number;
  avoidAreasCount: number;
  tipsCount: number;
}

const citySafetyKeys: CitySafetyKey[] = [
  { id: "miami", city: "Miami", country: "USA", heatLevel: "extreme", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "houston", city: "Houston", country: "USA", heatLevel: "severe", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "dallas", city: "Dallas", country: "USA", heatLevel: "extreme", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "atlanta", city: "Atlanta", country: "USA", heatLevel: "high", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "new-york", city: "New York / New Jersey", country: "USA", heatLevel: "moderate", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "los-angeles", city: "Los Angeles", country: "USA", heatLevel: "moderate", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "seattle", city: "Seattle", country: "USA", heatLevel: "low", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "san-francisco", city: "San Francisco Bay Area", country: "USA", heatLevel: "low", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "boston", city: "Boston", country: "USA", heatLevel: "moderate", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "philadelphia", city: "Philadelphia", country: "USA", heatLevel: "moderate", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "kansas-city", city: "Kansas City", country: "USA", heatLevel: "high", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "mexico-city", city: "Mexico City", country: "Mexico", heatLevel: "moderate", safeAreaCount: 5, localConcernsCount: 5, avoidAreasCount: 4, tipsCount: 3 },
  { id: "guadalajara", city: "Guadalajara", country: "Mexico", heatLevel: "moderate", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 4, tipsCount: 3 },
  { id: "monterrey", city: "Monterrey", country: "Mexico", heatLevel: "extreme", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 3, tipsCount: 3 },
  { id: "toronto", city: "Toronto", country: "Canada", heatLevel: "low", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 3, tipsCount: 3 },
  { id: "vancouver", city: "Vancouver", country: "Canada", heatLevel: "low", safeAreaCount: 5, localConcernsCount: 4, avoidAreasCount: 3, tipsCount: 3 }
];

const citySafetyData = [
  {
    id: "miami",
    city: "Miami",
    country: "USA",
    heatWarning: "EXTREME: Heat index can reach 120°F (49°C) in June/July. High humidity makes cooling difficult. Heat exhaustion is a serious risk.",
    ticketScams: "Beware of fake tickets sold near Hard Rock Stadium. Only buy from FIFA.com or Ticketmaster. Counterfeit jerseys common on streets.",
    localConcerns: [
      "Hurricane season runs June-November - monitor weather alerts",
      "Strong sun exposure - wear SPF 50+ and reapply frequently",
      "Mosquitoes carry diseases - use repellent especially at dawn/dusk",
      "Rip currents at beaches - swim only at lifeguarded areas"
    ],
    safeAreas: [
      { name: "Miami Beach", description: "Tourist-friendly beachfront with heavy police presence, well-lit Art Deco district, and 24/7 activity on Ocean Drive." },
      { name: "Brickell", description: "Miami's financial district with upscale high-rises, modern restaurants, and excellent walkability. Very safe day and night." },
      { name: "Coral Gables", description: "Affluent residential area known for Mediterranean architecture, tree-lined streets, and the beautiful Miracle Mile shopping district." },
      { name: "Coconut Grove", description: "Bohemian waterfront neighborhood with outdoor cafes, boutique shops, and safe walking paths along the bay." },
      { name: "Wynwood", description: "Famous arts district with colorful murals and galleries. Very safe during daytime; exercise caution after midnight." }
    ],
    avoidAreas: ["Overtown", "Liberty City", "Little Haiti (after dark)", "Opa-locka"],
    tips: ["Stay hydrated - drink water constantly", "Seek air conditioning during 11am-4pm", "Use Uber/Lyft instead of walking long distances in heat"]
  },
  {
    id: "houston",
    city: "Houston",
    country: "USA",
    heatWarning: "SEVERE: Temperatures regularly exceed 105°F (40°C). Subtropical humidity makes it feel even hotter. All 21 risky heat days in 2025 summer were climate-change-induced.",
    ticketScams: "NRG Stadium area sees scalpers with fake tickets. Parking lot scams common - only use official lots.",
    localConcerns: [
      "Flash flooding during summer storms - avoid underpasses",
      "Power grid can strain during heat waves",
      "Wide spread city - public transit limited, plan transportation",
      "Traffic congestion severe - allow extra time"
    ],
    safeAreas: [
      { name: "The Heights", description: "Historic neighborhood with Victorian homes, trendy restaurants, and walkable 19th Street shopping district. Family-friendly atmosphere." },
      { name: "Montrose", description: "Eclectic, LGBTQ-friendly neighborhood with diverse dining, vintage shops, and vibrant nightlife. Safe and welcoming." },
      { name: "River Oaks", description: "Houston's wealthiest neighborhood with luxury estates, upscale shopping, and excellent security. Home to many consulates." },
      { name: "Galleria area", description: "Major shopping and business district centered around the famous Galleria mall. Well-patrolled with many hotels nearby." },
      { name: "Downtown", description: "Business district safe during daytime with museums, theaters, and sports venues. Use rideshare for evening returns." }
    ],
    avoidAreas: ["Third Ward (parts)", "Sunnyside", "Acres Homes", "South Park"],
    tips: ["Carry water bottle everywhere", "Know location of cooling centers", "Check flash flood warnings during storms"]
  },
  {
    id: "dallas",
    city: "Dallas",
    country: "USA",
    heatWarning: "EXTREME: Consecutive days above 105°F (40°C) throughout June. Can break 110°F. Dallas ranks 4th most uncomfortable U.S. city in summer.",
    ticketScams: "AT&T Stadium (Arlington) is massive - scammers operate in parking areas. Fake parking passes sold online.",
    localConcerns: [
      "Severe thunderstorms and tornadoes possible in June",
      "Stadium is in Arlington - 20 miles from Dallas, plan transport",
      "Very car-dependent - limited public transit to stadium",
      "Toll roads everywhere - have cash or TollTag"
    ],
    safeAreas: [
      { name: "Uptown", description: "Trendy urban neighborhood with walkable streets, rooftop bars, and excellent restaurants. Popular with young professionals, very safe." },
      { name: "Highland Park", description: "One of America's wealthiest enclaves with beautiful mansions, manicured lawns, and its own police force. Extremely safe." },
      { name: "Bishop Arts District", description: "Charming arts and entertainment district in Oak Cliff with local boutiques, galleries, and diverse dining options." },
      { name: "Deep Ellum", description: "Historic entertainment district with live music venues and street art. Safe during daytime; use rideshare at night." },
      { name: "Victory Park", description: "Modern mixed-use development near American Airlines Center with upscale dining and entertainment. Well-secured area." }
    ],
    avoidAreas: ["South Dallas", "Pleasant Grove", "Fair Park (after dark)", "parts of Oak Cliff"],
    tips: ["Pre-book stadium parking", "Use DART light rail where available", "Carry portable fan and cooling towel"]
  },
  {
    id: "atlanta",
    city: "Atlanta",
    country: "USA",
    heatWarning: "HIGH: 45-50 days forecast to reach 90°F+ in summer. Urban heat island effect makes downtown several degrees hotter than suburbs.",
    ticketScams: "Mercedes-Benz Stadium is downtown - street vendors sell fake tickets and merchandise. Only use official channels.",
    localConcerns: [
      "Traffic among worst in USA - MARTA train recommended",
      "Neighborhoods change quickly block-by-block",
      "Humidity makes heat feel more oppressive",
      "Summer afternoon thunderstorms daily"
    ],
    safeAreas: [
      { name: "Midtown", description: "Cultural heart of Atlanta with Piedmont Park, High Museum, and excellent dining. MARTA accessible and walkable." },
      { name: "Buckhead", description: "Upscale shopping and dining district known for Lenox Square mall and luxury hotels. Heavy police presence." },
      { name: "Virginia-Highland", description: "Charming residential neighborhood with local boutiques, coffee shops, and tree-lined streets. Very walkable." },
      { name: "Inman Park", description: "Atlanta's first planned suburb with Victorian homes, the BeltLine trail access, and eclectic restaurants." },
      { name: "Decatur", description: "Independent city within metro Atlanta known for its downtown square, excellent schools, and family-friendly vibe." }
    ],
    avoidAreas: ["Bankhead", "Vine City (parts)", "English Avenue", "Pittsburgh (after dark)"],
    tips: ["Use MARTA for stadium access", "Stay in designated fan zones", "Seek shelter during afternoon storms"]
  },
  {
    id: "new-york",
    city: "New York / New Jersey",
    country: "USA",
    heatWarning: "MODERATE: Heat waves possible but less severe than southern cities. Humidity can be uncomfortable. Subway platforms extremely hot.",
    ticketScams: "MetLife Stadium scammers operate at transit hubs (Penn Station, Port Authority). Never buy from street vendors.",
    localConcerns: [
      "Stadium in New Jersey - 10 miles from Manhattan",
      "NJ Transit trains to stadium can be overcrowded",
      "Pickpocketing on crowded subways",
      "Aggressive street vendors in tourist areas"
    ],
    safeAreas: [
      { name: "Midtown Manhattan", description: "Heart of NYC with Times Square, Broadway theaters, and major hotels. Extremely busy but well-policed 24/7." },
      { name: "Upper East/West Side", description: "Affluent residential neighborhoods with world-class museums, Central Park access, and excellent restaurants." },
      { name: "SoHo", description: "Trendy shopping district with cobblestone streets, designer boutiques, and cast-iron architecture. Safe and fashionable." },
      { name: "Brooklyn Heights", description: "Historic neighborhood with stunning Manhattan views, brownstone-lined streets, and the famous Promenade." },
      { name: "Hoboken", description: "Waterfront NJ city with Manhattan skyline views, excellent restaurants, and direct PATH train to NYC. Very safe." }
    ],
    avoidAreas: ["Parts of the Bronx", "East New York", "Brownsville", "some areas of Newark"],
    tips: ["Pre-purchase NJ Transit tickets", "Keep belongings secure on subway", "Allow 2+ hours to reach stadium from Manhattan"]
  },
  {
    id: "los-angeles",
    city: "Los Angeles",
    country: "USA",
    heatWarning: "MODERATE to HIGH: Inland areas can reach 100°F+. Coastal areas cooler. SoFi Stadium in Inglewood can be very hot.",
    ticketScams: "SoFi Stadium area has organized scalping operations. Fake VIP experiences sold online. Verify all tickets on official apps.",
    localConcerns: [
      "Car essential - worst traffic in USA",
      "Extreme smog during heat waves",
      "Homeless encampments in some areas",
      "Earthquakes possible (know safety procedures)"
    ],
    safeAreas: [
      { name: "Santa Monica", description: "Iconic beach city with the famous pier, Third Street Promenade shopping, and ocean breezes. Tourist-friendly and safe." },
      { name: "Beverly Hills", description: "World-famous luxury destination with Rodeo Drive shopping, celebrity homes, and excellent security. Very upscale." },
      { name: "West Hollywood", description: "Vibrant LGBTQ-friendly neighborhood with Sunset Strip nightlife, trendy restaurants, and walkable streets." },
      { name: "Pasadena", description: "Charming city with Old Town dining, the Rose Bowl, and Caltech. Feels like a small town within LA." },
      { name: "Manhattan Beach", description: "Upscale coastal community with beautiful beaches, bike paths, and family-friendly atmosphere. Very safe." }
    ],
    avoidAreas: ["Skid Row", "parts of South LA", "Compton", "some areas of Inglewood"],
    tips: ["Leave 2+ hours for any drive", "Stay hydrated - dry heat is deceptive", "Download earthquake alert app"]
  },
  {
    id: "seattle",
    city: "Seattle",
    country: "USA",
    heatWarning: "LOW: Typically mild summer weather (70-80°F). Occasional heat waves but rare. Air conditioning not common - hotels may not have it.",
    ticketScams: "Lumen Field has less scam activity than other cities, but still buy only from official sources.",
    localConcerns: [
      "Rain possible even in summer - bring layers",
      "Homeless population visible downtown",
      "Hills make walking tiring",
      "Wildfire smoke from Eastern WA possible in summer"
    ],
    safeAreas: [
      { name: "Capitol Hill", description: "Seattle's most vibrant neighborhood with LGBTQ culture, excellent nightlife, coffee shops, and walkable streets." },
      { name: "Queen Anne", description: "Hilly residential area with stunning city views from Kerry Park, boutique shops, and quiet tree-lined streets." },
      { name: "Ballard", description: "Former Scandinavian fishing village now hip neighborhood with craft breweries, restaurants, and Sunday farmers market." },
      { name: "Fremont", description: "Quirky artistic neighborhood self-declared 'Center of the Universe' with the famous Fremont Troll and eclectic shops." },
      { name: "Bellevue", description: "Upscale eastside city with luxury shopping at Bellevue Square, excellent Asian cuisine, and very low crime rates." }
    ],
    avoidAreas: ["Pioneer Square (after dark)", "parts of SODO", "certain areas of Aurora Ave"],
    tips: ["Light rail connects airport to downtown and stadium", "Bring rain jacket even in summer", "Check air quality if wildfires active"]
  },
  {
    id: "san-francisco",
    city: "San Francisco Bay Area",
    country: "USA",
    heatWarning: "LOW at coast, HIGH inland: SF itself is cool (60-70°F) but Levi's Stadium in Santa Clara can reach 95°F+. Dress in layers.",
    ticketScams: "Tech-savvy scammers create sophisticated fake ticket sites. Only use FIFA.com or Ticketmaster.",
    localConcerns: [
      "Stadium 45 miles from SF - plan transportation",
      "Smash-and-grab car break-ins epidemic - never leave anything in cars",
      "Homeless population in SF city center",
      "BART trains can be unsafe late night"
    ],
    safeAreas: [
      { name: "Marina District", description: "Affluent waterfront neighborhood with Crissy Field, boutique shopping on Chestnut Street, and Golden Gate views." },
      { name: "Pacific Heights", description: "San Francisco's most prestigious neighborhood with Victorian mansions, upscale dining, and Fillmore Street shopping." },
      { name: "Noe Valley", description: "Family-friendly neighborhood known as 'Stroller Valley' with 24th Street shops, sunny weather, and quiet streets." },
      { name: "Palo Alto", description: "Home to Stanford University, charming downtown, excellent restaurants, and very safe suburban feel near stadium." },
      { name: "Saratoga", description: "Upscale Silicon Valley town with wineries, hiking trails, and peaceful atmosphere. Very close to Levi's Stadium." }
    ],
    avoidAreas: ["Tenderloin", "parts of SOMA", "some areas of Oakland"],
    tips: ["Use Caltrain to stadium", "Never leave anything visible in parked car", "Bring layers - temperature varies dramatically"]
  },
  {
    id: "boston",
    city: "Boston",
    country: "USA",
    heatWarning: "MODERATE: Summer humidity can make 85°F feel like 95°F. Gillette Stadium in Foxborough has no shade - be prepared.",
    ticketScams: "Patriots fans control Gillette Stadium area - outsiders selling tickets are likely scammers.",
    localConcerns: [
      "Stadium 30 miles south of Boston in Foxborough",
      "Limited public transit to stadium (commuter rail on game days only)",
      "Aggressive Boston sports fan culture",
      "Construction everywhere downtown"
    ],
    safeAreas: [
      { name: "Back Bay", description: "Elegant Victorian neighborhood with Newbury Street shopping, brownstone-lined Commonwealth Ave, and upscale dining." },
      { name: "Beacon Hill", description: "Historic cobblestone streets, gas lamps, and Federal-style row houses. One of America's most picturesque neighborhoods." },
      { name: "Cambridge", description: "Home to Harvard and MIT with intellectual atmosphere, bookstores, diverse dining, and vibrant Harvard Square." },
      { name: "Brookline", description: "Affluent suburban feel within city limits, excellent public transit (Green Line), and Coolidge Corner shops." },
      { name: "North End", description: "Boston's Little Italy with authentic Italian restaurants, pastry shops, and narrow European-style streets. Very walkable." }
    ],
    avoidAreas: ["Parts of Roxbury", "Dorchester (some areas)", "Mattapan"],
    tips: ["Book stadium parking in advance", "Commuter rail fills up fast - arrive early", "Respect local fan culture"]
  },
  {
    id: "philadelphia",
    city: "Philadelphia",
    country: "USA",
    heatWarning: "MODERATE to HIGH: Summer heat waves with high humidity. Urban heat island effect downtown.",
    ticketScams: "Lincoln Financial Field area has organized scalping. Fake Eagles/Phillies merchandise sold near stadiums.",
    localConcerns: [
      "Gun violence in some neighborhoods",
      "SEPTA public transit reliable but crowded",
      "Philly fans have reputation for being rowdy",
      "Streets can be confusing to navigate"
    ],
    safeAreas: [
      { name: "Center City", description: "Downtown Philadelphia with historic sites, Reading Terminal Market, and major hotels. Well-patrolled and busy." },
      { name: "Rittenhouse Square", description: "Philadelphia's most prestigious park surrounded by upscale dining, boutiques, and beautiful brownstones." },
      { name: "Old City", description: "Historic district with Independence Hall, Liberty Bell, cobblestone streets, and excellent restaurants." },
      { name: "University City", description: "Home to UPenn and Drexel with student energy, diverse dining, and good transit connections." },
      { name: "Chestnut Hill", description: "Charming suburban village feel with boutique shopping, Wissahickon trails, and tree-lined streets." }
    ],
    avoidAreas: ["North Philadelphia", "Kensington", "parts of West Philadelphia"],
    tips: ["Use SEPTA Broad Street Line to stadium", "Stay in well-lit areas after dark", "Be aware of surroundings"]
  },
  {
    id: "kansas-city",
    city: "Kansas City",
    country: "USA",
    heatWarning: "HIGH: Hot and humid summers, regularly 95°F+ with high humidity. Arrowhead Stadium offers little shade.",
    ticketScams: "Chiefs fans are devoted - be wary of anyone not obviously a local selling tickets.",
    localConcerns: [
      "Severe thunderstorms and tornadoes possible",
      "Very car-dependent city",
      "Stadium in Missouri side (KC spans two states)",
      "Limited international food options"
    ],
    safeAreas: [
      { name: "Country Club Plaza", description: "Spanish-inspired outdoor shopping district with fountains, upscale stores, and excellent restaurants. KC's premier destination." },
      { name: "Westport", description: "Entertainment district with live music, diverse bars, and restaurants. Popular nightlife area, generally safe." },
      { name: "Brookside", description: "Charming neighborhood with local shops, tree-lined streets, and strong community feel. Family-friendly atmosphere." },
      { name: "Overland Park", description: "Affluent Kansas suburb with excellent shopping, dining, and very low crime rates. Corporate headquarters hub." },
      { name: "Crown Center", description: "Mixed-use development with hotels, shops, and attractions including Legoland. Well-secured and family-friendly." }
    ],
    avoidAreas: ["East Side neighborhoods", "parts of Northeast KC", "Ivanhoe"],
    tips: ["Tailgating culture is huge - join in respectfully", "Monitor tornado warnings", "Bring sun protection for stadium"]
  },
  {
    id: "mexico-city",
    city: "Mexico City",
    country: "Mexico",
    heatWarning: "MODERATE: High altitude (7,350 ft) means cooler temps than expected (70-80°F). But altitude sickness is a concern - acclimatize before exertion.",
    ticketScams: "Azteca Stadium area has sophisticated scam operations. Counterfeit tickets look very real. Only buy from FIFA.com.",
    localConcerns: [
      "Altitude sickness - take it easy first 2 days",
      "Pickpocketing on Metro (especially Line B)",
      "Police extortion possible",
      "Tap water unsafe - drink only bottled",
      "Air pollution can be severe"
    ],
    safeAreas: [
      { name: "Polanco", description: "Mexico City's most upscale neighborhood with designer boutiques, world-class restaurants, and excellent museums. Very safe." },
      { name: "Roma Norte", description: "Trendy bohemian neighborhood with Art Deco architecture, hip cafes, and vibrant food scene. Popular with expats." },
      { name: "Condesa", description: "Leafy, walkable neighborhood with Art Nouveau buildings, outdoor cafes in Parque México, and excellent nightlife." },
      { name: "Coyoacán", description: "Historic colonial neighborhood with Frida Kahlo Museum, cobblestone streets, and charming central plaza. Family-friendly." },
      { name: "Santa Fe", description: "Modern business district with gleaming towers, upscale malls, and international hotels. Corporate and very secure." }
    ],
    avoidAreas: ["Tepito", "Doctores", "Iztapalapa", "empty streets anywhere after dark"],
    tips: ["Use Uber/DiDi exclusively - never street taxis", "Keep phone in pocket (motorcycle snatchers)", "Drink lots of water for altitude"]
  },
  {
    id: "guadalajara",
    city: "Guadalajara",
    country: "Mexico",
    heatWarning: "MODERATE: Warm but not extreme (80-90°F). Rainy season June-October means afternoon thunderstorms daily.",
    ticketScams: "Estadio Akron area sees fake ticket sales. Only use official FIFA channels.",
    localConcerns: [
      "Jalisco state has cartel presence - stick to tourist areas",
      "Motorcycle phone-snatchers in Colonia Americana & Centro",
      "Very different safety day vs night",
      "Limited English spoken outside tourist areas"
    ],
    safeAreas: [
      { name: "Colonia Americana", description: "Expat-friendly neighborhood with Art Deco mansions, trendy cafes, and Chapultepec Avenue nightlife. Hip and walkable." },
      { name: "Providencia", description: "Upscale residential area with excellent restaurants, shopping centers, and tree-lined streets. Very safe neighborhood." },
      { name: "Zapopan", description: "Home to the famous Basílica with added security, modern shopping malls, and growing restaurant scene." },
      { name: "Chapalita", description: "Family-oriented residential area with parks, local shops, and quiet streets. Excellent for families with children." },
      { name: "Historic Center", description: "Beautiful colonial architecture with the Cathedral and Teatro Degollado. Safe during daytime with police presence." }
    ],
    avoidAreas: ["Analco", "Las Juntas", "Lomas del Paraíso", "Cerro del Cuatro"],
    tips: ["Use Uber for any night travel", "Don't walk alone after dark", "Keep valuables hidden always"]
  },
  {
    id: "monterrey",
    city: "Monterrey",
    country: "Mexico",
    heatWarning: "EXTREME: Desert climate with temps regularly exceeding 100°F (38°C) in June/July. Very dry heat.",
    ticketScams: "Estadio BBVA area - same caution as other Mexican cities. Use only official ticket sources.",
    localConcerns: [
      "Nuevo León state has cartel activity history",
      "Very hot and dry - stay hydrated",
      "Business city - less tourist infrastructure",
      "Some areas near US border are high-risk"
    ],
    safeAreas: [
      { name: "San Pedro Garza García", description: "Mexico's wealthiest municipality with luxury malls, fine dining, and private security. Essentially a gated community feel." },
      { name: "Valle Oriente", description: "Modern business district with corporate towers, upscale hotels, and excellent restaurants. Very well-patrolled." },
      { name: "Cumbres", description: "Upscale residential area popular with families, featuring shopping plazas and a suburban atmosphere." },
      { name: "Centro", description: "Historic downtown with the famous Macroplaza and Barrio Antiguo. Safe during daytime with tourist police presence." },
      { name: "Barrio Antiguo", description: "Trendy nightlife district with bars, restaurants, and art galleries. Popular and well-lit in evenings." }
    ],
    avoidAreas: ["Areas near state borders", "Industrial zones", "Outskirts after dark"],
    tips: ["Stay in business districts", "Use hotel-arranged transportation", "Carry water everywhere"]
  },
  {
    id: "toronto",
    city: "Toronto",
    country: "Canada",
    heatWarning: "LOW to MODERATE: Generally comfortable (75-85°F) but humidity can spike. More temperate than US southern cities.",
    ticketScams: "BMO Field is smaller venue - less scam activity but still use only official ticket sources.",
    localConcerns: [
      "High cost of living - everything expensive",
      "TTC public transit reliable but crowded",
      "Gun violence has increased in some areas",
      "Very multicultural - respect diversity"
    ],
    safeAreas: [
      { name: "Downtown Core", description: "Financial district with CN Tower, PATH underground shopping, and major attractions. Busy and well-policed." },
      { name: "Yorkville", description: "Toronto's most upscale neighborhood with designer boutiques, celebrity sightings, and fine dining. Very safe." },
      { name: "The Annex", description: "Vibrant neighborhood near University of Toronto with Victorian homes, bookstores, and diverse restaurants." },
      { name: "Leslieville", description: "Trendy east-end neighborhood with indie shops, brunch spots, and a strong community feel. Family-friendly." },
      { name: "Distillery District", description: "Beautifully restored Victorian industrial area with galleries, restaurants, and cobblestone streets. Car-free zone." }
    ],
    avoidAreas: ["Jane and Finch", "parts of Scarborough", "Regent Park (improving but caution)"],
    tips: ["Get PRESTO card for transit", "Tipping expected (15-20%)", "Download TTC app for real-time transit"]
  },
  {
    id: "vancouver",
    city: "Vancouver",
    country: "Canada",
    heatWarning: "LOW: Mild summer weather (70-75°F). BC Place is covered stadium. Rain possible even in summer.",
    ticketScams: "Less scam activity than US cities but exercise normal caution with unofficial sellers.",
    localConcerns: [
      "Downtown Eastside has visible drug crisis - avoid Hastings Street",
      "Very expensive city - budget accordingly",
      "Wildfire smoke possible from BC interior",
      "Rental housing crisis - book accommodation early"
    ],
    safeAreas: [
      { name: "Yaletown", description: "Converted warehouse district with trendy restaurants, boutiques, and waterfront seawall access. Very walkable and safe." },
      { name: "Gastown", description: "Historic neighborhood with the famous steam clock, cobblestone streets, and upscale dining. Tourist-friendly (avoid east end)." },
      { name: "Kitsilano", description: "Beach neighborhood with organic cafes, yoga studios, and stunning mountain views. Popular with young professionals." },
      { name: "West End", description: "Densely populated residential area near Stanley Park and English Bay Beach. LGBTQ-friendly and very safe." },
      { name: "North Vancouver", description: "Across the harbor with mountain trails, Capilano Suspension Bridge, and suburban safety. Beautiful natural setting." }
    ],
    avoidAreas: ["Downtown Eastside", "parts of East Hastings", "Surrey Central (after dark)"],
    tips: ["SkyTrain connects airport to downtown and stadium", "Bring layers - weather changes quickly", "Cannabis legal but follow rules"]
  }
];

interface ProhibitedItemKey {
  id: string;
  translationKey: string;
  severity: "critical" | "high" | "medium";
}

interface ProhibitedCategoryKey {
  id: string;
  translationKey: string;
  icon: string;
  items: ProhibitedItemKey[];
}

const prohibitedDataKeys: {
  customs: ProhibitedCategoryKey[];
  stadium: ProhibitedCategoryKey[];
} = {
  customs: [
    {
      id: "food",
      translationKey: "food",
      icon: "🍎",
      items: [
        { id: "kinder-eggs", translationKey: "kinderEggs", severity: "medium" },
        { id: "meats", translationKey: "meats", severity: "high" },
        { id: "fruits-vegetables", translationKey: "fruitsVegetables", severity: "critical" },
        { id: "dairy", translationKey: "dairy", severity: "high" }
      ]
    },
    {
      id: "drugs",
      translationKey: "drugs",
      icon: "💊",
      items: [
        { id: "cannabis", translationKey: "cannabis", severity: "critical" },
        { id: "prescription", translationKey: "prescription", severity: "high" }
      ]
    },
    {
      id: "currency",
      translationKey: "currency",
      icon: "💵",
      items: [
        { id: "cash-over-10k", translationKey: "cashOver10k", severity: "critical" }
      ]
    },
    {
      id: "items",
      translationKey: "items",
      icon: "📦",
      items: [
        { id: "drones", translationKey: "drones", severity: "high" },
        { id: "counterfeit", translationKey: "counterfeit", severity: "medium" },
        { id: "cuban-products", translationKey: "cubanProducts", severity: "medium" }
      ]
    },
    {
      id: "weapons",
      translationKey: "weapons",
      icon: "🔫",
      items: [
        { id: "firearms", translationKey: "firearms", severity: "critical" },
        { id: "knives", translationKey: "knives", severity: "high" }
      ]
    }
  ],
  stadium: [
    {
      id: "bags",
      translationKey: "bags",
      icon: "🎒",
      items: [
        { id: "backpacks", translationKey: "backpacks", severity: "critical" },
        { id: "coolers", translationKey: "coolers", severity: "high" }
      ]
    },
    {
      id: "electronics",
      translationKey: "electronics",
      icon: "📷",
      items: [
        { id: "pro-cameras", translationKey: "proCameras", severity: "high" },
        { id: "tripods", translationKey: "tripods", severity: "medium" },
        { id: "drones-stadium", translationKey: "drones", severity: "critical" },
        { id: "laptops", translationKey: "laptops", severity: "medium" }
      ]
    },
    {
      id: "noisemakers",
      translationKey: "noisemakers",
      icon: "📢",
      items: [
        { id: "airhorns", translationKey: "airhorns", severity: "high" },
        { id: "drums", translationKey: "drums", severity: "medium" }
      ]
    },
    {
      id: "food-drink",
      translationKey: "foodDrink",
      icon: "🥤",
      items: [
        { id: "outside-food", translationKey: "outsideFood", severity: "medium" },
        { id: "alcohol", translationKey: "alcohol", severity: "high" }
      ]
    },
    {
      id: "other",
      translationKey: "other",
      icon: "⛔",
      items: [
        { id: "umbrellas", translationKey: "umbrellas", severity: "medium" },
        { id: "flags-poles", translationKey: "flagsPoles", severity: "medium" },
        { id: "laser-pointers", translationKey: "laserPointers", severity: "critical" },
        { id: "fireworks", translationKey: "fireworks", severity: "critical" },
        { id: "political", translationKey: "political", severity: "high" }
      ]
    }
  ]
};

interface Broadcaster {
  id: string;
  name: string;
  type: "tv" | "streaming" | "radio";
  channels: string[];
  cost: string;
  notes: string;
}

interface BroadcasterRegion {
  id: string;
  region: string;
  flag: string;
  broadcasters: Broadcaster[];
}

const tvGuideData = {
  english: [
    {
      id: "usa-english",
      region: "United States",
      flag: "us",
      broadcasters: [
        {
          id: "fox",
          name: "FOX Sports",
          type: "tv" as const,
          channels: ["FOX (69 matches)", "FS1 (35 matches)"],
          cost: "Free (FOX with antenna) / Cable subscription (FS1)",
          notes: "All 104 matches. FOX network includes all USMNT games and Final. 340+ hours of coverage."
        },
        {
          id: "fubo",
          name: "FuboTV",
          type: "streaming" as const,
          channels: ["FOX", "FS1", "Telemundo", "Universo"],
          cost: "$75/month",
          notes: "Soccer-focused streaming with 4K options. Complete English and Spanish coverage."
        },
        {
          id: "youtube-tv",
          name: "YouTube TV",
          type: "streaming" as const,
          channels: ["FOX", "FS1", "Telemundo"],
          cost: "$73/month",
          notes: "Comprehensive package with unlimited DVR. Both English and Spanish."
        },
        {
          id: "sling-blue",
          name: "Sling TV Blue",
          type: "streaming" as const,
          channels: ["FOX", "FS1"],
          cost: "$35-51/month",
          notes: "Budget English option. No Spanish coverage included."
        },
        {
          id: "siriusxm",
          name: "SiriusXM",
          type: "radio" as const,
          channels: ["FC channel"],
          cost: "Subscription required",
          notes: "Live audio coverage expected. Check closer to tournament."
        }
      ]
    },
    {
      id: "canada-english",
      region: "Canada",
      flag: "ca",
      broadcasters: [
        {
          id: "tsn",
          name: "TSN (The Sports Network)",
          type: "tv" as const,
          channels: ["TSN1", "TSN2", "TSN3", "TSN4", "TSN5"],
          cost: "Cable subscription",
          notes: "Exclusive English-language rights. All 104 matches. Co-host nation special coverage."
        },
        {
          id: "tsn-direct",
          name: "TSN Direct",
          type: "streaming" as const,
          channels: ["TSN streaming app"],
          cost: "$19.99/month",
          notes: "Stream all matches without cable. On-demand replays available."
        },
        {
          id: "ctv",
          name: "CTV",
          type: "tv" as const,
          channels: ["CTV", "CTV2"],
          cost: "Free over-the-air",
          notes: "Supplementary coverage with co-host nation features and highlights."
        }
      ]
    },
    {
      id: "uk",
      region: "United Kingdom",
      flag: "gb",
      broadcasters: [
        {
          id: "bbc",
          name: "BBC",
          type: "tv" as const,
          channels: ["BBC One", "BBC Two", "BBC iPlayer"],
          cost: "Free (with TV license)",
          notes: "52 matches including shared Final. Free streaming on BBC iPlayer."
        },
        {
          id: "itv",
          name: "ITV",
          type: "tv" as const,
          channels: ["ITV1", "ITV4", "ITVX"],
          cost: "Free over-the-air",
          notes: "52 matches including shared Final. Free streaming on ITVX."
        },
        {
          id: "bbc-radio",
          name: "BBC Radio 5 Live",
          type: "radio" as const,
          channels: ["5 Live", "5 Sports Extra"],
          cost: "Free",
          notes: "Full audio commentary. Available on BBC Sounds app worldwide."
        },
        {
          id: "talksport",
          name: "TalkSPORT",
          type: "radio" as const,
          channels: ["TalkSPORT", "TalkSPORT 2"],
          cost: "Free",
          notes: "Alternative commentary. Available via app and online."
        }
      ]
    },
    {
      id: "australia",
      region: "Australia",
      flag: "au",
      broadcasters: [
        {
          id: "sbs",
          name: "SBS",
          type: "tv" as const,
          channels: ["SBS", "SBS VICELAND"],
          cost: "Free over-the-air",
          notes: "All 104 matches free-to-air. Australia's World Cup home since 1986."
        },
        {
          id: "sbs-ondemand",
          name: "SBS On Demand",
          type: "streaming" as const,
          channels: ["SBS On Demand app"],
          cost: "Free",
          notes: "Live streaming and replays. Available on all devices."
        }
      ]
    }
  ],
  spanish: [
    {
      id: "usa-spanish",
      region: "United States",
      flag: "us",
      broadcasters: [
        {
          id: "telemundo",
          name: "Telemundo",
          type: "tv" as const,
          channels: ["Telemundo (92 matches)", "Universo (12 matches)"],
          cost: "Free over-the-air / Cable",
          notes: "All 104 matches in Spanish. Primary Spanish-language broadcaster."
        },
        {
          id: "peacock",
          name: "Peacock",
          type: "streaming" as const,
          channels: ["Peacock Premium"],
          cost: "$7.99/month",
          notes: "Best budget option for Spanish. All matches streaming."
        }
      ]
    },
    {
      id: "mexico",
      region: "Mexico",
      flag: "mx",
      broadcasters: [
        {
          id: "televisa",
          name: "TelevisaUnivision",
          type: "tv" as const,
          channels: ["Las Estrellas", "Canal 5", "TUDN"],
          cost: "Free over-the-air",
          notes: "Co-host nation coverage. All matches free. Extensive pre/post analysis."
        },
        {
          id: "azteca",
          name: "TV Azteca",
          type: "tv" as const,
          channels: ["Azteca 7", "Azteca Deportes"],
          cost: "Free over-the-air",
          notes: "Alternative free coverage. Special Mexico national team programming."
        }
      ]
    },
    {
      id: "spain",
      region: "Spain",
      flag: "es",
      broadcasters: [
        {
          id: "rtve",
          name: "RTVE",
          type: "tv" as const,
          channels: ["La 1", "Teledeporte"],
          cost: "Free over-the-air",
          notes: "Spanish public broadcaster. Free coverage of key matches."
        },
        {
          id: "movistar",
          name: "Movistar+",
          type: "streaming" as const,
          channels: ["Movistar Liga de Campeones"],
          cost: "Subscription required",
          notes: "Complete tournament coverage with premium features."
        }
      ]
    },
    {
      id: "argentina",
      region: "Argentina",
      flag: "ar",
      broadcasters: [
        {
          id: "tyc",
          name: "TyC Sports",
          type: "tv" as const,
          channels: ["TyC Sports", "TyC Sports 2"],
          cost: "Cable subscription",
          notes: "Primary Argentine coverage. Passionate local commentary."
        },
        {
          id: "tvp",
          name: "TV Pública",
          type: "tv" as const,
          channels: ["TV Pública Argentina"],
          cost: "Free over-the-air",
          notes: "National broadcaster with free coverage."
        }
      ]
    },
    {
      id: "brazil",
      region: "Brazil",
      flag: "br",
      broadcasters: [
        {
          id: "globo",
          name: "TV Globo",
          type: "tv" as const,
          channels: ["Globo", "SporTV"],
          cost: "Free (Globo) / Cable (SporTV)",
          notes: "Broadcasting World Cups since 1970. Most watched in Brazil."
        },
        {
          id: "cazetv",
          name: "CazéTV",
          type: "streaming" as const,
          channels: ["YouTube"],
          cost: "Free",
          notes: "All 104 matches on YouTube. Popular streamer Casimiro. Young audience favorite."
        }
      ]
    }
  ],
  international: [
    {
      id: "canada-french",
      region: "Canada (French)",
      flag: "ca",
      broadcasters: [
        {
          id: "rds",
          name: "RDS",
          type: "tv" as const,
          channels: ["RDS", "RDS2", "RDS Info"],
          cost: "Cable subscription",
          notes: "Exclusive French-language rights in Canada. All 104 matches."
        },
        {
          id: "rds-direct",
          name: "RDS Direct",
          type: "streaming" as const,
          channels: ["RDS Direct app"],
          cost: "$19.99/month",
          notes: "French streaming without cable subscription."
        }
      ]
    },
    {
      id: "germany",
      region: "Germany",
      flag: "de",
      broadcasters: [
        {
          id: "magenta",
          name: "MagentaTV",
          type: "streaming" as const,
          channels: ["MagentaTV app"],
          cost: "Subscription required",
          notes: "All 104 matches. Deutsche Telekom platform."
        },
        {
          id: "ard",
          name: "ARD",
          type: "tv" as const,
          channels: ["Das Erste", "ARD Mediathek"],
          cost: "Free",
          notes: "30 matches including German team games. Free streaming."
        },
        {
          id: "zdf",
          name: "ZDF",
          type: "tv" as const,
          channels: ["ZDF", "ZDF Mediathek"],
          cost: "Free",
          notes: "30 matches. Public broadcaster coverage."
        }
      ]
    },
    {
      id: "france",
      region: "France",
      flag: "fr",
      broadcasters: [
        {
          id: "tf1",
          name: "TF1",
          type: "tv" as const,
          channels: ["TF1", "TF1+"],
          cost: "Free over-the-air",
          notes: "Major free-to-air coverage. Streaming via TF1+."
        },
        {
          id: "m6",
          name: "M6",
          type: "tv" as const,
          channels: ["M6", "6play"],
          cost: "Free over-the-air",
          notes: "Additional free coverage. Stream on 6play platform."
        }
      ]
    },
    {
      id: "italy",
      region: "Italy",
      flag: "it",
      broadcasters: [
        {
          id: "rai",
          name: "RAI",
          type: "tv" as const,
          channels: ["Rai 1", "Rai Sport"],
          cost: "Free",
          notes: "Italian public broadcaster. Free streaming on RaiPlay."
        }
      ]
    },
    {
      id: "netherlands",
      region: "Netherlands",
      flag: "nl",
      broadcasters: [
        {
          id: "nos",
          name: "NOS",
          type: "tv" as const,
          channels: ["NPO 1", "NPO 3"],
          cost: "Free",
          notes: "Dutch public broadcaster. Free coverage for all matches."
        }
      ]
    },
    {
      id: "india",
      region: "India",
      flag: "in",
      broadcasters: [
        {
          id: "star",
          name: "Star Sports",
          type: "tv" as const,
          channels: ["Star Sports 1", "Star Sports Select"],
          cost: "Cable subscription",
          notes: "Confirmed broadcaster for India and subcontinent."
        },
        {
          id: "jiocinema",
          name: "JioCinema",
          type: "streaming" as const,
          channels: ["JioCinema app"],
          cost: "Free/Premium",
          notes: "Potential streaming partner. Check closer to tournament."
        }
      ]
    },
    {
      id: "japan",
      region: "Japan",
      flag: "jp",
      broadcasters: [
        {
          id: "nhk",
          name: "NHK",
          type: "tv" as const,
          channels: ["NHK General", "NHK BS"],
          cost: "Free",
          notes: "Japan's public broadcaster. All Japan matches on free TV."
        },
        {
          id: "abema",
          name: "ABEMA",
          type: "streaming" as const,
          channels: ["ABEMA app"],
          cost: "Free/Premium",
          notes: "Popular streaming platform. All matches expected."
        }
      ]
    },
    {
      id: "south-korea",
      region: "South Korea",
      flag: "🇰🇷",
      broadcasters: [
        {
          id: "tvj",
          name: "tvJ",
          type: "tv" as const,
          channels: ["SBS", "KBS", "MBC"],
          cost: "Free",
          notes: "Broadcast rights secured for 2026 and 2030."
        }
      ]
    },
    {
      id: "mena",
      region: "Middle East & North Africa",
      flag: "🌍",
      broadcasters: [
        {
          id: "bein",
          name: "beIN Sports",
          type: "tv" as const,
          channels: ["beIN Sports 1-3", "beIN Sports HD"],
          cost: "Subscription required",
          notes: "Primary broadcaster for MENA region. Arabic commentary."
        }
      ]
    },
    {
      id: "africa",
      region: "Sub-Saharan Africa",
      flag: "🌍",
      broadcasters: [
        {
          id: "supersport",
          name: "SuperSport",
          type: "tv" as const,
          channels: ["SuperSport Football", "SuperSport Blitz"],
          cost: "Subscription (DStv)",
          notes: "Primary broadcaster for Sub-Saharan Africa."
        },
        {
          id: "newworld",
          name: "New World TV",
          type: "streaming" as const,
          channels: ["New World TV app"],
          cost: "Varies by country",
          notes: "Alternative African coverage. Mobile-friendly."
        }
      ]
    }
  ],
  streamingTips: [
    "VPN may be needed to access home country coverage while traveling",
    "Download apps before arriving - some require verification",
    "Stadium WiFi will be limited - download content for offline viewing",
    "Most streaming services work on mobile, tablet, and smart TV",
    "Check time zones - matches will air at different times by city"
  ]
};

interface PrivateAirport {
  id: string;
  code: string;
  name: string;
  distance: string;
  fbos: string[];
  customs: boolean;
  notes: string;
}

interface PrivateCityData {
  id: string;
  city: string;
  country: string;
  flag: string;
  airports: PrivateAirport[];
  marinas?: {
    id: string;
    name: string;
    maxLength: string;
    features: string;
  }[];
}

const privateTransportData = {
  usaCities: [
    {
      id: "miami",
      city: "Miami",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "opf",
          code: "OPF",
          name: "Opa-Locka Executive Airport",
          distance: "15 mi from downtown",
          fbos: ["Signature Flight Support", "Atlantic Aviation"],
          customs: true,
          notes: "Preferred for private jets. Less congested than MIA. 24/7 CBP available."
        },
        {
          id: "mia-pvt",
          code: "MIA",
          name: "Miami International (Private Terminal)",
          distance: "In Miami proper",
          fbos: ["Signature Flight Support", "Tursair"],
          customs: true,
          notes: "Full CBP on-site. Higher traffic but convenient location."
        }
      ],
      marinas: [
        { id: "islandGardens", name: "Yacht Haven Grande (Island Gardens)", maxLength: "550ft (167m)", features: "Deep water, 50 superyacht berths, 24hr immigration, IGY managed" },
        { id: "oneIslandPark", name: "One Island Park", maxLength: "800ft (244m)", features: "100m+ yachts only, VIP concierge, fastest ocean access" },
        { id: "miamiBeachMarina", name: "Miami Beach Marina", maxLength: "250ft (76m)", features: "400 slips, near South Beach, no fixed bridges" }
      ]
    },
    {
      id: "new-york",
      city: "New York/New Jersey",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "teb",
          code: "TEB",
          name: "Teterboro Airport",
          distance: "12 mi from Manhattan",
          fbos: ["Signature", "Atlantic", "Meridian", "Jet Aviation"],
          customs: true,
          notes: "Premier NYC private jet airport. Nation's busiest GA field. Full CBP."
        },
        {
          id: "hpn",
          code: "HPN",
          name: "Westchester County Airport",
          distance: "35 mi north of Manhattan",
          fbos: ["Signature", "Million Air", "Ross Aviation"],
          customs: true,
          notes: "Second choice for Manhattan. Less traffic than Teterboro."
        }
      ],
      marinas: [
        { id: "libertyLanding", name: "Liberty Landing Marina", maxLength: "200ft", features: "Direct NYC skyline views, near MetLife Stadium" },
        { id: "northCove", name: "North Cove Marina", maxLength: "150ft", features: "Manhattan location, Financial District" }
      ]
    },
    {
      id: "los-angeles",
      city: "Los Angeles",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "vny",
          code: "VNY",
          name: "Van Nuys Airport",
          distance: "20 mi from downtown",
          fbos: ["Signature", "Atlantic", "Jet Aviation", "Castle & Cooke"],
          customs: true,
          notes: "World's busiest private jet airport. No commercial traffic. Full CBP."
        },
        {
          id: "lgb",
          code: "LGB",
          name: "Long Beach Airport",
          distance: "South of downtown LA",
          fbos: ["Signature", "Ross Aviation"],
          customs: true,
          notes: "Avoids LAX traffic. Popular alternative with full services."
        },
        {
          id: "smo",
          code: "SMO",
          name: "Santa Monica Airport",
          distance: "3 mi from Beverly Hills",
          fbos: ["Atlantic Aviation"],
          customs: false,
          notes: "Intimate, discreet. Limited to smaller jets. No on-site CBP."
        }
      ],
      marinas: [
        { id: "marinaDelRey", name: "Marina del Rey", maxLength: "Variable", features: "Large recreational marina, some superyacht capacity" },
        { id: "longBeachMarina", name: "Long Beach Marina", maxLength: "100ft+", features: "Near convention center, protected harbor" }
      ]
    },
    {
      id: "dallas",
      city: "Dallas",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "dal",
          code: "DAL",
          name: "Dallas Love Field",
          distance: "8 mi from downtown",
          fbos: ["Signature", "Atlantic", "Business Jet Center"],
          customs: true,
          notes: "One of busiest private jet airports in US. Full CBP services."
        },
        {
          id: "ads",
          code: "ADS",
          name: "Addison Airport",
          distance: "North of downtown",
          fbos: ["Million Air", "Atlantic"],
          customs: false,
          notes: "Ideal for North Dallas. High-end FBOs. No on-site CBP."
        },
        {
          id: "dfw-pvt",
          code: "DFW",
          name: "DFW International (Private Terminal)",
          distance: "Between Dallas/Fort Worth",
          fbos: ["Signature", "Business Jet Center"],
          customs: true,
          notes: "Major hub with private terminals. Full international clearance."
        }
      ]
    },
    {
      id: "houston",
      city: "Houston",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "hou",
          code: "HOU",
          name: "William P. Hobby Airport",
          distance: "7 mi from downtown",
          fbos: ["Signature", "Jet Aviation", "Wilson Air", "Atlantic", "Million Air"],
          customs: true,
          notes: "Top-ranked private jet airport. Closest to NRG Stadium. Full CBP."
        },
        {
          id: "iah-pvt",
          code: "IAH",
          name: "George Bush Intercontinental (Private)",
          distance: "North of Houston",
          fbos: ["Signature", "Atlantic"],
          customs: true,
          notes: "Major international hub. Full-service private terminals."
        }
      ]
    },
    {
      id: "atlanta",
      city: "Atlanta",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "pdk",
          code: "PDK",
          name: "DeKalb-Peachtree Airport",
          distance: "12 mi NE of downtown",
          fbos: ["Signature", "Atlantic", "Epps Aviation"],
          customs: false,
          notes: "Preferred for private jets. 600+ daily operations. No CBP - clear at ATL first."
        },
        {
          id: "atl-pvt",
          code: "ATL",
          name: "Hartsfield-Jackson (Private Terminal)",
          distance: "7 mi south of downtown",
          fbos: ["Signature Flight Support"],
          customs: true,
          notes: "World's busiest airport. Full CBP. Longer taxi times."
        }
      ]
    },
    {
      id: "boston",
      city: "Boston",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "bed",
          code: "BED",
          name: "Hanscom Field",
          distance: "15 mi NW of downtown",
          fbos: ["Signature", "Jet Aviation", "Rectrix Aviation"],
          customs: false,
          notes: "Premier private jet airport. Less congestion than Logan."
        },
        {
          id: "bos-pvt",
          code: "BOS",
          name: "Boston Logan (Private Terminal)",
          distance: "3 mi from downtown",
          fbos: ["Signature Flight Support"],
          customs: true,
          notes: "Full CBP on-site. Only FBO at Logan. Convenient city access."
        }
      ]
    },
    {
      id: "seattle",
      city: "Seattle",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "bfi",
          code: "BFI",
          name: "Boeing Field / King County",
          distance: "5 mi from downtown",
          fbos: ["Signature", "Clay Lacy", "Galvin Flying"],
          customs: true,
          notes: "Primary private aviation airport. Full CBP. Close to downtown."
        },
        {
          id: "sea-pvt",
          code: "SEA",
          name: "Seattle-Tacoma (Private Terminal)",
          distance: "14 mi south of downtown",
          fbos: ["Signature Flight Support"],
          customs: true,
          notes: "Major international hub. Full services but busy commercial traffic."
        }
      ],
      marinas: [
        { id: "emeraldLanding", name: "Emerald Landing", maxLength: "360ft (109m)", features: "Lake Union, freshwater, downtown access" },
        { id: "elliottBay", name: "Elliott Bay Marina", maxLength: "300ft", features: "Gated, secure, minutes from downtown" },
        { id: "bellHarbor", name: "Bell Harbor Marina", maxLength: "100ft+", features: "Only downtown Seattle marina, 24hr security" }
      ]
    },
    {
      id: "philadelphia",
      city: "Philadelphia",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "pne",
          code: "PNE",
          name: "Northeast Philadelphia Airport",
          distance: "10 mi NE of downtown",
          fbos: ["Atlantic Aviation"],
          customs: false,
          notes: "Primary private jet airport for Philly. No CBP on-site."
        },
        {
          id: "phl-pvt",
          code: "PHL",
          name: "Philadelphia International (Private)",
          distance: "7 mi SW of downtown",
          fbos: ["Atlantic Aviation"],
          customs: true,
          notes: "Full CBP services. Commercial traffic can cause delays."
        }
      ]
    },
    {
      id: "san-francisco",
      city: "San Francisco Bay Area",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "sql",
          code: "SQL",
          name: "San Carlos Airport",
          distance: "25 mi south of SF",
          fbos: ["Signature Flight Support"],
          customs: false,
          notes: "Popular Silicon Valley airport. No on-site CBP."
        },
        {
          id: "sjc-pvt",
          code: "SJC",
          name: "San Jose International (Private)",
          distance: "Near Levi's Stadium",
          fbos: ["Signature", "Atlantic"],
          customs: true,
          notes: "Closest major airport to stadium. Full CBP on-site."
        },
        {
          id: "oak-pvt",
          code: "OAK",
          name: "Oakland International (Private)",
          distance: "Across bay from SF",
          fbos: ["Signature Flight Support"],
          customs: true,
          notes: "Full international clearance. Less traffic than SFO."
        }
      ]
    },
    {
      id: "kansas-city",
      city: "Kansas City",
      country: "USA",
      flag: "us",
      airports: [
        {
          id: "mkc",
          code: "MKC",
          name: "Charles B. Wheeler Downtown Airport",
          distance: "Downtown KC",
          fbos: ["Signature Flight Support"],
          customs: false,
          notes: "Closest to Arrowhead Stadium. General aviation focused."
        },
        {
          id: "mci-pvt",
          code: "MCI",
          name: "Kansas City International (Private)",
          distance: "15 mi NW of downtown",
          fbos: ["Signature Flight Support"],
          customs: true,
          notes: "Full CBP services. Primary international entry point."
        }
      ]
    }
  ],
  mexicoCities: [
    {
      id: "mexico-city",
      city: "Mexico City",
      country: "Mexico",
      flag: "mx",
      airports: [
        {
          id: "tlc",
          code: "TLC/MMTO",
          name: "Toluca International Airport",
          distance: "40-60 km from city center",
          fbos: ["Jetex", "18+ FBO providers"],
          customs: true,
          notes: "REQUIRED for private jets (MEX doesn't accept private). 70%+ of Mexico's private jets use this. On-site CIQ."
        }
      ]
    },
    {
      id: "guadalajara",
      city: "Guadalajara",
      country: "Mexico",
      flag: "mx",
      airports: [
        {
          id: "gdl",
          code: "GDL/MMGL",
          name: "Guadalajara International Airport",
          distance: "Central location",
          fbos: ["Aerotron", "Multiple FBOs"],
          customs: true,
          notes: "Large FBO facilities. On-site customs. 24/7 private aviation support."
        }
      ]
    },
    {
      id: "monterrey",
      city: "Monterrey",
      country: "Mexico",
      flag: "mx",
      airports: [
        {
          id: "ntr",
          code: "NTR/MMAN",
          name: "Del Norte International Airport",
          distance: "23 km north of city",
          fbos: ["ExecuJet", "10+ FBO providers"],
          customs: true,
          notes: "Preferred for private aviation. VIP terminals. 24/7 service."
        },
        {
          id: "mty",
          code: "MTY/MMMY",
          name: "Monterrey International Airport",
          distance: "30 km east of city",
          fbos: ["Multiple FBOs"],
          customs: true,
          notes: "International connections. Separate private aviation terminals."
        }
      ]
    }
  ],
  canadaCities: [
    {
      id: "toronto",
      city: "Toronto",
      country: "Canada",
      flag: "ca",
      airports: [
        {
          id: "yyz-pvt",
          code: "YYZ",
          name: "Toronto Pearson (Private Terminal)",
          distance: "27 km from downtown",
          fbos: ["Skyservice", "Avitat"],
          customs: true,
          notes: "Full CBSA services. Canada's busiest airport. Private terminals available."
        },
        {
          id: "ykz",
          code: "YKZ",
          name: "Buttonville Municipal Airport",
          distance: "North of Toronto",
          fbos: ["Multiple GA FBOs"],
          customs: false,
          notes: "General aviation. Clear customs at Pearson first."
        }
      ]
    },
    {
      id: "vancouver",
      city: "Vancouver",
      country: "Canada",
      flag: "ca",
      airports: [
        {
          id: "yvr-pvt",
          code: "YVR",
          name: "Vancouver International (Private)",
          distance: "12 km from downtown",
          fbos: ["Landmark Aviation", "Avitat"],
          customs: true,
          notes: "Full CBSA services. South Terminal for GA. Beautiful approach."
        }
      ]
    }
  ],
  customsRequirements: {
    usa: {
      title: "US Private Aircraft Customs",
      requirements: [
        { id: "eapis", item: "eAPIS Manifest", desc: "Submit via CBP eAPIS system before departure. Include all passenger/crew info." },
        { id: "decal", item: "User Fee Decal", desc: "Annual CBP Private Aircraft Decal required. Purchase via DTOPS ($29.96/year)." },
        { id: "permission", item: "Permission to Land", desc: "Contact destination CBP port before departure from foreign area." },
        { id: "airports", item: "Designated Airports", desc: "381 airports accept private international arrivals. Verify your destination." },
        { id: "preclearance", item: "Preclearance Option", desc: "Available in Shannon (Ireland) and Aruba for faster US entry." }
      ]
    },
    yacht: {
      title: "US Yacht Customs",
      requirements: [
        { id: "report", item: "Report Within 24 Hours", desc: "All yachts arriving from foreign ports must report via CBP ROAM app or phone." },
        { id: "qFlag", item: "Q Flag Required", desc: "Fly yellow quarantine flag when entering 12-mile territorial waters until cleared." },
        { id: "stayOnboard", item: "Stay Onboard", desc: "No one may leave or board until customs processing is complete." },
        { id: "uscg", item: "USCG Notification", desc: "Foreign yachts over 300 gross tons must notify USCG 96 hours before arrival." },
        { id: "cruisingLicense", item: "Cruising License", desc: "Foreign-flagged yachts from certain countries can get 1-year cruising license." },
        { id: "dtops", item: "DTOPS Decal", desc: "Required for boats 30+ feet. Purchase annually ($29.96)." }
      ]
    },
    mexico: {
      title: "Mexico Private Aircraft",
      requirements: [
        { id: "apis", item: "Mexican APIS", desc: "Advance Passenger Information required for all private flights." },
        { id: "permits", item: "Single-Entry Permits", desc: "Now required (no more annual authorization). Plan 10+ business days lead time." },
        { id: "insurance", item: "Insurance Match", desc: "Aircraft make/model/serial/tail must exactly match registration." },
        { id: "restrictions", item: "Airport Restrictions", desc: "Private jets restricted to designated airports (MEX closed to private)." }
      ]
    },
    canada: {
      title: "Canada Private Aircraft",
      requirements: [
        { id: "apis", item: "Canadian APIS", desc: "Required for international arrivals to Canada." },
        { id: "canpass", item: "CANPASS", desc: "CANPASS Private Aircraft program available for expedited clearance." },
        { id: "cbsa", item: "CBSA Notification", desc: "Advance customs arrangements required through FBO/handler." }
      ]
    }
  },
  tips: [
    "Book FBO slots early during World Cup - demand will be extremely high",
    "Helicopter transfers available from most major airports to stadiums",
    "Mexico City private jets MUST use Toluca (TLC), not MEX airport",
    "Yacht berths in Miami will be premium - book 6+ months ahead",
    "Consider fractional jet programs if you don't own - NetJets, Flexjet, VistaJet",
    "All 3 host countries require advance passenger manifests (APIS/eAPIS)"
  ]
};

interface Consulate {
  country: string;
  flag: string;
  phone: string;
  address: string;
  emergency?: string;
}

interface CityConsulates {
  id: string;
  city: string;
  country: string;
  consulates: Consulate[];
}

const consulatesData: CityConsulates[] = [
  {
    id: "new-york",
    city: "New York / New Jersey",
    country: "USA",
    consulates: [
      { country: "Argentina", flag: "ar", phone: "+1 212-603-0400", address: "12 W 56th St, New York, NY" },
      { country: "Brazil", flag: "br", phone: "+1 917-777-7777", address: "225 E 41st St, New York, NY" },
      { country: "Canada", flag: "ca", phone: "+1 212-596-1628", address: "466 Lexington Ave, New York, NY" },
      { country: "France", flag: "fr", phone: "+1 212-606-3600", address: "934 Fifth Ave, New York, NY" },
      { country: "Germany", flag: "de", phone: "+1 212-610-9700", address: "871 United Nations Plaza, New York, NY" },
      { country: "India", flag: "in", phone: "+1 212-774-0600", address: "3 E 64th St, New York, NY" },
      { country: "Japan", flag: "jp", phone: "+1 212-371-8222", address: "299 Park Ave, New York, NY" },
      { country: "Mexico", flag: "mx", phone: "+1 212-217-6400", address: "27 E 39th St, New York, NY" },
      { country: "South Korea", flag: "🇰🇷", phone: "+1 646-674-6000", address: "460 Park Ave, New York, NY" },
      { country: "Spain", flag: "es", phone: "+1 212-355-4080", address: "150 E 58th St, New York, NY" },
      { country: "United Kingdom", flag: "gb", phone: "+1 212-745-0200", address: "885 Second Ave, New York, NY" }
    ]
  },
  {
    id: "los-angeles",
    city: "Los Angeles",
    country: "USA",
    consulates: [
      { country: "Argentina", flag: "ar", phone: "+1 323-954-9155", address: "5055 Wilshire Blvd, Los Angeles, CA" },
      { country: "Brazil", flag: "br", phone: "+1 323-651-2664", address: "8484 Wilshire Blvd, Beverly Hills, CA" },
      { country: "Canada", flag: "ca", phone: "+1 213-346-2700", address: "550 S Hope St, Los Angeles, CA" },
      { country: "China", flag: "cn", phone: "+1 213-807-8088", address: "443 Shatto Place, Los Angeles, CA" },
      { country: "France", flag: "fr", phone: "+1 310-235-3200", address: "10390 Santa Monica Blvd, Los Angeles, CA" },
      { country: "Germany", flag: "de", phone: "+1 323-930-2703", address: "6222 Wilshire Blvd, Los Angeles, CA" },
      { country: "Japan", flag: "jp", phone: "+1 213-617-6700", address: "350 S Grand Ave, Los Angeles, CA" },
      { country: "Mexico", flag: "mx", phone: "+1 213-351-6800", address: "2401 W 6th St, Los Angeles, CA" },
      { country: "South Korea", flag: "🇰🇷", phone: "+1 213-385-9300", address: "3243 Wilshire Blvd, Los Angeles, CA" },
      { country: "United Kingdom", flag: "gb", phone: "+1 310-789-0031", address: "2029 Century Park East, Los Angeles, CA" }
    ]
  },
  {
    id: "miami",
    city: "Miami",
    country: "USA",
    consulates: [
      { country: "Argentina", flag: "ar", phone: "+1 305-373-1889", address: "1101 Brickell Ave, Miami, FL" },
      { country: "Brazil", flag: "br", phone: "+1 305-285-6200", address: "80 SW 8th St, Miami, FL" },
      { country: "Canada", flag: "ca", phone: "+1 305-579-1600", address: "200 S Biscayne Blvd, Miami, FL" },
      { country: "Colombia", flag: "🇨🇴", phone: "+1 305-441-1235", address: "280 Aragon Ave, Coral Gables, FL" },
      { country: "France", flag: "fr", phone: "+1 305-403-4150", address: "1395 Brickell Ave, Miami, FL" },
      { country: "Germany", flag: "de", phone: "+1 305-358-0290", address: "100 N Biscayne Blvd, Miami, FL" },
      { country: "Mexico", flag: "mx", phone: "+1 786-268-4900", address: "1399 SW 1st Ave, Miami, FL" },
      { country: "Spain", flag: "es", phone: "+1 305-446-5511", address: "2655 Le Jeune Rd, Coral Gables, FL" },
      { country: "United Kingdom", flag: "gb", phone: "+1 305-400-6400", address: "1001 Brickell Bay Dr, Miami, FL" }
    ]
  },
  {
    id: "houston",
    city: "Houston",
    country: "USA",
    consulates: [
      { country: "Argentina", flag: "ar", phone: "+1 713-871-8935", address: "3050 Post Oak Blvd, Houston, TX" },
      { country: "Brazil", flag: "br", phone: "+1 713-961-3063", address: "1233 West Loop South, Houston, TX" },
      { country: "Canada", flag: "ca", phone: "+1 832-327-0854", address: "5847 San Felipe St, Houston, TX" },
      { country: "China", flag: "cn", phone: "+1 713-520-1462", address: "3417 Montrose Blvd, Houston, TX" },
      { country: "France", flag: "fr", phone: "+1 713-572-2799", address: "777 Post Oak Blvd, Houston, TX" },
      { country: "Germany", flag: "de", phone: "+1 713-627-7770", address: "1330 Post Oak Blvd, Houston, TX" },
      { country: "India", flag: "in", phone: "+1 713-626-2148", address: "4300 Scotland St, Houston, TX" },
      { country: "Japan", flag: "jp", phone: "+1 713-652-2977", address: "909 Fannin St, Houston, TX" },
      { country: "Mexico", flag: "mx", phone: "+1 713-271-6800", address: "4507 San Jacinto St, Houston, TX" },
      { country: "Nigeria", flag: "🇳🇬", phone: "+1 713-839-1300", address: "8060 Park Place Blvd, Houston, TX" },
      { country: "United Kingdom", flag: "gb", phone: "+1 713-659-6270", address: "1000 Louisiana St, Houston, TX" }
    ]
  },
  {
    id: "dallas",
    city: "Dallas",
    country: "USA",
    consulates: [
      { country: "Canada", flag: "ca", phone: "+1 214-922-9806", address: "500 N Akard St, Dallas, TX" },
      { country: "France", flag: "fr", phone: "+1 214-978-3260", address: "5060 Tennyson Pkwy, Plano, TX" },
      { country: "Germany", flag: "de", phone: "+1 469-257-8456", address: "1600 Pacific Ave, Dallas, TX" },
      { country: "Japan", flag: "jp", phone: "+1 214-780-1400", address: "2717 Harwood St, Dallas, TX" },
      { country: "Mexico", flag: "mx", phone: "+1 214-932-8670", address: "1210 River Bend Dr, Dallas, TX" },
      { country: "South Korea", flag: "🇰🇷", phone: "+1 972-960-7511", address: "2801 Spring Valley Rd, Dallas, TX" }
    ]
  },
  {
    id: "atlanta",
    city: "Atlanta",
    country: "USA",
    consulates: [
      { country: "Brazil", flag: "br", phone: "+1 404-949-2400", address: "3500 Lenox Rd NE, Atlanta, GA" },
      { country: "Canada", flag: "ca", phone: "+1 404-532-2000", address: "1175 Peachtree St NE, Atlanta, GA" },
      { country: "France", flag: "fr", phone: "+1 404-495-1600", address: "3399 Peachtree Rd NE, Atlanta, GA" },
      { country: "Germany", flag: "de", phone: "+1 404-905-0000", address: "285 Peachtree Center Ave NE, Atlanta, GA" },
      { country: "Greece", flag: "🇬🇷", phone: "+1 404-261-3313", address: "3340 Peachtree Rd NE, Atlanta, GA" },
      { country: "India", flag: "in", phone: "+1 404-963-5902", address: "5549 Glenridge Dr, Atlanta, GA" },
      { country: "Japan", flag: "jp", phone: "+1 404-240-4300", address: "3438 Peachtree Rd NE, Atlanta, GA" },
      { country: "Mexico", flag: "mx", phone: "+1 404-266-1913", address: "1700 Chantilly Dr NE, Atlanta, GA" },
      { country: "South Korea", flag: "🇰🇷", phone: "+1 404-522-1611", address: "229 Peachtree St NE, Atlanta, GA" },
      { country: "Switzerland", flag: "🇨🇭", phone: "+1 404-870-2000", address: "1349 W Peachtree St NW, Atlanta, GA" }
    ]
  },
  {
    id: "seattle",
    city: "Seattle",
    country: "USA",
    consulates: [
      { country: "Canada", flag: "ca", phone: "+1 206-443-1777", address: "1501 4th Ave, Seattle, WA" },
      { country: "India", flag: "in", phone: "+1 206-803-0400", address: "1015 2nd Ave, Seattle, WA" },
      { country: "Japan", flag: "jp", phone: "+1 206-682-9107", address: "701 Pike St, Seattle, WA" },
      { country: "Mexico", flag: "mx", phone: "+1 206-448-3526", address: "807 E Roy St, Seattle, WA" },
      { country: "South Korea", flag: "🇰🇷", phone: "+1 206-441-1011", address: "115 W Mercer St, Seattle, WA" }
    ]
  },
  {
    id: "san-francisco",
    city: "San Francisco Bay Area",
    country: "USA",
    consulates: [
      { country: "Argentina", flag: "ar", phone: "+1 415-982-3050", address: "580 California St, San Francisco, CA" },
      { country: "Brazil", flag: "br", phone: "+1 415-981-8170", address: "300 Montgomery St, San Francisco, CA" },
      { country: "Canada", flag: "ca", phone: "+1 415-834-3180", address: "580 California St, San Francisco, CA" },
      { country: "China", flag: "cn", phone: "+1 415-852-5900", address: "1450 Laguna St, San Francisco, CA" },
      { country: "France", flag: "fr", phone: "+1 415-397-4330", address: "88 Kearny St, San Francisco, CA" },
      { country: "Germany", flag: "de", phone: "+1 415-775-1061", address: "1960 Jackson St, San Francisco, CA" },
      { country: "Japan", flag: "jp", phone: "+1 415-780-6000", address: "275 Battery St, San Francisco, CA" },
      { country: "Mexico", flag: "mx", phone: "+1 415-354-1700", address: "532 Folsom St, San Francisco, CA" },
      { country: "South Korea", flag: "🇰🇷", phone: "+1 415-921-2251", address: "3500 Clay St, San Francisco, CA" }
    ]
  },
  {
    id: "philadelphia",
    city: "Philadelphia",
    country: "USA",
    consulates: [
      { country: "France", flag: "fr", phone: "+1 267-404-3050", address: "205 N 4th St, Philadelphia, PA" },
      { country: "Germany", flag: "de", phone: "+1 215-931-8200", address: "1500 Market St, Philadelphia, PA" },
      { country: "Italy", flag: "it", phone: "+1 215-592-7329", address: "100 S Broad St, Philadelphia, PA" },
      { country: "Mexico", flag: "mx", phone: "+1 215-922-4262", address: "111 S Independence Mall E, Philadelphia, PA" }
    ]
  },
  {
    id: "boston",
    city: "Boston",
    country: "USA",
    consulates: [
      { country: "Brazil", flag: "br", phone: "+1 617-542-4000", address: "175 Purchase St, Boston, MA" },
      { country: "Canada", flag: "ca", phone: "+1 617-247-5100", address: "3 Copley Place, Boston, MA" },
      { country: "France", flag: "fr", phone: "+1 617-832-4400", address: "31 St James Ave, Boston, MA" },
      { country: "Germany", flag: "de", phone: "+1 617-369-4900", address: "3 Copley Place, Boston, MA" },
      { country: "Ireland", flag: "🇮🇪", phone: "+1 617-267-9330", address: "535 Boylston St, Boston, MA" },
      { country: "Japan", flag: "jp", phone: "+1 617-973-9772", address: "600 Atlantic Ave, Boston, MA" },
      { country: "Mexico", flag: "mx", phone: "+1 617-426-4181", address: "20 Park Plaza, Boston, MA" },
      { country: "United Kingdom", flag: "gb", phone: "+1 617-245-4500", address: "1 Broadway, Cambridge, MA" }
    ]
  },
  {
    id: "kansas-city",
    city: "Kansas City",
    country: "USA",
    consulates: [
      { country: "Canada", flag: "ca", phone: "+1 913-905-1585", address: "10555 Marty St, Overland Park, KS" },
      { country: "Mexico", flag: "mx", phone: "+1 816-556-0800", address: "1617 Baltimore Ave, Kansas City, MO" }
    ]
  },
  {
    id: "mexico-city",
    city: "Mexico City",
    country: "Mexico",
    consulates: [
      { country: "United States", flag: "us", phone: "+52 55 5080 2000", address: "Paseo de la Reforma 305, Col. Cuauhtémoc", emergency: "+52 55 5080 2000" },
      { country: "Canada", flag: "ca", phone: "+52 55 5724 7900", address: "Calle Schiller 529, Col. Polanco" },
      { country: "United Kingdom", flag: "gb", phone: "+52 55 1670 3200", address: "Rio Lerma 71, Col. Cuauhtémoc" },
      { country: "Germany", flag: "de", phone: "+52 55 5283 2200", address: "Horacio 1506, Col. Los Morales" },
      { country: "France", flag: "fr", phone: "+52 55 9171 9700", address: "Campos Elíseos 339, Col. Polanco" },
      { country: "Spain", flag: "es", phone: "+52 55 5242 0031", address: "Galileo 114, Col. Polanco" },
      { country: "Argentina", flag: "ar", phone: "+52 55 5520 9430", address: "Av. Pres. Masaryk 29, Col. Polanco" },
      { country: "Brazil", flag: "br", phone: "+52 55 5201 4553", address: "Lope de Armendáriz 130, Col. Lomas Virreyes" },
      { country: "Japan", flag: "jp", phone: "+52 55 5211 0028", address: "Paseo de la Reforma 243, Col. Cuauhtémoc" }
    ]
  },
  {
    id: "guadalajara",
    city: "Guadalajara",
    country: "Mexico",
    consulates: [
      { country: "United States", flag: "us", phone: "+52 33 3111 7800", address: "Manuel Acuña 3410, Col. Monraz", emergency: "+1 844-528-6611" },
      { country: "Canada", flag: "ca", phone: "+52 33 1818 2090", address: "World Trade Center, Av. Mariano Otero 1249" },
      { country: "Germany", flag: "de", phone: "+52 33 3616 6218", address: "Av. Américas 999, Col. Providencia" },
      { country: "Spain", flag: "es", phone: "+52 33 3630 0450", address: "Paseo Royal Country 4596, Col. Royal Country" }
    ]
  },
  {
    id: "monterrey",
    city: "Monterrey",
    country: "Mexico",
    consulates: [
      { country: "United States", flag: "us", phone: "+52 81 8047 3100", address: "Av. Alfonso Reyes 150, Col. Valle Poniente, Santa Catarina", emergency: "+52 55 5080 2000" },
      { country: "Canada", flag: "ca", phone: "+52 81 8344 3200", address: "Torre Comercial América, Av. Vasconcelos 335" },
      { country: "Germany", flag: "de", phone: "+52 81 8335 6098", address: "Calzada del Valle 255, Col. Del Valle" },
      { country: "Japan", flag: "jp", phone: "+52 81 8478 4700", address: "Av. Lázaro Cárdenas 2400, Col. Residencial San Agustín" }
    ]
  },
  {
    id: "toronto",
    city: "Toronto",
    country: "Canada",
    consulates: [
      { country: "United States", flag: "us", phone: "+1 416-595-1700", address: "360 University Ave, Toronto, ON" },
      { country: "United Kingdom", flag: "gb", phone: "+1 416-593-1290", address: "777 Bay St, Toronto, ON" },
      { country: "France", flag: "fr", phone: "+1 416-847-1900", address: "2 Bloor St E, Toronto, ON" },
      { country: "Germany", flag: "de", phone: "+1 416-925-2813", address: "2 Bloor St E, Toronto, ON" },
      { country: "India", flag: "in", phone: "+1 416-960-0751", address: "365 Bloor St E, Toronto, ON" },
      { country: "Japan", flag: "jp", phone: "+1 416-363-7038", address: "77 King St W, Toronto, ON" },
      { country: "Mexico", flag: "mx", phone: "+1 416-368-2875", address: "11 King St W, Toronto, ON" },
      { country: "Brazil", flag: "br", phone: "+1 416-922-2503", address: "77 Bloor St W, Toronto, ON" },
      { country: "South Korea", flag: "🇰🇷", phone: "+1 416-920-3809", address: "555 Avenue Rd, Toronto, ON" }
    ]
  },
  {
    id: "vancouver",
    city: "Vancouver",
    country: "Canada",
    consulates: [
      { country: "United States", flag: "us", phone: "+1 604-685-4311", address: "1075 W Pender St, Vancouver, BC" },
      { country: "United Kingdom", flag: "gb", phone: "+1 604-683-4421", address: "1111 Melville St, Vancouver, BC" },
      { country: "France", flag: "fr", phone: "+1 604-681-4345", address: "1130 W Pender St, Vancouver, BC" },
      { country: "Germany", flag: "de", phone: "+1 604-684-8377", address: "999 Canada Pl, Vancouver, BC" },
      { country: "India", flag: "in", phone: "+1 604-662-8811", address: "325 Howe St, Vancouver, BC" },
      { country: "Japan", flag: "jp", phone: "+1 604-684-5868", address: "900-1177 W Hastings St, Vancouver, BC" },
      { country: "Mexico", flag: "mx", phone: "+1 604-684-3547", address: "1177 W Hastings St, Vancouver, BC" },
      { country: "South Korea", flag: "🇰🇷", phone: "+1 604-681-9581", address: "1090 W Georgia St, Vancouver, BC" },
      { country: "Philippines", flag: "🇵🇭", phone: "+1 604-685-1619", address: "999 Canada Pl, Vancouver, BC" },
      { country: "Australia", flag: "au", phone: "+1 604-694-6160", address: "1075 W Georgia St, Vancouver, BC" }
    ]
  }
];

const customsDataKeys = {
  visaRequirements: ["esta", "b1b2", "fifa-pass"],
  firstPointOfEntrySteps: 5,
  additionalInfo: ["customs-declaration", "duty-free", "cash-declaration", "food-restrictions", "global-entry"]
};

export default function CriticalInfo() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language || 'en';
  const [activeCategory, setActiveCategory] = useState<InfoCategory>("safety");
  const [activeTravelCategory, setActiveTravelCategory] = useState<TravelCategory>("travel-entry");
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"info" | "travel" | "medical">("info");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [expandedSafeArea, setExpandedSafeArea] = useState<string | null>(null);
  const [selectedMedicalCity, setSelectedMedicalCity] = useState<CityMedicalData | null>(null);
  const [facilityFilter, setFacilityFilter] = useState<"all" | "er" | "urgent">("all");
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen));
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories: { id: InfoCategory; labelKey: string; icon: any; available: boolean }[] = [
    { id: "safety", labelKey: "criticalInfo.categories.safety", icon: Shield, available: true },
    { id: "emergency", labelKey: "criticalInfo.categories.emergency", icon: Phone, available: true },
    { id: "financial", labelKey: "criticalInfo.categories.financial", icon: DollarSign, available: true },
    { id: "legal", labelKey: "criticalInfo.categories.legal", icon: Scale, available: true },
    { id: "daily", labelKey: "criticalInfo.categories.dailyLife", icon: Sun, available: true },
    { id: "religious", labelKey: "criticalInfo.categories.religiousServices", icon: Church, available: true },
  ];

  const travelCategories: { id: TravelCategory; labelKey: string; icon: any; available: boolean }[] = [
    { id: "travel-entry", labelKey: "criticalInfo.travelCategories.travelEntry", icon: Stamp, available: true },
    { id: "travel-safety", labelKey: "criticalInfo.travelCategories.safety", icon: ShieldCheck, available: true },
    { id: "prohibited", labelKey: "criticalInfo.travelCategories.prohibited", icon: Ban, available: true },
    { id: "tvguide", labelKey: "criticalInfo.travelCategories.tvguide", icon: Tv, available: true },
    { id: "transport", labelKey: "criticalInfo.travelCategories.transport", icon: Plane, available: true },
  ];

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  return (
    <Layout pageTitle="nav.essentialGuide">
      <div className="pt-12 px-6 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <h1 className="text-3xl font-display font-bold text-white">{t("criticalInfo.title")}</h1>
        </div>

        <p className="text-muted-foreground mb-4">
          {t("criticalInfo.subtitle")}
        </p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setViewMode("info")}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === "info" 
                ? "bg-primary text-primary-foreground" 
                : "bg-card text-muted-foreground hover:text-white"
            }`}
            data-testid="tab-info"
          >
            {t("criticalInfo.viewModes.generalInfo")}
          </button>
          <button
            onClick={() => setViewMode("travel")}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === "travel" 
                ? "bg-primary text-primary-foreground" 
                : "bg-card text-muted-foreground hover:text-white"
            }`}
            data-testid="tab-travel"
          >
            {t("criticalInfo.viewModes.travelEntry")}
          </button>
          <button
            onClick={() => setViewMode("medical")}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              viewMode === "medical" 
                ? "bg-red-500 text-white" 
                : "bg-card text-muted-foreground hover:text-white"
            }`}
            data-testid="tab-medical"
          >
            {t("criticalInfo.viewModes.medical")}
          </button>
        </div>

        {viewMode === "info" && (
          <>
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 -mx-6 px-6 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => cat.available && setActiveCategory(cat.id)}
                  disabled={!cat.available}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-red-500 text-white"
                      : cat.available 
                        ? "bg-card text-muted-foreground hover:text-white"
                        : "bg-card/50 text-muted-foreground/50 cursor-not-allowed"
                  }`}
                  data-testid={`category-${cat.id}`}
                >
                  <cat.icon className="w-4 h-4" />
                  {t(cat.labelKey)}
                  {!cat.available && <span className="text-[10px] ml-1">(Soon)</span>}
                </button>
              ))}
            </div>

            {activeCategory === "safety" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl font-display font-bold text-white">{t("criticalInfo.safetySection.title")}</h2>
                </div>

                {["unsafeNeighborhoods", "followHomeRobberies", "pickpocketing", "ticketScams", "carBreakIns", "heatWarning"].map((cardId) => (
                  <div 
                    key={cardId}
                    className="bg-gradient-to-br from-amber-900/20 to-amber-950/30 border border-amber-500/20 rounded-2xl overflow-hidden"
                    data-testid={`safety-card-${cardId}`}
                  >
                    <button
                      onClick={() => toggleCard(cardId)}
                      className="w-full p-4 text-left flex items-start justify-between"
                      data-testid={`toggle-${cardId}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-5 h-5 rounded-full border-2 border-amber-400/50 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                          </div>
                          <h3 className="font-bold text-white">{t(`criticalInfo.safetySection.${cardId}.title`)}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground ml-7">{t(`criticalInfo.safetySection.${cardId}.description`)}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 mt-1">
                        <span className="text-xs text-amber-400 font-medium">{t("criticalInfo.solution")}</span>
                        {expandedCards.has(cardId) ? (
                          <ChevronUp className="w-5 h-5 text-amber-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                    </button>

                    {expandedCards.has(cardId) && (
                      <div className="px-4 pb-4">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 ml-7">
                          <div className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2">
                            {t("criticalInfo.preventionTips")}
                          </div>
                          <p className="text-sm text-amber-100/80">{t(`criticalInfo.safetySection.${cardId}.tips`)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeCategory === "emergency" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-display font-bold text-white">{t("criticalInfo.emergencySection.title")}</h2>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{t("criticalInfo.emergencySection.subtitle")}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">{t("criticalInfo.emergencySection.healthEmergency")}</h3>
                  </div>
                  <div className="space-y-3">
                    {["911", "988", "311", "medicalLocator"].map((itemId) => (
                      <div 
                        key={itemId}
                        className="bg-card border border-white/5 rounded-xl p-4"
                        data-testid={`emergency-card-${itemId}`}
                      >
                        <h4 className="font-bold text-white mb-1">{t(`criticalInfo.emergencySection.${itemId}.title`)}</h4>
                        <p className="text-sm text-muted-foreground">{t(`criticalInfo.emergencySection.${itemId}.description`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCategory === "financial" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">{t("criticalInfo.financialSection.title")}</h3>
                  </div>
                  <div className="space-y-3">
                    {["tipping", "salesTax", "creditHolds"].map((itemId) => (
                      <div 
                        key={itemId}
                        className="bg-card border border-white/5 rounded-xl p-4"
                        data-testid={`financial-card-${itemId}`}
                      >
                        <h4 className="font-bold text-white mb-1">{t(`criticalInfo.financialSection.${itemId}.title`)}</h4>
                        <p className="text-sm text-muted-foreground">{t(`criticalInfo.financialSection.${itemId}.description`)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <CurrencyConverter showBackButton={false} compact={true} />
                </div>
              </div>
            )}

            {activeCategory === "legal" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-blue-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">{t("criticalInfo.legalSection.title")}</h3>
                  </div>
                  <div className="space-y-3">
                    {["alcoholAge", "cannabis", "rightTurn"].map((itemId) => (
                      <div 
                        key={itemId}
                        className="bg-card border border-white/5 rounded-xl p-4"
                        data-testid={`legal-card-${itemId}`}
                      >
                        <h4 className="font-bold text-white mb-1">{t(`criticalInfo.legalSection.${itemId}.title`)}</h4>
                        <p className="text-sm text-muted-foreground">{t(`criticalInfo.legalSection.${itemId}.description`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCategory === "daily" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-orange-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">{t("criticalInfo.dailyLifeSection.title")}</h3>
                  </div>
                  <div className="space-y-3">
                    {["esim", "metric", "restrooms"].map((itemId) => (
                      <div 
                        key={itemId}
                        className="bg-card border border-white/5 rounded-xl p-4"
                        data-testid={`daily-card-${itemId}`}
                      >
                        <h4 className="font-bold text-white mb-1">{t(`criticalInfo.dailyLifeSection.${itemId}.title`)}</h4>
                        <p className="text-sm text-muted-foreground">{t(`criticalInfo.dailyLifeSection.${itemId}.description`)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeCategory === "religious" && (
              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    {t("religiousServices.disclaimer")}
                  </p>
                </div>

                {["usa", "canada", "mexico"].map((countryKey) => {
                  const countryCities = religiousServices.filter(s => s.countryKey === countryKey);
                  const countryFlags: Record<string, string> = {
                    usa: getFlagUrl("United States"),
                    canada: getFlagUrl("Canada"),
                    mexico: getFlagUrl("Mexico")
                  };
                  return (
                    <div key={countryKey} className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={countryFlags[countryKey]} 
                          alt={t(`cities.countries.${countryKey}`)} 
                          className="w-8 h-6 object-cover rounded"
                        />
                        <h2 className="text-xl font-display font-bold text-white">
                          {t(`cities.countries.${countryKey}`)}
                        </h2>
                      </div>
                      {countryCities.map((service) => {
                        const hasFeaturedChurches = service.featuredChurches && service.featuredChurches.length > 0;
                        const protestantExpandKey = `protestant-${service.cityKey}`;
                        const isProtestantExpanded = expandedCards.has(protestantExpandKey);
                        
                        return (
                          <div key={service.cityKey} className="bg-card border border-white/10 rounded-xl p-4 mb-4">
                            <div className="flex items-center gap-3 mb-4">
                              <MapPin className="w-5 h-5 text-primary" />
                              <h3 className="text-lg font-display font-bold text-white">
                                {t(`cities.cityNames.${service.cityKey}`)}
                              </h3>
                            </div>
                            
                            <div className="space-y-2">
                              {hasFeaturedChurches ? (
                                <div>
                                  <button
                                    onClick={() => {
                                      const newExpanded = new Set(expandedCards);
                                      if (isProtestantExpanded) {
                                        newExpanded.delete(protestantExpandKey);
                                      } else {
                                        newExpanded.add(protestantExpandKey);
                                      }
                                      setExpandedCards(newExpanded);
                                    }}
                                    className="flex items-center gap-3 p-3 rounded-lg border text-blue-400 bg-blue-400/10 border-blue-400/20 hover:opacity-80 transition-opacity w-full"
                                  >
                                    <Church className="w-5 h-5 flex-shrink-0" />
                                    <span className="text-white text-sm font-medium flex-1 text-left">
                                      {t("religiousServices.protestant")}
                                    </span>
                                    {isProtestantExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                    )}
                                  </button>
                                  
                                  {isProtestantExpanded && (
                                    <div className="mt-2 ml-4 space-y-2">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        <span className="text-sm font-bold text-yellow-400">{t("religiousServices.featured")}</span>
                                      </div>
                                      {service.featuredChurches!.map((church, idx) => (
                                        <a
                                          key={idx}
                                          href={church.mapUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-3 p-3 rounded-lg border text-yellow-400 bg-yellow-400/10 border-yellow-400/20 hover:opacity-80 transition-opacity"
                                        >
                                          <Church className="w-5 h-5 flex-shrink-0" />
                                          <div className="flex-1">
                                            <span className="text-white text-sm font-medium block">
                                              {t(`religiousServices.churches.${church.nameKey}`)}{church.campus ? ` - ${church.campus}` : ''}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{church.address}</span>
                                          </div>
                                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                        </a>
                                      ))}
                                      <a
                                        href={service.protestantMapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-lg border text-blue-400 bg-blue-400/10 border-blue-400/20 hover:opacity-80 transition-opacity"
                                      >
                                        <Church className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-white text-sm font-medium flex-1">
                                          {t("religiousServices.searchAll")}
                                        </span>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <a
                                  href={service.protestantMapUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-3 p-3 rounded-lg border text-blue-400 bg-blue-400/10 border-blue-400/20 hover:opacity-80 transition-opacity"
                                >
                                  <Church className="w-5 h-5 flex-shrink-0" />
                                  <span className="text-white text-sm font-medium flex-1">
                                    {t("religiousServices.protestant")}
                                  </span>
                                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                </a>
                              )}
                              <a
                                href={service.catholicMapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border text-purple-400 bg-purple-400/10 border-purple-400/20 hover:opacity-80 transition-opacity"
                              >
                                <Cross className="w-5 h-5 flex-shrink-0" />
                                <span className="text-white text-sm font-medium flex-1">
                                  {t("religiousServices.catholic")}
                                </span>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                              </a>
                              <a
                                href={service.islamicMapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border text-emerald-400 bg-emerald-400/10 border-emerald-400/20 hover:opacity-80 transition-opacity"
                              >
                                <Moon className="w-5 h-5 flex-shrink-0" />
                                <span className="text-white text-sm font-medium flex-1">
                                  {t("religiousServices.islamic")}
                                </span>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                              </a>
                              <a
                                href={service.synagogueMapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border text-amber-400 bg-amber-400/10 border-amber-400/20 hover:opacity-80 transition-opacity"
                              >
                                <Star className="w-5 h-5 flex-shrink-0" />
                                <span className="text-white text-sm font-medium flex-1">
                                  {t("religiousServices.synagogue")}
                                </span>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {viewMode === "travel" && (
          <>
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 -mx-6 px-6 scrollbar-hide">
              {travelCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => cat.available && setActiveTravelCategory(cat.id)}
                  disabled={!cat.available}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${
                    activeTravelCategory === cat.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : cat.available 
                        ? "bg-card text-muted-foreground hover:text-white border-white/10"
                        : "bg-card/50 text-muted-foreground/50 cursor-not-allowed border-white/5"
                  }`}
                  data-testid={`travel-category-${cat.id}`}
                >
                  <cat.icon className="w-4 h-4" />
                  {t(cat.labelKey)}
                  {!cat.available && <span className="text-[10px] ml-1">(Soon)</span>}
                </button>
              ))}
            </div>

            {activeTravelCategory === "travel-entry" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Stamp className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-display font-bold text-white">{t("criticalInfo.travelEntrySection.title")}</h2>
                    <p className="text-sm text-muted-foreground">{t("criticalInfo.travelEntrySection.subtitle")}</p>
                  </div>
                </div>

                {/* Entry Requirements Section */}
                <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCard("travel-entry-requirements")}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    data-testid="toggle-entry-requirements"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Stamp className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-white">{t("criticalInfo.travelEntrySection.entryRequirements.title")}</h3>
                        <p className="text-xs text-muted-foreground">{t("criticalInfo.travelEntrySection.entryRequirements.subtitle")}</p>
                      </div>
                    </div>
                    {expandedCards.has("travel-entry-requirements") ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedCards.has("travel-entry-requirements") && (
                    <div className="border-t border-white/5 p-4 space-y-4">
                      <div className="space-y-3">
                        <h4 className="font-bold text-white text-sm">{t("criticalInfo.customsSection.visaRequirements")}</h4>
                        {customsDataKeys.visaRequirements.map((id) => (
                          <div key={id} className="bg-background/50 border border-white/10 rounded-xl p-3" data-testid={`customs-${id}`}>
                            <p className="text-sm text-muted-foreground">
                              <span className="text-white font-medium">{t(`criticalInfo.customsSection.visaItems.${id}.title`)}</span>: {t(`criticalInfo.customsSection.visaItems.${id}.description`)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-bold text-red-400 text-sm">{t("criticalInfo.customsSection.firstPointOfEntry.title")}</h4>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                          <p className="text-white font-medium text-sm mb-2">
                            {t("criticalInfo.customsSection.firstPointOfEntry.description")}
                          </p>
                          <ol className="space-y-1 text-xs text-muted-foreground">
                            {(t("criticalInfo.customsSection.firstPointOfEntry.steps", { returnObjects: true }) as string[]).map((step, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-primary font-medium">{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-400">💡</span>
                          <div>
                            <p className="text-white font-medium text-sm">{t("criticalInfo.customsSection.mpcTip.title")}</p>
                            <a 
                              href="https://www.cbp.gov/travel/us-citizens/mobile-passport-control" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                              data-testid="link-mpc-app"
                            >
                              <Plane className="w-3 h-3" />
                              {t("criticalInfo.customsSection.mpcTip.button")}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-bold text-white text-sm">{t("criticalInfo.customsSection.additionalInfo")}</h4>
                        {customsDataKeys.additionalInfo.map((id) => (
                          <div key={id} className="bg-background/50 border border-white/10 rounded-xl p-3" data-testid={`customs-${id}`}>
                            <h5 className="font-bold text-white text-sm mb-1">{t(`criticalInfo.customsSection.additionalItems.${id}.title`)}</h5>
                            <p className="text-xs text-muted-foreground">{t(`criticalInfo.customsSection.additionalItems.${id}.description`)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Consulates Section */}
                <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleCard("travel-entry-consulates")}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    data-testid="toggle-consulates"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-white">{t("criticalInfo.travelEntrySection.consulates.title")}</h3>
                        <p className="text-xs text-muted-foreground">{t("criticalInfo.travelEntrySection.consulates.subtitle")}</p>
                      </div>
                    </div>
                    {expandedCards.has("travel-entry-consulates") ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedCards.has("travel-entry-consulates") && (
                    <div className="border-t border-white/5 p-4 space-y-4">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-amber-200 font-medium text-sm mb-1">{t("criticalInfo.consulatesSection.whenToContact")}</p>
                            <ul className="text-xs text-amber-200/80 space-y-0.5">
                              {(t("criticalInfo.consulatesSection.reasons", { returnObjects: true }) as string[]).map((reason, i) => (
                                <li key={i}>• {reason}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {consulatesData.map((cityData) => (
                          <div key={cityData.id} className="bg-background/50 border border-white/10 rounded-xl overflow-hidden">
                            <button
                              onClick={() => toggleCard(`consulate-${cityData.id}`)}
                              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                              data-testid={`consulate-city-${cityData.id}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-xl">
                                  {cityData.country === "USA" ? "🇺🇸" : cityData.country === "Mexico" ? "🇲🇽" : "🇨🇦"}
                                </span>
                                <div className="text-left">
                                  <h4 className="font-bold text-white text-sm">{cityData.city}</h4>
                                  <p className="text-[10px] text-muted-foreground">{cityData.consulates.length} {t("criticalInfo.consulatesSection.consulatesCount")}</p>
                                </div>
                              </div>
                              {expandedCards.has(`consulate-${cityData.id}`) ? (
                                <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>

                            {expandedCards.has(`consulate-${cityData.id}`) && (
                              <div className="border-t border-white/10 p-3 space-y-2">
                                {cityData.consulates.map((consulate, idx) => (
                                  <div 
                                    key={idx}
                                    className="bg-card border border-white/10 rounded-lg p-3"
                                    data-testid={`consulate-${cityData.id}-${consulate.country.toLowerCase().replace(/\s+/g, '-')}`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <img src={getFlagUrlByCode(consulate.flag, 40)} alt={consulate.country} className="w-6 h-4 object-cover rounded" />
                                      <h5 className="font-bold text-white text-sm">{consulate.country}</h5>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mb-2">{consulate.address}</p>
                                    <a
                                      href={`tel:${consulate.phone.replace(/\s+/g, '')}`}
                                      className="w-full bg-primary text-primary-foreground py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1"
                                      data-testid={`call-consulate-${cityData.id}-${idx}`}
                                    >
                                      <Phone className="w-3 h-3" />
                                      {consulate.phone}
                                    </a>
                                    {consulate.emergency && (
                                      <div className="mt-2 bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                                        <p className="text-[10px] text-red-300">
                                          <strong>24/7:</strong> {consulate.emergency}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-blue-200 font-medium text-xs mb-1">{t("criticalInfo.travelEntrySection.consulateTips.title")}</p>
                            <ul className="text-[10px] text-blue-200/80 space-y-0.5">
                              {(t("criticalInfo.travelEntrySection.consulateTips.items", { returnObjects: true, defaultValue: [
                                "Save your consulate's number before traveling",
                                "Register with your embassy for travel alerts",
                                "Consulates can NOT post bail or provide legal representation",
                                "Emergency passports take 1-2 business days",
                                "Most consulates close on local AND home country holidays"
                              ] }) as string[]).map((tip, i) => (
                                <li key={i}>• {tip}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTravelCategory === "travel-safety" && (
              <div className="space-y-6">
                {!selectedCity ? (
                  <>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <h2 className="text-xl font-display font-bold text-white">{t("criticalInfo.citySafetySection.title")}</h2>
                      </div>
                      <p className="text-muted-foreground text-sm">{t("criticalInfo.citySafetySection.subtitle")}</p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <span className="text-lg">🇺🇸</span> {t("criticalInfo.citySafetySection.countries.usa")}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {citySafetyKeys.filter(c => c.country === "USA").map((city) => (
                          <button
                            key={city.id}
                            onClick={() => setSelectedCity(city.id)}
                            className="bg-card border border-white/10 rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
                            data-testid={`city-safety-${city.id}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="font-medium text-white text-sm">{city.city}</span>
                            </div>
                            <div className={`text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block ${
                              city.heatLevel === "extreme" ? "bg-red-500/20 text-red-400" :
                              city.heatLevel === "severe" ? "bg-orange-500/20 text-orange-400" :
                              city.heatLevel === "high" ? "bg-yellow-500/20 text-yellow-400" :
                              city.heatLevel === "moderate" ? "bg-blue-500/20 text-blue-400" :
                              "bg-green-500/20 text-green-400"
                            }`}>
                              {t(`criticalInfo.citySafetySection.heatLevels.${city.heatLevel}`)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <span className="text-lg">🇲🇽</span> {t("criticalInfo.citySafetySection.countries.mexico")}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {citySafetyKeys.filter(c => c.country === "Mexico").map((city) => (
                          <button
                            key={city.id}
                            onClick={() => setSelectedCity(city.id)}
                            className="bg-card border border-white/10 rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
                            data-testid={`city-safety-${city.id}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="font-medium text-white text-sm">{city.city}</span>
                            </div>
                            <div className={`text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block ${
                              city.heatLevel === "extreme" ? "bg-red-500/20 text-red-400" :
                              city.heatLevel === "moderate" ? "bg-blue-500/20 text-blue-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {t(`criticalInfo.citySafetySection.heatLevels.${city.heatLevel}`)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <span className="text-lg">🇨🇦</span> {t("criticalInfo.citySafetySection.countries.canada")}
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {citySafetyKeys.filter(c => c.country === "Canada").map((city) => (
                          <button
                            key={city.id}
                            onClick={() => setSelectedCity(city.id)}
                            className="bg-card border border-white/10 rounded-xl p-4 text-left hover:border-primary/50 transition-colors"
                            data-testid={`city-safety-${city.id}`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="font-medium text-white text-sm">{city.city}</span>
                            </div>
                            <div className={`text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block ${
                              city.heatLevel === "low" ? "bg-green-500/20 text-green-400" :
                              "bg-blue-500/20 text-blue-400"
                            }`}>
                              {t(`criticalInfo.citySafetySection.heatLevels.${city.heatLevel}`)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {(() => {
                      const cityKey = citySafetyKeys.find(c => c.id === selectedCity);
                      if (!cityKey) return null;
                      const heatLevel = cityKey.heatLevel;
                      return (
                        <div className="space-y-5">
                          <button
                            onClick={() => setSelectedCity(null)}
                            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                            data-testid="button-back-cities"
                          >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">{t("criticalInfo.citySafetySection.backToCities")}</span>
                          </button>

                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-xl font-display font-bold text-white">{cityKey.city}</h2>
                              <p className="text-sm text-muted-foreground">{cityKey.country}</p>
                            </div>
                          </div>

                          <div className={`rounded-xl p-4 border ${
                            heatLevel === "extreme" ? "bg-red-500/10 border-red-500/30" :
                            heatLevel === "severe" ? "bg-orange-500/10 border-orange-500/30" :
                            heatLevel === "high" ? "bg-yellow-500/10 border-yellow-500/30" :
                            heatLevel === "moderate" ? "bg-blue-500/10 border-blue-500/30" :
                            "bg-green-500/10 border-green-500/30"
                          }`}>
                            <div className="flex items-start gap-3">
                              <Thermometer className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                heatLevel === "extreme" ? "text-red-400" :
                                heatLevel === "severe" ? "text-orange-400" :
                                heatLevel === "high" ? "text-yellow-400" :
                                heatLevel === "moderate" ? "text-blue-400" :
                                "text-green-400"
                              }`} />
                              <div>
                                <div className={`text-sm font-bold mb-1 ${
                                  heatLevel === "extreme" ? "text-red-400" :
                                  heatLevel === "severe" ? "text-orange-400" :
                                  heatLevel === "high" ? "text-yellow-400" :
                                  heatLevel === "moderate" ? "text-blue-400" :
                                  "text-green-400"
                                }`}>
                                  {t("criticalInfo.citySafetySection.heatWarning")}: {t(`criticalInfo.citySafetySection.heatLevels.${heatLevel}`)}
                                </div>
                                <p className="text-sm text-muted-foreground">{t(`criticalInfo.citySafetySection.cities.${cityKey.id}.heatWarning`)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <TicketX className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <div className="text-sm font-bold text-amber-400 mb-1">{t("criticalInfo.citySafetySection.ticketScams")}</div>
                                <p className="text-sm text-muted-foreground">{t(`criticalInfo.citySafetySection.cities.${cityKey.id}.ticketScams`)}</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-red-400" />
                              <h3 className="font-bold text-white text-sm">{t("criticalInfo.citySafetySection.localConcerns")}</h3>
                            </div>
                            <div className="bg-card border border-white/5 rounded-xl p-4">
                              <ul className="space-y-2">
                                {(() => {
                                  const concerns = t(`criticalInfo.citySafetySection.cities.${cityKey.id}.localConcerns`, { returnObjects: true });
                                  return Array.isArray(concerns) ? concerns.map((concern: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                      <span className="text-red-400 mt-0.5">•</span>
                                      {concern}
                                    </li>
                                  )) : null;
                                })()}
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <h3 className="font-bold text-white text-sm">{t("criticalInfo.citySafetySection.safeAreas")}</h3>
                              <span className="text-[10px] text-muted-foreground">{t("criticalInfo.citySafetySection.tapForDetails")}</span>
                            </div>
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                              <div className="space-y-2">
                                {(() => {
                                  const safeAreas = t(`criticalInfo.citySafetySection.cities.${cityKey.id}.safeAreas`, { returnObjects: true });
                                  return Array.isArray(safeAreas) ? safeAreas.map((area: {name: string, description: string}, i: number) => {
                                    const areaKeyStr = `${cityKey.id}-${area.name}`;
                                    const isExpanded = expandedSafeArea === areaKeyStr;
                                    return (
                                      <div key={i}>
                                        <button
                                          onClick={() => setExpandedSafeArea(isExpanded ? null : areaKeyStr)}
                                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                                            isExpanded 
                                              ? "bg-green-500/30 text-green-300" 
                                              : "bg-green-500/20 text-green-400 hover:bg-green-500/25"
                                          }`}
                                          data-testid={`safe-area-${cityKey.id}-${i}`}
                                        >
                                          <div className="flex items-center justify-between">
                                            <span className="font-medium">{area.name}</span>
                                            {isExpanded ? (
                                              <ChevronUp className="w-4 h-4 flex-shrink-0" />
                                            ) : (
                                              <ChevronDown className="w-4 h-4 flex-shrink-0" />
                                            )}
                                          </div>
                                        </button>
                                        {isExpanded && (
                                          <div className="mt-2 px-3 py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                                            <p className="text-sm text-green-100/80">{area.description}</p>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }) : null;
                                })()}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <XCircle className="w-4 h-4 text-red-400" />
                              <h3 className="font-bold text-white text-sm">{t("criticalInfo.citySafetySection.areasToAvoid")}</h3>
                            </div>
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                              <div className="flex flex-wrap gap-2">
                                {(() => {
                                  const avoidAreas = t(`criticalInfo.citySafetySection.cities.${cityKey.id}.avoidAreas`, { returnObjects: true });
                                  return Array.isArray(avoidAreas) ? avoidAreas.map((area: string, i: number) => (
                                    <span key={i} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs">
                                      {area}
                                    </span>
                                  )) : null;
                                })()}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-400" />
                              <h3 className="font-bold text-white text-sm">{t("criticalInfo.citySafetySection.tips")}</h3>
                            </div>
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                              <ul className="space-y-2">
                                {(() => {
                                  const tips = t(`criticalInfo.citySafetySection.cities.${cityKey.id}.tips`, { returnObjects: true });
                                  return Array.isArray(tips) ? tips.map((tip: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-yellow-100/80">
                                      <span className="text-yellow-400 mt-0.5">💡</span>
                                      {tip}
                                    </li>
                                  )) : null;
                                })()}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            )}

            {activeTravelCategory === "prohibited" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="w-5 h-5 text-red-400" />
                    <h2 className="text-xl font-display font-bold text-white">{t("criticalInfo.prohibitedSection.title")}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">{t("criticalInfo.prohibitedSection.subtitle")}</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setExpandedCards(new Set(["customs"]))}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      expandedCards.has("customs") || (!expandedCards.has("stadium") && !expandedCards.has("customs"))
                        ? "bg-red-500 text-white" 
                        : "bg-card text-muted-foreground hover:text-white border border-white/10"
                    }`}
                    data-testid="tab-prohibited-customs"
                  >
                    {t("criticalInfo.prohibitedSection.entryToUSA")}
                  </button>
                  <button
                    onClick={() => setExpandedCards(new Set(["stadium"]))}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      expandedCards.has("stadium")
                        ? "bg-red-500 text-white" 
                        : "bg-card text-muted-foreground hover:text-white border border-white/10"
                    }`}
                    data-testid="tab-prohibited-stadium"
                  >
                    {t("criticalInfo.prohibitedSection.stadiumEntry")}
                  </button>
                </div>

                {(expandedCards.has("customs") || (!expandedCards.has("stadium") && !expandedCards.has("customs"))) && (
                  <div className="space-y-6">
                    {prohibitedDataKeys.customs.map((category) => (
                      <div key={category.id} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wide">{t(`criticalInfo.prohibitedSection.customs.${category.translationKey}.title`)}</h3>
                        </div>
                        <div className="space-y-3">
                          {category.items.map((item) => (
                            <div 
                              key={item.id}
                              className="bg-card border border-white/5 rounded-xl overflow-hidden"
                              data-testid={`prohibited-customs-${item.id}`}
                            >
                              <div className="p-4">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <h4 className="font-bold text-white">{t(`criticalInfo.prohibitedSection.customs.${category.translationKey}.${item.translationKey}.name`)}</h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                    item.severity === "critical" ? "bg-red-500 text-white" :
                                    item.severity === "high" ? "bg-orange-500 text-white" :
                                    "bg-yellow-500 text-black"
                                  }`}>
                                    {t(`criticalInfo.prohibitedSection.severity.${item.severity}`)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{t(`criticalInfo.prohibitedSection.customs.${category.translationKey}.${item.translationKey}.description`)}</p>
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <span className="text-sm text-red-400">{t("criticalInfo.prohibitedSection.penalty")}: {t(`criticalInfo.prohibitedSection.customs.${category.translationKey}.${item.translationKey}.penalty`)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {expandedCards.has("stadium") && (
                  <div className="space-y-6">
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">🎒</span>
                        <div>
                          <p className="text-white font-medium text-sm">{t("criticalInfo.prohibitedSection.clearBagPolicy.title")}</p>
                          <p className="text-sm text-amber-100/80 mt-1">{t("criticalInfo.prohibitedSection.clearBagPolicy.description")}</p>
                        </div>
                      </div>
                    </div>

                    {prohibitedDataKeys.stadium.map((category) => (
                      <div key={category.id} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{category.icon}</span>
                          <h3 className="text-sm font-bold text-white uppercase tracking-wide">{t(`criticalInfo.prohibitedSection.stadium.${category.translationKey}.title`)}</h3>
                        </div>
                        <div className="space-y-3">
                          {category.items.map((item) => (
                            <div 
                              key={item.id}
                              className="bg-card border border-white/5 rounded-xl overflow-hidden"
                              data-testid={`prohibited-stadium-${item.id}`}
                            >
                              <div className="p-4">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <h4 className="font-bold text-white">{t(`criticalInfo.prohibitedSection.stadium.${category.translationKey}.${item.translationKey}.name`)}</h4>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                    item.severity === "critical" ? "bg-red-500 text-white" :
                                    item.severity === "high" ? "bg-orange-500 text-white" :
                                    "bg-yellow-500 text-black"
                                  }`}>
                                    {t(`criticalInfo.prohibitedSection.severity.${item.severity}`)}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">{t(`criticalInfo.prohibitedSection.stadium.${category.translationKey}.${item.translationKey}.description`)}</p>
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                                    <span className="text-sm text-red-400">{t("criticalInfo.prohibitedSection.penalty")}: {t(`criticalInfo.prohibitedSection.stadium.${category.translationKey}.${item.translationKey}.penalty`)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-400 font-medium text-sm mb-2">{t("criticalInfo.prohibitedSection.whatYouCanBring.title")}</p>
                          <ul className="text-sm text-green-100/80 space-y-1">
                            {(t("criticalInfo.prohibitedSection.whatYouCanBring.items", { returnObjects: true }) as string[]).map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTravelCategory === "tvguide" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tv className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display font-bold text-white">{t("criticalInfo.tvGuideSection.title")}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">{t("criticalInfo.tvGuideSection.subtitle")}</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setExpandedCards(new Set(["tv-english"]))}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      expandedCards.has("tv-english") || (!expandedCards.has("tv-spanish") && !expandedCards.has("tv-international") && !expandedCards.has("tv-english"))
                        ? "bg-primary text-black" 
                        : "bg-card text-muted-foreground hover:text-white border border-white/10"
                    }`}
                    data-testid="tab-tv-english"
                  >
                    {t("criticalInfo.tvGuideSection.tabs.english")}
                  </button>
                  <button
                    onClick={() => setExpandedCards(new Set(["tv-spanish"]))}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      expandedCards.has("tv-spanish")
                        ? "bg-primary text-black" 
                        : "bg-card text-muted-foreground hover:text-white border border-white/10"
                    }`}
                    data-testid="tab-tv-spanish"
                  >
                    {t("criticalInfo.tvGuideSection.tabs.spanish")}
                  </button>
                  <button
                    onClick={() => setExpandedCards(new Set(["tv-international"]))}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      expandedCards.has("tv-international")
                        ? "bg-primary text-black" 
                        : "bg-card text-muted-foreground hover:text-white border border-white/10"
                    }`}
                    data-testid="tab-tv-international"
                  >
                    {t("criticalInfo.tvGuideSection.tabs.international")}
                  </button>
                </div>

                {(expandedCards.has("tv-english") || (!expandedCards.has("tv-spanish") && !expandedCards.has("tv-international") && !expandedCards.has("tv-english"))) && (
                  <div className="space-y-6">
                    {tvGuideData.english.map((region) => (
                      <div key={region.id} className="bg-card border border-white/5 rounded-xl overflow-hidden" data-testid={`tv-region-${region.id}`}>
                        <div className="bg-gradient-to-r from-primary/20 to-transparent p-4 border-b border-white/5">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <img src={getFlagUrlByCode(region.flag, 40)} alt={region.region} className="w-8 h-6 object-cover rounded" />
                            {region.region}
                          </h3>
                        </div>
                        <div className="p-4 space-y-4">
                          {region.broadcasters.map((broadcaster) => (
                            <div key={broadcaster.id} className="border border-white/10 rounded-lg p-4" data-testid={`broadcaster-${broadcaster.id}`}>
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-bold text-white">{broadcaster.name}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  broadcaster.type === "tv" ? "bg-blue-500/20 text-blue-400" :
                                  broadcaster.type === "streaming" ? "bg-purple-500/20 text-purple-400" :
                                  "bg-orange-500/20 text-orange-400"
                                }`}>
                                  {broadcaster.type === "tv" ? "📺 TV" : broadcaster.type === "streaming" ? "📱 Stream" : "📻 Radio"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {broadcaster.channels.map((channel, i) => (
                                  <span key={i} className="bg-white/5 text-white/80 px-2 py-0.5 rounded text-xs">{channel}</span>
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{broadcaster.notes}</p>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-primary" />
                                <span className="text-xs text-primary">{broadcaster.cost}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {expandedCards.has("tv-spanish") && (
                  <div className="space-y-6">
                    {tvGuideData.spanish.map((region) => (
                      <div key={region.id} className="bg-card border border-white/5 rounded-xl overflow-hidden" data-testid={`tv-region-${region.id}`}>
                        <div className="bg-gradient-to-r from-orange-500/20 to-transparent p-4 border-b border-white/5">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <img src={getFlagUrlByCode(region.flag, 40)} alt={region.region} className="w-8 h-6 object-cover rounded" />
                            {region.region}
                          </h3>
                        </div>
                        <div className="p-4 space-y-4">
                          {region.broadcasters.map((broadcaster) => (
                            <div key={broadcaster.id} className="border border-white/10 rounded-lg p-4" data-testid={`broadcaster-${broadcaster.id}`}>
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-bold text-white">{broadcaster.name}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  broadcaster.type === "tv" ? "bg-blue-500/20 text-blue-400" :
                                  broadcaster.type === "streaming" ? "bg-purple-500/20 text-purple-400" :
                                  "bg-orange-500/20 text-orange-400"
                                }`}>
                                  {broadcaster.type === "tv" ? "📺 TV" : broadcaster.type === "streaming" ? "📱 Stream" : "📻 Radio"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {broadcaster.channels.map((channel, i) => (
                                  <span key={i} className="bg-white/5 text-white/80 px-2 py-0.5 rounded text-xs">{channel}</span>
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{broadcaster.notes}</p>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-orange-400" />
                                <span className="text-xs text-orange-400">{broadcaster.cost}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {expandedCards.has("tv-international") && (
                  <div className="space-y-6">
                    {tvGuideData.international.map((region) => (
                      <div key={region.id} className="bg-card border border-white/5 rounded-xl overflow-hidden" data-testid={`tv-region-${region.id}`}>
                        <div className="bg-gradient-to-r from-purple-500/20 to-transparent p-4 border-b border-white/5">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <img src={getFlagUrlByCode(region.flag, 40)} alt={region.region} className="w-8 h-6 object-cover rounded" />
                            {region.region}
                          </h3>
                        </div>
                        <div className="p-4 space-y-4">
                          {region.broadcasters.map((broadcaster) => (
                            <div key={broadcaster.id} className="border border-white/10 rounded-lg p-4" data-testid={`broadcaster-${broadcaster.id}`}>
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-bold text-white">{broadcaster.name}</h4>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  broadcaster.type === "tv" ? "bg-blue-500/20 text-blue-400" :
                                  broadcaster.type === "streaming" ? "bg-purple-500/20 text-purple-400" :
                                  "bg-orange-500/20 text-orange-400"
                                }`}>
                                  {broadcaster.type === "tv" ? "📺 TV" : broadcaster.type === "streaming" ? "📱 Stream" : "📻 Radio"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {broadcaster.channels.map((channel, i) => (
                                  <span key={i} className="bg-white/5 text-white/80 px-2 py-0.5 rounded text-xs">{channel}</span>
                                ))}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{broadcaster.notes}</p>
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-purple-400" />
                                <span className="text-xs text-purple-400">{broadcaster.cost}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-amber-400 font-medium text-sm mb-2">{t("criticalInfo.tvGuideSection.streamingTips")}</p>
                      <ul className="text-sm text-amber-100/80 space-y-1">
                        {tvGuideData.streamingTips.map((tip, i) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTravelCategory === "transport" && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Plane className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-display font-bold text-white">{t("criticalInfo.transportSection.title")}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm">{t("criticalInfo.transportSection.subtitle")}</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setExpandedCards(new Set(["transport-jets"]))}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      expandedCards.has("transport-jets") || (!expandedCards.has("transport-yachts") && !expandedCards.has("transport-customs") && !expandedCards.has("transport-jets"))
                        ? "bg-primary text-black" 
                        : "bg-card text-muted-foreground hover:text-white border border-white/10"
                    }`}
                    data-testid="tab-transport-jets"
                  >
                    {t("criticalInfo.transportSection.tabs.jets")}
                  </button>
                  <button
                    onClick={() => setExpandedCards(new Set(["transport-yachts"]))}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      expandedCards.has("transport-yachts")
                        ? "bg-primary text-black" 
                        : "bg-card text-muted-foreground hover:text-white border border-white/10"
                    }`}
                    data-testid="tab-transport-yachts"
                  >
                    {t("criticalInfo.transportSection.tabs.yachts")}
                  </button>
                  <button
                    onClick={() => setExpandedCards(new Set(["transport-customs"]))}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      expandedCards.has("transport-customs")
                        ? "bg-primary text-black" 
                        : "bg-card text-muted-foreground hover:text-white border border-white/10"
                    }`}
                    data-testid="tab-transport-customs"
                  >
                    {t("criticalInfo.transportSection.tabs.clearance")}
                  </button>
                </div>

                {(expandedCards.has("transport-jets") || (!expandedCards.has("transport-yachts") && !expandedCards.has("transport-customs") && !expandedCards.has("transport-jets"))) && (
                  <div className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Plane className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-400 font-medium text-sm mb-1">{t("criticalInfo.transportSection.fboInfo.title")}</p>
                          <p className="text-xs text-blue-100/80">{t("criticalInfo.transportSection.fboInfo.description")}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                        <span>🇺🇸</span> {t("criticalInfo.transportSection.usaHostCities")}
                      </h3>
                      {privateTransportData.usaCities.map((city) => (
                        <div key={city.id} className="bg-card border border-white/5 rounded-xl overflow-hidden" data-testid={`airport-city-${city.id}`}>
                          <button
                            onClick={() => {
                              const key = `airport-${city.id}`;
                              const newExpanded = new Set(expandedCards);
                              newExpanded.add("transport-jets");
                              if (newExpanded.has(key)) {
                                newExpanded.delete(key);
                              } else {
                                newExpanded.add(key);
                              }
                              setExpandedCards(newExpanded);
                            }}
                            className="w-full p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <img src={getFlagUrlByCode(city.flag, 40)} alt={city.city} className="w-6 h-4 object-cover rounded" />
                              <span className="font-bold text-white">{city.city}</span>
                              <span className="text-xs text-muted-foreground">({city.airports.length} {t("criticalInfo.transportSection.airports")})</span>
                            </div>
                            {expandedCards.has(`airport-${city.id}`) ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                          {expandedCards.has(`airport-${city.id}`) && (
                            <div className="p-4 pt-0 space-y-3">
                              {city.airports.map((airport) => (
                                <div key={airport.id} className="border border-white/10 rounded-lg p-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-bold text-white text-sm">{airport.name}</h4>
                                      <p className="text-xs text-muted-foreground">{airport.code} • {airport.distance}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      airport.customs ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                                    }`}>
                                      {airport.customs ? t("criticalInfo.transportSection.cbpOnSite") : t("criticalInfo.transportSection.noCBP")}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {airport.fbos.map((fbo, i) => (
                                      <span key={i} className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs">{fbo}</span>
                                    ))}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{t(`criticalInfo.transportSection.airportNotes.${airport.id}`, { defaultValue: airport.notes })}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                        <span>🇲🇽</span> {t("criticalInfo.transportSection.mexicoHostCities")}
                      </h3>
                      {privateTransportData.mexicoCities.map((city) => (
                        <div key={city.id} className="bg-card border border-white/5 rounded-xl overflow-hidden" data-testid={`airport-city-${city.id}`}>
                          <button
                            onClick={() => {
                              const key = `airport-${city.id}`;
                              const newExpanded = new Set(expandedCards);
                              newExpanded.add("transport-jets");
                              if (newExpanded.has(key)) {
                                newExpanded.delete(key);
                              } else {
                                newExpanded.add(key);
                              }
                              setExpandedCards(newExpanded);
                            }}
                            className="w-full p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <img src={getFlagUrlByCode(city.flag, 40)} alt={city.city} className="w-6 h-4 object-cover rounded" />
                              <span className="font-bold text-white">{city.city}</span>
                            </div>
                            {expandedCards.has(`airport-${city.id}`) ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                          {expandedCards.has(`airport-${city.id}`) && (
                            <div className="p-4 pt-0 space-y-3">
                              {city.airports.map((airport) => (
                                <div key={airport.id} className="border border-white/10 rounded-lg p-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-bold text-white text-sm">{airport.name}</h4>
                                      <p className="text-xs text-muted-foreground">{airport.code} • {airport.distance}</p>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                      {t("criticalInfo.transportSection.ciqOnSite")}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {airport.fbos.map((fbo, i) => (
                                      <span key={i} className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded text-xs">{fbo}</span>
                                    ))}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{t(`criticalInfo.transportSection.airportNotes.${airport.id}`, { defaultValue: airport.notes })}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                        <span>🇨🇦</span> {t("criticalInfo.transportSection.canadaHostCities")}
                      </h3>
                      {privateTransportData.canadaCities.map((city) => (
                        <div key={city.id} className="bg-card border border-white/5 rounded-xl overflow-hidden" data-testid={`airport-city-${city.id}`}>
                          <button
                            onClick={() => {
                              const key = `airport-${city.id}`;
                              const newExpanded = new Set(expandedCards);
                              newExpanded.add("transport-jets");
                              if (newExpanded.has(key)) {
                                newExpanded.delete(key);
                              } else {
                                newExpanded.add(key);
                              }
                              setExpandedCards(newExpanded);
                            }}
                            className="w-full p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <img src={getFlagUrlByCode(city.flag, 40)} alt={city.city} className="w-6 h-4 object-cover rounded" />
                              <span className="font-bold text-white">{city.city}</span>
                            </div>
                            {expandedCards.has(`airport-${city.id}`) ? (
                              <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            )}
                          </button>
                          {expandedCards.has(`airport-${city.id}`) && (
                            <div className="p-4 pt-0 space-y-3">
                              {city.airports.map((airport) => (
                                <div key={airport.id} className="border border-white/10 rounded-lg p-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-bold text-white text-sm">{airport.name}</h4>
                                      <p className="text-xs text-muted-foreground">{airport.code} • {airport.distance}</p>
                                    </div>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                                      {t("criticalInfo.transportSection.cbsaOnSite")}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {airport.fbos.map((fbo, i) => (
                                      <span key={i} className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-xs">{fbo}</span>
                                    ))}
                                  </div>
                                  <p className="text-xs text-muted-foreground">{t(`criticalInfo.transportSection.airportNotes.${airport.id}`, { defaultValue: airport.notes })}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {expandedCards.has("transport-yachts") && (
                  <div className="space-y-6">
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Anchor className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-cyan-400 font-medium text-sm mb-1">{t("criticalInfo.transportSection.yachtInfo.title")}</p>
                          <p className="text-xs text-cyan-100/80">{t("criticalInfo.transportSection.yachtInfo.description")}</p>
                        </div>
                      </div>
                    </div>

                    {privateTransportData.usaCities.filter(city => city.marinas && city.marinas.length > 0).map((city) => (
                      <div key={city.id} className="bg-card border border-white/5 rounded-xl overflow-hidden" data-testid={`marina-city-${city.id}`}>
                        <div className="bg-gradient-to-r from-cyan-500/20 to-transparent p-4 border-b border-white/5">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <img src={getFlagUrlByCode(city.flag, 40)} alt={city.city} className="w-8 h-6 object-cover rounded" />
                            {city.city}
                          </h3>
                        </div>
                        <div className="p-4 space-y-3">
                          {city.marinas?.map((marina, i) => (
                            <div key={marina.id} className="border border-white/10 rounded-lg p-3">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-bold text-white text-sm">{marina.name}</h4>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                                  {t("criticalInfo.transportSection.maxLength")}: {marina.maxLength}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">{t(`criticalInfo.transportSection.marinaFeatures.${marina.id}`, { defaultValue: marina.features })}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                      <div className="flex items-start gap-2">
                        <Ship className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-400 font-medium text-sm mb-2">{t("criticalInfo.transportSection.yachtChecklist.title")}</p>
                          <ul className="text-sm text-amber-100/80 space-y-1">
                            {(t("criticalInfo.transportSection.yachtChecklist.items", { returnObjects: true }) as string[]).map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {expandedCards.has("transport-customs") && (
                  <div className="space-y-6">
                    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500/20 to-transparent p-4 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Plane className="w-5 h-5" />
                          {t("criticalInfo.transportSection.clearance.usa.title", { defaultValue: privateTransportData.customsRequirements.usa.title })}
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {privateTransportData.customsRequirements.usa.requirements.map((req) => (
                          <div key={req.id} className="border border-white/10 rounded-lg p-3">
                            <h4 className="font-bold text-white text-sm mb-1">{t(`criticalInfo.transportSection.clearance.usa.${req.id}.item`, { defaultValue: req.item })}</h4>
                            <p className="text-xs text-muted-foreground">{t(`criticalInfo.transportSection.clearance.usa.${req.id}.desc`, { defaultValue: req.desc })}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-500/20 to-transparent p-4 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Anchor className="w-5 h-5" />
                          {t("criticalInfo.transportSection.clearance.yacht.title", { defaultValue: privateTransportData.customsRequirements.yacht.title })}
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {privateTransportData.customsRequirements.yacht.requirements.map((req) => (
                          <div key={req.id} className="border border-white/10 rounded-lg p-3">
                            <h4 className="font-bold text-white text-sm mb-1">{t(`criticalInfo.transportSection.clearance.yacht.${req.id}.item`, { defaultValue: req.item })}</h4>
                            <p className="text-xs text-muted-foreground">{t(`criticalInfo.transportSection.clearance.yacht.${req.id}.desc`, { defaultValue: req.desc })}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500/20 to-transparent p-4 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <span className="text-lg">🇲🇽</span>
                          {t("criticalInfo.transportSection.clearance.mexico.title", { defaultValue: privateTransportData.customsRequirements.mexico.title })}
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {privateTransportData.customsRequirements.mexico.requirements.map((req) => (
                          <div key={req.id} className="border border-white/10 rounded-lg p-3">
                            <h4 className="font-bold text-white text-sm mb-1">{t(`criticalInfo.transportSection.clearance.mexico.${req.id}.item`, { defaultValue: req.item })}</h4>
                            <p className="text-xs text-muted-foreground">{t(`criticalInfo.transportSection.clearance.mexico.${req.id}.desc`, { defaultValue: req.desc })}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-card border border-white/5 rounded-xl overflow-hidden">
                      <div className="bg-gradient-to-r from-red-500/20 to-transparent p-4 border-b border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <span className="text-lg">🇨🇦</span>
                          {t("criticalInfo.transportSection.clearance.canada.title", { defaultValue: privateTransportData.customsRequirements.canada.title })}
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {privateTransportData.customsRequirements.canada.requirements.map((req) => (
                          <div key={req.id} className="border border-white/10 rounded-lg p-3">
                            <h4 className="font-bold text-white text-sm mb-1">{t(`criticalInfo.transportSection.clearance.canada.${req.id}.item`, { defaultValue: req.item })}</h4>
                            <p className="text-xs text-muted-foreground">{t(`criticalInfo.transportSection.clearance.canada.${req.id}.desc`, { defaultValue: req.desc })}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-primary font-medium text-sm mb-2">{t("criticalInfo.transportSection.transportTips")}</p>
                      <ul className="text-sm text-primary/80 space-y-1">
                        {(t("criticalInfo.transportSection.tips", { returnObjects: true }) as string[]).map((tip, i) => (
                          <li key={i}>• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {viewMode === "medical" && (
          <>
            {selectedMedicalCity ? (
              <div className="space-y-4">
                <button 
                  onClick={() => setSelectedMedicalCity(null)}
                  className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors"
                  data-testid="back-from-city"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('criticalInfo.medicalSection.facilityView.backToAllCities')}
                </button>

                <div className="bg-gradient-to-br from-red-900/30 to-red-950/20 border border-red-500/20 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={getFlagUrlByCode(selectedMedicalCity.flag, 40)} alt={selectedMedicalCity.city} className="w-8 h-6 object-cover rounded" />
                    <div>
                      <h2 className="text-xl font-display font-bold text-white">{selectedMedicalCity.city}</h2>
                      <p className="text-sm text-muted-foreground">{selectedMedicalCity.stadium}</p>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedMedicalCity.stadiumLat},${selectedMedicalCity.stadiumLng}&hl=${currentLanguage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    data-testid="stadium-map-link"
                  >
                    <MapPin className="w-3 h-3" />
                    {t('criticalInfo.medicalSection.facilityView.viewStadiumOnMap')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setFacilityFilter("all")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${facilityFilter === "all" ? "bg-white text-black" : "bg-card text-muted-foreground"}`}
                    data-testid="filter-all"
                  >
                    {t('criticalInfo.medicalSection.facilityView.filterAll')}
                  </button>
                  <button
                    onClick={() => setFacilityFilter("er")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${facilityFilter === "er" ? "bg-red-500 text-white" : "bg-card text-muted-foreground"}`}
                    data-testid="filter-er"
                  >
                    {t('criticalInfo.medicalSection.facilityView.filterErOnly')}
                  </button>
                  <button
                    onClick={() => setFacilityFilter("urgent")}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${facilityFilter === "urgent" ? "bg-blue-500 text-white" : "bg-card text-muted-foreground"}`}
                    data-testid="filter-urgent"
                  >
                    {t('criticalInfo.medicalSection.facilityView.filterUrgentCare')}
                  </button>
                </div>

                <div className="space-y-3">
                  {selectedMedicalCity.facilities
                    .filter(f => facilityFilter === "all" || f.type === facilityFilter)
                    .map((facility) => (
                      <div 
                        key={facility.id}
                        className={`rounded-xl border p-4 ${
                          facility.type === "er" 
                            ? "bg-red-500/10 border-red-500/30" 
                            : "bg-blue-500/10 border-blue-500/30"
                        }`}
                        data-testid={`facility-${facility.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                facility.type === "er" 
                                  ? "bg-red-500 text-white" 
                                  : "bg-blue-500 text-white"
                              }`}>
                                {facility.type === "er" ? t('criticalInfo.medicalSection.facilityView.emergencyRoomBadge') : t('criticalInfo.medicalSection.facilityView.urgentCareBadge')}
                              </span>
                            </div>
                            <h3 className="font-bold text-white">{facility.name}</h3>
                            <p className="text-xs text-muted-foreground">{facility.address}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span className="text-sm text-primary font-medium">
                              {facility.distance} ({(parseFloat(facility.distance) * 1.6).toFixed(1)} km)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{facility.drivingTime}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">{facility.hours}</div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <a
                              href={`tel:${facility.phone}`}
                              className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                              data-testid={`call-${facility.id}`}
                            >
                              <Phone className="w-3 h-3" />
                              {t('criticalInfo.medicalSection.buttons.call')}
                            </a>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&origin=${selectedMedicalCity.stadiumLat},${selectedMedicalCity.stadiumLng}&destination=${facility.lat},${facility.lng}&travelmode=driving&hl=${currentLanguage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-card border border-white/10 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                              data-testid={`directions-${facility.id}`}
                            >
                              <MapPin className="w-3 h-3" />
                              {t('criticalInfo.medicalSection.buttons.directions')}
                            </a>
                          </div>
                          {!isMobile && (
                            <p className="text-[10px] text-muted-foreground text-center">
                              {t('criticalInfo.medicalSection.facilityView.desktopCallNote')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-red-900/30 to-red-950/20 border border-red-500/20 rounded-2xl p-4">
                  <h2 className="text-lg font-display font-bold text-white mb-3 flex items-center gap-2 normal-case">
                    <Heart className="w-5 h-5 text-red-400" />
                    {t('criticalInfo.medicalSection.erVsUrgentCare.title')}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                      <div className="text-xs font-bold text-blue-400 uppercase mb-2">{t('criticalInfo.medicalSection.erVsUrgentCare.urgentCare.label')}</div>
                      <ul className="text-xs text-white/80 space-y-1">
                        {(t('criticalInfo.medicalSection.erVsUrgentCare.urgentCare.items', { returnObjects: true }) as string[]).map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                      <div className="text-xs font-bold text-red-400 uppercase mb-2">{t('criticalInfo.medicalSection.erVsUrgentCare.emergencyRoom.label')}</div>
                      <ul className="text-xs text-white/80 space-y-1">
                        {(t('criticalInfo.medicalSection.erVsUrgentCare.emergencyRoom.items', { returnObjects: true }) as string[]).map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-xs text-amber-200">
                      <strong>{t('common.tip')}:</strong> {t('criticalInfo.medicalSection.erVsUrgentCare.tip')}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">{t('criticalInfo.medicalSection.selectHostCity.title')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t('criticalInfo.medicalSection.selectHostCity.description')}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <span>🇺🇸</span> {t('criticalInfo.medicalSection.hostCityHeaders.usa')}
                  </h4>
                  {medicalFacilitiesData.filter(c => c.country === "USA").map((city) => (
                    <button
                      key={city.id}
                      onClick={() => setSelectedMedicalCity(city)}
                      className="w-full bg-card border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
                      data-testid={`city-${city.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={getFlagUrlByCode(city.flag, 40)} alt={city.city} className="w-7 h-5 object-cover rounded" />
                        <div className="text-left">
                          <div className="font-bold text-white">{city.city}</div>
                          <div className="text-xs text-muted-foreground">{city.stadium}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          {city.facilities.filter(f => f.type === "er").length} ER
                        </span>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          {city.facilities.filter(f => f.type === "urgent").length} UC
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <span>🇲🇽</span> {t('criticalInfo.medicalSection.hostCityHeaders.mexico')}
                  </h4>
                  {medicalFacilitiesData.filter(c => c.country === "Mexico").map((city) => (
                    <button
                      key={city.id}
                      onClick={() => setSelectedMedicalCity(city)}
                      className="w-full bg-card border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
                      data-testid={`city-${city.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={getFlagUrlByCode(city.flag, 40)} alt={city.city} className="w-7 h-5 object-cover rounded" />
                        <div className="text-left">
                          <div className="font-bold text-white">{city.city}</div>
                          <div className="text-xs text-muted-foreground">{city.stadium}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          {city.facilities.filter(f => f.type === "er").length} ER
                        </span>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          {city.facilities.filter(f => f.type === "urgent").length} UC
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <span>🇨🇦</span> {t('criticalInfo.medicalSection.hostCityHeaders.canada')}
                  </h4>
                  {medicalFacilitiesData.filter(c => c.country === "Canada").map((city) => (
                    <button
                      key={city.id}
                      onClick={() => setSelectedMedicalCity(city)}
                      className="w-full bg-card border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
                      data-testid={`city-${city.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={getFlagUrlByCode(city.flag, 40)} alt={city.city} className="w-7 h-5 object-cover rounded" />
                        <div className="text-left">
                          <div className="font-bold text-white">{city.city}</div>
                          <div className="text-xs text-muted-foreground">{city.stadium}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                          {city.facilities.filter(f => f.type === "er").length} ER
                        </span>
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                          {city.facilities.filter(f => f.type === "urgent").length} UC
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-primary font-medium text-sm mb-2">{t('criticalInfo.medicalSection.medicalTips.title')}</p>
                      <ul className="text-sm text-primary/80 space-y-1">
                        {(t('criticalInfo.medicalSection.medicalTips.items', { returnObjects: true }) as string[]).map((item, idx) => (
                          <li key={idx}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
