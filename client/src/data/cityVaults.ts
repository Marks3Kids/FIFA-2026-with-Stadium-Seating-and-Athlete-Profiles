export interface DepartmentOfTransportation {
  name: string;
  abbreviation: string;
  website: string;
  phone: string;
  state?: string;
}

export interface LogisticsInfo {
  trap: string;
  solution: string;
  localTransit: string[];
  departmentOfTransportation?: DepartmentOfTransportation[];
}

export interface SafetyInfo {
  internationalHospital: {
    name: string;
    specialty: string;
    mapsUrl: string;
  };
  emergencyHub: {
    name: string;
    description: string;
    mapsUrl: string;
  };
  emergencyNumber: string;
}

export interface SpiritualService {
  name: string;
  type: 'protestant' | 'catholic' | 'islamic' | 'jewish' | 'chapel';
  description: string;
  mapsUrl: string;
}

export interface WatchPartyVenue {
  name: string;
  type: 'vibe' | 'energy' | 'local';
  description: string;
  capacity: string;
  mapsUrl: string;
}

export interface ComfortGuide {
  category: string;
  recommendations: {
    name: string;
    description: string;
    mapsUrl: string;
  }[];
}

export interface AdaGate {
  name: string;
  description: string;
  mapsUrl: string;
}

export interface RideshareZone {
  name: string;
  type: 'pickup' | 'dropoff' | 'both';
  description: string;
  mapsUrl: string;
}

export interface StadiumAccess {
  fifaStadiumName: string;
  regularStadiumName: string;
  mobilityMapUrl?: string;
  lastMileWalkingGuideUrl?: string;
  transportationPdfUrl?: string;
  adaGates?: AdaGate[];
  rideshareZones?: RideshareZone[];
  gateAssignments?: string;
}

export interface CityVault {
  cityKey: string;
  motto: string;
  welcomeMessage: string;
  logistics: LogisticsInfo;
  safety: SafetyInfo;
  spiritual: SpiritualService[];
  watchParties: WatchPartyVenue[];
  comfort: ComfortGuide[];
  stadiumAccess?: StadiumAccess;
}

