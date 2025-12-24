export interface WatchPartyVenue {
  name: string;
  type: 'fanfest' | 'bar' | 'outdoor' | 'fanzone';
  capacity: string;
  address: string;
  mapsUrl: string;
  features: string[];
}

export interface CityWatchParties {
  cityKey: string;
  officialFanFest?: WatchPartyVenue;
  venues: WatchPartyVenue[];
}

export const watchParties: CityWatchParties[] = [
  {
    cityKey: "newYork",
    officialFanFest: {
      name: "FIFA Fan Festival NYC",
      type: "fanfest",
      capacity: "50,000+",
      address: "Times Square, New York, NY",
      mapsUrl: "https://www.google.com/maps/search/times+square+new+york",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Bryant Park Watch Party",
        type: "outdoor",
        capacity: "10,000",
        address: "Bryant Park, New York, NY",
        mapsUrl: "https://www.google.com/maps/search/bryant+park+new+york",
        features: ["Free entry", "Lawn seating", "Food vendors"]
      }
    ]
  },
  {
    cityKey: "dallas",
    officialFanFest: {
      name: "FIFA Fan Festival Dallas",
      type: "fanfest",
      capacity: "40,000+",
      address: "AT&T Discovery District, Dallas, TX",
      mapsUrl: "https://www.google.com/maps/search/at%26t+discovery+district+dallas",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Klyde Warren Park",
        type: "outdoor",
        capacity: "15,000",
        address: "Klyde Warren Park, Dallas, TX",
        mapsUrl: "https://www.google.com/maps/search/klyde+warren+park+dallas",
        features: ["Free entry", "Food trucks", "Family friendly"]
      }
    ]
  },
  {
    cityKey: "losAngeles",
    officialFanFest: {
      name: "FIFA Fan Festival LA",
      type: "fanfest",
      capacity: "45,000+",
      address: "Grand Park, Los Angeles, CA",
      mapsUrl: "https://www.google.com/maps/search/grand+park+los+angeles",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Santa Monica Pier",
        type: "outdoor",
        capacity: "8,000",
        address: "Santa Monica Pier, CA",
        mapsUrl: "https://www.google.com/maps/search/santa+monica+pier",
        features: ["Beach atmosphere", "Food vendors", "Entertainment"]
      }
    ]
  },
  {
    cityKey: "atlanta",
    officialFanFest: {
      name: "FIFA Fan Festival Atlanta",
      type: "fanfest",
      capacity: "35,000+",
      address: "Centennial Olympic Park, Atlanta, GA",
      mapsUrl: "https://www.google.com/maps/search/centennial+olympic+park+atlanta",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Piedmont Park",
        type: "outdoor",
        capacity: "12,000",
        address: "Piedmont Park, Atlanta, GA",
        mapsUrl: "https://www.google.com/maps/search/piedmont+park+atlanta",
        features: ["Free entry", "Lawn seating", "Food vendors"]
      }
    ]
  },
  {
    cityKey: "miami",
    officialFanFest: {
      name: "FIFA Fan Festival Miami",
      type: "fanfest",
      capacity: "40,000+",
      address: "Bayfront Park, Miami, FL",
      mapsUrl: "https://www.google.com/maps/search/bayfront+park+miami",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "South Beach Watch Party",
        type: "outdoor",
        capacity: "10,000",
        address: "Lummus Park, Miami Beach, FL",
        mapsUrl: "https://www.google.com/maps/search/lummus+park+miami+beach",
        features: ["Beach location", "Giant screens", "Food vendors"]
      }
    ]
  },
  {
    cityKey: "sanFrancisco",
    officialFanFest: {
      name: "FIFA Fan Festival SF",
      type: "fanfest",
      capacity: "30,000+",
      address: "Civic Center Plaza, San Francisco, CA",
      mapsUrl: "https://www.google.com/maps/search/civic+center+plaza+san+francisco",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Dolores Park",
        type: "outdoor",
        capacity: "8,000",
        address: "Dolores Park, San Francisco, CA",
        mapsUrl: "https://www.google.com/maps/search/dolores+park+san+francisco",
        features: ["Free entry", "Lawn seating", "City views"]
      }
    ]
  },
  {
    cityKey: "seattle",
    officialFanFest: {
      name: "FIFA Fan Festival Seattle",
      type: "fanfest",
      capacity: "25,000+",
      address: "Seattle Center, Seattle, WA",
      mapsUrl: "https://www.google.com/maps/search/seattle+center",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Gas Works Park",
        type: "outdoor",
        capacity: "6,000",
        address: "Gas Works Park, Seattle, WA",
        mapsUrl: "https://www.google.com/maps/search/gas+works+park+seattle",
        features: ["Free entry", "Skyline views", "Family friendly"]
      }
    ]
  },
  {
    cityKey: "houston",
    officialFanFest: {
      name: "FIFA Fan Festival Houston",
      type: "fanfest",
      capacity: "35,000+",
      address: "Discovery Green, Houston, TX",
      mapsUrl: "https://www.google.com/maps/search/discovery+green+houston",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Hermann Park",
        type: "outdoor",
        capacity: "10,000",
        address: "Hermann Park, Houston, TX",
        mapsUrl: "https://www.google.com/maps/search/hermann+park+houston",
        features: ["Free entry", "Lawn seating", "Family friendly"]
      }
    ]
  },
  {
    cityKey: "philadelphia",
    officialFanFest: {
      name: "FIFA Fan Festival Philadelphia",
      type: "fanfest",
      capacity: "30,000+",
      address: "Benjamin Franklin Parkway, Philadelphia, PA",
      mapsUrl: "https://www.google.com/maps/search/benjamin+franklin+parkway+philadelphia",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Fairmount Park",
        type: "outdoor",
        capacity: "8,000",
        address: "Fairmount Park, Philadelphia, PA",
        mapsUrl: "https://www.google.com/maps/search/fairmount+park+philadelphia",
        features: ["Free entry", "Lawn seating", "Historic setting"]
      }
    ]
  },
  {
    cityKey: "kansasCity",
    officialFanFest: {
      name: "FIFA Fan Festival KC",
      type: "fanfest",
      capacity: "25,000+",
      address: "Power & Light District, Kansas City, MO",
      mapsUrl: "https://www.google.com/maps/search/power+and+light+district+kansas+city",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Union Station",
        type: "outdoor",
        capacity: "5,000",
        address: "Union Station, Kansas City, MO",
        mapsUrl: "https://www.google.com/maps/search/union+station+kansas+city",
        features: ["Historic venue", "Giant screens", "Food vendors"]
      }
    ]
  },
  {
    cityKey: "boston",
    officialFanFest: {
      name: "FIFA Fan Festival Boston",
      type: "fanfest",
      capacity: "25,000+",
      address: "Boston Common, Boston, MA",
      mapsUrl: "https://www.google.com/maps/search/boston+common",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Seaport District",
        type: "outdoor",
        capacity: "8,000",
        address: "Seaport District, Boston, MA",
        mapsUrl: "https://www.google.com/maps/search/seaport+district+boston",
        features: ["Waterfront views", "Multiple screens", "Restaurants"]
      }
    ]
  },
  {
    cityKey: "toronto",
    officialFanFest: {
      name: "FIFA Fan Festival Toronto",
      type: "fanfest",
      capacity: "40,000+",
      address: "Nathan Phillips Square, Toronto, ON",
      mapsUrl: "https://www.google.com/maps/search/nathan+phillips+square+toronto",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Maple Leaf Square",
        type: "outdoor",
        capacity: "10,000",
        address: "Maple Leaf Square, Toronto, ON",
        mapsUrl: "https://www.google.com/maps/search/maple+leaf+square+toronto",
        features: ["Giant screens", "Food vendors", "Near CN Tower"]
      }
    ]
  },
  {
    cityKey: "vancouver",
    officialFanFest: {
      name: "FIFA Fan Festival Vancouver",
      type: "fanfest",
      capacity: "30,000+",
      address: "Jack Poole Plaza, Vancouver, BC",
      mapsUrl: "https://www.google.com/maps/search/jack+poole+plaza+vancouver",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Granville Island",
        type: "outdoor",
        capacity: "5,000",
        address: "Granville Island, Vancouver, BC",
        mapsUrl: "https://www.google.com/maps/search/granville+island+vancouver",
        features: ["Waterfront views", "Food market", "Entertainment"]
      }
    ]
  },
  {
    cityKey: "mexicoCity",
    officialFanFest: {
      name: "FIFA Fan Festival CDMX",
      type: "fanfest",
      capacity: "60,000+",
      address: "Zócalo, Mexico City",
      mapsUrl: "https://www.google.com/maps/search/zocalo+mexico+city",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Reforma Fan Zone",
        type: "outdoor",
        capacity: "20,000",
        address: "Paseo de la Reforma, Mexico City",
        mapsUrl: "https://www.google.com/maps/search/paseo+de+la+reforma+mexico+city",
        features: ["Iconic avenue", "Multiple screens", "Food vendors"]
      }
    ]
  },
  {
    cityKey: "guadalajara",
    officialFanFest: {
      name: "FIFA Fan Festival Guadalajara",
      type: "fanfest",
      capacity: "35,000+",
      address: "Plaza de la Liberación, Guadalajara",
      mapsUrl: "https://www.google.com/maps/search/plaza+de+la+liberacion+guadalajara",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Glorieta Chapalita",
        type: "outdoor",
        capacity: "8,000",
        address: "Glorieta Chapalita, Guadalajara",
        mapsUrl: "https://www.google.com/maps/search/glorieta+chapalita+guadalajara",
        features: ["Local atmosphere", "Food vendors", "Family friendly"]
      }
    ]
  },
  {
    cityKey: "monterrey",
    officialFanFest: {
      name: "FIFA Fan Festival Monterrey",
      type: "fanfest",
      capacity: "30,000+",
      address: "Macroplaza, Monterrey",
      mapsUrl: "https://www.google.com/maps/search/macroplaza+monterrey",
      features: ["Giant screens", "Live entertainment", "Food vendors", "Official merchandise"]
    },
    venues: [
      {
        name: "Fundidora Park",
        type: "outdoor",
        capacity: "12,000",
        address: "Parque Fundidora, Monterrey",
        mapsUrl: "https://www.google.com/maps/search/parque+fundidora+monterrey",
        features: ["Large park", "Multiple areas", "Family friendly"]
      }
    ]
  }
];
