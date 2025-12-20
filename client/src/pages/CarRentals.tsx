import { Layout } from "@/components/Layout";
import { Car, ArrowLeft, MapPin, DollarSign, ChevronRight, ExternalLink, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface RentalCompany {
  name: string;
  url: string;
  descriptionKey: string;
}

interface RideshareApp {
  name: string;
  url: string;
  availabilityKey: string;
}

interface CityInfo {
  city: string;
  cityKey: string;
  country: string;
  countryKey: string;
  countryCode: string;
  rentalCompanies: RentalCompany[];
  rideshareApps: RideshareApp[];
  dailyRates: {
    economy: string;
    midsize: string;
    suv: string;
    luxury: string;
  };
  parkingInfo: string[];
  tips: string[];
}

const cities: CityInfo[] = [
  {
    city: "New York / New Jersey",
    cityKey: "newYork",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "airportCityLocations" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "neighborhoodPickup" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "jfkEwrLga" },
      { name: "Budget", url: "https://www.budget.com", descriptionKey: "affordableOptions" },
      { name: "National", url: "https://www.nationalcar.com", descriptionKey: "emeraldClub" },
      { name: "Sixt", url: "https://www.sixt.com", descriptionKey: "premiumVehicles" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7AllAreas" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7AllAreas" },
      { name: "Via", url: "https://ridewithvia.com", availabilityKey: "sharedRidesLowerCost" },
    ],
    dailyRates: { economy: "$45-75 USD", midsize: "$55-95 USD", suv: "$75-130 USD", luxury: "$120-250 USD" },
    parkingInfo: [
      "parkingNewYork1",
      "parkingNewYork2",
      "parkingNewYork3",
    ],
    tips: [
      "tipNewYork1",
      "tipNewYork2",
      "tipNewYork3",
    ]
  },
  {
    city: "Los Angeles",
    cityKey: "losAngeles",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "laxCitywide" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "freePickupService" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "preferredLax" },
      { name: "Budget", url: "https://www.budget.com", descriptionKey: "goodValueOptions" },
      { name: "Turo", url: "https://www.turo.com", descriptionKey: "peerToPeerSharing" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7Everywhere" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7Everywhere" },
    ],
    dailyRates: { economy: "$40-65 USD", midsize: "$50-85 USD", suv: "$70-120 USD", luxury: "$110-220 USD" },
    parkingInfo: [
      "parkingLosAngeles1",
      "parkingLosAngeles2",
      "parkingLosAngeles3",
    ],
    tips: [
      "tipLosAngeles1",
      "tipLosAngeles2",
      "tipLosAngeles3",
    ]
  },
  {
    city: "Miami",
    cityKey: "miami",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "miaAirport" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "southBeachLocations" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "cruisePortPickup" },
      { name: "Dollar", url: "https://www.dollar.com", descriptionKey: "budgetFriendly" },
      { name: "Alamo", url: "https://www.alamo.com", descriptionKey: "greatForLeisure" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7AllAreas" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7AllAreas" },
      { name: "Freebee", url: "https://ridefreebee.com", availabilityKey: "freeSelectZones" },
    ],
    dailyRates: { economy: "$35-60 USD", midsize: "$45-80 USD", suv: "$65-110 USD", luxury: "$100-200 USD" },
    parkingInfo: [
      "parkingMiami1",
      "parkingMiami2",
      "parkingMiami3",
    ],
    tips: [
      "tipMiami1",
      "tipMiami2",
      "tipMiami3",
    ]
  },
  {
    city: "Dallas",
    cityKey: "dallas",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "dfwAirport" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "multipleLocations" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "businessPreferred" },
      { name: "National", url: "https://www.nationalcar.com", descriptionKey: "quickPickup" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7DfwMetro" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7DfwMetro" },
    ],
    dailyRates: { economy: "$35-55 USD", midsize: "$45-75 USD", suv: "$60-100 USD", luxury: "$90-180 USD" },
    parkingInfo: [
      "parkingDallas1",
      "parkingDallas2",
      "parkingDallas3",
    ],
    tips: [
      "tipDallas1",
      "tipDallas2",
      "tipDallas3",
    ]
  },
  {
    city: "Atlanta",
    cityKey: "atlanta",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "atlRentalCenter" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "cityLocations" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "buckheadArea" },
      { name: "Budget", url: "https://www.budget.com", descriptionKey: "valueOptions" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7MetroArea" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7MetroArea" },
    ],
    dailyRates: { economy: "$35-55 USD", midsize: "$45-70 USD", suv: "$60-100 USD", luxury: "$85-170 USD" },
    parkingInfo: [
      "parkingAtlanta1",
      "parkingAtlanta2",
      "parkingAtlanta3",
    ],
    tips: [
      "tipAtlanta1",
      "tipAtlanta2",
      "tipAtlanta3",
    ]
  },
  {
    city: "Houston",
    cityKey: "houston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "iahHouAirports" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "manyLocations" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "galleriaArea" },
      { name: "Budget", url: "https://www.budget.com", descriptionKey: "affordableRates" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7GreaterHouston" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7GreaterHouston" },
    ],
    dailyRates: { economy: "$35-55 USD", midsize: "$45-70 USD", suv: "$55-95 USD", luxury: "$80-160 USD" },
    parkingInfo: [
      "parkingHouston1",
      "parkingHouston2",
      "parkingHouston3",
    ],
    tips: [
      "tipHouston1",
      "tipHouston2",
      "tipHouston3",
    ]
  },
  {
    city: "Seattle",
    cityKey: "seattle",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "seaTacAirport" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "downtownSuburbs" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "multipleLocations" },
      { name: "Turo", url: "https://www.turo.com", descriptionKey: "localCarSharing" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7PugetSound" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7PugetSound" },
    ],
    dailyRates: { economy: "$40-65 USD", midsize: "$50-85 USD", suv: "$70-115 USD", luxury: "$100-200 USD" },
    parkingInfo: [
      "parkingSeattle1",
      "parkingSeattle2",
      "parkingSeattle3",
    ],
    tips: [
      "tipSeattle1",
      "tipSeattle2",
      "tipSeattle3",
    ]
  },
  {
    city: "San Francisco Bay Area",
    cityKey: "sanFrancisco",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "sfoOakSjc" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "bayAreaWide" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "airportLocations" },
      { name: "Getaround", url: "https://www.getaround.com", descriptionKey: "carshareByHour" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7BayArea" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7BayArea" },
    ],
    dailyRates: { economy: "$45-75 USD", midsize: "$55-95 USD", suv: "$75-130 USD", luxury: "$120-250 USD" },
    parkingInfo: [
      "parkingSanFrancisco1",
      "parkingSanFrancisco2",
      "parkingSanFrancisco3",
    ],
    tips: [
      "tipSanFrancisco1",
      "tipSanFrancisco2",
      "tipSanFrancisco3",
    ]
  },
  {
    city: "Toronto",
    cityKey: "toronto",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    rentalCompanies: [
      { name: "Enterprise", url: "https://www.enterprise.ca", descriptionKey: "yyzDowntown" },
      { name: "Hertz", url: "https://www.hertz.ca", descriptionKey: "airportLocation" },
      { name: "Avis", url: "https://www.avis.ca", descriptionKey: "unionStation" },
      { name: "Budget", url: "https://www.budget.ca", descriptionKey: "valueOption" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com/ca", availabilityKey: "24_7Gta" },
      { name: "Lyft", url: "https://www.lyft.com/rider/cities/toronto-on", availabilityKey: "24_7Gta" },
    ],
    dailyRates: { economy: "CAD $50-80", midsize: "CAD $60-100", suv: "CAD $80-140", luxury: "CAD $130-260" },
    parkingInfo: [
      "parkingToronto1",
      "parkingToronto2",
      "parkingToronto3",
    ],
    tips: [
      "tipToronto1",
      "tipToronto2",
      "tipToronto3",
    ]
  },
  {
    city: "Vancouver",
    cityKey: "vancouver",
    country: "Canada",
    countryKey: "canada",
    countryCode: "ca",
    rentalCompanies: [
      { name: "Enterprise", url: "https://www.enterprise.ca", descriptionKey: "yvrDowntown" },
      { name: "Hertz", url: "https://www.hertz.ca", descriptionKey: "airportPickup" },
      { name: "Avis", url: "https://www.avis.ca", descriptionKey: "conventionCentre" },
      { name: "Evo Car Share", url: "https://www.evo.ca", descriptionKey: "localCarshare" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com/ca", availabilityKey: "24_7MetroVancouver" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7MetroVancouver" },
    ],
    dailyRates: { economy: "CAD $50-80", midsize: "CAD $60-95", suv: "CAD $80-130", luxury: "CAD $120-240" },
    parkingInfo: [
      "parkingVancouver1",
      "parkingVancouver2",
      "parkingVancouver3",
    ],
    tips: [
      "tipVancouver1",
      "tipVancouver2",
      "tipVancouver3",
    ]
  },
  {
    city: "Mexico City",
    cityKey: "mexicoCity",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com.mx", descriptionKey: "mexAirport" },
      { name: "Enterprise", url: "https://www.enterprise.com.mx", descriptionKey: "multipleLocations" },
      { name: "Avis", url: "https://www.avis.com.mx", descriptionKey: "majorHotels" },
      { name: "Europcar", url: "https://www.europcar.com.mx", descriptionKey: "wideSelection" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com/mx", availabilityKey: "24_7Cdmx" },
      { name: "DiDi", url: "https://www.didiglobal.com/mx", availabilityKey: "24_7Cdmx" },
      { name: "Cabify", url: "https://cabify.com/mx", availabilityKey: "majorAreas" },
    ],
    dailyRates: { economy: "MXN $600-1,000", midsize: "MXN $800-1,400", suv: "MXN $1,200-2,000", luxury: "MXN $2,000-4,000" },
    parkingInfo: [
      "parkingMexicoCity1",
      "parkingMexicoCity2",
      "parkingMexicoCity3",
    ],
    tips: [
      "tipMexicoCity1",
      "tipMexicoCity2",
      "tipMexicoCity3",
    ]
  },
  {
    city: "Guadalajara",
    cityKey: "guadalajara",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com.mx", descriptionKey: "gdlAirport" },
      { name: "Europcar", url: "https://www.europcar.com.mx", descriptionKey: "downtown" },
      { name: "National", url: "https://www.nationalcar.com.mx", descriptionKey: "airport" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com/mx", availabilityKey: "24_7MetroArea" },
      { name: "DiDi", url: "https://www.didiglobal.com/mx", availabilityKey: "24_7MetroArea" },
    ],
    dailyRates: { economy: "MXN $500-850", midsize: "MXN $700-1,200", suv: "MXN $1,000-1,700", luxury: "MXN $1,700-3,500" },
    parkingInfo: [
      "parkingGuadalajara1",
      "parkingGuadalajara2",
      "parkingGuadalajara3",
    ],
    tips: [
      "tipGuadalajara1",
      "tipGuadalajara2",
      "tipGuadalajara3",
    ]
  },
  {
    city: "Monterrey",
    cityKey: "monterrey",
    country: "Mexico",
    countryKey: "mexico",
    countryCode: "mx",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com.mx", descriptionKey: "mtyAirport" },
      { name: "Avis", url: "https://www.avis.com.mx", descriptionKey: "downtownAirport" },
      { name: "Europcar", url: "https://www.europcar.com.mx", descriptionKey: "sanPedro" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com/mx", availabilityKey: "24_7MetroArea" },
      { name: "DiDi", url: "https://www.didiglobal.com/mx", availabilityKey: "24_7MetroArea" },
    ],
    dailyRates: { economy: "MXN $500-800", midsize: "MXN $650-1,100", suv: "MXN $950-1,600", luxury: "MXN $1,600-3,200" },
    parkingInfo: [
      "parkingMonterrey1",
      "parkingMonterrey2",
      "parkingMonterrey3",
    ],
    tips: [
      "tipMonterrey1",
      "tipMonterrey2",
      "tipMonterrey3",
    ]
  },
  {
    city: "Boston",
    cityKey: "boston",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "bosAirport" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "backBaySuburbs" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "downtownLocations" },
      { name: "Zipcar", url: "https://www.zipcar.com", descriptionKey: "hourlyRentals" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7GreaterBoston" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7GreaterBoston" },
    ],
    dailyRates: { economy: "$45-70 USD", midsize: "$55-90 USD", suv: "$70-120 USD", luxury: "$110-220 USD" },
    parkingInfo: [
      "parkingBoston1",
      "parkingBoston2",
      "parkingBoston3",
    ],
    tips: [
      "tipBoston1",
      "tipBoston2",
      "tipBoston3",
    ]
  },
  {
    city: "Philadelphia",
    cityKey: "philadelphia",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "phlAirport" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "centerCity" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "thirtiethStreetStation" },
      { name: "Budget", url: "https://www.budget.com", descriptionKey: "valueOptions" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7Philadelphia" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7Philadelphia" },
    ],
    dailyRates: { economy: "$40-65 USD", midsize: "$50-80 USD", suv: "$65-110 USD", luxury: "$95-190 USD" },
    parkingInfo: [
      "parkingPhiladelphia1",
      "parkingPhiladelphia2",
      "parkingPhiladelphia3",
    ],
    tips: [
      "tipPhiladelphia1",
      "tipPhiladelphia2",
      "tipPhiladelphia3",
    ]
  },
  {
    city: "Kansas City",
    cityKey: "kansasCity",
    country: "USA",
    countryKey: "usa",
    countryCode: "us",
    rentalCompanies: [
      { name: "Hertz", url: "https://www.hertz.com", descriptionKey: "mciAirport" },
      { name: "Enterprise", url: "https://www.enterprise.com", descriptionKey: "downtownSuburbs" },
      { name: "Avis", url: "https://www.avis.com", descriptionKey: "airportLocation" },
      { name: "Budget", url: "https://www.budget.com", descriptionKey: "affordableRates" },
    ],
    rideshareApps: [
      { name: "Uber", url: "https://www.uber.com", availabilityKey: "24_7KcMetro" },
      { name: "Lyft", url: "https://www.lyft.com", availabilityKey: "24_7KcMetro" },
    ],
    dailyRates: { economy: "$30-50 USD", midsize: "$40-65 USD", suv: "$55-90 USD", luxury: "$80-160 USD" },
    parkingInfo: [
      "parkingKansasCity1",
      "parkingKansasCity2",
      "parkingKansasCity3",
    ],
    tips: [
      "tipKansasCity1",
      "tipKansasCity2",
      "tipKansasCity3",
    ]
  },
];

