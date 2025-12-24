export interface GlobalWatchHub {
  countryCode: string;
  countryName: string;
  primaryCity: string;
  venues: {
    name: string;
    city: string;
    capacity: string;
    mapsUrl: string;
  }[];
}

export const globalWatchHubs: GlobalWatchHub[] = [
  { countryCode: "AR", countryName: "Argentina", primaryCity: "Buenos Aires", venues: [{ name: "Obelisco Fan Zone", city: "Buenos Aires", capacity: "100,000+", mapsUrl: "https://www.google.com/maps/search/obelisco+buenos+aires" }] },
  { countryCode: "AU", countryName: "Australia", primaryCity: "Sydney", venues: [{ name: "Darling Harbour", city: "Sydney", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/darling+harbour+sydney" }] },
  { countryCode: "AT", countryName: "Austria", primaryCity: "Vienna", venues: [{ name: "Rathausplatz", city: "Vienna", capacity: "20,000+", mapsUrl: "https://www.google.com/maps/search/rathausplatz+vienna" }] },
  { countryCode: "BE", countryName: "Belgium", primaryCity: "Brussels", venues: [{ name: "Grand Place", city: "Brussels", capacity: "15,000+", mapsUrl: "https://www.google.com/maps/search/grand+place+brussels" }] },
  { countryCode: "BR", countryName: "Brazil", primaryCity: "Rio de Janeiro", venues: [{ name: "Copacabana Beach", city: "Rio de Janeiro", capacity: "150,000+", mapsUrl: "https://www.google.com/maps/search/copacabana+rio+de+janeiro" }] },
  { countryCode: "CM", countryName: "Cameroon", primaryCity: "Yaoundé", venues: [{ name: "Place de l'Indépendance", city: "Yaoundé", capacity: "20,000+", mapsUrl: "https://www.google.com/maps/search/place+de+independance+yaounde" }] },
  { countryCode: "CA", countryName: "Canada", primaryCity: "Toronto", venues: [{ name: "Maple Leaf Square", city: "Toronto", capacity: "15,000+", mapsUrl: "https://www.google.com/maps/search/maple+leaf+square+toronto" }] },
  { countryCode: "CL", countryName: "Chile", primaryCity: "Santiago", venues: [{ name: "Plaza Italia", city: "Santiago", capacity: "50,000+", mapsUrl: "https://www.google.com/maps/search/plaza+italia+santiago" }] },
  { countryCode: "CO", countryName: "Colombia", primaryCity: "Bogotá", venues: [{ name: "Plaza de Bolívar", city: "Bogotá", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/plaza+de+bolivar+bogota" }] },
  { countryCode: "HR", countryName: "Croatia", primaryCity: "Zagreb", venues: [{ name: "Ban Jelačić Square", city: "Zagreb", capacity: "25,000+", mapsUrl: "https://www.google.com/maps/search/ban+jelacic+square+zagreb" }] },
  { countryCode: "CZ", countryName: "Czech Republic", primaryCity: "Prague", venues: [{ name: "Old Town Square", city: "Prague", capacity: "15,000+", mapsUrl: "https://www.google.com/maps/search/old+town+square+prague" }] },
  { countryCode: "DK", countryName: "Denmark", primaryCity: "Copenhagen", venues: [{ name: "Rådhuspladsen", city: "Copenhagen", capacity: "20,000+", mapsUrl: "https://www.google.com/maps/search/radhuspladsen+copenhagen" }] },
  { countryCode: "EC", countryName: "Ecuador", primaryCity: "Quito", venues: [{ name: "Plaza de la Independencia", city: "Quito", capacity: "20,000+", mapsUrl: "https://www.google.com/maps/search/plaza+independencia+quito" }] },
  { countryCode: "EG", countryName: "Egypt", primaryCity: "Cairo", venues: [{ name: "Tahrir Square", city: "Cairo", capacity: "50,000+", mapsUrl: "https://www.google.com/maps/search/tahrir+square+cairo" }] },
  { countryCode: "GB", countryName: "England", primaryCity: "London", venues: [{ name: "Trafalgar Square", city: "London", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/trafalgar+square+london" }] },
  { countryCode: "FR", countryName: "France", primaryCity: "Paris", venues: [{ name: "Champ de Mars", city: "Paris", capacity: "90,000+", mapsUrl: "https://www.google.com/maps/search/champ+de+mars+paris" }] },
  { countryCode: "DE", countryName: "Germany", primaryCity: "Berlin", venues: [{ name: "Brandenburg Gate", city: "Berlin", capacity: "100,000+", mapsUrl: "https://www.google.com/maps/search/brandenburg+gate+berlin" }] },
  { countryCode: "HU", countryName: "Hungary", primaryCity: "Budapest", venues: [{ name: "Heroes' Square", city: "Budapest", capacity: "25,000+", mapsUrl: "https://www.google.com/maps/search/heroes+square+budapest" }] },
  { countryCode: "IR", countryName: "Iran", primaryCity: "Tehran", venues: [{ name: "Azadi Square", city: "Tehran", capacity: "40,000+", mapsUrl: "https://www.google.com/maps/search/azadi+square+tehran" }] },
  { countryCode: "IT", countryName: "Italy", primaryCity: "Rome", venues: [{ name: "Piazza del Popolo", city: "Rome", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/piazza+del+popolo+rome" }] },
  { countryCode: "JP", countryName: "Japan", primaryCity: "Tokyo", venues: [{ name: "Shibuya Crossing", city: "Tokyo", capacity: "50,000+", mapsUrl: "https://www.google.com/maps/search/shibuya+crossing+tokyo" }] },
  { countryCode: "KR", countryName: "South Korea", primaryCity: "Seoul", venues: [{ name: "Gwanghwamun Square", city: "Seoul", capacity: "40,000+", mapsUrl: "https://www.google.com/maps/search/gwanghwamun+square+seoul" }] },
  { countryCode: "MX", countryName: "Mexico", primaryCity: "Mexico City", venues: [{ name: "Zócalo", city: "Mexico City", capacity: "100,000+", mapsUrl: "https://www.google.com/maps/search/zocalo+mexico+city" }] },
  { countryCode: "MA", countryName: "Morocco", primaryCity: "Casablanca", venues: [{ name: "Place Mohammed V", city: "Casablanca", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/place+mohammed+v+casablanca" }] },
  { countryCode: "NL", countryName: "Netherlands", primaryCity: "Amsterdam", venues: [{ name: "Museumplein", city: "Amsterdam", capacity: "40,000+", mapsUrl: "https://www.google.com/maps/search/museumplein+amsterdam" }] },
  { countryCode: "NG", countryName: "Nigeria", primaryCity: "Lagos", venues: [{ name: "Tafawa Balewa Square", city: "Lagos", capacity: "35,000+", mapsUrl: "https://www.google.com/maps/search/tafawa+balewa+square+lagos" }] },
  { countryCode: "PY", countryName: "Paraguay", primaryCity: "Asunción", venues: [{ name: "Plaza de Armas", city: "Asunción", capacity: "15,000+", mapsUrl: "https://www.google.com/maps/search/plaza+de+armas+asuncion" }] },
  { countryCode: "PE", countryName: "Peru", primaryCity: "Lima", venues: [{ name: "Plaza Mayor", city: "Lima", capacity: "20,000+", mapsUrl: "https://www.google.com/maps/search/plaza+mayor+lima" }] },
  { countryCode: "PL", countryName: "Poland", primaryCity: "Warsaw", venues: [{ name: "Fan Zone Warsaw", city: "Warsaw", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/fan+zone+warsaw" }] },
  { countryCode: "PT", countryName: "Portugal", primaryCity: "Lisbon", venues: [{ name: "Praça do Comércio", city: "Lisbon", capacity: "40,000+", mapsUrl: "https://www.google.com/maps/search/praca+do+comercio+lisbon" }] },
  { countryCode: "QA", countryName: "Qatar", primaryCity: "Doha", venues: [{ name: "Corniche Waterfront", city: "Doha", capacity: "25,000+", mapsUrl: "https://www.google.com/maps/search/corniche+doha" }] },
  { countryCode: "SA", countryName: "Saudi Arabia", primaryCity: "Riyadh", venues: [{ name: "Boulevard Riyadh", city: "Riyadh", capacity: "50,000+", mapsUrl: "https://www.google.com/maps/search/boulevard+riyadh" }] },
  { countryCode: "RS", countryName: "Serbia", primaryCity: "Belgrade", venues: [{ name: "Republic Square", city: "Belgrade", capacity: "25,000+", mapsUrl: "https://www.google.com/maps/search/republic+square+belgrade" }] },
  { countryCode: "SN", countryName: "Senegal", primaryCity: "Dakar", venues: [{ name: "Place de l'Indépendance", city: "Dakar", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/place+independance+dakar" }] },
  { countryCode: "SI", countryName: "Slovenia", primaryCity: "Ljubljana", venues: [{ name: "Congress Square", city: "Ljubljana", capacity: "10,000+", mapsUrl: "https://www.google.com/maps/search/congress+square+ljubljana" }] },
  { countryCode: "ZA", countryName: "South Africa", primaryCity: "Johannesburg", venues: [{ name: "Nelson Mandela Square", city: "Johannesburg", capacity: "15,000+", mapsUrl: "https://www.google.com/maps/search/nelson+mandela+square+johannesburg" }] },
  { countryCode: "ES", countryName: "Spain", primaryCity: "Madrid", venues: [{ name: "Plaza de Colón", city: "Madrid", capacity: "50,000+", mapsUrl: "https://www.google.com/maps/search/plaza+de+colon+madrid" }] },
  { countryCode: "CH", countryName: "Switzerland", primaryCity: "Zurich", venues: [{ name: "Sechseläutenplatz", city: "Zurich", capacity: "20,000+", mapsUrl: "https://www.google.com/maps/search/sechselautenplatz+zurich" }] },
  { countryCode: "TN", countryName: "Tunisia", primaryCity: "Tunis", venues: [{ name: "Avenue Habib Bourguiba", city: "Tunis", capacity: "25,000+", mapsUrl: "https://www.google.com/maps/search/avenue+habib+bourguiba+tunis" }] },
  { countryCode: "TR", countryName: "Turkey", primaryCity: "Istanbul", venues: [{ name: "Taksim Square", city: "Istanbul", capacity: "40,000+", mapsUrl: "https://www.google.com/maps/search/taksim+square+istanbul" }] },
  { countryCode: "UA", countryName: "Ukraine", primaryCity: "Kyiv", venues: [{ name: "Maidan Nezalezhnosti", city: "Kyiv", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/maidan+nezalezhnosti+kyiv" }] },
  { countryCode: "US", countryName: "United States", primaryCity: "New York", venues: [{ name: "Times Square", city: "New York", capacity: "50,000+", mapsUrl: "https://www.google.com/maps/search/times+square+new+york" }] },
  { countryCode: "UY", countryName: "Uruguay", primaryCity: "Montevideo", venues: [{ name: "Plaza Independencia", city: "Montevideo", capacity: "25,000+", mapsUrl: "https://www.google.com/maps/search/plaza+independencia+montevideo" }] },
  { countryCode: "UZ", countryName: "Uzbekistan", primaryCity: "Tashkent", venues: [{ name: "Independence Square", city: "Tashkent", capacity: "20,000+", mapsUrl: "https://www.google.com/maps/search/independence+square+tashkent" }] },
  { countryCode: "VE", countryName: "Venezuela", primaryCity: "Caracas", venues: [{ name: "Plaza Venezuela", city: "Caracas", capacity: "15,000+", mapsUrl: "https://www.google.com/maps/search/plaza+venezuela+caracas" }] },
  { countryCode: "GB-WLS", countryName: "Wales", primaryCity: "Cardiff", venues: [{ name: "Cardiff Castle", city: "Cardiff", capacity: "10,000+", mapsUrl: "https://www.google.com/maps/search/cardiff+castle" }] },
  { countryCode: "DZ", countryName: "Algeria", primaryCity: "Algiers", venues: [{ name: "Place de la Grande Poste", city: "Algiers", capacity: "20,000+", mapsUrl: "https://www.google.com/maps/search/grande+poste+algiers" }] },
  { countryCode: "GB-SCT", countryName: "Scotland", primaryCity: "Edinburgh", venues: [{ name: "Princes Street Gardens", city: "Edinburgh", capacity: "15,000+", mapsUrl: "https://www.google.com/maps/search/princes+street+gardens+edinburgh" }] }
];
