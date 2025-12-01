import { storage } from "./storage";

async function seedNewData() {
  console.log("Seeding players, tournament history, and stadium sections...");

  // Tournament History - All World Cups from 1930 to 2022
  const tournamentHistoryData = [
    { year: 1930, hostCountry: "Uruguay", winner: "Uruguay", runnerUp: "Argentina", thirdPlace: "USA", fourthPlace: "Yugoslavia", totalGoals: 70, totalMatches: 18, totalAttendance: 590549, goldenBoot: "Guillermo Stábile", goldenBootGoals: 8, goldenBall: null, bestGoalkeeper: null, finalScore: "4-2", teams: 13 },
    { year: 1934, hostCountry: "Italy", winner: "Italy", runnerUp: "Czechoslovakia", thirdPlace: "Germany", fourthPlace: "Austria", totalGoals: 70, totalMatches: 17, totalAttendance: 363000, goldenBoot: "Oldřich Nejedlý", goldenBootGoals: 5, goldenBall: null, bestGoalkeeper: null, finalScore: "2-1", teams: 16 },
    { year: 1938, hostCountry: "France", winner: "Italy", runnerUp: "Hungary", thirdPlace: "Brazil", fourthPlace: "Sweden", totalGoals: 84, totalMatches: 18, totalAttendance: 375700, goldenBoot: "Leônidas", goldenBootGoals: 7, goldenBall: null, bestGoalkeeper: null, finalScore: "4-2", teams: 15 },
    { year: 1950, hostCountry: "Brazil", winner: "Uruguay", runnerUp: "Brazil", thirdPlace: "Sweden", fourthPlace: "Spain", totalGoals: 88, totalMatches: 22, totalAttendance: 1045246, goldenBoot: "Ademir", goldenBootGoals: 9, goldenBall: null, bestGoalkeeper: null, finalScore: "2-1", teams: 13 },
    { year: 1954, hostCountry: "Switzerland", winner: "Germany", runnerUp: "Hungary", thirdPlace: "Austria", fourthPlace: "Uruguay", totalGoals: 140, totalMatches: 26, totalAttendance: 768607, goldenBoot: "Sándor Kocsis", goldenBootGoals: 11, goldenBall: null, bestGoalkeeper: null, finalScore: "3-2", teams: 16 },
    { year: 1958, hostCountry: "Sweden", winner: "Brazil", runnerUp: "Sweden", thirdPlace: "France", fourthPlace: "Germany", totalGoals: 126, totalMatches: 35, totalAttendance: 819810, goldenBoot: "Just Fontaine", goldenBootGoals: 13, goldenBall: null, bestGoalkeeper: null, finalScore: "5-2", teams: 16 },
    { year: 1962, hostCountry: "Chile", winner: "Brazil", runnerUp: "Czechoslovakia", thirdPlace: "Chile", fourthPlace: "Yugoslavia", totalGoals: 89, totalMatches: 32, totalAttendance: 893172, goldenBoot: "Multiple (6 players)", goldenBootGoals: 4, goldenBall: null, bestGoalkeeper: null, finalScore: "3-1", teams: 16 },
    { year: 1966, hostCountry: "England", winner: "England", runnerUp: "Germany", thirdPlace: "Portugal", fourthPlace: "USSR", totalGoals: 89, totalMatches: 32, totalAttendance: 1563135, goldenBoot: "Eusébio", goldenBootGoals: 9, goldenBall: null, bestGoalkeeper: null, finalScore: "4-2", teams: 16 },
    { year: 1970, hostCountry: "Mexico", winner: "Brazil", runnerUp: "Italy", thirdPlace: "Germany", fourthPlace: "Uruguay", totalGoals: 95, totalMatches: 32, totalAttendance: 1603975, goldenBoot: "Gerd Müller", goldenBootGoals: 10, goldenBall: null, bestGoalkeeper: null, finalScore: "4-1", teams: 16 },
    { year: 1974, hostCountry: "Germany", winner: "Germany", runnerUp: "Netherlands", thirdPlace: "Poland", fourthPlace: "Brazil", totalGoals: 97, totalMatches: 38, totalAttendance: 1865762, goldenBoot: "Grzegorz Lato", goldenBootGoals: 7, goldenBall: "Johan Cruyff", bestGoalkeeper: null, finalScore: "2-1", teams: 16 },
    { year: 1978, hostCountry: "Argentina", winner: "Argentina", runnerUp: "Netherlands", thirdPlace: "Brazil", fourthPlace: "Italy", totalGoals: 102, totalMatches: 38, totalAttendance: 1545791, goldenBoot: "Mario Kempes", goldenBootGoals: 6, goldenBall: "Mario Kempes", bestGoalkeeper: null, finalScore: "3-1", teams: 16 },
    { year: 1982, hostCountry: "Spain", winner: "Italy", runnerUp: "Germany", thirdPlace: "Poland", fourthPlace: "France", totalGoals: 146, totalMatches: 52, totalAttendance: 2109723, goldenBoot: "Paolo Rossi", goldenBootGoals: 6, goldenBall: "Paolo Rossi", bestGoalkeeper: null, finalScore: "3-1", teams: 24 },
    { year: 1986, hostCountry: "Mexico", winner: "Argentina", runnerUp: "Germany", thirdPlace: "France", fourthPlace: "Belgium", totalGoals: 132, totalMatches: 52, totalAttendance: 2394031, goldenBoot: "Gary Lineker", goldenBootGoals: 6, goldenBall: "Diego Maradona", bestGoalkeeper: null, finalScore: "3-2", teams: 24 },
    { year: 1990, hostCountry: "Italy", winner: "Germany", runnerUp: "Argentina", thirdPlace: "Italy", fourthPlace: "England", totalGoals: 115, totalMatches: 52, totalAttendance: 2516215, goldenBoot: "Salvatore Schillaci", goldenBootGoals: 6, goldenBall: "Salvatore Schillaci", bestGoalkeeper: null, finalScore: "1-0", teams: 24 },
    { year: 1994, hostCountry: "USA", winner: "Brazil", runnerUp: "Italy", thirdPlace: "Sweden", fourthPlace: "Bulgaria", totalGoals: 141, totalMatches: 52, totalAttendance: 3587538, goldenBoot: "Oleg Salenko / Hristo Stoichkov", goldenBootGoals: 6, goldenBall: "Romário", bestGoalkeeper: null, finalScore: "0-0 (3-2 pen)", teams: 24 },
    { year: 1998, hostCountry: "France", winner: "France", runnerUp: "Brazil", thirdPlace: "Croatia", fourthPlace: "Netherlands", totalGoals: 171, totalMatches: 64, totalAttendance: 2785100, goldenBoot: "Davor Šuker", goldenBootGoals: 6, goldenBall: "Ronaldo", bestGoalkeeper: "Fabien Barthez", finalScore: "3-0", teams: 32 },
    { year: 2002, hostCountry: "South Korea/Japan", winner: "Brazil", runnerUp: "Germany", thirdPlace: "Turkey", fourthPlace: "South Korea", totalGoals: 161, totalMatches: 64, totalAttendance: 2705197, goldenBoot: "Ronaldo", goldenBootGoals: 8, goldenBall: "Oliver Kahn", bestGoalkeeper: "Oliver Kahn", finalScore: "2-0", teams: 32 },
    { year: 2006, hostCountry: "Germany", winner: "Italy", runnerUp: "France", thirdPlace: "Germany", fourthPlace: "Portugal", totalGoals: 147, totalMatches: 64, totalAttendance: 3359439, goldenBoot: "Miroslav Klose", goldenBootGoals: 5, goldenBall: "Zinedine Zidane", bestGoalkeeper: "Gianluigi Buffon", finalScore: "1-1 (5-3 pen)", teams: 32 },
    { year: 2010, hostCountry: "South Africa", winner: "Spain", runnerUp: "Netherlands", thirdPlace: "Germany", fourthPlace: "Uruguay", totalGoals: 145, totalMatches: 64, totalAttendance: 3178856, goldenBoot: "Thomas Müller", goldenBootGoals: 5, goldenBall: "Diego Forlán", bestGoalkeeper: "Iker Casillas", finalScore: "1-0", teams: 32 },
    { year: 2014, hostCountry: "Brazil", winner: "Germany", runnerUp: "Argentina", thirdPlace: "Netherlands", fourthPlace: "Brazil", totalGoals: 171, totalMatches: 64, totalAttendance: 3429873, goldenBoot: "James Rodríguez", goldenBootGoals: 6, goldenBall: "Lionel Messi", bestGoalkeeper: "Manuel Neuer", finalScore: "1-0", teams: 32 },
    { year: 2018, hostCountry: "Russia", winner: "France", runnerUp: "Croatia", thirdPlace: "Belgium", fourthPlace: "England", totalGoals: 169, totalMatches: 64, totalAttendance: 3031768, goldenBoot: "Harry Kane", goldenBootGoals: 6, goldenBall: "Luka Modrić", bestGoalkeeper: "Thibaut Courtois", finalScore: "4-2", teams: 32 },
    { year: 2022, hostCountry: "Qatar", winner: "Argentina", runnerUp: "France", thirdPlace: "Croatia", fourthPlace: "Morocco", totalGoals: 172, totalMatches: 64, totalAttendance: 3404252, goldenBoot: "Kylian Mbappé", goldenBootGoals: 8, goldenBall: "Lionel Messi", bestGoalkeeper: "Emiliano Martínez", finalScore: "3-3 (4-2 pen)", teams: 32 },
  ];

  for (const tournament of tournamentHistoryData) {
    try {
      await storage.createTournamentHistory(tournament);
    } catch (e) {
      console.log(`Tournament ${tournament.year} may already exist`);
    }
  }
  console.log(`Seeded ${tournamentHistoryData.length} tournaments`);

  // Stadium Sections for all 16 host cities
  const stadiumSectionsData = [
    // MetLife Stadium - East Rutherford/New York
    { stadiumName: "MetLife Stadium", cityName: "New York/New Jersey", sectionName: "Field Level", sectionType: "premium", level: "Lower", basePriceUsd: 850, premiumPriceUsd: 1500, capacity: 8000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "Exclusive Food"] },
    { stadiumName: "MetLife Stadium", cityName: "New York/New Jersey", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 550, premiumPriceUsd: 950, capacity: 15000, viewQuality: "Great", amenities: ["Club Access", "Premium Concessions"] },
    { stadiumName: "MetLife Stadium", cityName: "New York/New Jersey", sectionName: "Mezzanine", sectionType: "standard", level: "Middle", basePriceUsd: 350, premiumPriceUsd: 550, capacity: 25000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "MetLife Stadium", cityName: "New York/New Jersey", sectionName: "Upper Deck", sectionType: "economy", level: "Upper", basePriceUsd: 175, premiumPriceUsd: 300, capacity: 32000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // SoFi Stadium - Los Angeles
    { stadiumName: "SoFi Stadium", cityName: "Los Angeles", sectionName: "Field Level", sectionType: "premium", level: "Lower", basePriceUsd: 900, premiumPriceUsd: 1600, capacity: 7500, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "All-Inclusive"] },
    { stadiumName: "SoFi Stadium", cityName: "Los Angeles", sectionName: "Terrace Level", sectionType: "club", level: "Middle", basePriceUsd: 500, premiumPriceUsd: 850, capacity: 20000, viewQuality: "Great", amenities: ["Club Access", "Enhanced Food"] },
    { stadiumName: "SoFi Stadium", cityName: "Los Angeles", sectionName: "Main Concourse", sectionType: "standard", level: "Middle", basePriceUsd: 320, premiumPriceUsd: 520, capacity: 30000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "SoFi Stadium", cityName: "Los Angeles", sectionName: "Upper Gallery", sectionType: "economy", level: "Upper", basePriceUsd: 160, premiumPriceUsd: 280, capacity: 15000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // AT&T Stadium - Dallas
    { stadiumName: "AT&T Stadium", cityName: "Dallas", sectionName: "Field Level", sectionType: "premium", level: "Lower", basePriceUsd: 800, premiumPriceUsd: 1400, capacity: 10000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "Video Board View"] },
    { stadiumName: "AT&T Stadium", cityName: "Dallas", sectionName: "Hall of Fame", sectionType: "club", level: "Middle", basePriceUsd: 480, premiumPriceUsd: 800, capacity: 18000, viewQuality: "Great", amenities: ["Club Access", "Air Conditioning"] },
    { stadiumName: "AT&T Stadium", cityName: "Dallas", sectionName: "Main Concourse", sectionType: "standard", level: "Middle", basePriceUsd: 280, premiumPriceUsd: 450, capacity: 35000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "AT&T Stadium", cityName: "Dallas", sectionName: "Upper Reserved", sectionType: "economy", level: "Upper", basePriceUsd: 140, premiumPriceUsd: 250, capacity: 20000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // Hard Rock Stadium - Miami
    { stadiumName: "Hard Rock Stadium", cityName: "Miami", sectionName: "Lower Bowl", sectionType: "premium", level: "Lower", basePriceUsd: 750, premiumPriceUsd: 1300, capacity: 12000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "Shade Coverage"] },
    { stadiumName: "Hard Rock Stadium", cityName: "Miami", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 450, premiumPriceUsd: 750, capacity: 15000, viewQuality: "Great", amenities: ["Club Access", "Air Conditioning"] },
    { stadiumName: "Hard Rock Stadium", cityName: "Miami", sectionName: "Upper Deck", sectionType: "standard", level: "Upper", basePriceUsd: 250, premiumPriceUsd: 400, capacity: 25000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "Hard Rock Stadium", cityName: "Miami", sectionName: "Corner Upper", sectionType: "economy", level: "Upper", basePriceUsd: 125, premiumPriceUsd: 220, capacity: 13000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // Levi's Stadium - San Francisco Bay Area
    { stadiumName: "Levi's Stadium", cityName: "San Francisco Bay Area", sectionName: "Field Level", sectionType: "premium", level: "Lower", basePriceUsd: 820, premiumPriceUsd: 1450, capacity: 9000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "Tech Hub"] },
    { stadiumName: "Levi's Stadium", cityName: "San Francisco Bay Area", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 520, premiumPriceUsd: 880, capacity: 14000, viewQuality: "Great", amenities: ["Club Access", "USB Charging"] },
    { stadiumName: "Levi's Stadium", cityName: "San Francisco Bay Area", sectionName: "Upper Sideline", sectionType: "standard", level: "Upper", basePriceUsd: 300, premiumPriceUsd: 480, capacity: 28000, viewQuality: "Good", amenities: ["Standard Concessions", "WiFi"] },
    { stadiumName: "Levi's Stadium", cityName: "San Francisco Bay Area", sectionName: "Upper Corner", sectionType: "economy", level: "Upper", basePriceUsd: 150, premiumPriceUsd: 260, capacity: 17000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // Mercedes-Benz Stadium - Atlanta
    { stadiumName: "Mercedes-Benz Stadium", cityName: "Atlanta", sectionName: "Lower Bowl", sectionType: "premium", level: "Lower", basePriceUsd: 700, premiumPriceUsd: 1200, capacity: 11000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "Retractable Roof"] },
    { stadiumName: "Mercedes-Benz Stadium", cityName: "Atlanta", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 420, premiumPriceUsd: 700, capacity: 16000, viewQuality: "Great", amenities: ["Club Access", "Fan-Friendly Pricing"] },
    { stadiumName: "Mercedes-Benz Stadium", cityName: "Atlanta", sectionName: "Upper Deck", sectionType: "standard", level: "Upper", basePriceUsd: 220, premiumPriceUsd: 380, capacity: 30000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "Mercedes-Benz Stadium", cityName: "Atlanta", sectionName: "Upper Corner", sectionType: "economy", level: "Upper", basePriceUsd: 110, premiumPriceUsd: 200, capacity: 15000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // NRG Stadium - Houston
    { stadiumName: "NRG Stadium", cityName: "Houston", sectionName: "Field Level", sectionType: "premium", level: "Lower", basePriceUsd: 680, premiumPriceUsd: 1150, capacity: 10000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "Climate Control"] },
    { stadiumName: "NRG Stadium", cityName: "Houston", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 380, premiumPriceUsd: 650, capacity: 18000, viewQuality: "Great", amenities: ["Club Access", "Air Conditioning"] },
    { stadiumName: "NRG Stadium", cityName: "Houston", sectionName: "Mezzanine", sectionType: "standard", level: "Middle", basePriceUsd: 200, premiumPriceUsd: 350, capacity: 25000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "NRG Stadium", cityName: "Houston", sectionName: "Upper Level", sectionType: "economy", level: "Upper", basePriceUsd: 100, premiumPriceUsd: 180, capacity: 20000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // Lincoln Financial Field - Philadelphia
    { stadiumName: "Lincoln Financial Field", cityName: "Philadelphia", sectionName: "Lower Level", sectionType: "premium", level: "Lower", basePriceUsd: 720, premiumPriceUsd: 1250, capacity: 9500, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating"] },
    { stadiumName: "Lincoln Financial Field", cityName: "Philadelphia", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 440, premiumPriceUsd: 750, capacity: 14000, viewQuality: "Great", amenities: ["Club Access", "Enhanced Dining"] },
    { stadiumName: "Lincoln Financial Field", cityName: "Philadelphia", sectionName: "Upper Deck", sectionType: "standard", level: "Upper", basePriceUsd: 240, premiumPriceUsd: 400, capacity: 26000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "Lincoln Financial Field", cityName: "Philadelphia", sectionName: "Endzone Upper", sectionType: "economy", level: "Upper", basePriceUsd: 120, premiumPriceUsd: 210, capacity: 18000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // Arrowhead Stadium - Kansas City
    { stadiumName: "Arrowhead Stadium", cityName: "Kansas City", sectionName: "Lower Level", sectionType: "premium", level: "Lower", basePriceUsd: 650, premiumPriceUsd: 1100, capacity: 10000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "Historic Venue"] },
    { stadiumName: "Arrowhead Stadium", cityName: "Kansas City", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 350, premiumPriceUsd: 600, capacity: 12000, viewQuality: "Great", amenities: ["Club Access", "BBQ Concessions"] },
    { stadiumName: "Arrowhead Stadium", cityName: "Kansas City", sectionName: "Upper Deck", sectionType: "standard", level: "Upper", basePriceUsd: 180, premiumPriceUsd: 320, capacity: 28000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "Arrowhead Stadium", cityName: "Kansas City", sectionName: "Upper Corner", sectionType: "economy", level: "Upper", basePriceUsd: 90, premiumPriceUsd: 160, capacity: 26000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // Gillette Stadium - Boston
    { stadiumName: "Gillette Stadium", cityName: "Boston", sectionName: "Field Level", sectionType: "premium", level: "Lower", basePriceUsd: 780, premiumPriceUsd: 1350, capacity: 8500, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "Patriot Place Access"] },
    { stadiumName: "Gillette Stadium", cityName: "Boston", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 480, premiumPriceUsd: 820, capacity: 13000, viewQuality: "Great", amenities: ["Club Access", "Indoor Lounge"] },
    { stadiumName: "Gillette Stadium", cityName: "Boston", sectionName: "Upper Deck", sectionType: "standard", level: "Upper", basePriceUsd: 260, premiumPriceUsd: 420, capacity: 24000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "Gillette Stadium", cityName: "Boston", sectionName: "Upper Corner", sectionType: "economy", level: "Upper", basePriceUsd: 130, premiumPriceUsd: 230, capacity: 20000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // Lumen Field - Seattle
    { stadiumName: "Lumen Field", cityName: "Seattle", sectionName: "Lower Bowl", sectionType: "premium", level: "Lower", basePriceUsd: 700, premiumPriceUsd: 1200, capacity: 9000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Premium Seating", "City Views"] },
    { stadiumName: "Lumen Field", cityName: "Seattle", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 420, premiumPriceUsd: 720, capacity: 14000, viewQuality: "Great", amenities: ["Club Access", "Local Cuisine"] },
    { stadiumName: "Lumen Field", cityName: "Seattle", sectionName: "Upper Deck", sectionType: "standard", level: "Upper", basePriceUsd: 220, premiumPriceUsd: 380, capacity: 27000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "Lumen Field", cityName: "Seattle", sectionName: "Hawks Nest", sectionType: "economy", level: "Upper", basePriceUsd: 110, premiumPriceUsd: 200, capacity: 19000, viewQuality: "Standard", amenities: ["Basic Seating", "Fan Zone"] },
    
    // Estadio Azteca - Mexico City
    { stadiumName: "Estadio Azteca", cityName: "Mexico City", sectionName: "Cancha", sectionType: "premium", level: "Lower", basePriceUsd: 600, premiumPriceUsd: 1000, capacity: 15000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Historic Venue", "Legend Status"] },
    { stadiumName: "Estadio Azteca", cityName: "Mexico City", sectionName: "Palcos", sectionType: "club", level: "Middle", basePriceUsd: 350, premiumPriceUsd: 580, capacity: 20000, viewQuality: "Great", amenities: ["Club Access", "Private Boxes"] },
    { stadiumName: "Estadio Azteca", cityName: "Mexico City", sectionName: "General", sectionType: "standard", level: "Middle", basePriceUsd: 150, premiumPriceUsd: 280, capacity: 40000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "Estadio Azteca", cityName: "Mexico City", sectionName: "Sol", sectionType: "economy", level: "Upper", basePriceUsd: 75, premiumPriceUsd: 140, capacity: 12000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // Estadio BBVA - Monterrey
    { stadiumName: "Estadio BBVA", cityName: "Monterrey", sectionName: "Cancha", sectionType: "premium", level: "Lower", basePriceUsd: 550, premiumPriceUsd: 950, capacity: 8000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Modern Stadium", "Mountain Views"] },
    { stadiumName: "Estadio BBVA", cityName: "Monterrey", sectionName: "Preferente", sectionType: "club", level: "Middle", basePriceUsd: 320, premiumPriceUsd: 540, capacity: 12000, viewQuality: "Great", amenities: ["Club Access", "Premium Food"] },
    { stadiumName: "Estadio BBVA", cityName: "Monterrey", sectionName: "General Norte/Sur", sectionType: "standard", level: "Middle", basePriceUsd: 140, premiumPriceUsd: 250, capacity: 20000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "Estadio BBVA", cityName: "Monterrey", sectionName: "Popular", sectionType: "economy", level: "Upper", basePriceUsd: 70, premiumPriceUsd: 130, capacity: 11000, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // Estadio Akron - Guadalajara
    { stadiumName: "Estadio Akron", cityName: "Guadalajara", sectionName: "Cancha", sectionType: "premium", level: "Lower", basePriceUsd: 520, premiumPriceUsd: 900, capacity: 7500, viewQuality: "Excellent", amenities: ["VIP Lounge", "New Stadium", "Great Acoustics"] },
    { stadiumName: "Estadio Akron", cityName: "Guadalajara", sectionName: "Club", sectionType: "club", level: "Middle", basePriceUsd: 300, premiumPriceUsd: 500, capacity: 11000, viewQuality: "Great", amenities: ["Club Access", "Local Cuisine"] },
    { stadiumName: "Estadio Akron", cityName: "Guadalajara", sectionName: "Cabecera", sectionType: "standard", level: "Middle", basePriceUsd: 130, premiumPriceUsd: 230, capacity: 18000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "Estadio Akron", cityName: "Guadalajara", sectionName: "General", sectionType: "economy", level: "Upper", basePriceUsd: 65, premiumPriceUsd: 120, capacity: 8700, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // BC Place - Vancouver
    { stadiumName: "BC Place", cityName: "Vancouver", sectionName: "Lower Bowl", sectionType: "premium", level: "Lower", basePriceUsd: 700, premiumPriceUsd: 1200, capacity: 9000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Retractable Roof", "Waterfront Views"] },
    { stadiumName: "BC Place", cityName: "Vancouver", sectionName: "Club Level", sectionType: "club", level: "Middle", basePriceUsd: 420, premiumPriceUsd: 720, capacity: 12000, viewQuality: "Great", amenities: ["Club Access", "Premium Dining"] },
    { stadiumName: "BC Place", cityName: "Vancouver", sectionName: "Upper Deck", sectionType: "standard", level: "Upper", basePriceUsd: 220, premiumPriceUsd: 380, capacity: 25000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "BC Place", cityName: "Vancouver", sectionName: "Upper Corner", sectionType: "economy", level: "Upper", basePriceUsd: 110, premiumPriceUsd: 200, capacity: 8500, viewQuality: "Standard", amenities: ["Basic Seating"] },
    
    // BMO Field - Toronto
    { stadiumName: "BMO Field", cityName: "Toronto", sectionName: "Lower Bowl", sectionType: "premium", level: "Lower", basePriceUsd: 680, premiumPriceUsd: 1150, capacity: 7000, viewQuality: "Excellent", amenities: ["VIP Lounge", "Intimate Venue", "Lake Views"] },
    { stadiumName: "BMO Field", cityName: "Toronto", sectionName: "West Stand", sectionType: "club", level: "Middle", basePriceUsd: 400, premiumPriceUsd: 680, capacity: 9000, viewQuality: "Great", amenities: ["Club Access", "Covered Seating"] },
    { stadiumName: "BMO Field", cityName: "Toronto", sectionName: "East Stand", sectionType: "standard", level: "Middle", basePriceUsd: 200, premiumPriceUsd: 350, capacity: 12000, viewQuality: "Good", amenities: ["Standard Concessions"] },
    { stadiumName: "BMO Field", cityName: "Toronto", sectionName: "North End", sectionType: "economy", level: "Lower", basePriceUsd: 100, premiumPriceUsd: 180, capacity: 7000, viewQuality: "Standard", amenities: ["Supporter Section", "Standing Area"] },
  ];

  for (const section of stadiumSectionsData) {
    try {
      await storage.createStadiumSection(section);
    } catch (e) {
      console.log(`Section ${section.sectionName} at ${section.stadiumName} may already exist`);
    }
  }
  console.log(`Seeded ${stadiumSectionsData.length} stadium sections`);

  // Get existing teams to get their IDs
  const existingTeams = await storage.getAllTeams();
  const teamIdMap: Record<string, number> = {};
  for (const team of existingTeams) {
    teamIdMap[team.name] = team.id;
  }

  // Players data - Key players from major teams
  const playersData = [
    // Argentina
    { teamId: teamIdMap["Argentina"], name: "Lionel Messi", position: "Forward", number: 10, dateOfBirth: "1987-06-24", height: "170cm", currentClub: "Inter Miami", isCaptain: 1, internationalCaps: 187, internationalGoals: 109, clubCareerGoals: 723, clubCareerAssists: 340, highlightVideoUrl: "https://www.youtube.com/results?search_query=lionel+messi+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Lionel_Messi" },
    { teamId: teamIdMap["Argentina"], name: "Julián Álvarez", position: "Forward", number: 9, dateOfBirth: "2000-01-31", height: "170cm", currentClub: "Atlético Madrid", isCaptain: 0, internationalCaps: 42, internationalGoals: 11, clubCareerGoals: 85, clubCareerAssists: 35, highlightVideoUrl: "https://www.youtube.com/results?search_query=julian+alvarez+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Juli%C3%A1n_%C3%81lvarez" },
    { teamId: teamIdMap["Argentina"], name: "Emiliano Martínez", position: "Goalkeeper", number: 23, dateOfBirth: "1992-09-02", height: "195cm", currentClub: "Aston Villa", isCaptain: 0, internationalCaps: 48, internationalGoals: 0, clubCareerGoals: 0, clubCareerAssists: 2, highlightVideoUrl: "https://www.youtube.com/results?search_query=emiliano+martinez+saves", wikiUrl: "https://en.wikipedia.org/wiki/Emiliano_Mart%C3%ADnez" },
    { teamId: teamIdMap["Argentina"], name: "Rodrigo De Paul", position: "Midfielder", number: 7, dateOfBirth: "1994-05-24", height: "180cm", currentClub: "Atlético Madrid", isCaptain: 0, internationalCaps: 62, internationalGoals: 3, clubCareerGoals: 45, clubCareerAssists: 60, highlightVideoUrl: "https://www.youtube.com/results?search_query=rodrigo+de+paul+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Rodrigo_De_Paul" },
    
    // France
    { teamId: teamIdMap["France"], name: "Kylian Mbappé", position: "Forward", number: 10, dateOfBirth: "1998-12-20", height: "178cm", currentClub: "Real Madrid", isCaptain: 1, internationalCaps: 86, internationalGoals: 48, clubCareerGoals: 285, clubCareerAssists: 125, highlightVideoUrl: "https://www.youtube.com/results?search_query=kylian+mbappe+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Kylian_Mbapp%C3%A9" },
    { teamId: teamIdMap["France"], name: "Antoine Griezmann", position: "Forward", number: 7, dateOfBirth: "1991-03-21", height: "176cm", currentClub: "Atlético Madrid", isCaptain: 0, internationalCaps: 137, internationalGoals: 46, clubCareerGoals: 220, clubCareerAssists: 95, highlightVideoUrl: "https://www.youtube.com/results?search_query=antoine+griezmann+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Antoine_Griezmann" },
    { teamId: teamIdMap["France"], name: "Aurélien Tchouaméni", position: "Midfielder", number: 8, dateOfBirth: "2000-01-27", height: "187cm", currentClub: "Real Madrid", isCaptain: 0, internationalCaps: 40, internationalGoals: 2, clubCareerGoals: 12, clubCareerAssists: 8, highlightVideoUrl: "https://www.youtube.com/results?search_query=aurelien+tchouameni+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Aur%C3%A9lien_Tchouam%C3%A9ni" },
    { teamId: teamIdMap["France"], name: "Mike Maignan", position: "Goalkeeper", number: 16, dateOfBirth: "1995-07-03", height: "191cm", currentClub: "AC Milan", isCaptain: 0, internationalCaps: 18, internationalGoals: 0, clubCareerGoals: 0, clubCareerAssists: 1, highlightVideoUrl: "https://www.youtube.com/results?search_query=mike+maignan+saves", wikiUrl: "https://en.wikipedia.org/wiki/Mike_Maignan" },
    
    // England
    { teamId: teamIdMap["England"], name: "Harry Kane", position: "Forward", number: 9, dateOfBirth: "1993-07-28", height: "188cm", currentClub: "Bayern Munich", isCaptain: 1, internationalCaps: 98, internationalGoals: 66, clubCareerGoals: 355, clubCareerAssists: 85, highlightVideoUrl: "https://www.youtube.com/results?search_query=harry+kane+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Harry_Kane" },
    { teamId: teamIdMap["England"], name: "Jude Bellingham", position: "Midfielder", number: 10, dateOfBirth: "2003-06-29", height: "186cm", currentClub: "Real Madrid", isCaptain: 0, internationalCaps: 42, internationalGoals: 6, clubCareerGoals: 55, clubCareerAssists: 30, highlightVideoUrl: "https://www.youtube.com/results?search_query=jude+bellingham+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Jude_Bellingham" },
    { teamId: teamIdMap["England"], name: "Bukayo Saka", position: "Winger", number: 7, dateOfBirth: "2001-09-05", height: "178cm", currentClub: "Arsenal", isCaptain: 0, internationalCaps: 40, internationalGoals: 12, clubCareerGoals: 55, clubCareerAssists: 50, highlightVideoUrl: "https://www.youtube.com/results?search_query=bukayo+saka+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Bukayo_Saka" },
    { teamId: teamIdMap["England"], name: "Phil Foden", position: "Midfielder", number: 11, dateOfBirth: "2000-05-28", height: "171cm", currentClub: "Manchester City", isCaptain: 0, internationalCaps: 42, internationalGoals: 4, clubCareerGoals: 75, clubCareerAssists: 45, highlightVideoUrl: "https://www.youtube.com/results?search_query=phil+foden+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Phil_Foden" },
    
    // Spain
    { teamId: teamIdMap["Spain"], name: "Rodri", position: "Midfielder", number: 16, dateOfBirth: "1996-06-22", height: "191cm", currentClub: "Manchester City", isCaptain: 0, internationalCaps: 65, internationalGoals: 4, clubCareerGoals: 30, clubCareerAssists: 25, highlightVideoUrl: "https://www.youtube.com/results?search_query=rodri+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Rodri_(footballer,_born_1996)" },
    { teamId: teamIdMap["Spain"], name: "Lamine Yamal", position: "Winger", number: 19, dateOfBirth: "2007-07-13", height: "180cm", currentClub: "Barcelona", isCaptain: 0, internationalCaps: 18, internationalGoals: 3, clubCareerGoals: 12, clubCareerAssists: 18, highlightVideoUrl: "https://www.youtube.com/results?search_query=lamine+yamal+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Lamine_Yamal" },
    { teamId: teamIdMap["Spain"], name: "Pedri", position: "Midfielder", number: 8, dateOfBirth: "2002-11-25", height: "174cm", currentClub: "Barcelona", isCaptain: 0, internationalCaps: 32, internationalGoals: 1, clubCareerGoals: 15, clubCareerAssists: 20, highlightVideoUrl: "https://www.youtube.com/results?search_query=pedri+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Pedri" },
    { teamId: teamIdMap["Spain"], name: "Nico Williams", position: "Winger", number: 17, dateOfBirth: "2002-07-12", height: "181cm", currentClub: "Athletic Bilbao", isCaptain: 0, internationalCaps: 22, internationalGoals: 3, clubCareerGoals: 20, clubCareerAssists: 25, highlightVideoUrl: "https://www.youtube.com/results?search_query=nico+williams+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Nico_Williams" },
    
    // Brazil
    { teamId: teamIdMap["Brazil"], name: "Vinícius Júnior", position: "Winger", number: 7, dateOfBirth: "2000-07-12", height: "176cm", currentClub: "Real Madrid", isCaptain: 0, internationalCaps: 38, internationalGoals: 6, clubCareerGoals: 85, clubCareerAssists: 70, highlightVideoUrl: "https://www.youtube.com/results?search_query=vinicius+junior+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Vin%C3%ADcius_J%C3%BAnior" },
    { teamId: teamIdMap["Brazil"], name: "Rodrygo", position: "Forward", number: 11, dateOfBirth: "2001-01-09", height: "174cm", currentClub: "Real Madrid", isCaptain: 0, internationalCaps: 28, internationalGoals: 7, clubCareerGoals: 50, clubCareerAssists: 35, highlightVideoUrl: "https://www.youtube.com/results?search_query=rodrygo+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Rodrygo" },
    { teamId: teamIdMap["Brazil"], name: "Raphinha", position: "Winger", number: 19, dateOfBirth: "1996-12-14", height: "176cm", currentClub: "Barcelona", isCaptain: 0, internationalCaps: 30, internationalGoals: 8, clubCareerGoals: 60, clubCareerAssists: 45, highlightVideoUrl: "https://www.youtube.com/results?search_query=raphinha+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Raphinha" },
    { teamId: teamIdMap["Brazil"], name: "Alisson Becker", position: "Goalkeeper", number: 1, dateOfBirth: "1992-10-02", height: "193cm", currentClub: "Liverpool", isCaptain: 0, internationalCaps: 70, internationalGoals: 0, clubCareerGoals: 1, clubCareerAssists: 3, highlightVideoUrl: "https://www.youtube.com/results?search_query=alisson+becker+saves", wikiUrl: "https://en.wikipedia.org/wiki/Alisson_Becker" },
    
    // Germany
    { teamId: teamIdMap["Germany"], name: "Florian Wirtz", position: "Midfielder", number: 17, dateOfBirth: "2003-05-03", height: "176cm", currentClub: "Bayer Leverkusen", isCaptain: 0, internationalCaps: 28, internationalGoals: 5, clubCareerGoals: 50, clubCareerAssists: 45, highlightVideoUrl: "https://www.youtube.com/results?search_query=florian+wirtz+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Florian_Wirtz" },
    { teamId: teamIdMap["Germany"], name: "Jamal Musiala", position: "Midfielder", number: 10, dateOfBirth: "2003-02-26", height: "183cm", currentClub: "Bayern Munich", isCaptain: 0, internationalCaps: 38, internationalGoals: 6, clubCareerGoals: 45, clubCareerAssists: 30, highlightVideoUrl: "https://www.youtube.com/results?search_query=jamal+musiala+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Jamal_Musiala" },
    { teamId: teamIdMap["Germany"], name: "Kai Havertz", position: "Forward", number: 29, dateOfBirth: "1999-06-11", height: "193cm", currentClub: "Arsenal", isCaptain: 0, internationalCaps: 48, internationalGoals: 17, clubCareerGoals: 85, clubCareerAssists: 40, highlightVideoUrl: "https://www.youtube.com/results?search_query=kai+havertz+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Kai_Havertz" },
    { teamId: teamIdMap["Germany"], name: "Antonio Rüdiger", position: "Defender", number: 2, dateOfBirth: "1993-03-03", height: "190cm", currentClub: "Real Madrid", isCaptain: 0, internationalCaps: 70, internationalGoals: 3, clubCareerGoals: 15, clubCareerAssists: 5, highlightVideoUrl: "https://www.youtube.com/results?search_query=antonio+rudiger+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Antonio_R%C3%BCdiger" },
    
    // Portugal
    { teamId: teamIdMap["Portugal"], name: "Cristiano Ronaldo", position: "Forward", number: 7, dateOfBirth: "1985-02-05", height: "187cm", currentClub: "Al-Nassr", isCaptain: 1, internationalCaps: 214, internationalGoals: 135, clubCareerGoals: 735, clubCareerAssists: 240, highlightVideoUrl: "https://www.youtube.com/results?search_query=cristiano+ronaldo+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Cristiano_Ronaldo" },
    { teamId: teamIdMap["Portugal"], name: "Bruno Fernandes", position: "Midfielder", number: 8, dateOfBirth: "1994-09-08", height: "179cm", currentClub: "Manchester United", isCaptain: 0, internationalCaps: 72, internationalGoals: 14, clubCareerGoals: 120, clubCareerAssists: 110, highlightVideoUrl: "https://www.youtube.com/results?search_query=bruno+fernandes+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Bruno_Fernandes" },
    { teamId: teamIdMap["Portugal"], name: "Rafael Leão", position: "Winger", number: 17, dateOfBirth: "1999-06-10", height: "188cm", currentClub: "AC Milan", isCaptain: 0, internationalCaps: 35, internationalGoals: 7, clubCareerGoals: 55, clubCareerAssists: 40, highlightVideoUrl: "https://www.youtube.com/results?search_query=rafael+leao+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Rafael_Le%C3%A3o" },
    { teamId: teamIdMap["Portugal"], name: "Rúben Dias", position: "Defender", number: 4, dateOfBirth: "1997-05-14", height: "186cm", currentClub: "Manchester City", isCaptain: 0, internationalCaps: 56, internationalGoals: 1, clubCareerGoals: 8, clubCareerAssists: 5, highlightVideoUrl: "https://www.youtube.com/results?search_query=ruben+dias+highlights", wikiUrl: "https://en.wikipedia.org/wiki/R%C3%BAben_Dias" },
    
    // USA
    { teamId: teamIdMap["USA"], name: "Christian Pulisic", position: "Winger", number: 10, dateOfBirth: "1998-09-18", height: "177cm", currentClub: "AC Milan", isCaptain: 1, internationalCaps: 72, internationalGoals: 30, clubCareerGoals: 75, clubCareerAssists: 50, highlightVideoUrl: "https://www.youtube.com/results?search_query=christian+pulisic+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Christian_Pulisic" },
    { teamId: teamIdMap["USA"], name: "Weston McKennie", position: "Midfielder", number: 8, dateOfBirth: "1998-08-28", height: "185cm", currentClub: "Juventus", isCaptain: 0, internationalCaps: 58, internationalGoals: 11, clubCareerGoals: 20, clubCareerAssists: 15, highlightVideoUrl: "https://www.youtube.com/results?search_query=weston+mckennie+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Weston_McKennie" },
    { teamId: teamIdMap["USA"], name: "Tyler Adams", position: "Midfielder", number: 4, dateOfBirth: "1999-02-14", height: "175cm", currentClub: "Bournemouth", isCaptain: 0, internationalCaps: 40, internationalGoals: 1, clubCareerGoals: 5, clubCareerAssists: 15, highlightVideoUrl: "https://www.youtube.com/results?search_query=tyler+adams+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Tyler_Adams" },
    { teamId: teamIdMap["USA"], name: "Gio Reyna", position: "Winger", number: 7, dateOfBirth: "2002-11-13", height: "185cm", currentClub: "Borussia Dortmund", isCaptain: 0, internationalCaps: 30, internationalGoals: 5, clubCareerGoals: 15, clubCareerAssists: 20, highlightVideoUrl: "https://www.youtube.com/results?search_query=gio+reyna+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Gio_Reyna" },
    
    // Mexico
    { teamId: teamIdMap["Mexico"], name: "Hirving Lozano", position: "Winger", number: 22, dateOfBirth: "1995-07-30", height: "175cm", currentClub: "San Diego FC", isCaptain: 0, internationalCaps: 72, internationalGoals: 18, clubCareerGoals: 75, clubCareerAssists: 45, highlightVideoUrl: "https://www.youtube.com/results?search_query=hirving+lozano+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Hirving_Lozano" },
    { teamId: teamIdMap["Mexico"], name: "Edson Álvarez", position: "Midfielder", number: 4, dateOfBirth: "1997-10-24", height: "187cm", currentClub: "West Ham", isCaptain: 1, internationalCaps: 68, internationalGoals: 2, clubCareerGoals: 12, clubCareerAssists: 8, highlightVideoUrl: "https://www.youtube.com/results?search_query=edson+alvarez+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Edson_%C3%81lvarez" },
    { teamId: teamIdMap["Mexico"], name: "Santiago Giménez", position: "Forward", number: 9, dateOfBirth: "2001-04-18", height: "183cm", currentClub: "Feyenoord", isCaptain: 0, internationalCaps: 28, internationalGoals: 8, clubCareerGoals: 50, clubCareerAssists: 15, highlightVideoUrl: "https://www.youtube.com/results?search_query=santiago+gimenez+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Santiago_Gim%C3%A9nez" },
    { teamId: teamIdMap["Mexico"], name: "Guillermo Ochoa", position: "Goalkeeper", number: 13, dateOfBirth: "1985-07-13", height: "183cm", currentClub: "AVS Futebol", isCaptain: 0, internationalCaps: 145, internationalGoals: 0, clubCareerGoals: 0, clubCareerAssists: 0, highlightVideoUrl: "https://www.youtube.com/results?search_query=guillermo+ochoa+saves", wikiUrl: "https://en.wikipedia.org/wiki/Guillermo_Ochoa" },
    
    // Netherlands
    { teamId: teamIdMap["Netherlands"], name: "Virgil van Dijk", position: "Defender", number: 4, dateOfBirth: "1991-07-08", height: "193cm", currentClub: "Liverpool", isCaptain: 1, internationalCaps: 68, internationalGoals: 7, clubCareerGoals: 25, clubCareerAssists: 10, highlightVideoUrl: "https://www.youtube.com/results?search_query=virgil+van+dijk+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Virgil_van_Dijk" },
    { teamId: teamIdMap["Netherlands"], name: "Frenkie de Jong", position: "Midfielder", number: 21, dateOfBirth: "1997-05-12", height: "181cm", currentClub: "Barcelona", isCaptain: 0, internationalCaps: 58, internationalGoals: 2, clubCareerGoals: 20, clubCareerAssists: 30, highlightVideoUrl: "https://www.youtube.com/results?search_query=frenkie+de+jong+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Frenkie_de_Jong" },
    { teamId: teamIdMap["Netherlands"], name: "Cody Gakpo", position: "Forward", number: 11, dateOfBirth: "1999-05-07", height: "189cm", currentClub: "Liverpool", isCaptain: 0, internationalCaps: 38, internationalGoals: 12, clubCareerGoals: 75, clubCareerAssists: 45, highlightVideoUrl: "https://www.youtube.com/results?search_query=cody+gakpo+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Cody_Gakpo" },
    { teamId: teamIdMap["Netherlands"], name: "Memphis Depay", position: "Forward", number: 10, dateOfBirth: "1994-02-13", height: "178cm", currentClub: "Corinthians", isCaptain: 0, internationalCaps: 98, internationalGoals: 46, clubCareerGoals: 175, clubCareerAssists: 95, highlightVideoUrl: "https://www.youtube.com/results?search_query=memphis+depay+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Memphis_Depay" },
    
    // Japan
    { teamId: teamIdMap["Japan"], name: "Takefusa Kubo", position: "Winger", number: 11, dateOfBirth: "2001-06-04", height: "173cm", currentClub: "Real Sociedad", isCaptain: 0, internationalCaps: 42, internationalGoals: 6, clubCareerGoals: 35, clubCareerAssists: 25, highlightVideoUrl: "https://www.youtube.com/results?search_query=takefusa+kubo+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Takefusa_Kubo" },
    { teamId: teamIdMap["Japan"], name: "Kaoru Mitoma", position: "Winger", number: 9, dateOfBirth: "1997-05-20", height: "178cm", currentClub: "Brighton", isCaptain: 0, internationalCaps: 32, internationalGoals: 7, clubCareerGoals: 30, clubCareerAssists: 20, highlightVideoUrl: "https://www.youtube.com/results?search_query=kaoru+mitoma+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Kaoru_Mitoma" },
    { teamId: teamIdMap["Japan"], name: "Wataru Endo", position: "Midfielder", number: 6, dateOfBirth: "1993-02-09", height: "178cm", currentClub: "Liverpool", isCaptain: 1, internationalCaps: 58, internationalGoals: 3, clubCareerGoals: 25, clubCareerAssists: 20, highlightVideoUrl: "https://www.youtube.com/results?search_query=wataru+endo+highlights", wikiUrl: "https://en.wikipedia.org/wiki/Wataru_End%C5%8D" },
  ];

  // Filter out players with undefined teamId (team not found)
  const validPlayers = playersData.filter(p => p.teamId !== undefined);
  
  for (const player of validPlayers) {
    try {
      await storage.createPlayer(player as any);
    } catch (e) {
      console.log(`Player ${player.name} may already exist`);
    }
  }
  console.log(`Seeded ${validPlayers.length} players`);

  console.log("Seeding complete!");
  process.exit(0);
}

seedNewData().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