export default function CarRentals() {
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState<CityInfo | null>(null);

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
            <span className="text-sm font-medium">{t("transportation.carRentals.backToCities")}</span>
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
                  <Car className="w-4 h-4 inline mr-1" />
                  {t("transportation.carRentals.title")}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-display font-bold text-white mb-3">{t("transportation.carRentals.rentalCompanies")}</h2>
            <div className="space-y-2">
              {selectedCity.rentalCompanies.map((company, index) => (
                <a
                  key={index}
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-card border border-white/5 rounded-xl p-4 hover:border-purple-500/30 transition-colors group"
                  data-testid={`link-rental-${company.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors flex items-center gap-2">
                        {company.name}
                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      </h3>
                      <p className="text-sm text-muted-foreground">{t(`transportation.carRentals.descriptions.${company.descriptionKey}`)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 rtl-flip" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-display font-bold text-white">{t("transportation.carRentals.dailyRates")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-white/5 rounded-xl p-4 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("transportation.carRentals.economy")}</span>
                <span className="block text-lg font-bold text-white">{selectedCity.dailyRates.economy}</span>
              </div>
              <div className="bg-card border border-white/5 rounded-xl p-4 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("transportation.carRentals.midsize")}</span>
                <span className="block text-lg font-bold text-white">{selectedCity.dailyRates.midsize}</span>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-purple-400 mb-1">{t("transportation.carRentals.suv")}</span>
                <span className="block text-lg font-bold text-purple-400">{selectedCity.dailyRates.suv}</span>
              </div>
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 text-center">
                <span className="block text-[10px] uppercase tracking-wider text-accent mb-1">{t("transportation.carRentals.luxury")}</span>
                <span className="block text-lg font-bold text-accent">{selectedCity.dailyRates.luxury}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Smartphone className="w-5 h-5 text-green-400" />
              <h2 className="text-lg font-display font-bold text-white">{t("transportation.carRentals.rideshareApps")}</h2>
            </div>
            <div className="space-y-2">
              {selectedCity.rideshareApps.map((app, index) => (
                <a
                  key={index}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-card border border-white/5 rounded-xl p-4 hover:border-green-500/30 transition-colors group"
                  data-testid={`link-rideshare-${app.name.toLowerCase()}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white group-hover:text-green-400 transition-colors flex items-center gap-2">
                        {app.name}
                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      </h3>
                      <p className="text-sm text-muted-foreground">{t(`transportation.carRentals.availability.${app.availabilityKey}`)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-green-400 rtl-flip" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-display font-bold text-white">{t("transportation.carRentals.parkingInfo")}</h2>
            </div>
            <div className="bg-card border border-white/5 rounded-xl p-4">
              <ul className="space-y-2">
                {selectedCity.parkingInfo.map((info, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-amber-400 mr-2">•</span>
                    {t(`transportation.carRentals.parking.${info}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-display font-bold text-white mb-3">{t("transportation.carRentals.localTips")}</h2>
            <div className="bg-card border border-white/5 rounded-xl p-4">
              <ul className="space-y-2">
                {selectedCity.tips.map((tip, index) => (
                  <li key={index} className="text-sm text-gray-300 flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {t(`transportation.carRentals.tips.${tip}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("transportation.carRentals.pricingNote")}
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
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Car className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-white" data-testid="text-page-title">
              {t("transportation.carRentals.title")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("transportation.carRentals.subtitle")}</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-24">
        <h2 className="text-lg font-display font-bold text-white mb-4">{t("transportation.carRentals.selectCity")}</h2>
        
        <div className="space-y-3">
          {cities.map((city, index) => (
            <button
              key={index}
              onClick={() => setSelectedCity(city)}
              className="w-full bg-card border border-white/5 rounded-xl p-4 hover:border-purple-500/30 transition-all group text-left"
              data-testid={`button-car-city-${city.countryCode}-${index}`}
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
                    <p className="text-sm text-muted-foreground">{t("transportation.carRentals.rentalCompaniesCount", { count: city.rentalCompanies.length })}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-400 transition-colors rtl-flip" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
