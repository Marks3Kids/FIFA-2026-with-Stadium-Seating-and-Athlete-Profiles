import { Layout } from "@/components/Layout";
import { Hotel, ArrowLeft, MapPin, DollarSign, ChevronRight, ExternalLink, Star, Wifi, Car, Dumbbell, Home } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import hotelHeroImage from "@assets/generated_images/drone_view_luxury_hotel_pool.png";
import vacationRentalImage from "@/assets/stock_images/luxury_vacation_rent_277343dc.jpg";

interface Accommodation {
  name: string;
  type: string;
  priceRange: string;
  neighborhood: string;
  description: string;
  descriptionKey: string;
  website: string;
  amenities: string[];
}

interface PriceCategory {
  category: string;
  priceRange: string;
  color: string;
  bgColor: string;
  accommodations: Accommodation[];
}

interface CityLodging {
  city: string;
  cityKey: string;
  country: string;
  countryKey: string;
  countryCode: string;
  categories: PriceCategory[];
}

const lodgingData: CityLodging[] = [
  {
    city: "New York / New Jersey",
    cityKey: "newYork",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$100-200 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Pod 51", type: "Pod Hotel", priceRange: "$", neighborhood: "Midtown East", description: "Compact modern rooms, great value", descriptionKey: "pod51", website: "https://www.thepodhotel.com", amenities: ["WiFi", "Rooftop"] },
          { name: "The Jane Hotel", type: "Boutique Hotel", priceRange: "$", neighborhood: "West Village", description: "Historic hotel with cabin-style rooms", descriptionKey: "theJaneHotel", website: "https://www.thejanenyc.com", amenities: ["WiFi", "Bar"] },
          { name: "HI NYC Hostel", type: "Hostel", priceRange: "$", neighborhood: "Upper West Side", description: "Clean, social hostel on UWS", descriptionKey: "hiNycHostel", website: "https://www.hiusa.org/hostels/new-york/new-york/hi-new-york-city", amenities: ["WiFi", "Kitchen"] },
          { name: "YOTEL New York", type: "Pod Hotel", priceRange: "$", neighborhood: "Times Square", description: "Futuristic smart rooms", descriptionKey: "yotelNewYork", website: "https://www.yotel.com/en/hotels/yotel-new-york", amenities: ["WiFi", "Gym"] },
          { name: "Freehand New York", type: "Hybrid Hotel", priceRange: "$", neighborhood: "Flatiron", description: "Hostel-hotel hybrid", descriptionKey: "freehandNewYork", website: "https://www.freehandhotels.com/new-york", amenities: ["WiFi", "Bar", "Restaurant"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$200-400 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "citizenM Times Square", type: "Design Hotel", priceRange: "$$", neighborhood: "Times Square", description: "Dutch design hotel chain", descriptionKey: "citizenmTimesSquare", website: "https://www.citizenm.com/new-york", amenities: ["WiFi", "24hr Food", "Rooftop"] },
          { name: "The Renwick Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Midtown East", description: "Art Deco charm, Curio Collection", descriptionKey: "theRenwickHotel", website: "https://www.renwickhotel.com", amenities: ["WiFi", "Gym", "Bar"] },
          { name: "Hotel 50 Bowery", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Chinatown", description: "Hip Chinatown hotel with rooftop", descriptionKey: "hotel50Bowery", website: "https://www.hotel50bowery.com", amenities: ["WiFi", "Rooftop", "Restaurant"] },
          { name: "The William Vale", type: "Design Hotel", priceRange: "$$", neighborhood: "Brooklyn", description: "Brooklyn views, rooftop pool", descriptionKey: "theWilliamVale", website: "https://www.thewilliamvale.com", amenities: ["Pool", "WiFi", "Gym"] },
          { name: "Arlo NoMad", type: "Boutique Hotel", priceRange: "$$", neighborhood: "NoMad", description: "Modern micro-rooms with style", descriptionKey: "arloNomad", website: "https://www.arlohotels.com/arlo-nomad", amenities: ["WiFi", "Rooftop", "Restaurant"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$400-700 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "The Standard High Line", type: "Design Hotel", priceRange: "$$$", neighborhood: "Meatpacking", description: "Iconic hotel over High Line", descriptionKey: "theStandardHighLine", website: "https://www.standardhotels.com/new-york", amenities: ["Pool", "Spa", "Nightclub"] },
          { name: "1 Hotel Brooklyn Bridge", type: "Eco-Luxury", priceRange: "$$$", neighborhood: "Brooklyn", description: "Sustainable luxury with views", descriptionKey: "oneHotelBrooklynBridge", website: "https://www.1hotels.com/brooklyn-bridge", amenities: ["Pool", "Spa", "Gym"] },
          { name: "The Ludlow", type: "Boutique Hotel", priceRange: "$$$", neighborhood: "Lower East Side", description: "Rock n roll meets luxury", descriptionKey: "theLudlow", website: "https://www.ludlowhotel.com", amenities: ["Pool", "Restaurant", "Bar"] },
          { name: "Park Hyatt New York", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Midtown", description: "Carnegie Hall views", descriptionKey: "parkHyattNewYork", website: "https://www.hyatt.com/en-US/hotel/new-york/park-hyatt-new-york", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "The Langham New York", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Fifth Avenue", description: "Elegant Fifth Avenue address", descriptionKey: "theLanghamNewYork", website: "https://www.langhamhotels.com/en/the-langham/new-york", amenities: ["Spa", "Restaurant", "Bar"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$700+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "The Plaza", type: "Landmark Hotel", priceRange: "$$$$", neighborhood: "Central Park South", description: "NYC's most iconic hotel", descriptionKey: "thePlaza", website: "https://www.theplazany.com", amenities: ["Spa", "Fine Dining", "Butler Service"] },
          { name: "Four Seasons New York", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Midtown", description: "Sophisticated elegance", descriptionKey: "fourSeasonsNewYork", website: "https://www.fourseasons.com/newyork", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "The St. Regis New York", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Midtown", description: "Gilded Age grandeur", descriptionKey: "theStRegisNewYork", website: "https://www.marriott.com/hotels/travel/nycxr-the-st-regis-new-york", amenities: ["Butler", "Spa", "Fine Dining"] },
          { name: "Mandarin Oriental", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Columbus Circle", description: "Asian elegance with park views", descriptionKey: "mandarinOriental", website: "https://www.mandarinoriental.com/new-york", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "The Peninsula New York", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Fifth Avenue", description: "Belle Époque landmark", descriptionKey: "thePeninsulaNewYork", website: "https://www.peninsula.com/en/new-york", amenities: ["Rooftop", "Spa", "Pool"] },
        ]
      }
    ]
  },
  {
    city: "Los Angeles",
    cityKey: "losAngeles",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$100-200 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Freehand Los Angeles", type: "Hybrid Hotel", priceRange: "$", neighborhood: "Downtown", description: "Hostel-hotel with rooftop pool", descriptionKey: "freehandLosAngeles", website: "https://www.freehandhotels.com/los-angeles", amenities: ["Pool", "WiFi", "Bar"] },
          { name: "The LINE LA", type: "Design Hotel", priceRange: "$", neighborhood: "Koreatown", description: "Hip K-Town hotel", descriptionKey: "theLineLa", website: "https://www.thelinehotel.com/los-angeles", amenities: ["Pool", "WiFi", "Restaurant"] },
          { name: "Mama Shelter Los Angeles", type: "Boutique Hotel", priceRange: "$", neighborhood: "Hollywood", description: "Playful design hotel", descriptionKey: "mamaShelterLosAngeles", website: "https://www.mamashelter.com/los-angeles", amenities: ["Rooftop", "WiFi", "Restaurant"] },
          { name: "The Hoxton Downtown LA", type: "Boutique Hotel", priceRange: "$", neighborhood: "Downtown", description: "UK brand's LA outpost", descriptionKey: "theHoxtonDowntownLa", website: "https://www.thehoxton.com/los-angeles/downtown-la", amenities: ["Pool", "WiFi", "Restaurant"] },
          { name: "Hollywood Roosevelt", type: "Historic Hotel", priceRange: "$", neighborhood: "Hollywood", description: "Historic Hollywood landmark", descriptionKey: "hollywoodRoosevelt", website: "https://www.thehollywoodroosevelt.com", amenities: ["Pool", "Nightclub", "Bar"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$200-400 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "The Ace Hotel Downtown LA", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Hip creative hub", descriptionKey: "theAceHotelDowntownLa", website: "https://www.acehotel.com/losangeles", amenities: ["Pool", "Restaurant", "Theater"] },
          { name: "Palihouse Santa Monica", type: "Aparthotel", priceRange: "$$", neighborhood: "Santa Monica", description: "Residential-style suites", descriptionKey: "palihouseSantaMonica", website: "https://www.palisociety.com/hotels/santa-monica", amenities: ["Kitchen", "WiFi", "Courtyard"] },
          { name: "Hotel Figueroa", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Spanish Colonial Revival beauty", descriptionKey: "hotelFigueroa", website: "https://www.hotelfigueroa.com", amenities: ["Pool", "Restaurant", "Bar"] },
          { name: "The Kimpton Everly", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Hollywood", description: "Modern Hollywood base", descriptionKey: "theKimptonEverly", website: "https://www.everlyhotelhollywood.com", amenities: ["Pool", "Gym", "Restaurant"] },
          { name: "Dream Hollywood", type: "Design Hotel", priceRange: "$$", neighborhood: "Hollywood", description: "Rooftop pool and TAO", descriptionKey: "dreamHollywood", website: "https://www.dreamhotels.com/hollywood", amenities: ["Pool", "Nightclub", "Restaurant"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$400-700 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Shutters on the Beach", type: "Beach Resort", priceRange: "$$$", neighborhood: "Santa Monica", description: "Beachfront luxury", descriptionKey: "shuttersOnTheBeach", website: "https://www.shuttersonthebeach.com", amenities: ["Beach", "Spa", "Pool"] },
          { name: "The Edition West Hollywood", type: "Boutique Luxury", priceRange: "$$$", neighborhood: "West Hollywood", description: "Ian Schrager's latest", descriptionKey: "theEditionWestHollywood", website: "https://www.editionhotels.com/weho", amenities: ["Pool", "Spa", "Nightclub"] },
          { name: "Fairmont Miramar", type: "Historic Luxury", priceRange: "$$$", neighborhood: "Santa Monica", description: "Oceanfront luxury resort", descriptionKey: "fairmontMiramar", website: "https://www.fairmont.com/santa-monica", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "SLS Hotel Beverly Hills", type: "Design Hotel", priceRange: "$$$", neighborhood: "Beverly Hills", description: "Philippe Starck design", descriptionKey: "slsHotelBeverlyHills", website: "https://www.sbe.com/hotels/sls-hotels/beverly-hills", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "NoMad Los Angeles", type: "Boutique Luxury", priceRange: "$$$", neighborhood: "Downtown", description: "Elegant NYC import", descriptionKey: "nomadLosAngeles", website: "https://www.thenomadhotel.com/los-angeles", amenities: ["Pool", "Restaurant", "Bar"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$700+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "The Beverly Hills Hotel", type: "Legendary Hotel", priceRange: "$$$$", neighborhood: "Beverly Hills", description: "The Pink Palace", descriptionKey: "theBeverlyHillsHotel", website: "https://www.dorchestercollection.com/en/los-angeles/the-beverly-hills-hotel", amenities: ["Pool", "Spa", "Bungalows"] },
          { name: "Hotel Bel-Air", type: "Luxury Resort", priceRange: "$$$$", neighborhood: "Bel-Air", description: "Swan Lake elegance", descriptionKey: "hotelBelAir", website: "https://www.dorchestercollection.com/en/los-angeles/hotel-bel-air", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "Four Seasons Beverly Wilshire", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Beverly Hills", description: "Rodeo Drive landmark", descriptionKey: "fourSeasonsBeverlyWilshire", website: "https://www.fourseasons.com/beverlywilshire", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "The Peninsula Beverly Hills", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Beverly Hills", description: "Garden rooftop villas", descriptionKey: "thePeninsulaBeverlyHills", website: "https://www.peninsula.com/en/beverly-hills", amenities: ["Rooftop", "Spa", "Pool"] },
          { name: "Waldorf Astoria Beverly Hills", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Beverly Hills", description: "Modern Beverly Hills luxury", descriptionKey: "waldorfAstoriaBeverlyHills", website: "https://www.waldorfastoria.com/beverly-hills", amenities: ["Rooftop", "Spa", "Pool"] },
        ]
      }
    ]
  },
  {
    city: "Miami",
    cityKey: "miami",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$100-200 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Generator Miami", type: "Design Hostel", priceRange: "$", neighborhood: "Miami Beach", description: "Stylish hostel with pool", descriptionKey: "generatorMiami", website: "https://www.staygenerator.com/destinations/miami", amenities: ["Pool", "WiFi", "Bar"] },
          { name: "The Freehand Miami", type: "Hybrid Hotel", priceRange: "$", neighborhood: "Miami Beach", description: "Hip hostel-hotel hybrid", descriptionKey: "theFreehandMiami", website: "https://www.freehandhotels.com/miami", amenities: ["Pool", "Bar", "Restaurant"] },
          { name: "The Vagabond Hotel", type: "Retro Motel", priceRange: "$", neighborhood: "MiMo District", description: "Mid-century modern gem", descriptionKey: "theVagabondHotel", website: "https://www.thevagabondhotel.com", amenities: ["Pool", "Bar", "Restaurant"] },
          { name: "The Clay Hotel", type: "Historic Hotel", priceRange: "$", neighborhood: "South Beach", description: "Spanish-style in SoBe", descriptionKey: "theClayHotel", website: "https://www.clayhotel.com", amenities: ["WiFi", "Garden", "Bar"] },
          { name: "Life House Little Havana", type: "Boutique Hotel", priceRange: "$", neighborhood: "Little Havana", description: "Cuban-inspired design", descriptionKey: "lifeHouseLittleHavana", website: "https://www.lifehousehotels.com/little-havana", amenities: ["Pool", "WiFi", "Restaurant"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$200-400 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "The Plymouth Hotel", type: "Art Deco", priceRange: "$$", neighborhood: "South Beach", description: "Art Deco elegance", descriptionKey: "thePlymouthHotel", website: "https://www.theplymouthmiami.com", amenities: ["Pool", "Restaurant", "Bar"] },
          { name: "The Confidante Miami Beach", type: "Beach Hotel", priceRange: "$$", neighborhood: "Mid-Beach", description: "Beachfront boutique", descriptionKey: "theConfidanteMiamiBeach", website: "https://www.theconfidantemiamibeach.com", amenities: ["Beach", "Pool", "Spa"] },
          { name: "The Gabriel Miami", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Downtown sophistication", descriptionKey: "theGabrielMiami", website: "https://www.thegabrielmiami.com", amenities: ["Pool", "Gym", "Restaurant"] },
          { name: "Kimpton EPIC Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Waterfront with views", descriptionKey: "kimptonEpicHotel", website: "https://www.epichotel.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "The Standard Spa Miami Beach", type: "Spa Hotel", priceRange: "$$", neighborhood: "Belle Isle", description: "Wellness-focused escape", descriptionKey: "theStandardSpaMiamiBeach", website: "https://www.standardhotels.com/miami", amenities: ["Spa", "Pool", "Restaurant"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$400-700 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Faena Hotel Miami Beach", type: "Luxury Beach", priceRange: "$$$", neighborhood: "Mid-Beach", description: "Theatrical luxury", descriptionKey: "faenaHotelMiamiBeach", website: "https://www.faena.com/miami-beach", amenities: ["Beach", "Spa", "Theater"] },
          { name: "The Setai Miami Beach", type: "Luxury Resort", priceRange: "$$$", neighborhood: "South Beach", description: "Asian-inspired oceanfront", descriptionKey: "theSetaiMiamiBeach", website: "https://www.thesetaihotel.com", amenities: ["Beach", "Spa", "Pool"] },
          { name: "1 Hotel South Beach", type: "Eco-Luxury", priceRange: "$$$", neighborhood: "South Beach", description: "Sustainable beachfront", descriptionKey: "oneHotelSouthBeach", website: "https://www.1hotels.com/south-beach", amenities: ["Beach", "Spa", "Pool"] },
          { name: "W South Beach", type: "Design Hotel", priceRange: "$$$", neighborhood: "South Beach", description: "Scene-y beachfront", descriptionKey: "wSouthBeach", website: "https://www.marriott.com/wsob", amenities: ["Beach", "Pool", "Nightclub"] },
          { name: "The Edition Miami Beach", type: "Boutique Luxury", priceRange: "$$$", neighborhood: "Mid-Beach", description: "Ian Schrager masterpiece", descriptionKey: "theEditionMiamiBeach", website: "https://www.editionhotels.com/miami-beach", amenities: ["Beach", "Spa", "Bowling"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$700+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Four Seasons Surf Club", type: "Legendary Resort", priceRange: "$$$$", neighborhood: "Surfside", description: "Historic glamour restored", descriptionKey: "fourSeasonsSurfClub", website: "https://www.fourseasons.com/surfside", amenities: ["Beach", "Spa", "Fine Dining"] },
          { name: "Acqualina Resort", type: "Beachfront Resort", priceRange: "$$$$", neighborhood: "Sunny Isles", description: "Mediterranean oasis", descriptionKey: "acqualinarResort", website: "https://www.acqualinaresort.com", amenities: ["Beach", "Spa", "Pool"] },
          { name: "The St. Regis Bal Harbour", type: "Luxury Resort", priceRange: "$$$$", neighborhood: "Bal Harbour", description: "Oceanfront butler service", descriptionKey: "theStRegisBalHarbour", website: "https://www.stregisbalharbour.com", amenities: ["Beach", "Spa", "Butler"] },
          { name: "The Ritz-Carlton South Beach", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "South Beach", description: "Art Deco meets luxury", descriptionKey: "theRitzCarltonSouthBeach", website: "https://www.ritzcarlton.com/southbeach", amenities: ["Beach", "Spa", "Pool"] },
          { name: "Mandarin Oriental Miami", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Brickell Key", description: "Private island luxury", descriptionKey: "mandarinOrientalMiami", website: "https://www.mandarinoriental.com/miami", amenities: ["Spa", "Pool", "Beach"] },
        ]
      }
    ]
  },
  {
    city: "Dallas",
    cityKey: "dallas",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$80-150 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Nylo Las Colinas", type: "Boutique Hotel", priceRange: "$", neighborhood: "Irving", description: "Modern loft-style rooms", descriptionKey: "nyloLasColinas", website: "https://www.nylohotels.com", amenities: ["Pool", "WiFi", "Gym"] },
          { name: "Aloft Dallas Downtown", type: "Design Hotel", priceRange: "$", neighborhood: "Downtown", description: "W Hotels' younger sibling", descriptionKey: "aloftDallasDowntown", website: "https://www.aloftdallasdowntown.com", amenities: ["Pool", "WiFi", "Bar"] },
          { name: "Home2 Suites by Hilton", type: "Extended Stay", priceRange: "$", neighborhood: "Multiple locations", description: "All-suite eco-friendly", descriptionKey: "home2SuitesByHilton", website: "https://www.home2suites.com", amenities: ["Kitchen", "Pool", "Gym"] },
          { name: "La Quinta Inn & Suites", type: "Value Hotel", priceRange: "$", neighborhood: "Multiple locations", description: "Reliable value option", descriptionKey: "laQuintaInnAndSuites", website: "https://www.wyndhamhotels.com/laquinta", amenities: ["WiFi", "Breakfast", "Pool"] },
          { name: "The Highland Dallas", type: "Boutique Hotel", priceRange: "$", neighborhood: "Highland Park", description: "Curio Collection hotel", descriptionKey: "theHighlandDallas", website: "https://www.thehighlanddallas.com", amenities: ["Pool", "Spa", "Restaurant"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$150-300 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "The Statler Dallas", type: "Historic Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Revived 1956 landmark", descriptionKey: "theStatlerDallas", website: "https://www.thestatlerdallas.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Hotel ZaZa Dallas", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Uptown", description: "Eclectic luxury", descriptionKey: "hotelZazaDallas", website: "https://www.hotelzaza.com/dallas", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "The Adolphus Hotel", type: "Historic Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Beaux-Arts landmark", descriptionKey: "theAdolphusHotel", website: "https://www.theadolphus.com", amenities: ["Restaurant", "Spa", "Bar"] },
          { name: "The Joule", type: "Design Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Iconic cantilevered pool", descriptionKey: "theJoule", website: "https://www.thejouledallas.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Warwick Melrose Dallas", type: "Historic Hotel", priceRange: "$$", neighborhood: "Oak Lawn", description: "1920s elegance", descriptionKey: "warwickMelroseDallas", website: "https://www.warwickmelrose.com", amenities: ["Restaurant", "Bar", "Gym"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$300-500 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "The Ritz-Carlton Dallas", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Uptown", description: "Classic luxury", descriptionKey: "theRitzCarltonDallas", website: "https://www.ritzcarlton.com/dallas", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Four Seasons Resort Dallas", type: "Luxury Resort", priceRange: "$$$", neighborhood: "Las Colinas", description: "Resort experience in the city", descriptionKey: "fourSeasonsResortDallas", website: "https://www.fourseasons.com/dallas", amenities: ["Golf", "Spa", "Pool"] },
          { name: "The Mansion on Turtle Creek", type: "Historic Luxury", priceRange: "$$$", neighborhood: "Turtle Creek", description: "Dallas institution", descriptionKey: "theMansionOnTurtleCreek", website: "https://www.rosewoodhotels.com/dallas", amenities: ["Spa", "Restaurant", "Pool"] },
          { name: "W Dallas Victory", type: "Design Hotel", priceRange: "$$$", neighborhood: "Victory Park", description: "Downtown hotspot", descriptionKey: "wDallasVictory", website: "https://www.marriott.com/wdal", amenities: ["Pool", "Spa", "Bar"] },
          { name: "Hotel Crescent Court", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Uptown", description: "European-style luxury", descriptionKey: "hotelCrescentCourt", website: "https://www.crescentcourt.com", amenities: ["Spa", "Pool", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$500+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "The Mansion on Turtle Creek", type: "Historic Mansion", priceRange: "$$$$", neighborhood: "Turtle Creek", description: "Rosewood flagship", descriptionKey: "theMansionOnTurtleCreekLuxury", website: "https://www.rosewoodhotels.com/dallas", amenities: ["Butler", "Spa", "Fine Dining"] },
          { name: "Four Seasons Resort", type: "Luxury Resort", priceRange: "$$$$", neighborhood: "Las Colinas", description: "Championship golf", descriptionKey: "fourSeasonsResort", website: "https://www.fourseasons.com/dallas", amenities: ["Golf", "Spa", "Pool"] },
          { name: "The Virgin Hotels Dallas", type: "Lifestyle Hotel", priceRange: "$$$$", neighborhood: "Design District", description: "Richard Branson's vision", descriptionKey: "theVirginHotelsDallas", website: "https://www.virginhotels.com/dallas", amenities: ["Pool", "Rooftop", "Spa"] },
          { name: "Thompson Dallas", type: "Boutique Luxury", priceRange: "$$$$", neighborhood: "The Arts District", description: "Arts District sophistication", descriptionKey: "thompsonDallas", website: "https://www.thompsonhotels.com/dallas", amenities: ["Pool", "Rooftop", "Spa"] },
          { name: "The Rosewood Mansion", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Turtle Creek", description: "Ultimate Dallas luxury", descriptionKey: "theRosewoodMansion", website: "https://www.rosewoodhotels.com", amenities: ["Butler", "Spa", "Dining"] },
        ]
      }
    ]
  },
  {
    city: "Atlanta",
    cityKey: "atlanta",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$80-150 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Hotel Indigo Atlanta Downtown", type: "Boutique Hotel", priceRange: "$", neighborhood: "Downtown", description: "Colorful boutique option", descriptionKey: "hotelIndigoAtlantaDowntown", website: "https://www.ihg.com/hotelindigo/atlanta", amenities: ["WiFi", "Gym", "Restaurant"] },
          { name: "Aloft Atlanta Downtown", type: "Design Hotel", priceRange: "$", neighborhood: "Downtown", description: "Modern and playful", descriptionKey: "aloftAtlantaDowntown", website: "https://www.marriott.com/aloft-atlanta", amenities: ["Pool", "WiFi", "Bar"] },
          { name: "The Social Goat B&B", type: "Bed & Breakfast", priceRange: "$", neighborhood: "East Atlanta", description: "Quirky B&B with goats", descriptionKey: "theSocialGoatBandB", website: "https://www.thesocialgoat.com", amenities: ["Breakfast", "WiFi", "Garden"] },
          { name: "Hotel Clermont", type: "Boutique Hotel", priceRange: "$", neighborhood: "Poncey-Highland", description: "Revived Atlanta icon", descriptionKey: "hotelClermont", website: "https://www.hotelclermont.com", amenities: ["Rooftop", "Bar", "Restaurant"] },
          { name: "Home2 Suites Atlanta Downtown", type: "Extended Stay", priceRange: "$", neighborhood: "Downtown", description: "All-suite value", descriptionKey: "home2SuitesAtlantaDowntown", website: "https://www.home2suites.com", amenities: ["Kitchen", "Pool", "Gym"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$150-300 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "The Ellis Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Women-friendly floor option", descriptionKey: "theEllisHotel", website: "https://www.ellishotel.com", amenities: ["Gym", "Restaurant", "Bar"] },
          { name: "Loews Atlanta Hotel", type: "Luxury Hotel", priceRange: "$$", neighborhood: "Midtown", description: "Midtown sophistication", descriptionKey: "loewsAtlantaHotel", website: "https://www.loewshotels.com/atlanta", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "W Atlanta Midtown", type: "Design Hotel", priceRange: "$$", neighborhood: "Midtown", description: "Scene-y and stylish", descriptionKey: "wAtlantaMidtown", website: "https://www.marriott.com/watl", amenities: ["Pool", "Bar", "Gym"] },
          { name: "The Georgian Terrace", type: "Historic Hotel", priceRange: "$$", neighborhood: "Midtown", description: "Gone with the Wind history", descriptionKey: "theGeorgianTerrace", website: "https://www.thegeorgianterrace.com", amenities: ["Pool", "Restaurant", "Bar"] },
          { name: "Kimpton Sylvan Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Buckhead", description: "Buckhead boutique gem", descriptionKey: "kimptonSylvanHotel", website: "https://www.thesylvanhotel.com", amenities: ["Pool", "Restaurant", "Bar"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$300-500 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Four Seasons Atlanta", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Midtown", description: "Classic Five-star service", descriptionKey: "fourSeasonsAtlanta", website: "https://www.fourseasons.com/atlanta", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "The St. Regis Atlanta", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Buckhead", description: "Buckhead elegance", descriptionKey: "theStRegisAtlanta", website: "https://www.stregisatlanta.com", amenities: ["Butler", "Spa", "Pool"] },
          { name: "The Ritz-Carlton Atlanta", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Downtown", description: "Downtown landmark", descriptionKey: "theRitzCarltonAtlanta", website: "https://www.ritzcarlton.com/atlanta", amenities: ["Spa", "Restaurant", "Bar"] },
          { name: "Waldorf Astoria Atlanta Buckhead", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Buckhead", description: "Art Deco splendor", descriptionKey: "waldorfAstoriaAtlantaBuckhead", website: "https://www.waldorfastoria.com/atlanta", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "InterContinental Buckhead", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Buckhead", description: "Refined luxury", descriptionKey: "intercontinentalBuckhead", website: "https://www.ihg.com/intercontinental/buckhead", amenities: ["Pool", "Spa", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$500+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "The St. Regis Atlanta", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Buckhead", description: "Butler service perfection", descriptionKey: "theStRegisAtlantaLuxury", website: "https://www.stregisatlanta.com", amenities: ["Butler", "Spa", "Fine Dining"] },
          { name: "Mandarin Oriental Atlanta", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Buckhead", description: "Asian-inspired luxury", descriptionKey: "mandarinOrientalAtlanta", website: "https://www.mandarinoriental.com/atlanta", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "Four Seasons Atlanta", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Midtown", description: "Ultimate service", descriptionKey: "fourSeasonsAtlantaLuxury", website: "https://www.fourseasons.com/atlanta", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "The Whitley Atlanta Buckhead", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Buckhead", description: "Marriott Luxury Collection", descriptionKey: "theWhitleyAtlantaBuckhead", website: "https://www.thewhitleyhotel.com", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "JW Marriott Atlanta Buckhead", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Buckhead", description: "Upscale sophistication", descriptionKey: "jwMarriottAtlantaBuckhead", website: "https://www.marriott.com/jwatlanta", amenities: ["Spa", "Pool", "Restaurant"] },
        ]
      }
    ]
  },
  {
    city: "Houston",
    cityKey: "houston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$80-150 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Hotel Granduca Houston", type: "Boutique Hotel", priceRange: "$", neighborhood: "Uptown", description: "Italian-inspired boutique", descriptionKey: "hotelGranducaHouston", website: "https://www.granducahouston.com", amenities: ["Pool", "Restaurant", "Gym"] },
          { name: "Aloft Houston Downtown", type: "Design Hotel", priceRange: "$", neighborhood: "Downtown", description: "Modern and tech-forward", descriptionKey: "aloftHoustonDowntown", website: "https://www.marriott.com/aloft-houston", amenities: ["Pool", "WiFi", "Bar"] },
          { name: "La Colombe d'Or Hotel", type: "Mansion Hotel", priceRange: "$", neighborhood: "Montrose", description: "Art-filled mansion", descriptionKey: "laColombeDorHotel", website: "https://www.lacolombedor.com", amenities: ["Garden", "WiFi", "Art"] },
          { name: "The Lancaster Hotel", type: "Historic Hotel", priceRange: "$", neighborhood: "Downtown", description: "1926 theatrical history", descriptionKey: "theLancasterHotel", website: "https://www.thelancaster.com", amenities: ["Restaurant", "Bar", "WiFi"] },
          { name: "Hotel Icon", type: "Historic Hotel", priceRange: "$", neighborhood: "Downtown", description: "1911 bank building", descriptionKey: "hotelIcon", website: "https://www.hotelicon.com", amenities: ["Pool", "Spa", "Restaurant"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$150-300 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "The Sam Houston Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Curio Collection gem", descriptionKey: "theSamHoustonHotel", website: "https://www.thesamhoustonhotel.com", amenities: ["Pool", "Restaurant", "Bar"] },
          { name: "Hotel ZaZa Houston", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Museum District", description: "Glamorous boutique", descriptionKey: "hotelZazaHouston", website: "https://www.hotelzaza.com/houston", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "The Whitehall Houston", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Art-focused boutique", descriptionKey: "theWhitehallHouston", website: "https://www.thewhitehallhouston.com", amenities: ["Restaurant", "Bar", "Gym"] },
          { name: "Marriott Marquis Houston", type: "Convention Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Texas-shaped rooftop pool", descriptionKey: "marriottMarquisHouston", website: "https://www.marriott.com/mrkqm", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "The Magnolia Hotel Houston", type: "Historic Hotel", priceRange: "$$", neighborhood: "Downtown", description: "1926 landmark", descriptionKey: "theMagnoliaHotelHouston", website: "https://www.magnoliahotels.com/houston", amenities: ["Gym", "Bar", "WiFi"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$300-500 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "The Post Oak Hotel", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Uptown", description: "Houston's newest luxury", descriptionKey: "thePostOakHotel", website: "https://www.thepostoak.com", amenities: ["Spa", "Pool", "Rolls-Royce"] },
          { name: "Four Seasons Houston", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Downtown", description: "Classic luxury downtown", descriptionKey: "fourSeasonsHouston", website: "https://www.fourseasons.com/houston", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "The St. Regis Houston", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Galleria", description: "Butler service excellence", descriptionKey: "theStRegisHouston", website: "https://www.stregishouston.com", amenities: ["Butler", "Spa", "Restaurant"] },
          { name: "Hotel Granduca Houston", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Uptown", description: "Italian villa experience", descriptionKey: "hotelGranducaHoustonUpscale", website: "https://www.granducahouston.com", amenities: ["Pool", "Restaurant", "Spa"] },
          { name: "La Colombe d'Or", type: "Boutique Luxury", priceRange: "$$$", neighborhood: "Montrose", description: "Mansion meets museum", descriptionKey: "laColombeDor", website: "https://www.lacolombedor.com", amenities: ["Art", "Garden", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$500+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "The Post Oak Hotel", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Uptown", description: "Tilman Fertitta's flagship", descriptionKey: "thePostOakHotelLuxury", website: "https://www.thepostoak.com", amenities: ["Rolls-Royce", "Spa", "Fine Dining"] },
          { name: "The St. Regis Houston", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Galleria", description: "Ultimate butler service", descriptionKey: "theStRegisHoustonLuxury", website: "https://www.stregishouston.com", amenities: ["Butler", "Spa", "Fine Dining"] },
          { name: "Four Seasons Houston", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Downtown", description: "Five-star perfection", descriptionKey: "fourSeasonsHoustonLuxury", website: "https://www.fourseasons.com/houston", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "JW Marriott Houston Downtown", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Downtown", description: "Sophisticated downtown", descriptionKey: "jwMarriottHoustonDowntown", website: "https://www.marriott.com/jwhouston", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "The Houstonian", type: "Resort Hotel", priceRange: "$$$$", neighborhood: "Memorial", description: "Urban resort retreat", descriptionKey: "theHoustonian", website: "https://www.houstonian.com", amenities: ["Spa", "Golf", "Pool"] },
        ]
      }
    ]
  },
  {
    city: "Seattle",
    cityKey: "seattle",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$100-180 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Ace Hotel Seattle", type: "Boutique Hotel", priceRange: "$", neighborhood: "Belltown", description: "Original Ace location", descriptionKey: "aceHotelSeattle", website: "https://www.acehotel.com/seattle", amenities: ["WiFi", "Restaurant", "Bar"] },
          { name: "The State Hotel", type: "Boutique Hotel", priceRange: "$", neighborhood: "Downtown", description: "Pike Place adjacent", descriptionKey: "theStateHotel", website: "https://www.thestatehotel.com", amenities: ["WiFi", "Restaurant", "Bar"] },
          { name: "Staypineapple Hotel FIVE", type: "Boutique Hotel", priceRange: "$", neighborhood: "Downtown", description: "Fun and colorful", descriptionKey: "staypineappleHotelFive", website: "https://www.staypineapple.com/hotel-five", amenities: ["WiFi", "Gym", "Bikes"] },
          { name: "Hotel Max", type: "Art Hotel", priceRange: "$", neighborhood: "Downtown", description: "Art-forward boutique", descriptionKey: "hotelMax", website: "https://www.hotelmaxseattle.com", amenities: ["WiFi", "Art", "Gym"] },
          { name: "Moore Hotel", type: "Historic Hotel", priceRange: "$", neighborhood: "Belltown", description: "1907 theater building", descriptionKey: "mooreHotel", website: "https://www.moorehotel.com", amenities: ["WiFi", "Theater"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$180-350 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "The Edgewater", type: "Waterfront Hotel", priceRange: "$$", neighborhood: "Waterfront", description: "Beatles stayed here", descriptionKey: "theEdgewater", website: "https://www.edgewaterhotel.com", amenities: ["Waterfront", "Restaurant", "Spa"] },
          { name: "Thompson Seattle", type: "Design Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Rooftop with views", descriptionKey: "thompsonSeattle", website: "https://www.thompsonseattle.com", amenities: ["Rooftop", "Restaurant", "Spa"] },
          { name: "Hotel Theodore", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Museum-worthy design", descriptionKey: "hotelTheodore", website: "https://www.hoteltheodore.com", amenities: ["WiFi", "Restaurant", "Bar"] },
          { name: "Lotte Hotel Seattle", type: "Luxury Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Korean elegance", descriptionKey: "lotteHotelSeattle", website: "https://www.lottehotel.com/seattle", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Kimpton Palladian Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Belltown", description: "1910 building charm", descriptionKey: "kimptonPalladianHotel", website: "https://www.palladianhotel.com", amenities: ["Restaurant", "Bar", "Gym"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$350-550 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Four Seasons Seattle", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Downtown", description: "Waterfront luxury", descriptionKey: "fourSeasonsSeattle", website: "https://www.fourseasons.com/seattle", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "The Fairmont Olympic", type: "Historic Luxury", priceRange: "$$$", neighborhood: "Downtown", description: "1924 landmark hotel", descriptionKey: "theFairmontOlympic", website: "https://www.fairmont.com/seattle", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Inn at the Market", type: "Boutique Hotel", priceRange: "$$$", neighborhood: "Pike Place", description: "Pike Place hideaway", descriptionKey: "innAtTheMarket", website: "https://www.innatthemarket.com", amenities: ["Views", "Restaurant", "Rooftop"] },
          { name: "The Charter Hotel Seattle", type: "Boutique Hotel", priceRange: "$$$", neighborhood: "Downtown", description: "Curio Collection", descriptionKey: "theCharterHotelSeattle", website: "https://www.thecharterhotel.com", amenities: ["Rooftop", "Restaurant", "Bar"] },
          { name: "Kimpton Hotel Vintage", type: "Boutique Hotel", priceRange: "$$$", neighborhood: "Downtown", description: "Wine-themed boutique", descriptionKey: "kimptonHotelVintage", website: "https://www.hotelvintage-seattle.com", amenities: ["Wine Hour", "Restaurant", "Gym"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$550+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Four Seasons Seattle", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Downtown", description: "Waterfront excellence", descriptionKey: "fourSeasonsSeattleLuxury", website: "https://www.fourseasons.com/seattle", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "The Fairmont Olympic", type: "Grand Hotel", priceRange: "$$$$", neighborhood: "Downtown", description: "Historic grandeur", descriptionKey: "theFairmontOlympicLuxury", website: "https://www.fairmont.com/seattle", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "Rosewood Seattle", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Downtown", description: "New luxury landmark", descriptionKey: "rosewoodSeattle", website: "https://www.rosewoodhotels.com/seattle", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "The Willows Lodge", type: "Wine Country", priceRange: "$$$$", neighborhood: "Woodinville", description: "Wine country retreat", descriptionKey: "theWillowsLodge", website: "https://www.willowslodge.com", amenities: ["Spa", "Restaurant", "Gardens"] },
          { name: "Canlis Cottage", type: "Private Estate", priceRange: "$$$$", neighborhood: "Queen Anne", description: "Exclusive private rental", descriptionKey: "canlisCottage", website: "https://www.canlis.com", amenities: ["Private", "Views", "Kitchen"] },
        ]
      }
    ]
  },
  {
    city: "San Francisco Bay Area",
    cityKey: "sanFrancisco",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$120-200 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "HI San Francisco Fisherman's Wharf", type: "Hostel", priceRange: "$", neighborhood: "Fisherman's Wharf", description: "Historic Fort Mason hostel", descriptionKey: "hiSanFranciscoFishermansWharf", website: "https://www.hiusa.org/hostels/california/san-francisco", amenities: ["WiFi", "Kitchen", "Views"] },
          { name: "Hotel Triton", type: "Boutique Hotel", priceRange: "$", neighborhood: "Union Square", description: "Eclectic and fun", descriptionKey: "hotelTriton", website: "https://www.hoteltriton.com", amenities: ["WiFi", "Yoga", "Bar"] },
          { name: "Phoenix Hotel", type: "Motel", priceRange: "$", neighborhood: "Tenderloin", description: "Rock and roll motel", descriptionKey: "phoenixHotel", website: "https://www.jdvhotels.com/phoenix", amenities: ["Pool", "Bar", "Music"] },
          { name: "Hotel Bohème", type: "Boutique Hotel", priceRange: "$", neighborhood: "North Beach", description: "Beat Generation vibes", descriptionKey: "hotelBoheme", website: "https://www.hotelboheme.com", amenities: ["WiFi", "Character"] },
          { name: "Hotel Carlton", type: "Eco Hotel", priceRange: "$", neighborhood: "Nob Hill", description: "Green boutique hotel", descriptionKey: "hotelCarlton", website: "https://www.jdvhotels.com/carlton", amenities: ["WiFi", "Eco-Friendly"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$200-400 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "Hotel Vitale", type: "Waterfront Hotel", priceRange: "$$", neighborhood: "Embarcadero", description: "Bay views and spa", descriptionKey: "hotelVitale", website: "https://www.hotelvitale.com", amenities: ["Spa", "Views", "Restaurant"] },
          { name: "The Line San Francisco", type: "Design Hotel", priceRange: "$$", neighborhood: "Tenderloin", description: "Trendy Tenderloin base", descriptionKey: "theLineSanFrancisco", website: "https://www.thelinehotel.com/san-francisco", amenities: ["Restaurant", "Bar", "Gym"] },
          { name: "Proper Hotel San Francisco", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Mid-Market", description: "Kelly Wearstler design", descriptionKey: "properHotelSanFrancisco", website: "https://www.properhotel.com/san-francisco", amenities: ["Rooftop", "Restaurant", "Gym"] },
          { name: "Hotel Zeppelin", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Union Square", description: "Counterculture spirit", descriptionKey: "hotelZeppelin", website: "https://www.hotelzeppelin.com", amenities: ["Bar", "Game Room", "Music"] },
          { name: "The Battery", type: "Members Club", priceRange: "$$", neighborhood: "Financial District", description: "Private club with rooms", descriptionKey: "theBattery", website: "https://www.thebatterysf.com", amenities: ["Pool", "Spa", "Restaurant"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$400-700 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Four Seasons San Francisco", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "SoMa", description: "Five-star service", descriptionKey: "fourSeasonsSanFrancisco", website: "https://www.fourseasons.com/sanfrancisco", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "The Ritz-Carlton San Francisco", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Nob Hill", description: "Nob Hill landmark", descriptionKey: "theRitzCarltonSanFrancisco", website: "https://www.ritzcarlton.com/sanfrancisco", amenities: ["Spa", "Restaurant", "Club Floor"] },
          { name: "Fairmont San Francisco", type: "Historic Luxury", priceRange: "$$$", neighborhood: "Nob Hill", description: "Iconic hilltop hotel", descriptionKey: "fairmontSanFrancisco", website: "https://www.fairmont.com/san-francisco", amenities: ["Spa", "Restaurant", "Bar"] },
          { name: "Palace Hotel", type: "Historic Luxury", priceRange: "$$$", neighborhood: "SoMa", description: "1875 landmark hotel", descriptionKey: "palaceHotel", website: "https://www.sfpalace.com", amenities: ["Pool", "Spa", "Garden Court"] },
          { name: "St. Regis San Francisco", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "SoMa", description: "Museum-adjacent luxury", descriptionKey: "stRegisSanFrancisco", website: "https://www.stregissanfrancisco.com", amenities: ["Butler", "Spa", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$700+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Rosewood Sand Hill", type: "Resort", priceRange: "$$$$", neighborhood: "Menlo Park", description: "Silicon Valley retreat", descriptionKey: "rosewoodSandHill", website: "https://www.rosewoodhotels.com/sandhill", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "Cavallo Point Lodge", type: "Historic Lodge", priceRange: "$$$$", neighborhood: "Sausalito", description: "Golden Gate views", descriptionKey: "cavalloPointLodge", website: "https://www.cavallopoint.com", amenities: ["Spa", "Restaurant", "Views"] },
          { name: "The Ritz-Carlton San Francisco", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Nob Hill", description: "Legendary service", descriptionKey: "theRitzCarltonSanFranciscoLuxury", website: "https://www.ritzcarlton.com/sanfrancisco", amenities: ["Spa", "Fine Dining", "Club"] },
          { name: "Four Seasons Embarcadero", type: "Urban Luxury", priceRange: "$$$$", neighborhood: "Embarcadero", description: "Waterfront elegance", descriptionKey: "fourSeasonsEmbarcadero", website: "https://www.fourseasons.com/sanfranciscoe", amenities: ["Spa", "Pool", "Views"] },
          { name: "Meadowood Napa Valley", type: "Wine Resort", priceRange: "$$$$", neighborhood: "Napa Valley", description: "Wine country luxury", descriptionKey: "meadowoodNapaValley", website: "https://www.meadowood.com", amenities: ["Golf", "Spa", "Fine Dining"] },
        ]
      }
    ]
  },
  {
    city: "Boston",
    cityKey: "boston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$100-200 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "HI Boston Hostel", type: "Hostel", priceRange: "$", neighborhood: "Chinatown", description: "Clean, central hostel", descriptionKey: "hiBostonHostel", website: "https://www.hiusa.org/hostels/massachusetts/boston", amenities: ["WiFi", "Kitchen", "Lounge"] },
          { name: "The Revolution Hotel", type: "Boutique Hotel", priceRange: "$", neighborhood: "South End", description: "Micro-rooms, big style", descriptionKey: "theRevolutionHotel", website: "https://www.therevolutionhotel.com", amenities: ["WiFi", "Rooftop", "Bikes"] },
          { name: "The Verb Hotel", type: "Boutique Hotel", priceRange: "$", neighborhood: "Fenway", description: "Rock and roll themed", descriptionKey: "theVerbHotel", website: "https://www.theverbhotel.com", amenities: ["Pool", "Music", "Bar"] },
          { name: "Hotel Commonwealth", type: "Boutique Hotel", priceRange: "$", neighborhood: "Kenmore Square", description: "Near Fenway Park", descriptionKey: "hotelCommonwealth", website: "https://www.hotelcommonwealth.com", amenities: ["Restaurant", "Gym", "Bar"] },
          { name: "The Godfrey Hotel Boston", type: "Boutique Hotel", priceRange: "$", neighborhood: "Downtown Crossing", description: "Modern and stylish", descriptionKey: "theGodfreyHotelBoston", website: "https://www.godfreyhotelboston.com", amenities: ["WiFi", "Restaurant", "Gym"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$200-400 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "The Liberty Hotel", type: "Historic Hotel", priceRange: "$$", neighborhood: "Beacon Hill", description: "Former jail, now luxury", descriptionKey: "theLibertyHotel", website: "https://www.libertyhotel.com", amenities: ["Restaurant", "Bar", "Gym"] },
          { name: "Kimpton Onyx Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "North Station", description: "Modern luxury near TD Garden", descriptionKey: "kimptonOnyxHotel", website: "https://www.onyxhotel.com", amenities: ["WiFi", "Wine Hour", "Gym"] },
          { name: "The Envoy Hotel", type: "Waterfront Hotel", priceRange: "$$", neighborhood: "Seaport", description: "Seaport innovation hub", descriptionKey: "theEnvoyHotel", website: "https://www.theenvoyhotel.com", amenities: ["Rooftop", "Restaurant", "Views"] },
          { name: "The Boxer Boston", type: "Boutique Hotel", priceRange: "$$", neighborhood: "North End", description: "Intimate boutique", descriptionKey: "theBoxerBoston", website: "https://www.theboxerboston.com", amenities: ["WiFi", "Gym", "Restaurant"] },
          { name: "XV Beacon", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Beacon Hill", description: "Townhouse luxury", descriptionKey: "xvBeacon", website: "https://www.xvbeacon.com", amenities: ["Fireplace", "Library", "Restaurant"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$400-650 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Four Seasons Boston", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Back Bay", description: "Public Garden views", descriptionKey: "fourSeasonsBoston", website: "https://www.fourseasons.com/boston", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Mandarin Oriental Boston", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Back Bay", description: "Asian elegance on Boylston", descriptionKey: "mandarinOrientalBoston", website: "https://www.mandarinoriental.com/boston", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "The Ritz-Carlton Boston", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Back Bay", description: "Classic luxury", descriptionKey: "theRitzCarltonBoston", website: "https://www.ritzcarlton.com/boston", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "The Newbury Boston", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Back Bay", description: "Reimagined Ritz", descriptionKey: "theNewburyBoston", website: "https://www.thenewburyboston.com", amenities: ["Rooftop", "Spa", "Restaurant"] },
          { name: "Boston Harbor Hotel", type: "Waterfront Luxury", priceRange: "$$$", neighborhood: "Waterfront", description: "Harbor views", descriptionKey: "bostonHarborHotel", website: "https://www.bhh.com", amenities: ["Spa", "Marina", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$650+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Four Seasons One Dalton", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Back Bay", description: "Boston's tallest residential tower", descriptionKey: "fourSeasonsOneDalton", website: "https://www.fourseasons.com/onedalton", amenities: ["Spa", "Pool", "Views"] },
          { name: "Mandarin Oriental Boston", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Back Bay", description: "Award-winning spa", descriptionKey: "mandarinOrientalBostonLuxury", website: "https://www.mandarinoriental.com/boston", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "Raffles Boston", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Back Bay", description: "New global luxury brand", descriptionKey: "rafflesBoston", website: "https://www.raffles.com/boston", amenities: ["Spa", "Pool", "Butler"] },
          { name: "The Langham Boston", type: "Historic Luxury", priceRange: "$$$$", neighborhood: "Financial District", description: "Former Federal Reserve", descriptionKey: "theLanghamBoston", website: "https://www.langhamhotels.com/boston", amenities: ["Spa", "Restaurant", "Bar"] },
          { name: "XV Beacon", type: "Boutique Luxury", priceRange: "$$$$", neighborhood: "Beacon Hill", description: "Intimate townhouse luxury", descriptionKey: "xvBeaconLuxury", website: "https://www.xvbeacon.com", amenities: ["Fireplace", "Leopard Robes", "Library"] },
        ]
      }
    ]
  },
  {
    city: "Philadelphia",
    cityKey: "philadelphia",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$80-150 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Apple Hostels Philadelphia", type: "Hostel", priceRange: "$", neighborhood: "Old City", description: "Social hostel near attractions", descriptionKey: "appleHostelsPhiladelphia", website: "https://www.applehostels.com", amenities: ["WiFi", "Kitchen", "Bar"] },
          { name: "Lokal Hotel Old City", type: "Boutique Hotel", priceRange: "$", neighborhood: "Old City", description: "Apartment-style rooms", descriptionKey: "lokalHotelOldCity", website: "https://www.staystay.com/lokal-hotel-old-city", amenities: ["Kitchen", "WiFi", "Modern"] },
          { name: "Home2 Suites", type: "Extended Stay", priceRange: "$", neighborhood: "Convention Center", description: "All-suite value", descriptionKey: "home2Suites", website: "https://www.home2suites.com", amenities: ["Kitchen", "Pool", "Gym"] },
          { name: "Study at University City", type: "Boutique Hotel", priceRange: "$", neighborhood: "University City", description: "Academic chic", descriptionKey: "studyAtUniversityCity", website: "https://www.thestudyatuniversitycity.com", amenities: ["WiFi", "Library", "Restaurant"] },
          { name: "Aloft Philadelphia Downtown", type: "Design Hotel", priceRange: "$", neighborhood: "Center City", description: "Modern W sister brand", descriptionKey: "aloftPhiladelphiaDowntown", website: "https://www.marriott.com/aloft-philadelphia", amenities: ["Pool", "WiFi", "Bar"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$150-300 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "Kimpton Hotel Monaco", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Old City", description: "Historic Lafayette Building", descriptionKey: "kimptonHotelMonaco", website: "https://www.monaco-philadelphia.com", amenities: ["Wine Hour", "Restaurant", "Gym"] },
          { name: "The Logan Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Logan Square", description: "Modern luxury", descriptionKey: "theLoganHotel", website: "https://www.theloganhotel.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Hotel Palomar", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Rittenhouse", description: "Art Deco beauty", descriptionKey: "hotelPalomar", website: "https://www.hotelpalomar-philadelphia.com", amenities: ["Pool", "Restaurant", "Gym"] },
          { name: "AKA Rittenhouse Square", type: "Extended Stay", priceRange: "$$", neighborhood: "Rittenhouse", description: "Luxury apartment living", descriptionKey: "akaRittenhouseSquare", website: "https://www.stayaka.com/rittenhouse", amenities: ["Kitchen", "Gym", "Concierge"] },
          { name: "Sofitel Philadelphia", type: "Luxury Hotel", priceRange: "$$", neighborhood: "Rittenhouse", description: "French elegance", descriptionKey: "sofitelPhiladelphia", website: "https://www.sofitel.com/philadelphia", amenities: ["Restaurant", "Bar", "Gym"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$300-500 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Four Seasons Philadelphia", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Center City", description: "Comcast Center tower", descriptionKey: "fourSeasonsPhiladelphia", website: "https://www.fourseasons.com/philadelphia", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "The Rittenhouse Hotel", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Rittenhouse", description: "Overlooking the Square", descriptionKey: "theRittenhouseHotel", website: "https://www.rfrittenhousehotel.com", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Ritz-Carlton Philadelphia", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Center City", description: "Historic bank building", descriptionKey: "ritzCarltonPhiladelphia", website: "https://www.ritzcarlton.com/philadelphia", amenities: ["Spa", "Restaurant", "Club"] },
          { name: "Kimpton Hotel Palomar", type: "Boutique Luxury", priceRange: "$$$", neighborhood: "Rittenhouse", description: "Design-forward luxury", descriptionKey: "kimptonHotelPalomar", website: "https://www.hotelpalomar-philadelphia.com", amenities: ["Pool", "Restaurant", "Spa"] },
          { name: "The Windsor Suites", type: "All-Suite Hotel", priceRange: "$$$", neighborhood: "Parkway", description: "Spacious suites", descriptionKey: "theWindsorSuites", website: "https://www.thewindsorsuites.com", amenities: ["Kitchen", "Pool", "Gym"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$500+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Four Seasons Philadelphia", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Center City", description: "57th-floor views", descriptionKey: "fourSeasonsPhiladelphiaLuxury", website: "https://www.fourseasons.com/philadelphia", amenities: ["Spa", "Pool", "Jean-Georges"] },
          { name: "The Rittenhouse Hotel", type: "Grand Hotel", priceRange: "$$$$", neighborhood: "Rittenhouse", description: "Philadelphia institution", descriptionKey: "theRittenhouseHotelLuxury", website: "https://www.rfrittenhousehotel.com", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "Ritz-Carlton Philadelphia", type: "Historic Luxury", priceRange: "$$$$", neighborhood: "Center City", description: "1908 marble masterpiece", descriptionKey: "ritzCarltonPhiladelphiaLuxury", website: "https://www.ritzcarlton.com/philadelphia", amenities: ["Spa", "Restaurant", "Club"] },
          { name: "The Bellevue Hotel", type: "Historic Luxury", priceRange: "$$$$", neighborhood: "Center City", description: "1904 grandeur", descriptionKey: "theBellevueHotel", website: "https://www.bellevuehotel.com", amenities: ["Spa", "Restaurant", "Bar"] },
          { name: "Le Meridien Philadelphia", type: "Luxury Hotel", priceRange: "$$$$", neighborhood: "Center City", description: "Georgian Revival beauty", descriptionKey: "leMeridienPhiladelphia", website: "https://www.lemeridienphiladelphia.com", amenities: ["Restaurant", "Bar", "Library"] },
        ]
      }
    ]
  },
  {
    city: "Kansas City",
    cityKey: "kansasCity",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    categories: [
      {
        category: "Budget",
        priceRange: "$70-130 USD/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "21c Museum Hotel", type: "Art Hotel", priceRange: "$", neighborhood: "Crossroads", description: "Contemporary art museum hotel", descriptionKey: "twentyOneCMuseumHotel", website: "https://www.21cmuseumhotels.com/kansascity", amenities: ["Art", "Restaurant", "Bar"] },
          { name: "Hotel Phillips", type: "Historic Hotel", priceRange: "$", neighborhood: "Downtown", description: "1931 Art Deco landmark", descriptionKey: "hotelPhillips", website: "https://www.hotelphillips.com", amenities: ["Restaurant", "Bar", "Gym"] },
          { name: "Aloft Kansas City", type: "Design Hotel", priceRange: "$", neighborhood: "Country Club Plaza", description: "Modern and playful", descriptionKey: "aloftKansasCity", website: "https://www.aloftkansascity.com", amenities: ["Pool", "Bar", "Gym"] },
          { name: "The Fontaine", type: "Boutique Hotel", priceRange: "$", neighborhood: "Country Club Plaza", description: "European elegance", descriptionKey: "theFontaine", website: "https://www.thefontainehotel.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Holiday Inn Country Club Plaza", type: "Standard Hotel", priceRange: "$", neighborhood: "Country Club Plaza", description: "Reliable chain option", descriptionKey: "holidayInnCountryClubPlaza", website: "https://www.ihg.com/holidayinn/kansascity", amenities: ["Pool", "Restaurant", "Gym"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "$130-250 USD/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "The Raphael Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Country Club Plaza", description: "European charm on the Plaza", descriptionKey: "theRaphaelHotel", website: "https://www.raphaelkc.com", amenities: ["Restaurant", "Bar", "Gym"] },
          { name: "Crossroads Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Crossroads", description: "Arts district cool", descriptionKey: "crossroadsHotel", website: "https://www.crossroadshotelkc.com", amenities: ["Rooftop", "Restaurant", "Bar"] },
          { name: "Hotel Indigo", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Country Club Plaza", description: "Colorful boutique", descriptionKey: "hotelIndigo", website: "https://www.ihg.com/hotelindigo/kansascity", amenities: ["Pool", "Restaurant", "Bar"] },
          { name: "Ambassador Hotel", type: "Historic Hotel", priceRange: "$$", neighborhood: "Downtown", description: "1925 landmark", descriptionKey: "ambassadorHotel", website: "https://www.ambassadorkansascity.com", amenities: ["Restaurant", "Bar", "Gym"] },
          { name: "The Aladdin Hotel", type: "Historic Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Jazz Age glamour", descriptionKey: "theAladdinHotel", website: "https://www.aladdinkc.com", amenities: ["Restaurant", "Bar", "Gym"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "$250-400 USD/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "InterContinental Kansas City", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Country Club Plaza", description: "Plaza sophistication", descriptionKey: "intercontinentalKansasCity", website: "https://www.ihg.com/intercontinental/kansascity", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Loews Kansas City", type: "Convention Hotel", priceRange: "$$$", neighborhood: "Downtown", description: "Convention center connected", descriptionKey: "loewsKansasCity", website: "https://www.loewshotels.com/kansascity", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "The Westin Crown Center", type: "Landmark Hotel", priceRange: "$$$", neighborhood: "Crown Center", description: "Indoor waterfall lobby", descriptionKey: "theWestinCrownCenter", website: "https://www.westinkansascity.com", amenities: ["Pool", "Restaurant", "Tennis"] },
          { name: "Marriott Kansas City Downtown", type: "Full-Service Hotel", priceRange: "$$$", neighborhood: "Downtown", description: "Connected to convention", descriptionKey: "marriottKansasCityDowntown", website: "https://www.marriott.com/mkcdt", amenities: ["Pool", "Restaurant", "Gym"] },
          { name: "Sheraton Crown Center", type: "Conference Hotel", priceRange: "$$$", neighborhood: "Crown Center", description: "Atrium hotel", descriptionKey: "sheratonCrownCenter", website: "https://www.sheratonkansascity.com", amenities: ["Pool", "Restaurant", "Gym"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "$400+ USD/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "InterContinental Kansas City", type: "Premier Hotel", priceRange: "$$$$", neighborhood: "Country Club Plaza", description: "Plaza's finest", descriptionKey: "intercontinentalKansasCityLuxury", website: "https://www.ihg.com/intercontinental/kansascity", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "The Fontaine", type: "Boutique Luxury", priceRange: "$$$$", neighborhood: "Country Club Plaza", description: "European elegance", descriptionKey: "theFontaineLuxury", website: "https://www.thefontainehotel.com", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "21c Museum Hotel", type: "Art Luxury", priceRange: "$$$$", neighborhood: "Crossroads", description: "Contemporary art experience", descriptionKey: "twentyOneCMuseumHotelLuxury", website: "https://www.21cmuseumhotels.com/kansascity", amenities: ["Art", "Restaurant", "Spa"] },
          { name: "The Raphael Hotel", type: "Classic Luxury", priceRange: "$$$$", neighborhood: "Country Club Plaza", description: "Kansas City's grande dame", descriptionKey: "theRaphaelHotelLuxury", website: "https://www.raphaelkc.com", amenities: ["Restaurant", "Bar", "Concierge"] },
          { name: "Hotel Kansas City", type: "Historic Luxury", priceRange: "$$$$", neighborhood: "Downtown", description: "Restored club building", descriptionKey: "hotelKansasCity", website: "https://www.hotelkansascity.com", amenities: ["Pool", "Rooftop", "Restaurant"] },
        ]
      }
    ]
  },
  {
    city: "Toronto",
    cityKey: "toronto",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    categories: [
      {
        category: "Budget",
        priceRange: "CAD $120-200/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "HI Toronto Hostel", type: "Hostel", priceRange: "$", neighborhood: "Church-Wellesley", description: "Central and social", descriptionKey: "hiTorontoHostel", website: "https://www.hihostels.ca/toronto", amenities: ["WiFi", "Kitchen", "Lounge"] },
          { name: "The Drake Hotel", type: "Boutique Hotel", priceRange: "$", neighborhood: "West Queen West", description: "Art and culture hub", descriptionKey: "theDrakeHotel", website: "https://www.thedrake.ca", amenities: ["Restaurant", "Bar", "Rooftop"] },
          { name: "Gladstone Hotel", type: "Art Hotel", priceRange: "$", neighborhood: "West Queen West", description: "Artist-designed rooms", descriptionKey: "gladstoneHotel", website: "https://www.gladstonehotel.com", amenities: ["Art", "Bar", "Events"] },
          { name: "The Annex Hotel", type: "Boutique Hotel", priceRange: "$", neighborhood: "The Annex", description: "Neighborhood boutique", descriptionKey: "theAnnexHotel", website: "https://www.theannexhotel.com", amenities: ["WiFi", "Bar", "Restaurant"] },
          { name: "Hotel Ocho", type: "Boutique Hotel", priceRange: "$", neighborhood: "Chinatown", description: "Intimate boutique", descriptionKey: "hotelOcho", website: "https://www.hotelocho.com", amenities: ["Restaurant", "Bar", "Rooftop"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "CAD $200-350/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "The Broadview Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Riverside", description: "Revived Victorian landmark", descriptionKey: "theBroadviewHotel", website: "https://www.thebroadviewhotel.ca", amenities: ["Rooftop", "Restaurant", "Bar"] },
          { name: "1 Hotel Toronto", type: "Eco-Luxury", priceRange: "$$", neighborhood: "King West", description: "Sustainable luxury", descriptionKey: "oneHotelToronto", website: "https://www.1hotels.com/toronto", amenities: ["Spa", "Restaurant", "Gym"] },
          { name: "Kimpton Saint George", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Yorkville", description: "Yorkville glamour", descriptionKey: "kimptonSaintGeorge", website: "https://www.thesaintgeorge.com", amenities: ["Restaurant", "Wine Hour", "Gym"] },
          { name: "Bisha Hotel", type: "Design Hotel", priceRange: "$$", neighborhood: "Entertainment District", description: "Scene-y and stylish", descriptionKey: "bishaHotel", website: "https://www.bishahoteltoronto.com", amenities: ["Pool", "Restaurant", "Nightclub"] },
          { name: "The Hazelton Hotel", type: "Boutique Luxury", priceRange: "$$", neighborhood: "Yorkville", description: "Celebrity favorite", descriptionKey: "theHazeltonHotel", website: "https://www.thehazeltonhotel.com", amenities: ["Spa", "Restaurant", "Bar"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "CAD $350-550/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Four Seasons Toronto", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Yorkville", description: "Yorkville landmark", descriptionKey: "fourSeasonsToronto", website: "https://www.fourseasons.com/toronto", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "The Ritz-Carlton Toronto", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Entertainment District", description: "Downtown luxury", descriptionKey: "theRitzCarltonToronto", website: "https://www.ritzcarlton.com/toronto", amenities: ["Spa", "Restaurant", "Bar"] },
          { name: "Shangri-La Toronto", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "University", description: "Asian-inspired luxury", descriptionKey: "shangriLaToronto", website: "https://www.shangri-la.com/toronto", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Park Hyatt Toronto", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Yorkville", description: "Bloor Street elegance", descriptionKey: "parkHyattToronto", website: "https://www.hyatt.com/parktoronto", amenities: ["Spa", "Restaurant", "Rooftop"] },
          { name: "The St. Regis Toronto", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Financial District", description: "Butler service", descriptionKey: "theStRegisToronto", website: "https://www.stregistoronto.com", amenities: ["Butler", "Spa", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "CAD $550+/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Four Seasons Toronto", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Yorkville", description: "Toronto's finest", descriptionKey: "fourSeasonsTorontoLuxury", website: "https://www.fourseasons.com/toronto", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "The Ritz-Carlton Toronto", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Entertainment District", description: "Five-star service", descriptionKey: "theRitzCarltonTorontoLuxury", website: "https://www.ritzcarlton.com/toronto", amenities: ["Spa", "Cheese Cave", "Restaurant"] },
          { name: "The St. Regis Toronto", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Financial District", description: "Butler perfection", descriptionKey: "theStRegisTorontoLuxury", website: "https://www.stregistoronto.com", amenities: ["Butler", "Spa", "Louix Louis"] },
          { name: "The Hazelton Hotel", type: "Boutique Ultra-Luxury", priceRange: "$$$$", neighborhood: "Yorkville", description: "Private and exclusive", descriptionKey: "theHazeltonHotelLuxury", website: "https://www.thehazeltonhotel.com", amenities: ["Spa", "Restaurant", "Screening Room"] },
          { name: "Rosalie at The Ritz", type: "Residence Club", priceRange: "$$$$", neighborhood: "Downtown", description: "Private residence experience", descriptionKey: "rosalieAtTheRitz", website: "https://www.ritzcarlton.com/toronto", amenities: ["Kitchen", "Butler", "Spa"] },
        ]
      }
    ]
  },
  {
    city: "Vancouver",
    cityKey: "vancouver",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    categories: [
      {
        category: "Budget",
        priceRange: "CAD $120-200/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "HI Vancouver Central", type: "Hostel", priceRange: "$", neighborhood: "Downtown", description: "Central and social", descriptionKey: "hiVancouverCentral", website: "https://www.hihostels.ca/vancouver", amenities: ["WiFi", "Kitchen", "Tours"] },
          { name: "YWCA Hotel Vancouver", type: "Budget Hotel", priceRange: "$", neighborhood: "Downtown", description: "Clean and central", descriptionKey: "ywcaHotelVancouver", website: "https://www.ywcavan.org/hotel", amenities: ["WiFi", "Gym", "Kitchen"] },
          { name: "The Burrard", type: "Retro Motel", priceRange: "$", neighborhood: "Downtown", description: "Retro-modern motor inn", descriptionKey: "theBurrard", website: "https://www.theburrard.com", amenities: ["Bikes", "WiFi", "Courtyard"] },
          { name: "St. Regis Hotel Vancouver", type: "Budget Hotel", priceRange: "$", neighborhood: "Downtown", description: "Not the luxury chain", descriptionKey: "stRegisHotelVancouver", website: "https://www.stregishotel.com", amenities: ["Restaurant", "Bar", "WiFi"] },
          { name: "Victorian Hotel", type: "Historic Hotel", priceRange: "$", neighborhood: "Downtown", description: "European-style B&B feel", descriptionKey: "victorianHotel", website: "https://www.victorianhotel.ca", amenities: ["WiFi", "Breakfast"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "CAD $200-350/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "Loden Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Coal Harbour", description: "Boutique luxury", descriptionKey: "lodenHotel", website: "https://www.theloden.com", amenities: ["Spa", "Restaurant", "Gym"] },
          { name: "Opus Hotel", type: "Design Hotel", priceRange: "$$", neighborhood: "Yaletown", description: "Hip Yaletown base", descriptionKey: "opusHotel", website: "https://www.opushotel.com", amenities: ["Restaurant", "Bar", "Gym"] },
          { name: "Wedgewood Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Downtown", description: "European elegance", descriptionKey: "wedgewoodHotel", website: "https://www.wedgewoodhotel.com", amenities: ["Spa", "Restaurant", "Bar"] },
          { name: "Fairmont Hotel Vancouver", type: "Historic Hotel", priceRange: "$$", neighborhood: "Downtown", description: "Castle in the city", descriptionKey: "fairmontHotelVancouver", website: "https://www.fairmont.com/hotelvancouver", amenities: ["Spa", "Restaurant", "Gym"] },
          { name: "JW Marriott Parq Vancouver", type: "Luxury Hotel", priceRange: "$$", neighborhood: "Yaletown", description: "Modern luxury resort", descriptionKey: "jwMarriottParqVancouver", website: "https://www.marriott.com/jwparq", amenities: ["Spa", "Pool", "Casino"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "CAD $350-550/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Fairmont Pacific Rim", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Coal Harbour", description: "Waterfront luxury", descriptionKey: "fairmontPacificRim", website: "https://www.fairmont.com/pacificrim", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Rosewood Hotel Georgia", type: "Historic Luxury", priceRange: "$$$", neighborhood: "Downtown", description: "1927 landmark restored", descriptionKey: "rosewoodHotelGeorgia", website: "https://www.rosewoodhotels.com/georgia", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Four Seasons Vancouver", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Downtown", description: "Pacific Centre location", descriptionKey: "fourSeasonsVancouver", website: "https://www.fourseasons.com/vancouver", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Shangri-La Vancouver", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Downtown", description: "City's tallest building", descriptionKey: "shangriLaVancouver", website: "https://www.shangri-la.com/vancouver", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Pan Pacific Vancouver", type: "Waterfront Luxury", priceRange: "$$$", neighborhood: "Canada Place", description: "Cruise ship views", descriptionKey: "panPacificVancouver", website: "https://www.panpacific.com/vancouver", amenities: ["Spa", "Pool", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "CAD $550+/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Fairmont Pacific Rim", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Coal Harbour", description: "Vancouver's finest", descriptionKey: "fairmontPacificRimLuxury", website: "https://www.fairmont.com/pacificrim", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "Rosewood Hotel Georgia", type: "Historic Ultra-Luxury", priceRange: "$$$$", neighborhood: "Downtown", description: "Timeless elegance", descriptionKey: "rosewoodHotelGeorgiaLuxury", website: "https://www.rosewoodhotels.com/georgia", amenities: ["Spa", "Pool", "Hawksworth"] },
          { name: "Four Seasons Vancouver", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Downtown", description: "Five-star perfection", descriptionKey: "fourSeasonsVancouverLuxury", website: "https://www.fourseasons.com/vancouver", amenities: ["Spa", "Pool", "YEW"] },
          { name: "The Douglas at Parq", type: "Modern Luxury", priceRange: "$$$$", neighborhood: "Yaletown", description: "Autograph Collection", descriptionKey: "theDouglasAtParq", website: "https://www.thedouglasvancouver.com", amenities: ["Spa", "Pool", "D/6"] },
          { name: "L'Hermitage Hotel", type: "Boutique Luxury", priceRange: "$$$$", neighborhood: "Downtown", description: "Intimate luxury", descriptionKey: "lHermitageHotel", website: "https://www.lhermitagehotel.com", amenities: ["Pool", "Spa", "Restaurant"] },
        ]
      }
    ]
  },
  {
    city: "Mexico City",
    cityKey: "mexicoCity",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    categories: [
      {
        category: "Budget",
        priceRange: "MXN $1,000-2,500/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Chaya B&B", type: "Bed & Breakfast", priceRange: "$", neighborhood: "Roma Norte", description: "Cozy Roma Norte home", descriptionKey: "chayaBandB", website: "https://www.chayabb.com", amenities: ["Breakfast", "WiFi", "Garden"] },
          { name: "Casa de los Amigos", type: "Guesthouse", priceRange: "$", neighborhood: "Centro", description: "Quaker-run guesthouse", descriptionKey: "casaDeLosAmigos", website: "https://www.casadelosamigos.org", amenities: ["WiFi", "Kitchen", "Community"] },
          { name: "Hostel Home", type: "Hostel", priceRange: "$", neighborhood: "Roma Norte", description: "Social Roma hostel", descriptionKey: "hostelHome", website: "https://www.hostelhome.com.mx", amenities: ["WiFi", "Bar", "Kitchen"] },
          { name: "Suites del Angel", type: "Aparthotel", priceRange: "$", neighborhood: "Zona Rosa", description: "Near Angel of Independence", descriptionKey: "suitesDelAngel", website: "https://www.suitesdelangel.com", amenities: ["Kitchen", "WiFi", "Gym"] },
          { name: "Hotel Milan", type: "Budget Hotel", priceRange: "$", neighborhood: "Roma Norte", description: "Art Deco gem", descriptionKey: "hotelMilan", website: "https://www.hotelmilan.com.mx", amenities: ["WiFi", "Restaurant"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "MXN $2,500-5,000/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "Condesa DF", type: "Design Hotel", priceRange: "$$", neighborhood: "Condesa", description: "Iconic design hotel", descriptionKey: "condesaDf", website: "https://www.condesadf.com", amenities: ["Rooftop", "Restaurant", "Bar"] },
          { name: "Hotel Carlota", type: "Design Hotel", priceRange: "$$", neighborhood: "Cuauhtémoc", description: "Pool and modern art", descriptionKey: "hotelCarlota", website: "https://www.hotelcarlota.com.mx", amenities: ["Pool", "Restaurant", "Bar"] },
          { name: "Nima Local House Hotel", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Roma Norte", description: "Hip Roma spot", descriptionKey: "nimaLocalHouseHotel", website: "https://www.nimalocalhouse.com", amenities: ["Rooftop", "Bar", "Restaurant"] },
          { name: "Casa Goliana", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Roma Norte", description: "Intimate townhouse", descriptionKey: "casaGoliana", website: "https://www.casagoliana.com", amenities: ["Garden", "WiFi", "Breakfast"] },
          { name: "Ignacia Guest House", type: "Design B&B", priceRange: "$$", neighborhood: "Roma Norte", description: "Design-forward B&B", descriptionKey: "ignaciaGuestHouse", website: "https://www.ignaciaguesthouse.com", amenities: ["Breakfast", "Garden", "WiFi"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "MXN $5,000-10,000/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Las Alcobas", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Polanco", description: "Intimate luxury in Polanco", descriptionKey: "lasAlcobas", website: "https://www.lasalcobas.com", amenities: ["Spa", "Restaurant", "Bar"] },
          { name: "Four Seasons Mexico City", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Reforma", description: "Grand hacienda style", descriptionKey: "fourSeasonsMexicoCity", website: "https://www.fourseasons.com/mexicocity", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "St. Regis Mexico City", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Reforma", description: "Butler service luxury", descriptionKey: "stRegisMexicoCity", website: "https://www.stregismexicocity.com", amenities: ["Butler", "Spa", "Restaurant"] },
          { name: "JW Marriott Mexico City", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Polanco", description: "Polanco sophistication", descriptionKey: "jwMarriottMexicoCity", website: "https://www.marriott.com/jwmexicocity", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Hyatt Regency Mexico City", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Polanco", description: "Tower in Polanco", descriptionKey: "hyattRegencyMexicoCity", website: "https://www.hyatt.com/regency/mexicocity", amenities: ["Pool", "Spa", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "MXN $10,000+/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Four Seasons Mexico City", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Reforma", description: "CDMX's finest", descriptionKey: "fourSeasonsMexicoCityLuxury", website: "https://www.fourseasons.com/mexicocity", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "St. Regis Mexico City", type: "Ultra-Luxury", priceRange: "$$$$", neighborhood: "Reforma", description: "35 floors of luxury", descriptionKey: "stRegisMexicoCityLuxury", website: "https://www.stregismexicocity.com", amenities: ["Butler", "Spa", "Diana Restaurant"] },
          { name: "Las Alcobas Mexico City", type: "Boutique Ultra-Luxury", priceRange: "$$$$", neighborhood: "Polanco", description: "Intimate and refined", descriptionKey: "lasAlcobasMexicoCity", website: "https://www.lasalcobas.com", amenities: ["Spa", "Restaurant", "Bar"] },
          { name: "Sofitel Mexico City Reforma", type: "French Luxury", priceRange: "$$$$", neighborhood: "Reforma", description: "French elegance", descriptionKey: "sofitelMexicoCityReforma", website: "https://www.sofitel.com/mexicocity", amenities: ["Spa", "Restaurant", "Bar"] },
          { name: "W Mexico City", type: "Design Luxury", priceRange: "$$$$", neighborhood: "Polanco", description: "Scene and style", descriptionKey: "wMexicoCity", website: "https://www.marriott.com/wmexicocity", amenities: ["Spa", "Pool", "Living Room"] },
        ]
      }
    ]
  },
  {
    city: "Guadalajara",
    cityKey: "guadalajara",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    categories: [
      {
        category: "Budget",
        priceRange: "MXN $800-2,000/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Hostel Lit", type: "Hostel", priceRange: "$", neighborhood: "Centro", description: "Social downtown hostel", descriptionKey: "hostelLit", website: "https://www.hostellit.com", amenities: ["WiFi", "Bar", "Kitchen"] },
          { name: "Casa Pedro Loza", type: "Boutique Hotel", priceRange: "$", neighborhood: "Centro", description: "Historic center gem", descriptionKey: "casaPedroLoza", website: "https://www.casapedroloza.com", amenities: ["WiFi", "Restaurant", "Terrace"] },
          { name: "Hotel Morales", type: "Historic Hotel", priceRange: "$", neighborhood: "Centro", description: "Colonial charm", descriptionKey: "hotelMorales", website: "https://www.hotelmorales.com.mx", amenities: ["Pool", "Restaurant", "Bar"] },
          { name: "Hotel De Mendoza", type: "Colonial Hotel", priceRange: "$", neighborhood: "Centro", description: "Near Teatro Degollado", descriptionKey: "hotelDeMendoza", website: "https://www.hoteldemendoza.com.mx", amenities: ["Pool", "Restaurant", "Bar"] },
          { name: "Hotel Dali Plaza", type: "Budget Hotel", priceRange: "$", neighborhood: "Centro", description: "Simple and central", descriptionKey: "hotelDaliPlaza", website: "https://www.hoteldali.com", amenities: ["WiFi", "Restaurant"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "MXN $2,000-4,000/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "Hotel Demetria", type: "Design Hotel", priceRange: "$$", neighborhood: "Lafayette", description: "Modern design hotel", descriptionKey: "hotelDemetria", website: "https://www.hoteldemetria.com", amenities: ["Pool", "Restaurant", "Spa"] },
          { name: "Krystal Urban Guadalajara", type: "Business Hotel", priceRange: "$$", neighborhood: "Providencia", description: "Modern business hotel", descriptionKey: "krystalUrbanGuadalajara", website: "https://www.krystal-hotels.com", amenities: ["Pool", "Gym", "Restaurant"] },
          { name: "NH Collection Guadalajara", type: "Business Hotel", priceRange: "$$", neighborhood: "Providencia", description: "Spanish chain elegance", descriptionKey: "nhCollectionGuadalajara", website: "https://www.nh-hotels.com", amenities: ["Pool", "Restaurant", "Gym"] },
          { name: "Fiesta Americana", type: "Luxury Hotel", priceRange: "$$", neighborhood: "Centro", description: "Grand downtown hotel", descriptionKey: "fiestaAmericana", website: "https://www.fiestamericana.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Hotel Riu Plaza Guadalajara", type: "Chain Hotel", priceRange: "$$", neighborhood: "Providencia", description: "Reliable chain option", descriptionKey: "hotelRiuPlazaGuadalajara", website: "https://www.riu.com", amenities: ["Pool", "Gym", "Restaurant"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "MXN $4,000-7,000/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Quinta Real Guadalajara", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Minerva", description: "Hacienda-style luxury", descriptionKey: "quintaRealGuadalajara", website: "https://www.quintareal.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Casa Fayette", type: "Design Hotel", priceRange: "$$$", neighborhood: "Lafayette", description: "Design destination", descriptionKey: "casaFayette", website: "https://www.casafayette.com", amenities: ["Pool", "Restaurant", "Spa"] },
          { name: "Hotel Presidente InterContinental", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Expo", description: "Near Expo center", descriptionKey: "hotelPresidenteIntercontinental", website: "https://www.ihg.com/intercontinental", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Hilton Guadalajara", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Providencia", description: "Modern luxury", descriptionKey: "hiltonGuadalajara", website: "https://www.hilton.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Hyatt Regency Andares", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Andares", description: "Shopping mall adjacent", descriptionKey: "hyattRegencyAndares", website: "https://www.hyatt.com", amenities: ["Pool", "Spa", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "MXN $7,000+/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Quinta Real Guadalajara", type: "Grand Hacienda", priceRange: "$$$$", neighborhood: "Minerva", description: "Ultimate GDL luxury", descriptionKey: "quintaRealGuadalajaraLuxury", website: "https://www.quintareal.com", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "Casa Fayette", type: "Design Luxury", priceRange: "$$$$", neighborhood: "Lafayette", description: "Design excellence", descriptionKey: "casaFayetteLuxury", website: "https://www.casafayette.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Hotel Demetria", type: "Boutique Luxury", priceRange: "$$$$", neighborhood: "Lafayette", description: "Art meets hospitality", descriptionKey: "hotelDemetriaLuxury", website: "https://www.hoteldemetria.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "One Guadalajara Periférico", type: "Modern Luxury", priceRange: "$$$$", neighborhood: "Providencia", description: "Contemporary luxury", descriptionKey: "oneGuadalajaraPeriferico", website: "https://www.onehotels.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Grand Fiesta Americana", type: "Premium Chain", priceRange: "$$$$", neighborhood: "Country Club", description: "Golf club location", descriptionKey: "grandFiestaAmericana", website: "https://www.fiestamericana.com", amenities: ["Golf", "Spa", "Restaurant"] },
        ]
      }
    ]
  },
  {
    city: "Monterrey",
    cityKey: "monterrey",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    categories: [
      {
        category: "Budget",
        priceRange: "MXN $800-2,000/night",
        color: "text-green-400",
        bgColor: "bg-green-500/10 border-green-500/20",
        accommodations: [
          { name: "Ibis Monterrey", type: "Budget Hotel", priceRange: "$", neighborhood: "Centro", description: "Reliable French chain", descriptionKey: "ibisMonterrey", website: "https://www.ibis.com", amenities: ["WiFi", "Restaurant", "Bar"] },
          { name: "City Express", type: "Business Budget", priceRange: "$", neighborhood: "Multiple locations", description: "Mexican business chain", descriptionKey: "cityExpress", website: "https://www.cityexpress.com", amenities: ["WiFi", "Breakfast", "Gym"] },
          { name: "Hotel Quinta Avenida", type: "Budget Hotel", priceRange: "$", neighborhood: "Centro", description: "Simple downtown option", descriptionKey: "hotelQuintaAvenida", website: "https://www.hotelquintaavenida.com", amenities: ["WiFi", "Restaurant"] },
          { name: "One Monterrey Aeropuerto", type: "Airport Hotel", priceRange: "$", neighborhood: "Airport", description: "Convenient for flights", descriptionKey: "oneMonterreyAeropuerto", website: "https://www.onehotels.com", amenities: ["WiFi", "Restaurant", "Shuttle"] },
          { name: "Fiesta Inn Centro", type: "Mid-Range Chain", priceRange: "$", neighborhood: "Centro", description: "Reliable chain hotel", descriptionKey: "fiestaInnCentro", website: "https://www.fiestainn.com", amenities: ["Pool", "Restaurant", "Gym"] },
        ]
      },
      {
        category: "Mid-Range",
        priceRange: "MXN $2,000-4,000/night",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10 border-blue-500/20",
        accommodations: [
          { name: "Krystal Monterrey", type: "Business Hotel", priceRange: "$$", neighborhood: "Centro", description: "Downtown business hotel", descriptionKey: "krystalMonterrey", website: "https://www.krystal-hotels.com", amenities: ["Pool", "Restaurant", "Gym"] },
          { name: "NH Collection Monterrey", type: "Business Hotel", priceRange: "$$", neighborhood: "San Pedro", description: "Spanish chain quality", descriptionKey: "nhCollectionMonterrey", website: "https://www.nh-hotels.com", amenities: ["Pool", "Restaurant", "Spa"] },
          { name: "Holiday Inn Monterrey", type: "Chain Hotel", priceRange: "$$", neighborhood: "Centro", description: "Familiar reliability", descriptionKey: "holidayInnMonterrey", website: "https://www.ihg.com/holidayinn", amenities: ["Pool", "Restaurant", "Gym"] },
          { name: "Safi Royal Luxury Centro", type: "Boutique Hotel", priceRange: "$$", neighborhood: "Centro", description: "Luxury downtown", descriptionKey: "safiRoyalLuxuryCentro", website: "https://www.safihoteles.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Galería Plaza Monterrey", type: "Business Hotel", priceRange: "$$", neighborhood: "San Pedro", description: "San Pedro business hotel", descriptionKey: "galeriaPlazaMonterrey", website: "https://www.brisas.com.mx/galeria-plaza", amenities: ["Pool", "Restaurant", "Gym"] },
        ]
      },
      {
        category: "Upscale",
        priceRange: "MXN $4,000-7,000/night",
        color: "text-purple-400",
        bgColor: "bg-purple-500/10 border-purple-500/20",
        accommodations: [
          { name: "Quinta Real Monterrey", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Valle Oriente", description: "Hacienda elegance", descriptionKey: "quintaRealMonterrey", website: "https://www.quintareal.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "JW Marriott Monterrey", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Valle Oriente", description: "Business luxury", descriptionKey: "jwMarriottMonterrey", website: "https://www.marriott.com/jwmonterrey", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Live Aqua Urban Resort", type: "Urban Resort", priceRange: "$$$", neighborhood: "San Pedro", description: "Hip urban resort", descriptionKey: "liveAquaUrbanResort", website: "https://www.liveaqua.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Grand Fiesta Americana", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Valle Oriente", description: "Grand hotel", descriptionKey: "grandFiestaAmericanaMonterrey", website: "https://www.fiestamericana.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Hilton Monterrey", type: "Luxury Hotel", priceRange: "$$$", neighborhood: "Centro", description: "Downtown luxury", descriptionKey: "hiltonMonterrey", website: "https://www.hilton.com", amenities: ["Pool", "Spa", "Restaurant"] },
        ]
      },
      {
        category: "Luxury",
        priceRange: "MXN $7,000+/night",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10 border-amber-500/20",
        accommodations: [
          { name: "Quinta Real Monterrey", type: "Ultimate Luxury", priceRange: "$$$$", neighborhood: "Valle Oriente", description: "Monterrey's finest", descriptionKey: "quintaRealMonterreyLuxury", website: "https://www.quintareal.com", amenities: ["Spa", "Pool", "Fine Dining"] },
          { name: "JW Marriott Monterrey Valle", type: "Business Luxury", priceRange: "$$$$", neighborhood: "Valle Oriente", description: "Five-star service", descriptionKey: "jwMarriottMonterreyValle", website: "https://www.marriott.com/jwmonterrey", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Live Aqua Urban Resort", type: "Design Luxury", priceRange: "$$$$", neighborhood: "San Pedro", description: "Contemporary cool", descriptionKey: "liveAquaUrbanResortLuxury", website: "https://www.liveaqua.com", amenities: ["Spa", "Pool", "Restaurant"] },
          { name: "Camino Real Monterrey", type: "Classic Luxury", priceRange: "$$$$", neighborhood: "Centro", description: "Established elegance", descriptionKey: "caminoRealMonterrey", website: "https://www.caminoreal.com", amenities: ["Pool", "Spa", "Restaurant"] },
          { name: "Westin Monterrey Valle", type: "Premium Chain", priceRange: "$$$$", neighborhood: "Valle Oriente", description: "Marriott premium", descriptionKey: "westinMonterreyValle", website: "https://www.westin.com", amenities: ["Spa", "Pool", "Restaurant"] },
        ]
      }
    ]
  }
];

interface VacationRentalCity {
  cityKey: string;
  city: string;
  countryCode: string;
  countryKey: string;
  airbnbUrl: string;
  vrboUrl: string;
  description: string;
}

const vacationRentalData: VacationRentalCity[] = [
  { cityKey: "newYork", city: "New York / New Jersey", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/New-York--NY/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/new-york/new-york", description: "Find apartments, lofts, and homes across Manhattan, Brooklyn, and Jersey City" },
  { cityKey: "losAngeles", city: "Los Angeles", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/Los-Angeles--CA/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/california/los-angeles", description: "Beach houses, Hollywood Hills homes, and downtown lofts" },
  { cityKey: "miami", city: "Miami", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/Miami--FL/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/florida/miami", description: "Oceanfront condos, South Beach apartments, and luxury villas" },
  { cityKey: "houston", city: "Houston", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/Houston--TX/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/texas/houston", description: "Spacious homes, downtown apartments, and suburban retreats" },
  { cityKey: "dallas", city: "Dallas", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/Dallas--TX/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/texas/dallas", description: "Modern lofts, family homes, and uptown condos" },
  { cityKey: "atlanta", city: "Atlanta", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/Atlanta--GA/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/georgia/atlanta", description: "Buckhead mansions, Midtown apartments, and cozy bungalows" },
  { cityKey: "philadelphia", city: "Philadelphia", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/Philadelphia--PA/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/pennsylvania/philadelphia", description: "Historic row homes, Center City apartments, and suburban houses" },
  { cityKey: "seattle", city: "Seattle", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/Seattle--WA/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/washington/seattle", description: "Waterfront homes, Capitol Hill apartments, and mountain-view retreats" },
  { cityKey: "sanFrancisco", city: "San Francisco Bay Area", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/San-Francisco--CA/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/california/san-francisco", description: "Victorian homes, Marina apartments, and Bay Area houses" },
  { cityKey: "boston", city: "Boston", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/Boston--MA/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/massachusetts/boston", description: "Back Bay brownstones, waterfront condos, and Cambridge apartments" },
  { cityKey: "kansasCity", city: "Kansas City", countryCode: "us", countryKey: "usa", airbnbUrl: "https://www.airbnb.com/s/Kansas-City--MO/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/usa/missouri/kansas-city", description: "Downtown lofts, Power & Light apartments, and suburban homes" },
  { cityKey: "toronto", city: "Toronto", countryCode: "ca", countryKey: "canada", airbnbUrl: "https://www.airbnb.com/s/Toronto--ON--Canada/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/canada/ontario/toronto", description: "Downtown condos, Yorkville apartments, and waterfront suites" },
  { cityKey: "vancouver", city: "Vancouver", countryCode: "ca", countryKey: "canada", airbnbUrl: "https://www.airbnb.com/s/Vancouver--BC--Canada/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/canada/british-columbia/vancouver", description: "Coal Harbour condos, Gastown lofts, and mountain-view homes" },
  { cityKey: "mexicoCity", city: "Mexico City", countryCode: "mx", countryKey: "mexico", airbnbUrl: "https://www.airbnb.com/s/Mexico-City--Mexico/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/mexico/mexico-city", description: "Roma Norte apartments, Condesa homes, and Polanco penthouses" },
  { cityKey: "guadalajara", city: "Guadalajara", countryCode: "mx", countryKey: "mexico", airbnbUrl: "https://www.airbnb.com/s/Guadalajara--Mexico/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/mexico/jalisco/guadalajara", description: "Historic centro homes, Providencia apartments, and modern condos" },
  { cityKey: "monterrey", city: "Monterrey", countryCode: "mx", countryKey: "mexico", airbnbUrl: "https://www.airbnb.com/s/Monterrey--Mexico/homes", vrboUrl: "https://www.vrbo.com/vacation-rentals/mexico/nuevo-leon/monterrey", description: "San Pedro homes, Valle Oriente apartments, and mountain-view retreats" },
];

export default function Lodging() {
  const [selectedCity, setSelectedCity] = useState<CityLodging | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Budget");
  const [priceFilter, setPriceFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("hotels");
  const { t } = useTranslation();

  const getCategoryTranslation = (category: string): string => {
    const categoryMap: Record<string, string> = {
      "Budget": t("lodging.categories.budget"),
      "Mid-Range": t("lodging.categories.midRange"),
      "Upscale": t("lodging.categories.upscale"),
      "Luxury": t("lodging.categories.luxury"),
    };
    return categoryMap[category] || category;
  };

  const getHotelTypeTranslation = (type: string): string => {
    const typeKey = type
      .replace(/\s+/g, '')
      .replace(/\//g, '')
      .replace(/-/g, '');
    const translated = t(`lodging.hotelTypes.${typeKey}`, { defaultValue: '' });
    return translated || type;
  };

  const getDescriptionTranslation = (cityKey: string, descriptionKey: string, originalDescription: string): string => {
    const translated = t(`lodging.descriptions.${cityKey}.${descriptionKey}`, { defaultValue: '' });
    return translated || originalDescription;
  };

  const getAmenityTranslation = (amenity: string): string => {
    const amenityKey = amenity.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '');
    const translated = t(`lodging.amenities.${amenityKey}`, { defaultValue: '' });
    return translated || amenity;
  };

  if (selectedCity) {
    return (
      <Layout pageTitle="nav.lodging">
        <div className="pt-6 px-6 pb-24">
          <button 
            onClick={() => {
              setSelectedCity(null);
              setPriceFilter(null);
            }}
            className="flex items-center space-x-2 text-primary mb-6 hover:text-primary/80 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 rtl-flip" />
            <span className="text-sm font-medium">{t("lodging.backToCities")}</span>
          </button>

          <div className="bg-gradient-to-br from-purple-500/20 to-primary/10 border border-purple-500/20 rounded-2xl p-6 mb-6">
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
                <p className="text-purple-400 font-medium text-sm">
                  <Hotel className="w-4 h-4 inline mr-1" />
                  {t("lodging.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {priceFilter && (
            <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">{t("lodging.filterActive")}: </span>
                <span className={`text-sm font-medium ${
                  priceFilter === "Budget" ? "text-green-400" :
                  priceFilter === "Mid-Range" ? "text-blue-400" :
                  priceFilter === "Upscale" ? "text-purple-400" : "text-amber-400"
                }`}>{getCategoryTranslation(priceFilter)}</span>
              </div>
              <button 
                onClick={() => setPriceFilter(null)}
                className="text-xs text-primary hover:underline"
                data-testid="button-clear-filter-city"
              >
                {t("lodging.showAll")}
              </button>
            </div>
          )}

          <div className="space-y-4">
            {selectedCity.categories
              .filter(category => !priceFilter || category.category === priceFilter)
              .map((category, catIndex) => (
              <div key={catIndex} className="bg-card border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  data-testid={`button-category-${category.category.toLowerCase()}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center border`}>
                      <DollarSign className={`w-5 h-5 ${category.color}`} />
                    </div>
                    <div className="text-left">
                      <h3 className={`font-bold ${category.color}`}>{getCategoryTranslation(category.category)}</h3>
                      <p className="text-xs text-muted-foreground">{category.priceRange}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform rtl-flip ${expandedCategory === category.category ? 'rotate-90' : ''}`} />
                </button>
                
                {expandedCategory === category.category && (
                  <div className="px-4 pb-4 space-y-3">
                    {category.accommodations.map((hotel, hotelIndex) => (
                      <a
                        key={hotelIndex}
                        href={hotel.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-background/50 border border-white/5 rounded-lg p-4 hover:border-purple-500/30 transition-colors group"
                        data-testid={`link-hotel-${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                              {hotel.name}
                              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs ${category.color} font-medium`}>{getHotelTypeTranslation(hotel.type)}</span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{hotel.neighborhood}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">{getDescriptionTranslation(selectedCity.cityKey, hotel.descriptionKey, hotel.description)}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {hotel.amenities.map((amenity, amenityIndex) => (
                                <span 
                                  key={amenityIndex}
                                  className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-gray-400"
                                >
                                  {getAmenityTranslation(amenity)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("lodging.disclaimer")}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="nav.lodging">
      {/* Hero Section with Background Image */}
      <div className="relative overflow-hidden min-h-[200px]">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${hotelHeroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        
        <div className="relative pt-8 px-6 pb-12">
          <Link href="/home" className="flex items-center space-x-2 text-primary mb-4 hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4 rtl-flip" />
            <span className="text-sm font-medium">{t("common.back", "Back")}</span>
          </Link>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 backdrop-blur-sm flex items-center justify-center border border-purple-400/30">
              <Hotel className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white drop-shadow-lg" data-testid="text-page-title">
                {t("lodging.title")}
              </h1>
              <p className="text-sm text-gray-300">{t("lodging.subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="hotels" className="flex items-center gap-2">
              <Hotel className="w-4 h-4" />
              {t("lodging.tabs.hotels", "Hotels")}
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              {t("lodging.tabs.vacationRentals", "Vacation Rentals")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hotels" className="mt-0">
            <div className="grid grid-cols-4 gap-2 mb-6">
              <button
                onClick={() => setPriceFilter(priceFilter === "Budget" ? null : "Budget")}
                className={`rounded-lg p-2 text-center transition-all ${
                  priceFilter === "Budget" 
                    ? "bg-green-500/30 border-2 border-green-400 ring-2 ring-green-400/30" 
                    : "bg-green-500/10 border border-green-500/20 hover:bg-green-500/20"
                }`}
                data-testid="button-filter-budget"
              >
                <span className="text-[10px] text-green-400 font-medium">{t("lodging.categories.budget")}</span>
              </button>
              <button
                onClick={() => setPriceFilter(priceFilter === "Mid-Range" ? null : "Mid-Range")}
                className={`rounded-lg p-2 text-center transition-all ${
                  priceFilter === "Mid-Range" 
                    ? "bg-blue-500/30 border-2 border-blue-400 ring-2 ring-blue-400/30" 
                    : "bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20"
                }`}
                data-testid="button-filter-midrange"
              >
                <span className="text-[10px] text-blue-400 font-medium">{t("lodging.categories.midRange")}</span>
              </button>
              <button
                onClick={() => setPriceFilter(priceFilter === "Upscale" ? null : "Upscale")}
                className={`rounded-lg p-2 text-center transition-all ${
                  priceFilter === "Upscale" 
                    ? "bg-purple-500/30 border-2 border-purple-400 ring-2 ring-purple-400/30" 
                    : "bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20"
                }`}
                data-testid="button-filter-upscale"
              >
                <span className="text-[10px] text-purple-400 font-medium">{t("lodging.categories.upscale")}</span>
              </button>
              <button
                onClick={() => setPriceFilter(priceFilter === "Luxury" ? null : "Luxury")}
                className={`rounded-lg p-2 text-center transition-all ${
                  priceFilter === "Luxury" 
                    ? "bg-amber-500/30 border-2 border-amber-400 ring-2 ring-amber-400/30" 
                    : "bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"
                }`}
                data-testid="button-filter-luxury"
              >
                <span className="text-[10px] text-amber-400 font-medium">{t("lodging.categories.luxury")}</span>
              </button>
            </div>

            {priceFilter && (
              <div className="mb-4 p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">{t("lodging.filterActive")}: </span>
                  <span className={`text-sm font-medium ${
                    priceFilter === "Budget" ? "text-green-400" :
                    priceFilter === "Mid-Range" ? "text-blue-400" :
                    priceFilter === "Upscale" ? "text-purple-400" : "text-amber-400"
                  }`}>{getCategoryTranslation(priceFilter)}</span>
                </div>
                <button 
                  onClick={() => setPriceFilter(null)}
                  className="text-xs text-primary hover:underline"
                  data-testid="button-clear-filter"
                >
                  {t("lodging.showAll")}
                </button>
              </div>
            )}
            
            <h2 className="text-lg font-display font-bold text-white mb-4">{t("lodging.selectCity")}</h2>
            
            <div className="space-y-3 pb-20">
              {lodgingData.map((city, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCity(city);
                    setExpandedCategory(priceFilter || "Budget");
                  }}
                  className="w-full bg-card border border-white/5 rounded-xl p-4 hover:border-purple-500/30 transition-all group text-left"
                  data-testid={`button-lodging-city-${city.countryCode}-${index}`}
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
                        <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{t(`cities.cityNames.${city.cityKey}`)}</h3>
                        <p className="text-sm text-muted-foreground">{t("lodging.hotelsCount")}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 transition-colors rtl-flip" />
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rentals" className="mt-0">
            <div className="relative rounded-xl overflow-hidden mb-6 h-40">
              <img 
                src={vacationRentalImage} 
                alt="Vacation Rental" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-display font-bold text-white mb-1">{t("lodging.vacationRentals.title", "Vacation Rentals")}</h3>
                <p className="text-sm text-gray-300">{t("lodging.vacationRentals.subtitle", "Homes, apartments, and unique stays")}</p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-300">
                {t("lodging.vacationRentals.description", "Find entire homes, apartments, and unique accommodations through AirBnB and VRBO. Perfect for families, groups, or longer stays during the tournament.")}
              </p>
            </div>

            <h2 className="text-lg font-display font-bold text-white mb-4">{t("lodging.selectCity")}</h2>

            <div className="space-y-3 pb-20">
              {vacationRentalData.map((city, index) => (
                <div
                  key={index}
                  className="bg-card border border-white/5 rounded-xl p-4"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                      <img 
                        src={`https://flagcdn.com/w80/${city.countryCode}.png`}
                        alt={`${t(`cities.countries.${city.countryKey}`)} flag`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{t(`cities.cityNames.${city.cityKey}`)}</h3>
                      <p className="text-xs text-muted-foreground">{city.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={city.airbnbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#FF5A5F]/20 hover:bg-[#FF5A5F]/30 border border-[#FF5A5F]/30 rounded-lg py-3 px-4 transition-colors group"
                    >
                      <span className="font-bold text-[#FF5A5F]">Airbnb</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#FF5A5F] opacity-60 group-hover:opacity-100" />
                    </a>
                    <a
                      href={city.vrboUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-[#3B5998]/20 hover:bg-[#3B5998]/30 border border-[#3B5998]/30 rounded-lg py-3 px-4 transition-colors group"
                    >
                      <span className="font-bold text-[#3B82F6]">VRBO</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#3B82F6] opacity-60 group-hover:opacity-100" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("lodging.vacationRentals.disclaimer", "Links open external booking platforms. Championship Concierge is not affiliated with Airbnb or VRBO. Always verify listings and read reviews before booking.")}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