export const cityVaults: CityVault[] = [
  {
    cityKey: "kansasCity",
    motto: "The Soccer Capital of America & The Heart of the Tournament",
    welcomeMessage: "Welcome to the Heart of America! I see you've arrived in Kansas City. A quick heads-up: Parking at the stadium is extremely restricted today. I have secured your 'Stadium Direct' bus pass and mapped the shuttle pickup at Union Station. Since you have 3 hours before kickoff, would you like the walking route to the WWI Museum Fan Fest for a photo at the Heart Gateway?",
    logistics: {
      trap: "Arrowhead Stadium has 22,000 parking spots, but only 4,000 are available for the public. No ticket, no entry to the grounds.",
      solution: "Use ConnectKC26. The app links to 215+ motorcoaches running 'Stadium Direct' routes from regional hubs (Lawrence, Overland Park, Independence, Downtown).",
      localTransit: [
        "KC Streetcar (free) - Power & Light District to Fan Festival at Liberty Memorial",
        "RideKC Bus - Multiple routes to stadium on match days",
        "Stadium Direct Shuttles from Union Station"
      ],
      departmentOfTransportation: [
        { name: "Missouri Department of Transportation", abbreviation: "MoDOT", website: "https://www.modot.org", phone: "1-888-275-6636", state: "Missouri" },
        { name: "Kansas Department of Transportation", abbreviation: "KDOT", website: "https://www.ksdot.gov", phone: "785-296-3566", state: "Kansas" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Children's Mercy Hospital",
        specialty: "International Travel Medicine Clinic - perfect for families traveling from abroad",
        mapsUrl: "https://www.google.com/maps/search/childrens+mercy+hospital+kansas+city"
      },
      emergencyHub: {
        name: "Saint Luke's Hospital",
        description: "Primary high-capacity trauma center for the urban core, near the Plaza",
        mapsUrl: "https://www.google.com/maps/search/saint+lukes+hospital+kansas+city"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Faith and Family Chapel", type: "chapel", description: "Located at Arrowhead Stadium (south corner) - non-denominational services on match days", mapsUrl: "https://www.google.com/maps/search/arrowhead+stadium+kansas+city" },
      { name: "Islamic Center of Greater Kansas City", type: "islamic", description: "Primary hub for Friday prayers in South KC", mapsUrl: "https://www.google.com/maps/search/islamic+center+kansas+city" },
      { name: "The Jewish Community Center (The J)", type: "jewish", description: "Safe, welcoming environment in Overland Park", mapsUrl: "https://www.google.com/maps/search/jewish+community+center+overland+park" },
      { name: "Cathedral of the Immaculate Conception", type: "catholic", description: "Centrally located downtown", mapsUrl: "https://www.google.com/maps/search/cathedral+immaculate+conception+kansas+city" }
    ],
    watchParties: [
      { name: "Liberty Memorial (WWI Museum)", type: "vibe", description: "Official FIFA Fan Festival - 65-foot 'KC Heart Gateway' and 4,500 sq ft video boards. Best for families.", capacity: "25,000+", mapsUrl: "https://www.google.com/maps/search/liberty+memorial+kansas+city" },
      { name: "KC Live! (Power & Light)", type: "energy", description: "High-intensity, adult-focused, surrounded by bars. Where viral goal reactions happen.", capacity: "10,000+", mapsUrl: "https://www.google.com/maps/search/power+and+light+district+kansas+city" },
      { name: "North Kansas City (Northtown)", type: "local", description: "Curated local business vibe with fewer crowds than official Fan Fest", capacity: "3,000", mapsUrl: "https://www.google.com/maps/search/northtown+kansas+city" }
    ],
    comfort: [
      {
        category: "BBQ Trail",
        recommendations: [
          { name: "Joe's KC", description: "Gas station vibe, legendary burnt ends", mapsUrl: "https://www.google.com/maps/search/joes+kc+bbq" },
          { name: "Arthur Bryant's", description: "Historic KC BBQ institution", mapsUrl: "https://www.google.com/maps/search/arthur+bryants+kansas+city" },
          { name: "Q39", description: "Premium dining experience", mapsUrl: "https://www.google.com/maps/search/q39+kansas+city" }
        ]
      },
      {
        category: "Jazz & Nightlife",
        recommendations: [
          { name: "18th & Vine District", description: "Historic jazz district", mapsUrl: "https://www.google.com/maps/search/18th+and+vine+kansas+city" },
          { name: "The Blue Room", description: "Late-night jazz decompression after matches", mapsUrl: "https://www.google.com/maps/search/blue+room+jazz+kansas+city" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Kansas City Stadium FIFA",
      regularStadiumName: "GEHA Field at Arrowhead Stadium",
      adaGates: [
        { name: "Gate D", description: "Main ADA entrance - West side", mapsUrl: "https://www.google.com/maps/search/Arrowhead+Stadium+Gate+D+Kansas+City" },
        { name: "Gate G", description: "East ADA entrance", mapsUrl: "https://www.google.com/maps/search/Arrowhead+Stadium+Gate+G+Kansas+City" },
        { name: "Gate M", description: "North ADA entrance", mapsUrl: "https://www.google.com/maps/search/Arrowhead+Stadium+Gate+M+Kansas+City" }
      ],
      rideshareZones: [
        { name: "Lot M Rideshare", type: "both", description: "Primary Uber/Lyft zone - North lot", mapsUrl: "https://www.google.com/maps/search/Arrowhead+Stadium+Lot+M+Kansas+City" },
        { name: "Red Lot Drop-off", type: "dropoff", description: "Match day drop-off only", mapsUrl: "https://www.google.com/maps/search/Arrowhead+Stadium+Red+Lot+Kansas+City" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "newYork",
    motto: "The World's Stage - Where Champions Are Made",
    welcomeMessage: "Welcome to the Big Apple! I've noted your arrival in New York. The PATH trains and NJ Transit are running extended hours for match days. MetLife Stadium is in New Jersey - I've mapped the fastest route from your location. Would you like me to set a departure reminder accounting for stadium security lines?",
    logistics: {
      trap: "MetLife Stadium is in East Rutherford, NJ - not Manhattan. Traffic on match days can add 2+ hours to your journey.",
      solution: "Take NJ Transit from Penn Station to Meadowlands Station (direct service on match days). Avoid driving.",
      localTransit: [
        "NJ Transit - Direct trains from Penn Station to Meadowlands",
        "NY Waterway Ferry + Shuttle combo from Manhattan",
        "PATH train to Hoboken + NJ Transit connection"
      ],
      departmentOfTransportation: [
        { name: "New York State Department of Transportation", abbreviation: "NYSDOT", website: "https://www.dot.ny.gov", phone: "518-457-6195", state: "New York" },
        { name: "New Jersey Department of Transportation", abbreviation: "NJDOT", website: "https://dot.nj.gov", phone: "609-292-6500", state: "New Jersey" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "NYU Langone Medical Center",
        specialty: "International Patient Services with multilingual staff",
        mapsUrl: "https://www.google.com/maps/search/nyu+langone+medical+center"
      },
      emergencyHub: {
        name: "Hackensack University Medical Center",
        description: "Closest major trauma center to MetLife Stadium",
        mapsUrl: "https://www.google.com/maps/search/hackensack+university+medical+center"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "St. Patrick's Cathedral", type: "catholic", description: "Iconic cathedral on Fifth Avenue", mapsUrl: "https://www.google.com/maps/search/st+patricks+cathedral+new+york" },
      { name: "Islamic Cultural Center of NY", type: "islamic", description: "Largest mosque in New York City", mapsUrl: "https://www.google.com/maps/search/islamic+cultural+center+new+york" },
      { name: "Central Synagogue", type: "jewish", description: "Historic Reform synagogue in Midtown", mapsUrl: "https://www.google.com/maps/search/central+synagogue+new+york" },
      { name: "Riverside Church", type: "protestant", description: "Interdenominational church with stunning views", mapsUrl: "https://www.google.com/maps/search/riverside+church+new+york" }
    ],
    watchParties: [
      { name: "Times Square Fan Festival", type: "vibe", description: "Official FIFA Fan Festival - massive screens in the heart of NYC", capacity: "50,000+", mapsUrl: "https://www.google.com/maps/search/times+square+new+york" },
      { name: "Hudson Yards Public Square", type: "energy", description: "Modern venue with premium viewing and dining options", capacity: "15,000", mapsUrl: "https://www.google.com/maps/search/hudson+yards+new+york" },
      { name: "Smithfield Hall", type: "local", description: "Authentic soccer bar experience in Manhattan", capacity: "500", mapsUrl: "https://www.google.com/maps/search/smithfield+hall+new+york" }
    ],
    comfort: [
      {
        category: "Iconic NYC Eats",
        recommendations: [
          { name: "Katz's Delicatessen", description: "Legendary pastrami since 1888", mapsUrl: "https://www.google.com/maps/search/katzs+deli+new+york" },
          { name: "Joe's Pizza", description: "Classic NY slice experience", mapsUrl: "https://www.google.com/maps/search/joes+pizza+new+york" },
          { name: "Chelsea Market", description: "Food hall with global options", mapsUrl: "https://www.google.com/maps/search/chelsea+market+new+york" }
        ]
      },
      {
        category: "Late Night",
        recommendations: [
          { name: "Broadway Theater District", description: "Catch a show after the match", mapsUrl: "https://www.google.com/maps/search/broadway+theater+district" },
          { name: "Village Vanguard", description: "Historic jazz club", mapsUrl: "https://www.google.com/maps/search/village+vanguard+new+york" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "New York/New Jersey Stadium",
      regularStadiumName: "MetLife Stadium",
      adaGates: [
        { name: "Gate A", description: "Main ADA entrance - West plaza", mapsUrl: "https://www.google.com/maps/search/MetLife+Stadium+Gate+A+East+Rutherford" },
        { name: "Gate C", description: "North ADA entrance", mapsUrl: "https://www.google.com/maps/search/MetLife+Stadium+Gate+C+East+Rutherford" },
        { name: "Gate E", description: "South ADA entrance", mapsUrl: "https://www.google.com/maps/search/MetLife+Stadium+Gate+E+East+Rutherford" }
      ],
      rideshareZones: [
        { name: "Lot K Rideshare", type: "both", description: "Primary Uber/Lyft pickup and drop-off", mapsUrl: "https://www.google.com/maps/search/MetLife+Stadium+Lot+K+East+Rutherford" },
        { name: "Meadowlands Station", type: "dropoff", description: "Train station drop-off area", mapsUrl: "https://www.google.com/maps/search/Meadowlands+Rail+Station+East+Rutherford" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "losAngeles",
    motto: "City of Angels - Where Dreams Meet the World's Game",
    welcomeMessage: "Welcome to LA! Traffic is always a factor here - I've calculated that leaving 3 hours before kickoff from your location will get you to SoFi Stadium comfortably. The Metro E Line has a direct station at the stadium. Would you like cooling station locations mapped? It's expected to be 85°F at kickoff.",
    logistics: {
      trap: "LA traffic is legendary. SoFi Stadium has limited parking and can take 90+ minutes to exit after matches.",
      solution: "Take the Metro E Line direct to Downtown Inglewood station, then walk or shuttle to stadium.",
      localTransit: [
        "Metro E Line - Direct to Downtown Inglewood",
        "LAX FlyAway shuttles extended for match days",
        "Free stadium shuttles from designated parking lots"
      ],
      departmentOfTransportation: [
        { name: "California Department of Transportation", abbreviation: "Caltrans", website: "https://dot.ca.gov", phone: "916-322-1297", state: "California" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Cedars-Sinai Medical Center",
        specialty: "World-renowned medical center with international patient services",
        mapsUrl: "https://www.google.com/maps/search/cedars+sinai+los+angeles"
      },
      emergencyHub: {
        name: "Harbor-UCLA Medical Center",
        description: "Major trauma center near SoFi Stadium in Torrance",
        mapsUrl: "https://www.google.com/maps/search/harbor+ucla+medical+center"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Cathedral of Our Lady of the Angels", type: "catholic", description: "Modern cathedral in Downtown LA", mapsUrl: "https://www.google.com/maps/search/cathedral+our+lady+angels+los+angeles" },
      { name: "King Fahad Mosque", type: "islamic", description: "One of the largest mosques in the Western US", mapsUrl: "https://www.google.com/maps/search/king+fahad+mosque+los+angeles" },
      { name: "Sinai Temple", type: "jewish", description: "Historic Conservative synagogue in Westwood", mapsUrl: "https://www.google.com/maps/search/sinai+temple+los+angeles" },
      { name: "Hollywood United Methodist", type: "protestant", description: "Welcoming church near Hollywood", mapsUrl: "https://www.google.com/maps/search/hollywood+united+methodist+church" }
    ],
    watchParties: [
      { name: "Grand Park", type: "vibe", description: "Official FIFA Fan Festival - massive screens near City Hall", capacity: "45,000+", mapsUrl: "https://www.google.com/maps/search/grand+park+los+angeles" },
      { name: "LA Live", type: "energy", description: "Entertainment district with bars and restaurants", capacity: "20,000", mapsUrl: "https://www.google.com/maps/search/la+live+los+angeles" },
      { name: "The Greyhound Bar", type: "local", description: "Authentic soccer pub in Highland Park", capacity: "200", mapsUrl: "https://www.google.com/maps/search/greyhound+bar+los+angeles" }
    ],
    comfort: [
      {
        category: "LA Food Scene",
        recommendations: [
          { name: "Grand Central Market", description: "Historic food hall with diverse cuisines", mapsUrl: "https://www.google.com/maps/search/grand+central+market+los+angeles" },
          { name: "Koreatown", description: "24-hour Korean BBQ and nightlife", mapsUrl: "https://www.google.com/maps/search/koreatown+los+angeles" },
          { name: "Olvera Street", description: "Historic Mexican marketplace", mapsUrl: "https://www.google.com/maps/search/olvera+street+los+angeles" }
        ]
      },
      {
        category: "Beach Decompression",
        recommendations: [
          { name: "Santa Monica Pier", description: "Iconic beachfront entertainment", mapsUrl: "https://www.google.com/maps/search/santa+monica+pier" },
          { name: "Venice Beach Boardwalk", description: "Street performers and ocean views", mapsUrl: "https://www.google.com/maps/search/venice+beach+boardwalk" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Los Angeles Stadium FIFA",
      regularStadiumName: "SoFi Stadium",
      adaGates: [
        { name: "Gate A", description: "Main ADA entrance - American Airlines Plaza", mapsUrl: "https://www.google.com/maps/search/SoFi+Stadium+Gate+A+Inglewood" },
        { name: "Gate F", description: "East ADA entrance", mapsUrl: "https://www.google.com/maps/search/SoFi+Stadium+Gate+F+Inglewood" },
        { name: "Gate H", description: "South ADA entrance", mapsUrl: "https://www.google.com/maps/search/SoFi+Stadium+Gate+H+Inglewood" }
      ],
      rideshareZones: [
        { name: "Pink Lot", type: "both", description: "Primary Uber/Lyft zone", mapsUrl: "https://www.google.com/maps/search/SoFi+Stadium+Pink+Lot+Inglewood" },
        { name: "Hollywood Park Casino", type: "dropoff", description: "Overflow rideshare area", mapsUrl: "https://www.google.com/maps/search/Hollywood+Park+Casino+Inglewood" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "miami",
    motto: "Where Latin Passion Meets American Dreams",
    welcomeMessage: "Welcome to Miami! Important: The heat index can reach 105°F during matches. I've mapped all cooling stations and shaded rest areas around Hard Rock Stadium. The stadium is 15 miles north of downtown - would you like shuttle options from your hotel or the walking route to the nearest hydration station?",
    logistics: {
      trap: "Hard Rock Stadium is in Miami Gardens, 15 miles north of downtown Miami Beach. Limited parking and extreme heat.",
      solution: "Take the Brightline to Aventura, then use official FIFA shuttles. Stay hydrated - heat exhaustion is a real risk.",
      localTransit: [
        "Brightline train to Aventura + FIFA shuttle",
        "Miami-Dade Transit express buses on match days",
        "Official park-and-ride from Dolphin Mall"
      ],
      departmentOfTransportation: [
        { name: "Florida Department of Transportation", abbreviation: "FDOT", website: "https://www.fdot.gov", phone: "850-414-4100", state: "Florida" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Jackson Memorial Hospital",
        specialty: "International patient program with Spanish-speaking staff",
        mapsUrl: "https://www.google.com/maps/search/jackson+memorial+hospital+miami"
      },
      emergencyHub: {
        name: "Memorial Regional Hospital",
        description: "Level I trauma center closest to Hard Rock Stadium",
        mapsUrl: "https://www.google.com/maps/search/memorial+regional+hospital+hollywood+florida"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "St. Mary Cathedral", type: "catholic", description: "Historic cathedral in Downtown Miami", mapsUrl: "https://www.google.com/maps/search/st+mary+cathedral+miami" },
      { name: "Masjid Al-Ansar", type: "islamic", description: "Major mosque in Miami Gardens near stadium", mapsUrl: "https://www.google.com/maps/search/masjid+al+ansar+miami" },
      { name: "Temple Israel of Greater Miami", type: "jewish", description: "Reform synagogue in Miami", mapsUrl: "https://www.google.com/maps/search/temple+israel+miami" },
      { name: "Trinity Cathedral", type: "protestant", description: "Episcopal cathedral downtown", mapsUrl: "https://www.google.com/maps/search/trinity+cathedral+miami" }
    ],
    watchParties: [
      { name: "Bayfront Park", type: "vibe", description: "Official FIFA Fan Festival with bay views", capacity: "40,000+", mapsUrl: "https://www.google.com/maps/search/bayfront+park+miami" },
      { name: "Brickell City Centre", type: "energy", description: "Upscale outdoor screens with A/C nearby", capacity: "8,000", mapsUrl: "https://www.google.com/maps/search/brickell+city+centre+miami" },
      { name: "Fútbol Miami", type: "local", description: "Authentic soccer bar in Little Havana", capacity: "300", mapsUrl: "https://www.google.com/maps/search/futbol+miami+little+havana" }
    ],
    comfort: [
      {
        category: "Cuban & Latin Cuisine",
        recommendations: [
          { name: "Versailles Restaurant", description: "Iconic Cuban cuisine in Little Havana", mapsUrl: "https://www.google.com/maps/search/versailles+restaurant+miami" },
          { name: "Calle Ocho", description: "The heart of Cuban culture in Miami", mapsUrl: "https://www.google.com/maps/search/calle+ocho+miami" },
          { name: "La Mar by Gaston Acurio", description: "Upscale Peruvian in Brickell", mapsUrl: "https://www.google.com/maps/search/la+mar+miami" }
        ]
      },
      {
        category: "Beach & Nightlife",
        recommendations: [
          { name: "South Beach (Ocean Drive)", description: "Art Deco district and nightlife", mapsUrl: "https://www.google.com/maps/search/ocean+drive+miami+beach" },
          { name: "Wynwood Walls", description: "Street art and galleries", mapsUrl: "https://www.google.com/maps/search/wynwood+walls+miami" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Miami Stadium FIFA",
      regularStadiumName: "Hard Rock Stadium",
      adaGates: [
        { name: "Gate A", description: "Main ADA entrance - Northwest", mapsUrl: "https://www.google.com/maps/search/Hard+Rock+Stadium+Gate+A+Miami+Gardens" },
        { name: "Gate D", description: "East ADA entrance", mapsUrl: "https://www.google.com/maps/search/Hard+Rock+Stadium+Gate+D+Miami+Gardens" },
        { name: "Gate G", description: "South ADA entrance", mapsUrl: "https://www.google.com/maps/search/Hard+Rock+Stadium+Gate+G+Miami+Gardens" }
      ],
      rideshareZones: [
        { name: "Lot 18", type: "both", description: "Primary Uber/Lyft pickup and drop-off", mapsUrl: "https://www.google.com/maps/search/Hard+Rock+Stadium+Lot+18+Miami+Gardens" },
        { name: "NW 199th Street", type: "dropoff", description: "Overflow drop-off zone", mapsUrl: "https://www.google.com/maps/search/Hard+Rock+Stadium+NW+199th+Street" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "dallas",
    motto: "Everything's Bigger in Texas - Including the Passion",
    welcomeMessage: "Welcome to Big D! AT&T Stadium in Arlington is climate-controlled (thank goodness in Texas heat). I've mapped the TRE train route from Dallas - it's the easiest way to avoid I-30 traffic. The retractable roof will likely be closed. Would you like Texas BBQ recommendations for before the match?",
    logistics: {
      trap: "AT&T Stadium is in Arlington, between Dallas and Fort Worth. No public transit goes directly there.",
      solution: "Take the TRE (Trinity Railway Express) to CentrePort station, then use official shuttles. Or park at designated lots with shuttle service.",
      localTransit: [
        "TRE train to CentrePort + stadium shuttle",
        "DART Rail to TRE connection",
        "Official park-and-ride from Globe Life Field lot"
      ],
      departmentOfTransportation: [
        { name: "Texas Department of Transportation", abbreviation: "TxDOT", website: "https://www.txdot.gov", phone: "1-800-558-9368", state: "Texas" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "UT Southwestern Medical Center",
        specialty: "International patient services with translation",
        mapsUrl: "https://www.google.com/maps/search/ut+southwestern+medical+center+dallas"
      },
      emergencyHub: {
        name: "Texas Health Arlington Memorial",
        description: "Closest major hospital to AT&T Stadium",
        mapsUrl: "https://www.google.com/maps/search/texas+health+arlington+memorial"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Cathedral Shrine of the Virgin of Guadalupe", type: "catholic", description: "Beautiful cathedral in Downtown Dallas", mapsUrl: "https://www.google.com/maps/search/cathedral+guadalupe+dallas" },
      { name: "Islamic Association of North Texas", type: "islamic", description: "One of the largest mosques in Texas", mapsUrl: "https://www.google.com/maps/search/islamic+association+north+texas" },
      { name: "Congregation Shearith Israel", type: "jewish", description: "Historic synagogue in North Dallas", mapsUrl: "https://www.google.com/maps/search/congregation+shearith+israel+dallas" },
      { name: "First Baptist Dallas", type: "protestant", description: "Major downtown congregation", mapsUrl: "https://www.google.com/maps/search/first+baptist+dallas" }
    ],
    watchParties: [
      { name: "AT&T Discovery District", type: "vibe", description: "Official FIFA Fan Festival in Downtown Dallas", capacity: "40,000+", mapsUrl: "https://www.google.com/maps/search/att+discovery+district+dallas" },
      { name: "Deep Ellum", type: "energy", description: "Arts district with bars and live music", capacity: "15,000", mapsUrl: "https://www.google.com/maps/search/deep+ellum+dallas" },
      { name: "The Londoner", type: "local", description: "British pub with proper football atmosphere", capacity: "400", mapsUrl: "https://www.google.com/maps/search/the+londoner+dallas" }
    ],
    comfort: [
      {
        category: "Texas BBQ",
        recommendations: [
          { name: "Pecan Lodge", description: "Award-winning brisket in Deep Ellum", mapsUrl: "https://www.google.com/maps/search/pecan+lodge+dallas" },
          { name: "Terry Black's BBQ", description: "Austin-style BBQ in Deep Ellum", mapsUrl: "https://www.google.com/maps/search/terry+blacks+bbq+dallas" },
          { name: "Cattleack Barbeque", description: "Only open Thursday-Saturday, legendary", mapsUrl: "https://www.google.com/maps/search/cattleack+barbeque+dallas" }
        ]
      },
      {
        category: "Tex-Mex & Nightlife",
        recommendations: [
          { name: "Mi Cocina", description: "Upscale Tex-Mex in Highland Park", mapsUrl: "https://www.google.com/maps/search/mi+cocina+dallas" },
          { name: "Uptown Dallas", description: "Bars and restaurants on McKinney Ave", mapsUrl: "https://www.google.com/maps/search/uptown+dallas" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Dallas Stadium FIFA",
      regularStadiumName: "AT&T Stadium",
      adaGates: [
        { name: "Gate A", description: "Main ADA entrance - East plaza", mapsUrl: "https://www.google.com/maps/search/AT%26T+Stadium+Gate+A+Arlington" },
        { name: "Gate C", description: "North ADA entrance", mapsUrl: "https://www.google.com/maps/search/AT%26T+Stadium+Gate+C+Arlington" },
        { name: "Gate F", description: "West ADA entrance", mapsUrl: "https://www.google.com/maps/search/AT%26T+Stadium+Gate+F+Arlington" }
      ],
      rideshareZones: [
        { name: "Lot 4", type: "both", description: "Primary Uber/Lyft zone - East side", mapsUrl: "https://www.google.com/maps/search/AT%26T+Stadium+Lot+4+Arlington" },
        { name: "Globe Life Field", type: "dropoff", description: "Overflow rideshare with walking bridge", mapsUrl: "https://www.google.com/maps/search/Globe+Life+Field+Arlington" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "houston",
    motto: "Space City - Where the World Lands for the Beautiful Game",
    welcomeMessage: "Welcome to Space City! Critical alert: June/July humidity in Houston is intense. I've mapped all underground tunnel system entrances near your hotel - they connect 95+ blocks of climate-controlled walkways downtown. NRG Stadium has excellent A/C. Would you like the tunnel route to Discovery Green Fan Festival?",
    logistics: {
      trap: "Houston heat and humidity can be dangerous. NRG Stadium parking lots have little shade.",
      solution: "Use METRORail to NRG Park station. Arrive early to avoid heat. Use the downtown tunnel system when possible.",
      localTransit: [
        "METRORail Red Line direct to NRG Park",
        "Park & Ride from multiple suburban locations",
        "Downtown Tunnel System - 95+ blocks of A/C walkways"
      ],
      departmentOfTransportation: [
        { name: "Texas Department of Transportation", abbreviation: "TxDOT", website: "https://www.txdot.gov", phone: "1-800-558-9368", state: "Texas" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Houston Methodist Hospital",
        specialty: "Global Health Care Services with 200+ language interpreters",
        mapsUrl: "https://www.google.com/maps/search/houston+methodist+hospital"
      },
      emergencyHub: {
        name: "Memorial Hermann - Texas Medical Center",
        description: "Level I trauma center in the world's largest medical complex",
        mapsUrl: "https://www.google.com/maps/search/memorial+hermann+texas+medical+center"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Co-Cathedral of the Sacred Heart", type: "catholic", description: "Modern cathedral downtown", mapsUrl: "https://www.google.com/maps/search/co+cathedral+sacred+heart+houston" },
      { name: "Islamic Society of Greater Houston", type: "islamic", description: "Major mosque with community center", mapsUrl: "https://www.google.com/maps/search/islamic+society+greater+houston" },
      { name: "Congregation Beth Israel", type: "jewish", description: "Historic Reform synagogue", mapsUrl: "https://www.google.com/maps/search/congregation+beth+israel+houston" },
      { name: "Lakewood Church", type: "protestant", description: "America's largest megachurch", mapsUrl: "https://www.google.com/maps/search/lakewood+church+houston" }
    ],
    watchParties: [
      { name: "Discovery Green", type: "vibe", description: "Official FIFA Fan Festival in downtown park", capacity: "35,000+", mapsUrl: "https://www.google.com/maps/search/discovery+green+houston" },
      { name: "Midtown Houston", type: "energy", description: "Bar district with outdoor screens", capacity: "10,000", mapsUrl: "https://www.google.com/maps/search/midtown+houston" },
      { name: "Richmond Arms", type: "local", description: "Authentic British pub, legendary soccer atmosphere", capacity: "500", mapsUrl: "https://www.google.com/maps/search/richmond+arms+houston" }
    ],
    comfort: [
      {
        category: "Houston Cuisine",
        recommendations: [
          { name: "Killen's BBQ", description: "Award-winning brisket in Pearland", mapsUrl: "https://www.google.com/maps/search/killens+bbq+houston" },
          { name: "Pappasito's Cantina", description: "Houston-famous Tex-Mex", mapsUrl: "https://www.google.com/maps/search/pappasitos+cantina+houston" },
          { name: "Chinatown Houston", description: "One of America's best Asian food scenes", mapsUrl: "https://www.google.com/maps/search/chinatown+houston" }
        ]
      },
      {
        category: "Space & Culture",
        recommendations: [
          { name: "Space Center Houston", description: "NASA's official visitor center", mapsUrl: "https://www.google.com/maps/search/space+center+houston" },
          { name: "Museum District", description: "19 museums in walkable area", mapsUrl: "https://www.google.com/maps/search/museum+district+houston" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Houston Stadium",
      regularStadiumName: "NRG Stadium",
      adaGates: [
        { name: "Gate 1", description: "Main ADA entrance - North side", mapsUrl: "https://www.google.com/maps/search/NRG+Stadium+Gate+1+Houston" },
        { name: "Gate 5", description: "East ADA entrance", mapsUrl: "https://www.google.com/maps/search/NRG+Stadium+Gate+5+Houston" },
        { name: "Gate 8", description: "South ADA entrance near METRORail", mapsUrl: "https://www.google.com/maps/search/NRG+Stadium+Gate+8+Houston" }
      ],
      rideshareZones: [
        { name: "Yellow Lot", type: "both", description: "Primary Uber/Lyft zone", mapsUrl: "https://www.google.com/maps/search/NRG+Stadium+Yellow+Lot+Houston" },
        { name: "METRORail Station", type: "dropoff", description: "Drop-off near rail station", mapsUrl: "https://www.google.com/maps/search/NRG+Park+METRORail+Houston" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "atlanta",
    motto: "The ATL - Where Southern Hospitality Meets Global Football",
    welcomeMessage: "Welcome to Atlanta! Mercedes-Benz Stadium is one of the world's most modern venues - the halo video board is incredible. MARTA takes you directly there. I've noted that Georgia heat can be intense even in the dome area. Would you like soul food recommendations near the Centennial Olympic Park Fan Festival?",
    logistics: {
      trap: "Atlanta traffic is notoriously bad. Parking at MBS is expensive and fills quickly.",
      solution: "Take MARTA to Dome/GWCC/Philips Arena/CNN Center station - direct access to stadium.",
      localTransit: [
        "MARTA Rail - Blue/Green lines to Dome/GWCC station",
        "Atlanta Streetcar through downtown",
        "Free MARTA service on match days with ticket"
      ],
      departmentOfTransportation: [
        { name: "Georgia Department of Transportation", abbreviation: "GDOT", website: "https://www.dot.ga.gov", phone: "404-631-1990", state: "Georgia" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Emory University Hospital",
        specialty: "International Patient Services with global health expertise",
        mapsUrl: "https://www.google.com/maps/search/emory+university+hospital+atlanta"
      },
      emergencyHub: {
        name: "Grady Memorial Hospital",
        description: "Metro Atlanta's primary Level I trauma center downtown",
        mapsUrl: "https://www.google.com/maps/search/grady+memorial+hospital+atlanta"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Cathedral of Christ the King", type: "catholic", description: "Beautiful cathedral in Buckhead", mapsUrl: "https://www.google.com/maps/search/cathedral+christ+the+king+atlanta" },
      { name: "Al-Farooq Masjid", type: "islamic", description: "One of the largest mosques in the Southeast", mapsUrl: "https://www.google.com/maps/search/al+farooq+masjid+atlanta" },
      { name: "The Temple (Hebrew Benevolent Congregation)", type: "jewish", description: "Historic Reform synagogue in Midtown", mapsUrl: "https://www.google.com/maps/search/the+temple+atlanta" },
      { name: "Ebenezer Baptist Church", type: "protestant", description: "Historic church of Dr. Martin Luther King Jr.", mapsUrl: "https://www.google.com/maps/search/ebenezer+baptist+church+atlanta" }
    ],
    watchParties: [
      { name: "Centennial Olympic Park", type: "vibe", description: "Official FIFA Fan Festival at historic Olympic venue", capacity: "35,000+", mapsUrl: "https://www.google.com/maps/search/centennial+olympic+park+atlanta" },
      { name: "Ponce City Market Roof", type: "energy", description: "Rooftop views with food hall below", capacity: "5,000", mapsUrl: "https://www.google.com/maps/search/ponce+city+market+atlanta" },
      { name: "Fado Irish Pub", type: "local", description: "Authentic soccer pub in Buckhead", capacity: "400", mapsUrl: "https://www.google.com/maps/search/fado+irish+pub+atlanta" }
    ],
    comfort: [
      {
        category: "Southern Soul Food",
        recommendations: [
          { name: "Mary Mac's Tea Room", description: "Atlanta institution since 1945", mapsUrl: "https://www.google.com/maps/search/mary+macs+tea+room+atlanta" },
          { name: "Busy Bee Cafe", description: "Historic soul food in West End", mapsUrl: "https://www.google.com/maps/search/busy+bee+cafe+atlanta" },
          { name: "Fox Bros. Bar-B-Q", description: "Texas-style BBQ in Atlanta", mapsUrl: "https://www.google.com/maps/search/fox+bros+bbq+atlanta" }
        ]
      },
      {
        category: "Culture & History",
        recommendations: [
          { name: "Martin Luther King Jr. National Historic Site", description: "Civil rights history", mapsUrl: "https://www.google.com/maps/search/mlk+national+historic+site+atlanta" },
          { name: "Atlanta BeltLine", description: "Urban trail with art and restaurants", mapsUrl: "https://www.google.com/maps/search/atlanta+beltline" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Atlanta Stadium FIFA",
      regularStadiumName: "Mercedes-Benz Stadium",
      adaGates: [
        { name: "Gate 1", description: "Main ADA entrance - North plaza", mapsUrl: "https://www.google.com/maps/search/Mercedes-Benz+Stadium+Gate+1+Atlanta" },
        { name: "Gate 4", description: "East ADA entrance near MARTA", mapsUrl: "https://www.google.com/maps/search/Mercedes-Benz+Stadium+Gate+4+Atlanta" },
        { name: "Gate 6", description: "South ADA entrance", mapsUrl: "https://www.google.com/maps/search/Mercedes-Benz+Stadium+Gate+6+Atlanta" }
      ],
      rideshareZones: [
        { name: "Lot Red", type: "both", description: "Primary Uber/Lyft zone - West side", mapsUrl: "https://www.google.com/maps/search/Mercedes-Benz+Stadium+Red+Lot+Atlanta" },
        { name: "GWCC Silver Deck", type: "dropoff", description: "Covered drop-off area", mapsUrl: "https://www.google.com/maps/search/Georgia+World+Congress+Center+Atlanta" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "philadelphia",
    motto: "The Birthplace of America - Where History Meets Football",
    welcomeMessage: "Welcome to Philly! Lincoln Financial Field is easily reached via SEPTA. Fun fact: The city is one of the most walkable in America. I've mapped cheesesteak spots and the historic district near your hotel. Would you like the walking route to Independence Hall before your match?",
    logistics: {
      trap: "Philadelphia parking is expensive. Stadium lots fill up fast on match days.",
      solution: "Take SEPTA Broad Street Line to AT&T Station, then walk or shuttle to Lincoln Financial Field.",
      localTransit: [
        "SEPTA Broad Street Line to AT&T Station",
        "SEPTA Regional Rail to 30th Street Station + subway",
        "NJ Transit from Trenton (Amtrak corridor connection)"
      ],
      departmentOfTransportation: [
        { name: "Pennsylvania Department of Transportation", abbreviation: "PennDOT", website: "https://www.pa.gov/agencies/penndot", phone: "1-800-932-4600", state: "Pennsylvania" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Penn Medicine",
        specialty: "International Patient Services at Hospital of the University of Pennsylvania",
        mapsUrl: "https://www.google.com/maps/search/hospital+university+pennsylvania"
      },
      emergencyHub: {
        name: "Thomas Jefferson University Hospital",
        description: "Major trauma center in Center City",
        mapsUrl: "https://www.google.com/maps/search/thomas+jefferson+hospital+philadelphia"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Cathedral Basilica of Saints Peter and Paul", type: "catholic", description: "Stunning cathedral on the Parkway", mapsUrl: "https://www.google.com/maps/search/cathedral+basilica+philadelphia" },
      { name: "Masjid Al-Jamia", type: "islamic", description: "Historic mosque in West Philadelphia", mapsUrl: "https://www.google.com/maps/search/masjid+al+jamia+philadelphia" },
      { name: "Congregation Rodeph Shalom", type: "jewish", description: "Historic Reform synagogue", mapsUrl: "https://www.google.com/maps/search/rodeph+shalom+philadelphia" },
      { name: "Arch Street United Methodist", type: "protestant", description: "Historic church near Independence Hall", mapsUrl: "https://www.google.com/maps/search/arch+street+methodist+philadelphia" }
    ],
    watchParties: [
      { name: "Benjamin Franklin Parkway", type: "vibe", description: "Official FIFA Fan Festival on the famous boulevard", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/benjamin+franklin+parkway+philadelphia" },
      { name: "Xfinity Live!", type: "energy", description: "Entertainment complex near stadiums", capacity: "10,000", mapsUrl: "https://www.google.com/maps/search/xfinity+live+philadelphia" },
      { name: "Fado Irish Pub", type: "local", description: "Soccer pub in Center City", capacity: "350", mapsUrl: "https://www.google.com/maps/search/fado+irish+pub+philadelphia" }
    ],
    comfort: [
      {
        category: "Philly Classics",
        recommendations: [
          { name: "Pat's King of Steaks", description: "Original Philly cheesesteak since 1930", mapsUrl: "https://www.google.com/maps/search/pats+king+steaks+philadelphia" },
          { name: "Geno's Steaks", description: "The famous rival across the street", mapsUrl: "https://www.google.com/maps/search/genos+steaks+philadelphia" },
          { name: "Reading Terminal Market", description: "Historic food market with everything", mapsUrl: "https://www.google.com/maps/search/reading+terminal+market+philadelphia" }
        ]
      },
      {
        category: "History & Culture",
        recommendations: [
          { name: "Independence Hall", description: "Where America was born", mapsUrl: "https://www.google.com/maps/search/independence+hall+philadelphia" },
          { name: "Philadelphia Museum of Art", description: "Rocky Steps and world-class art", mapsUrl: "https://www.google.com/maps/search/philadelphia+museum+art" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Philadelphia Stadium",
      regularStadiumName: "Lincoln Financial Field",
      adaGates: [
        { name: "Gate A", description: "Main ADA entrance - West side", mapsUrl: "https://www.google.com/maps/search/Lincoln+Financial+Field+Gate+A+Philadelphia" },
        { name: "Gate C", description: "North ADA entrance", mapsUrl: "https://www.google.com/maps/search/Lincoln+Financial+Field+Gate+C+Philadelphia" },
        { name: "Gate F", description: "East ADA entrance near SEPTA", mapsUrl: "https://www.google.com/maps/search/Lincoln+Financial+Field+Gate+F+Philadelphia" }
      ],
      rideshareZones: [
        { name: "Lot K", type: "both", description: "Primary Uber/Lyft zone", mapsUrl: "https://www.google.com/maps/search/Lincoln+Financial+Field+Lot+K+Philadelphia" },
        { name: "Xfinity Live!", type: "dropoff", description: "Drop-off near entertainment complex", mapsUrl: "https://www.google.com/maps/search/Xfinity+Live+Philadelphia" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "seattle",
    motto: "Emerald City - Rain or Shine, We Play",
    welcomeMessage: "Welcome to Seattle! Don't worry about the rain - Lumen Field is designed for it, and locals love playing in any weather. Light rail takes you right to the stadium. I've noted the best coffee spots near your hotel - this is the birthplace of Starbucks, after all. Would you like Pike Place Market recommendations?",
    logistics: {
      trap: "Seattle traffic can be unpredictable. Parking near Lumen Field is limited and expensive.",
      solution: "Take Link Light Rail to Stadium Station - direct access. Embrace the Seattle walking culture.",
      localTransit: [
        "Link Light Rail to Stadium Station",
        "Seattle Streetcar through downtown",
        "Washington State Ferries for scenic arrival from Bainbridge"
      ],
      departmentOfTransportation: [
        { name: "Washington State Department of Transportation", abbreviation: "WSDOT", website: "https://wsdot.wa.gov", phone: "360-705-7000", state: "Washington" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "UW Medical Center",
        specialty: "International Patient Services at University of Washington",
        mapsUrl: "https://www.google.com/maps/search/uw+medical+center+seattle"
      },
      emergencyHub: {
        name: "Harborview Medical Center",
        description: "Pacific Northwest's only Level I trauma center",
        mapsUrl: "https://www.google.com/maps/search/harborview+medical+center+seattle"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "St. James Cathedral", type: "catholic", description: "Historic cathedral on First Hill", mapsUrl: "https://www.google.com/maps/search/st+james+cathedral+seattle" },
      { name: "Idris Mosque", type: "islamic", description: "Welcoming mosque in North Seattle", mapsUrl: "https://www.google.com/maps/search/idris+mosque+seattle" },
      { name: "Temple De Hirsch Sinai", type: "jewish", description: "Reform synagogue in Capitol Hill", mapsUrl: "https://www.google.com/maps/search/temple+de+hirsch+sinai+seattle" },
      { name: "Plymouth Congregational Church", type: "protestant", description: "Historic church downtown", mapsUrl: "https://www.google.com/maps/search/plymouth+congregational+church+seattle" }
    ],
    watchParties: [
      { name: "Seattle Center", type: "vibe", description: "Official FIFA Fan Festival at Space Needle plaza", capacity: "25,000+", mapsUrl: "https://www.google.com/maps/search/seattle+center" },
      { name: "Pioneer Square", type: "energy", description: "Historic district with bars and nightlife", capacity: "8,000", mapsUrl: "https://www.google.com/maps/search/pioneer+square+seattle" },
      { name: "George & Dragon Pub", type: "local", description: "British pub in Fremont, soccer haven", capacity: "200", mapsUrl: "https://www.google.com/maps/search/george+dragon+pub+seattle" }
    ],
    comfort: [
      {
        category: "Pacific Northwest Cuisine",
        recommendations: [
          { name: "Pike Place Market", description: "Iconic market with fresh seafood", mapsUrl: "https://www.google.com/maps/search/pike+place+market+seattle" },
          { name: "The Walrus and the Carpenter", description: "Famous oyster bar in Ballard", mapsUrl: "https://www.google.com/maps/search/walrus+carpenter+seattle" },
          { name: "Din Tai Fung", description: "World-famous dumplings", mapsUrl: "https://www.google.com/maps/search/din+tai+fung+seattle" }
        ]
      },
      {
        category: "Coffee & Culture",
        recommendations: [
          { name: "Original Starbucks", description: "The first store at Pike Place", mapsUrl: "https://www.google.com/maps/search/original+starbucks+pike+place" },
          { name: "Chihuly Garden and Glass", description: "Stunning glass art at Seattle Center", mapsUrl: "https://www.google.com/maps/search/chihuly+garden+glass+seattle" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Seattle Stadium FIFA",
      regularStadiumName: "Lumen Field",
      adaGates: [
        { name: "Gate A", description: "Main ADA entrance - North end", mapsUrl: "https://www.google.com/maps/search/Lumen+Field+Gate+A+Seattle" },
        { name: "Gate C", description: "West ADA entrance near Light Rail", mapsUrl: "https://www.google.com/maps/search/Lumen+Field+Gate+C+Seattle" },
        { name: "Gate E", description: "South ADA entrance", mapsUrl: "https://www.google.com/maps/search/Lumen+Field+Gate+E+Seattle" }
      ],
      rideshareZones: [
        { name: "Occidental Park", type: "both", description: "Primary Uber/Lyft zone in Pioneer Square", mapsUrl: "https://www.google.com/maps/search/Occidental+Park+Seattle" },
        { name: "S King Street", type: "dropoff", description: "Drop-off near Light Rail station", mapsUrl: "https://www.google.com/maps/search/Stadium+Station+Seattle" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "boston",
    motto: "America's Walking City - Historic Charm, Modern Game",
    welcomeMessage: "Welcome to Boston! Gillette Stadium is in Foxborough, about 30 miles south of the city. I've mapped the commuter rail route - it's the best option to avoid I-95 traffic. The Freedom Trail is a perfect pre-match walk. Would you like a walking tour mapped from your hotel?",
    logistics: {
      trap: "Gillette Stadium is in Foxborough, not Boston proper. Traffic on Route 1 can be brutal.",
      solution: "Take MBTA Commuter Rail (Franklin Line or Providence Line to special stadium stops on match days).",
      localTransit: [
        "MBTA Commuter Rail - Special Foxborough service on match days",
        "MBTA Red Line + bus connections",
        "Official park-and-ride from Patriot Place"
      ],
      departmentOfTransportation: [
        { name: "Massachusetts Department of Transportation", abbreviation: "MassDOT", website: "https://www.mass.gov/orgs/massachusetts-department-of-transportation", phone: "857-368-4636", state: "Massachusetts" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Massachusetts General Hospital",
        specialty: "International Patient Center with 150+ language support",
        mapsUrl: "https://www.google.com/maps/search/mass+general+hospital+boston"
      },
      emergencyHub: {
        name: "Brigham and Women's Hospital",
        description: "Major Level I trauma center",
        mapsUrl: "https://www.google.com/maps/search/brigham+womens+hospital+boston"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Cathedral of the Holy Cross", type: "catholic", description: "Largest church in New England", mapsUrl: "https://www.google.com/maps/search/cathedral+holy+cross+boston" },
      { name: "Islamic Society of Boston", type: "islamic", description: "Major mosque in Roxbury", mapsUrl: "https://www.google.com/maps/search/islamic+society+boston" },
      { name: "Temple Israel of Boston", type: "jewish", description: "Reform synagogue in Longwood", mapsUrl: "https://www.google.com/maps/search/temple+israel+boston" },
      { name: "Old South Church", type: "protestant", description: "Historic UCC church in Back Bay", mapsUrl: "https://www.google.com/maps/search/old+south+church+boston" }
    ],
    watchParties: [
      { name: "Boston Common", type: "vibe", description: "Official FIFA Fan Festival in America's oldest park", capacity: "25,000+", mapsUrl: "https://www.google.com/maps/search/boston+common" },
      { name: "Faneuil Hall Marketplace", type: "energy", description: "Historic marketplace with outdoor screens", capacity: "10,000", mapsUrl: "https://www.google.com/maps/search/faneuil+hall+boston" },
      { name: "The Banshee", type: "local", description: "Irish pub in Dorchester, soccer central", capacity: "250", mapsUrl: "https://www.google.com/maps/search/the+banshee+boston" }
    ],
    comfort: [
      {
        category: "Boston Classics",
        recommendations: [
          { name: "Union Oyster House", description: "America's oldest restaurant", mapsUrl: "https://www.google.com/maps/search/union+oyster+house+boston" },
          { name: "Mike's Pastry", description: "Famous cannoli in North End", mapsUrl: "https://www.google.com/maps/search/mikes+pastry+boston" },
          { name: "Quincy Market", description: "Food hall at Faneuil Hall", mapsUrl: "https://www.google.com/maps/search/quincy+market+boston" }
        ]
      },
      {
        category: "History & Sports",
        recommendations: [
          { name: "Freedom Trail", description: "Walk through American Revolution history", mapsUrl: "https://www.google.com/maps/search/freedom+trail+boston" },
          { name: "Fenway Park", description: "America's oldest ballpark", mapsUrl: "https://www.google.com/maps/search/fenway+park+boston" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Boston Stadium FIFA",
      regularStadiumName: "Gillette Stadium",
      adaGates: [
        { name: "Gate A", description: "Main ADA entrance - East side", mapsUrl: "https://www.google.com/maps/search/Gillette+Stadium+Gate+A+Foxborough" },
        { name: "Gate C", description: "North ADA entrance", mapsUrl: "https://www.google.com/maps/search/Gillette+Stadium+Gate+C+Foxborough" },
        { name: "Gate D", description: "West ADA entrance near Patriot Place", mapsUrl: "https://www.google.com/maps/search/Gillette+Stadium+Gate+D+Foxborough" }
      ],
      rideshareZones: [
        { name: "Patriot Place", type: "both", description: "Primary Uber/Lyft zone at retail complex", mapsUrl: "https://www.google.com/maps/search/Patriot+Place+Foxborough" },
        { name: "Lot 15", type: "dropoff", description: "Overflow drop-off area", mapsUrl: "https://www.google.com/maps/search/Gillette+Stadium+Lot+15+Foxborough" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "sanFrancisco",
    motto: "The Golden Gate to World Football",
    welcomeMessage: "Welcome to the Bay Area! Levi's Stadium is in Santa Clara, about 40 miles south. Caltrain is your best bet - I've mapped the route. Dress in layers; Bay Area weather can shift quickly. Would you like recommendations in Fisherman's Wharf before you head to the stadium?",
    logistics: {
      trap: "Levi's Stadium is in Santa Clara, not San Francisco. The drive can take 90+ minutes in traffic.",
      solution: "Take Caltrain to Santa Clara station, then VTA Light Rail or shuttle to stadium.",
      localTransit: [
        "Caltrain to Santa Clara + VTA Light Rail",
        "BART to Milpitas + VTA connection",
        "Official shuttle from downtown SF (match days)"
      ],
      departmentOfTransportation: [
        { name: "California Department of Transportation", abbreviation: "Caltrans", website: "https://dot.ca.gov", phone: "916-322-1297", state: "California" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "UCSF Medical Center",
        specialty: "International Patient Services with multilingual staff",
        mapsUrl: "https://www.google.com/maps/search/ucsf+medical+center"
      },
      emergencyHub: {
        name: "Stanford Health Care",
        description: "Major trauma center closer to Levi's Stadium",
        mapsUrl: "https://www.google.com/maps/search/stanford+health+care"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Cathedral of Saint Mary", type: "catholic", description: "Modern cathedral in Western Addition", mapsUrl: "https://www.google.com/maps/search/st+mary+cathedral+san+francisco" },
      { name: "Islamic Center of San Francisco", type: "islamic", description: "Welcoming mosque in the Outer Mission", mapsUrl: "https://www.google.com/maps/search/islamic+center+san+francisco" },
      { name: "Congregation Emanu-El", type: "jewish", description: "Historic Reform synagogue", mapsUrl: "https://www.google.com/maps/search/congregation+emanu+el+san+francisco" },
      { name: "Glide Memorial Church", type: "protestant", description: "Progressive church in the Tenderloin", mapsUrl: "https://www.google.com/maps/search/glide+memorial+church+san+francisco" }
    ],
    watchParties: [
      { name: "Civic Center Plaza", type: "vibe", description: "Official FIFA Fan Festival near City Hall", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/civic+center+plaza+san+francisco" },
      { name: "Oracle Park Plaza", type: "energy", description: "Waterfront viewing near Giants stadium", capacity: "10,000", mapsUrl: "https://www.google.com/maps/search/oracle+park+san+francisco" },
      { name: "Danny Coyle's", type: "local", description: "Irish pub in the Haight, soccer haven", capacity: "150", mapsUrl: "https://www.google.com/maps/search/danny+coyles+san+francisco" }
    ],
    comfort: [
      {
        category: "SF Food Scene",
        recommendations: [
          { name: "Ferry Building Marketplace", description: "Gourmet food hall on the Embarcadero", mapsUrl: "https://www.google.com/maps/search/ferry+building+san+francisco" },
          { name: "Chinatown", description: "Oldest Chinatown in North America", mapsUrl: "https://www.google.com/maps/search/chinatown+san+francisco" },
          { name: "Mission District", description: "Best burritos and vibrant murals", mapsUrl: "https://www.google.com/maps/search/mission+district+san+francisco" }
        ]
      },
      {
        category: "Iconic SF",
        recommendations: [
          { name: "Golden Gate Bridge", description: "Walk or bike the iconic span", mapsUrl: "https://www.google.com/maps/search/golden+gate+bridge" },
          { name: "Fisherman's Wharf", description: "Seafood and sea lions", mapsUrl: "https://www.google.com/maps/search/fishermans+wharf+san+francisco" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "San Francisco Bay Area Stadium",
      regularStadiumName: "Levi's Stadium",
      adaGates: [
        { name: "Gate A", description: "Main ADA entrance - North side", mapsUrl: "https://www.google.com/maps/search/Levis+Stadium+Gate+A+Santa+Clara" },
        { name: "Gate C", description: "East ADA entrance near VTA", mapsUrl: "https://www.google.com/maps/search/Levis+Stadium+Gate+C+Santa+Clara" },
        { name: "Gate F", description: "South ADA entrance", mapsUrl: "https://www.google.com/maps/search/Levis+Stadium+Gate+F+Santa+Clara" }
      ],
      rideshareZones: [
        { name: "Tasman Lot", type: "both", description: "Primary Uber/Lyft zone", mapsUrl: "https://www.google.com/maps/search/Levis+Stadium+Tasman+Lot+Santa+Clara" },
        { name: "Great America", type: "dropoff", description: "Overflow rideshare area", mapsUrl: "https://www.google.com/maps/search/Great+America+Santa+Clara" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "toronto",
    motto: "The Six - Canada's Global Gateway",
    welcomeMessage: "Welcome to Toronto! The PATH underground walkway system connects 30km of downtown - perfect for any weather. BMO Field is downtown and easily reached by TTC. I've mapped Tim Hortons and poutine spots near your hotel. Would you like the route to the CN Tower for pre-match photos?",
    logistics: {
      trap: "Toronto traffic is heavy, especially on the Gardiner Expressway. Parking at BMO Field is limited.",
      solution: "Take TTC (Line 1 to Exhibition Station or Line 2 to Dufferin + bus). The PATH underground keeps you dry.",
      localTransit: [
        "TTC Subway Line 1 to Exhibition GO Station",
        "GO Transit from suburbs",
        "PATH underground walkway system (30km of connected buildings)"
      ],
      departmentOfTransportation: [
        { name: "Ontario Ministry of Transportation", abbreviation: "MTO", website: "https://www.ontario.ca/page/ministry-transportation", phone: "1-800-268-4686", state: "Ontario" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Toronto General Hospital",
        specialty: "International Patient Services at University Health Network",
        mapsUrl: "https://www.google.com/maps/search/toronto+general+hospital"
      },
      emergencyHub: {
        name: "St. Michael's Hospital",
        description: "Level I trauma center downtown",
        mapsUrl: "https://www.google.com/maps/search/st+michaels+hospital+toronto"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "St. Michael's Cathedral Basilica", type: "catholic", description: "Historic cathedral downtown", mapsUrl: "https://www.google.com/maps/search/st+michaels+cathedral+toronto" },
      { name: "Toronto and Region Islamic Congregation", type: "islamic", description: "Major mosque in Scarborough", mapsUrl: "https://www.google.com/maps/search/taric+mosque+toronto" },
      { name: "Holy Blossom Temple", type: "jewish", description: "Reform synagogue in Midtown", mapsUrl: "https://www.google.com/maps/search/holy+blossom+temple+toronto" },
      { name: "Metropolitan United Church", type: "protestant", description: "Historic church near Eaton Centre", mapsUrl: "https://www.google.com/maps/search/metropolitan+united+church+toronto" }
    ],
    watchParties: [
      { name: "Nathan Phillips Square", type: "vibe", description: "Official FIFA Fan Festival at City Hall", capacity: "40,000+", mapsUrl: "https://www.google.com/maps/search/nathan+phillips+square+toronto" },
      { name: "Maple Leaf Square", type: "energy", description: "Major viewing area near Scotiabank Arena", capacity: "10,000", mapsUrl: "https://www.google.com/maps/search/maple+leaf+square+toronto" },
      { name: "The Football Factory", type: "local", description: "Soccer-dedicated pub on King West", capacity: "300", mapsUrl: "https://www.google.com/maps/search/football+factory+toronto" }
    ],
    comfort: [
      {
        category: "Canadian Classics",
        recommendations: [
          { name: "St. Lawrence Market", description: "Historic market with peameal bacon sandwiches", mapsUrl: "https://www.google.com/maps/search/st+lawrence+market+toronto" },
          { name: "Smoke's Poutinerie", description: "Canada's iconic dish perfected", mapsUrl: "https://www.google.com/maps/search/smokes+poutinerie+toronto" },
          { name: "Kensington Market", description: "Diverse food and vintage shops", mapsUrl: "https://www.google.com/maps/search/kensington+market+toronto" }
        ]
      },
      {
        category: "Toronto Icons",
        recommendations: [
          { name: "CN Tower", description: "Iconic skyline views", mapsUrl: "https://www.google.com/maps/search/cn+tower+toronto" },
          { name: "Distillery District", description: "Victorian industrial charm", mapsUrl: "https://www.google.com/maps/search/distillery+district+toronto" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Toronto Stadium",
      regularStadiumName: "BMO Field",
      adaGates: [
        { name: "Gate 1", description: "Main ADA entrance - East side", mapsUrl: "https://www.google.com/maps/search/BMO+Field+Gate+1+Toronto" },
        { name: "Gate 3", description: "North ADA entrance", mapsUrl: "https://www.google.com/maps/search/BMO+Field+Gate+3+Toronto" },
        { name: "Gate 5", description: "West ADA entrance near GO station", mapsUrl: "https://www.google.com/maps/search/BMO+Field+Gate+5+Toronto" }
      ],
      rideshareZones: [
        { name: "Exhibition GO", type: "both", description: "Primary Uber/Lyft zone near transit", mapsUrl: "https://www.google.com/maps/search/Exhibition+GO+Station+Toronto" },
        { name: "Liberty Village", type: "dropoff", description: "Nearby neighborhood drop-off", mapsUrl: "https://www.google.com/maps/search/Liberty+Village+Toronto" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "vancouver",
    motto: "Pacific Paradise - Where Mountains Meet the Match",
    welcomeMessage: "Welcome to Vancouver! BC Place is right downtown with the SkyTrain at your doorstep. The city is one of the most walkable in North America. I've noted it stays light until 10pm in summer - perfect for post-match strolls. Would you like Stanley Park or Granville Island recommendations?",
    logistics: {
      trap: "Vancouver traffic over bridges can be unpredictable. Parking downtown is expensive.",
      solution: "Take SkyTrain to Stadium-Chinatown Station - direct access to BC Place. Vancouver is extremely walkable.",
      localTransit: [
        "SkyTrain Expo Line to Stadium-Chinatown",
        "SeaBus from North Vancouver for scenic arrival",
        "West Coast Express from suburbs"
      ],
      departmentOfTransportation: [
        { name: "BC Ministry of Transportation and Transit", abbreviation: "MoTI", website: "https://www2.gov.bc.ca/gov/content/governments/organizational-structure/ministries-organizations/ministries/transportation", phone: "250-565-6185", state: "British Columbia" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Vancouver General Hospital",
        specialty: "Provincial trauma center with multilingual services",
        mapsUrl: "https://www.google.com/maps/search/vancouver+general+hospital"
      },
      emergencyHub: {
        name: "St. Paul's Hospital",
        description: "Downtown emergency center",
        mapsUrl: "https://www.google.com/maps/search/st+pauls+hospital+vancouver"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Holy Rosary Cathedral", type: "catholic", description: "Historic cathedral downtown", mapsUrl: "https://www.google.com/maps/search/holy+rosary+cathedral+vancouver" },
      { name: "BC Muslim Association", type: "islamic", description: "Major mosque in Richmond", mapsUrl: "https://www.google.com/maps/search/bc+muslim+association+richmond" },
      { name: "Beth Israel Synagogue", type: "jewish", description: "Orthodox synagogue in Oak Street", mapsUrl: "https://www.google.com/maps/search/beth+israel+synagogue+vancouver" },
      { name: "Christ Church Cathedral", type: "protestant", description: "Anglican cathedral downtown", mapsUrl: "https://www.google.com/maps/search/christ+church+cathedral+vancouver" }
    ],
    watchParties: [
      { name: "Jack Poole Plaza", type: "vibe", description: "Official FIFA Fan Festival at Olympic Cauldron", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/jack+poole+plaza+vancouver" },
      { name: "Yaletown", type: "energy", description: "Trendy neighborhood with patios and screens", capacity: "8,000", mapsUrl: "https://www.google.com/maps/search/yaletown+vancouver" },
      { name: "The Three Lions", type: "local", description: "British pub on Main Street, soccer dedicated", capacity: "200", mapsUrl: "https://www.google.com/maps/search/three+lions+vancouver" }
    ],
    comfort: [
      {
        category: "Vancouver Cuisine",
        recommendations: [
          { name: "Granville Island Public Market", description: "Fresh seafood and local produce", mapsUrl: "https://www.google.com/maps/search/granville+island+market+vancouver" },
          { name: "Richmond Night Market", description: "Asian street food paradise", mapsUrl: "https://www.google.com/maps/search/richmond+night+market" },
          { name: "Gastown", description: "Historic district with restaurants and bars", mapsUrl: "https://www.google.com/maps/search/gastown+vancouver" }
        ]
      },
      {
        category: "Nature & Views",
        recommendations: [
          { name: "Stanley Park", description: "1,000 acres of urban wilderness", mapsUrl: "https://www.google.com/maps/search/stanley+park+vancouver" },
          { name: "Grouse Mountain", description: "Skyride with city views", mapsUrl: "https://www.google.com/maps/search/grouse+mountain+vancouver" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Vancouver Stadium",
      regularStadiumName: "BC Place",
      adaGates: [
        { name: "Gate A", description: "Main ADA entrance - North side", mapsUrl: "https://www.google.com/maps/search/BC+Place+Gate+A+Vancouver" },
        { name: "Gate C", description: "East ADA entrance near SkyTrain", mapsUrl: "https://www.google.com/maps/search/BC+Place+Gate+C+Vancouver" },
        { name: "Gate E", description: "South ADA entrance", mapsUrl: "https://www.google.com/maps/search/BC+Place+Gate+E+Vancouver" }
      ],
      rideshareZones: [
        { name: "Rogers Arena", type: "both", description: "Primary Uber/Lyft zone nearby", mapsUrl: "https://www.google.com/maps/search/Rogers+Arena+Vancouver" },
        { name: "Stadium-Chinatown Station", type: "dropoff", description: "Drop-off near SkyTrain", mapsUrl: "https://www.google.com/maps/search/Stadium+Chinatown+Station+Vancouver" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "mexicoCity",
    motto: "Corazón de México - Where Football Is Religion",
    welcomeMessage: "¡Bienvenido a la Ciudad de México! Important: The altitude is 7,350 feet - take it easy the first day to acclimatize. I've mapped pharmacies with altitude sickness remedies near your hotel. Estadio Azteca is legendary - would you like the Metro route mapped and recommendations for tacos al pastor nearby?",
    logistics: {
      trap: "Mexico City altitude (2,240m/7,350ft) can cause altitude sickness. Traffic is legendary - avoid rush hour at all costs.",
      solution: "Take Metro Line 2 to Tasqueña, then Tren Ligero to Estadio Azteca. Arrive early and stay hydrated.",
      localTransit: [
        "Metro + Tren Ligero to Estadio Azteca",
        "Metrobús rapid transit",
        "Ecobici bike share for short trips"
      ],
      departmentOfTransportation: [
        { name: "Secretaría de Movilidad de la Ciudad de México", abbreviation: "SEMOVI", website: "https://www.semovi.cdmx.gob.mx", phone: "55-5209-9913", state: "Ciudad de México" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Hospital ABC (American British Cowdray)",
        specialty: "English-speaking staff, international standards",
        mapsUrl: "https://www.google.com/maps/search/hospital+abc+mexico+city"
      },
      emergencyHub: {
        name: "Hospital Ángeles",
        description: "Major private hospital network with emergency services",
        mapsUrl: "https://www.google.com/maps/search/hospital+angeles+mexico+city"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Basilica of Our Lady of Guadalupe", type: "catholic", description: "Most visited Catholic pilgrimage site in the world", mapsUrl: "https://www.google.com/maps/search/basilica+guadalupe+mexico+city" },
      { name: "Centro Cultural Islámico de México", type: "islamic", description: "Mosque with Arabic and Spanish services", mapsUrl: "https://www.google.com/maps/search/centro+islamico+mexico+city" },
      { name: "Comunidad Bet El", type: "jewish", description: "Conservative synagogue in Polanco", mapsUrl: "https://www.google.com/maps/search/bet+el+synagogue+mexico+city" },
      { name: "Union Church", type: "protestant", description: "English-speaking interdenominational church", mapsUrl: "https://www.google.com/maps/search/union+church+mexico+city" }
    ],
    watchParties: [
      { name: "Zócalo", type: "vibe", description: "Official FIFA Fan Festival in the historic main square", capacity: "60,000+", mapsUrl: "https://www.google.com/maps/search/zocalo+mexico+city" },
      { name: "Paseo de la Reforma", type: "energy", description: "Iconic boulevard with outdoor screens and bars", capacity: "20,000", mapsUrl: "https://www.google.com/maps/search/paseo+reforma+mexico+city" },
      { name: "La Condesa", type: "local", description: "Trendy neighborhood with cafes and bars", capacity: "5,000", mapsUrl: "https://www.google.com/maps/search/la+condesa+mexico+city" }
    ],
    comfort: [
      {
        category: "Mexican Cuisine",
        recommendations: [
          { name: "Tacos El Califa de León", description: "Legendary tacos al pastor", mapsUrl: "https://www.google.com/maps/search/tacos+el+califa+leon+mexico+city" },
          { name: "Pujol", description: "World's best Mexican fine dining", mapsUrl: "https://www.google.com/maps/search/pujol+mexico+city" },
          { name: "Mercado de San Juan", description: "Gourmet food market", mapsUrl: "https://www.google.com/maps/search/mercado+san+juan+mexico+city" }
        ]
      },
      {
        category: "Culture & History",
        recommendations: [
          { name: "Museo Nacional de Antropología", description: "World's greatest anthropology museum", mapsUrl: "https://www.google.com/maps/search/museo+antropologia+mexico+city" },
          { name: "Frida Kahlo Museum", description: "Casa Azul in Coyoacán", mapsUrl: "https://www.google.com/maps/search/frida+kahlo+museum+mexico+city" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Estadio Ciudad de México",
      regularStadiumName: "Estadio Azteca",
      adaGates: [
        { name: "Puerta 1", description: "Entrada principal ADA - Norte", mapsUrl: "https://www.google.com/maps/search/Estadio+Azteca+Puerta+1+Mexico+City" },
        { name: "Puerta 7", description: "Entrada ADA - Este", mapsUrl: "https://www.google.com/maps/search/Estadio+Azteca+Puerta+7+Mexico+City" },
        { name: "Puerta 15", description: "Entrada ADA - Oeste", mapsUrl: "https://www.google.com/maps/search/Estadio+Azteca+Puerta+15+Mexico+City" }
      ],
      rideshareZones: [
        { name: "Estacionamiento Norte", type: "both", description: "Zona principal Uber/DiDi", mapsUrl: "https://www.google.com/maps/search/Estadio+Azteca+Estacionamiento+Norte" },
        { name: "Tren Ligero Station", type: "dropoff", description: "Bajada cerca del tren ligero", mapsUrl: "https://www.google.com/maps/search/Estadio+Azteca+Tren+Ligero" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "guadalajara",
    motto: "La Perla del Occidente - Where Tequila Meets the Beautiful Game",
    welcomeMessage: "¡Bienvenido a Guadalajara! The birthplace of mariachi and tequila. Estadio Akron is modern and accessible via Macrobús. I've mapped tequila tastings and mariachi plazas in Tlaquepaque. Would you like recommendations for birria tacos before your match?",
    logistics: {
      trap: "Guadalajara heat can be intense. Stadium is 12km from centro histórico.",
      solution: "Take Macrobús Line 1 or Line 3 of the Mi Macro system. Uber is reliable and affordable.",
      localTransit: [
        "Macrobús Line 1 to stadium area",
        "Mi Macro Periférico light rail",
        "Uber/DiDi reliable throughout city"
      ],
      departmentOfTransportation: [
        { name: "Secretaría de Transporte de Jalisco", abbreviation: "SETRAN", website: "https://setran.jalisco.gob.mx", phone: "33-3819-2400", state: "Jalisco" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Hospital Country 2000",
        specialty: "English-speaking doctors, international patient services",
        mapsUrl: "https://www.google.com/maps/search/hospital+country+2000+guadalajara"
      },
      emergencyHub: {
        name: "Hospital Civil de Guadalajara",
        description: "Major public hospital with trauma services",
        mapsUrl: "https://www.google.com/maps/search/hospital+civil+guadalajara"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Guadalajara Cathedral", type: "catholic", description: "Iconic twin-spired cathedral downtown", mapsUrl: "https://www.google.com/maps/search/guadalajara+cathedral" },
      { name: "Centro Islámico de Guadalajara", type: "islamic", description: "Mosque serving the Muslim community", mapsUrl: "https://www.google.com/maps/search/centro+islamico+guadalajara" },
      { name: "Comunidad Judía de Guadalajara", type: "jewish", description: "Synagogue in Providencia", mapsUrl: "https://www.google.com/maps/search/comunidad+judia+guadalajara" },
      { name: "First Baptist Church Guadalajara", type: "protestant", description: "English-friendly services", mapsUrl: "https://www.google.com/maps/search/first+baptist+guadalajara" }
    ],
    watchParties: [
      { name: "Plaza de la Liberación", type: "vibe", description: "Official FIFA Fan Festival behind the cathedral", capacity: "35,000+", mapsUrl: "https://www.google.com/maps/search/plaza+liberacion+guadalajara" },
      { name: "Chapultepec Avenue", type: "energy", description: "Bar and restaurant strip with big screens", capacity: "10,000", mapsUrl: "https://www.google.com/maps/search/chapultepec+avenue+guadalajara" },
      { name: "Tlaquepaque", type: "local", description: "Artisan village with authentic atmosphere", capacity: "3,000", mapsUrl: "https://www.google.com/maps/search/tlaquepaque+guadalajara" }
    ],
    comfort: [
      {
        category: "Jalisco Specialties",
        recommendations: [
          { name: "Birriería Las 9 Esquinas", description: "Legendary birria tacos", mapsUrl: "https://www.google.com/maps/search/birrieria+9+esquinas+guadalajara" },
          { name: "Tortas Ahogadas", description: "Iconic Guadalajara street food", mapsUrl: "https://www.google.com/maps/search/tortas+ahogadas+guadalajara" },
          { name: "Casa Herradura", description: "Tequila distillery tours", mapsUrl: "https://www.google.com/maps/search/casa+herradura+tequila" }
        ]
      },
      {
        category: "Culture",
        recommendations: [
          { name: "Plaza de los Mariachis", description: "Live mariachi performances", mapsUrl: "https://www.google.com/maps/search/plaza+mariachis+guadalajara" },
          { name: "Instituto Cultural Cabañas", description: "UNESCO World Heritage murals", mapsUrl: "https://www.google.com/maps/search/instituto+cabanas+guadalajara" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Guadalajara Stadium",
      regularStadiumName: "Estadio Akron",
      adaGates: [
        { name: "Puerta Principal", description: "Entrada principal ADA - Norte", mapsUrl: "https://www.google.com/maps/search/Estadio+Akron+Puerta+Principal+Guadalajara" },
        { name: "Puerta Sur", description: "Entrada ADA - Sur", mapsUrl: "https://www.google.com/maps/search/Estadio+Akron+Puerta+Sur+Guadalajara" },
        { name: "Puerta Este", description: "Entrada ADA - Este", mapsUrl: "https://www.google.com/maps/search/Estadio+Akron+Puerta+Este+Guadalajara" }
      ],
      rideshareZones: [
        { name: "Estacionamiento Principal", type: "both", description: "Zona principal Uber/DiDi", mapsUrl: "https://www.google.com/maps/search/Estadio+Akron+Estacionamiento+Guadalajara" },
        { name: "Centro Comercial Andares", type: "dropoff", description: "Zona alternativa cerca del estadio", mapsUrl: "https://www.google.com/maps/search/Centro+Comercial+Andares+Guadalajara" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  },
  {
    cityKey: "monterrey",
    motto: "La Sultana del Norte - Industrial Power, Football Passion",
    welcomeMessage: "¡Bienvenido a Monterrey! This is Mexico's industrial capital with passionate football culture. Heat can be extreme - I've mapped all air-conditioned refuges near your hotel. Estadio BBVA is one of the most modern in the Americas. Would you like carne asada recommendations?",
    logistics: {
      trap: "Monterrey summer heat can exceed 40°C/104°F. Stadium traffic is heavy on match days.",
      solution: "Take Metrorrey Line 2 to General Anaya, then shuttle to Estadio BBVA. Stay hydrated constantly.",
      localTransit: [
        "Metrorrey Line 2 + stadium shuttle",
        "Ecovía bus rapid transit",
        "Uber/DiDi widely available"
      ],
      departmentOfTransportation: [
        { name: "Secretaría de Movilidad y Planeación Urbana de Nuevo León", abbreviation: "SMPU", website: "https://www.nl.gob.mx/es/movilidad", phone: "812-020-6730", state: "Nuevo León" }
      ]
    },
    safety: {
      internationalHospital: {
        name: "Hospital San José TecSalud",
        specialty: "Private hospital affiliated with Tec de Monterrey, English-speaking staff",
        mapsUrl: "https://www.google.com/maps/search/hospital+san+jose+monterrey"
      },
      emergencyHub: {
        name: "Hospital Universitario",
        description: "Major trauma center with emergency services",
        mapsUrl: "https://www.google.com/maps/search/hospital+universitario+monterrey"
      },
      emergencyNumber: "911"
    },
    spiritual: [
      { name: "Monterrey Cathedral", type: "catholic", description: "Historic cathedral in Macroplaza", mapsUrl: "https://www.google.com/maps/search/catedral+monterrey" },
      { name: "Mezquita de Monterrey", type: "islamic", description: "Mosque serving the Muslim community", mapsUrl: "https://www.google.com/maps/search/mezquita+monterrey" },
      { name: "Comunidad Judía de Monterrey", type: "jewish", description: "Synagogue in San Pedro", mapsUrl: "https://www.google.com/maps/search/comunidad+judia+monterrey" },
      { name: "Iglesia Bautista Central", type: "protestant", description: "Baptist church downtown", mapsUrl: "https://www.google.com/maps/search/iglesia+bautista+monterrey" }
    ],
    watchParties: [
      { name: "Macroplaza", type: "vibe", description: "Official FIFA Fan Festival in one of the world's largest plazas", capacity: "30,000+", mapsUrl: "https://www.google.com/maps/search/macroplaza+monterrey" },
      { name: "Barrio Antiguo", type: "energy", description: "Historic nightlife district with bars", capacity: "8,000", mapsUrl: "https://www.google.com/maps/search/barrio+antiguo+monterrey" },
      { name: "Parque Fundidora", type: "local", description: "Converted steel mill now urban park", capacity: "15,000", mapsUrl: "https://www.google.com/maps/search/parque+fundidora+monterrey" }
    ],
    comfort: [
      {
        category: "Regio Cuisine",
        recommendations: [
          { name: "El Gran Pastor", description: "Famous carne asada and cabrito", mapsUrl: "https://www.google.com/maps/search/gran+pastor+monterrey" },
          { name: "Cabrito en su Sangre", description: "Traditional Monterrey specialty", mapsUrl: "https://www.google.com/maps/search/cabrito+monterrey" },
          { name: "Cervecería Cuauhtémoc", description: "Historic brewery tours", mapsUrl: "https://www.google.com/maps/search/cerveceria+cuauhtemoc+monterrey" }
        ]
      },
      {
        category: "Nature & Adventure",
        recommendations: [
          { name: "Cerro de la Silla", description: "Iconic mountain backdrop", mapsUrl: "https://www.google.com/maps/search/cerro+silla+monterrey" },
          { name: "Grutas de García", description: "Cave tours in the mountains", mapsUrl: "https://www.google.com/maps/search/grutas+garcia+monterrey" }
        ]
      }
    ],
    stadiumAccess: {
      fifaStadiumName: "Monterrey Stadium",
      regularStadiumName: "Estadio BBVA",
      adaGates: [
        { name: "Puerta 1", description: "Entrada principal ADA - Oeste", mapsUrl: "https://www.google.com/maps/search/Estadio+BBVA+Puerta+1+Monterrey" },
        { name: "Puerta 5", description: "Entrada ADA - Norte", mapsUrl: "https://www.google.com/maps/search/Estadio+BBVA+Puerta+5+Monterrey" },
        { name: "Puerta 9", description: "Entrada ADA - Este", mapsUrl: "https://www.google.com/maps/search/Estadio+BBVA+Puerta+9+Monterrey" }
      ],
      rideshareZones: [
        { name: "Estacionamiento VIP", type: "both", description: "Zona principal Uber/DiDi", mapsUrl: "https://www.google.com/maps/search/Estadio+BBVA+Estacionamiento+Monterrey" },
        { name: "Metrorrey General Anaya", type: "dropoff", description: "Bajada cerca del metro", mapsUrl: "https://www.google.com/maps/search/Metrorrey+General+Anaya+Monterrey" }
      ],
      gateAssignments: "Gate assignments will be published by FIFA 30 days before tournament"
    }
  }
];
