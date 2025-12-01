import { storage } from "./storage";

async function seed() {
  console.log("Seeding database with all qualified teams...");

  // All 42 qualified teams for FIFA World Cup 2026
  const teamsData = [
    // Top Seeds (Pot 1)
    { name: "Spain", teamName: "La Roja", flag: "es", rank: 1, coach: "Luis de la Fuente", record: "12-2-1", points: "1877.18" },
    { name: "Argentina", teamName: "La Albiceleste", flag: "ar", rank: 2, coach: "Lionel Scaloni", record: "11-3-1", points: "1873.33" },
    { name: "France", teamName: "Les Bleus", flag: "fr", rank: 3, coach: "Didier Deschamps", record: "10-4-2", points: "1870.00" },
    { name: "England", teamName: "Three Lions", flag: "gb-eng", rank: 4, coach: "Thomas Tuchel", record: "9-5-2", points: "1834.12" },
    { name: "Brazil", teamName: "Seleção", flag: "br", rank: 5, coach: "Carlo Ancelotti", record: "8-6-3", points: "1760.46" },
    { name: "Portugal", teamName: "Seleção das Quinas", flag: "pt", rank: 6, coach: "Roberto Martínez", record: "10-2-3", points: "1750.00" },
    { name: "Netherlands", teamName: "Oranje", flag: "nl", rank: 7, coach: "Ronald Koeman", record: "9-3-4", points: "1740.00" },
    { name: "Belgium", teamName: "Red Devils", flag: "be", rank: 8, coach: "Domenico Tedesco", record: "8-4-3", points: "1730.00" },
    { name: "Germany", teamName: "Die Mannschaft", flag: "de", rank: 9, coach: "Julian Nagelsmann", record: "7-5-3", points: "1710.00" },
    { name: "Croatia", teamName: "Vatreni", flag: "hr", rank: 10, coach: "Zlatko Dalić", record: "8-3-4", points: "1700.00" },
    
    // Pot 2
    { name: "Morocco", teamName: "Atlas Lions", flag: "ma", rank: 12, coach: "Walid Regragui", record: "9-2-2", points: "1690.00" },
    { name: "Colombia", teamName: "Los Cafeteros", flag: "co", rank: 13, coach: "Néstor Lorenzo", record: "7-4-4", points: "1680.00" },
    { name: "USA", teamName: "USMNT", flag: "us", rank: 14, coach: "Mauricio Pochettino", record: "8-3-4", points: "1670.00" },
    { name: "Mexico", teamName: "El Tri", flag: "mx", rank: 15, coach: "Javier Aguirre", record: "8-4-3", points: "1665.00" },
    { name: "Uruguay", teamName: "La Celeste", flag: "uy", rank: 16, coach: "Marcelo Bielsa", record: "7-5-3", points: "1660.00" },
    { name: "Switzerland", teamName: "Nati", flag: "ch", rank: 17, coach: "Murat Yakin", record: "7-4-4", points: "1655.00" },
    { name: "Japan", teamName: "Samurai Blue", flag: "jp", rank: 18, coach: "Hajime Moriyasu", record: "8-3-4", points: "1650.00" },
    { name: "Senegal", teamName: "Lions of Teranga", flag: "sn", rank: 19, coach: "Aliou Cissé", record: "7-4-4", points: "1645.00" },
    { name: "Iran", teamName: "Team Melli", flag: "ir", rank: 20, coach: "Amir Ghalenoei", record: "7-3-5", points: "1640.00" },
    { name: "South Korea", teamName: "Taegeuk Warriors", flag: "kr", rank: 21, coach: "Hong Myung-bo", record: "7-4-4", points: "1635.00" },
    { name: "Ecuador", teamName: "La Tri", flag: "ec", rank: 22, coach: "Sebastián Beccacece", record: "6-5-4", points: "1630.00" },
    { name: "Austria", teamName: "Das Team", flag: "at", rank: 23, coach: "Ralf Rangnick", record: "7-3-5", points: "1625.00" },
    { name: "Australia", teamName: "Socceroos", flag: "au", rank: 24, coach: "Tony Popovic", record: "6-4-5", points: "1620.00" },
    
    // Pot 3
    { name: "Norway", teamName: "Løvene", flag: "no", rank: 25, coach: "Ståle Solbakken", record: "6-4-5", points: "1610.00" },
    { name: "Canada", teamName: "Les Rouges", flag: "ca", rank: 27, coach: "Jesse Marsch", record: "6-4-5", points: "1590.00" },
    { name: "Panama", teamName: "Los Canaleros", flag: "pa", rank: 30, coach: "Thomas Christiansen", record: "6-3-6", points: "1560.00" },
    { name: "Egypt", teamName: "Pharaohs", flag: "eg", rank: 32, coach: "Hossam Hassan", record: "6-4-5", points: "1540.00" },
    { name: "Algeria", teamName: "Les Fennecs", flag: "dz", rank: 33, coach: "Vladimir Petković", record: "6-3-6", points: "1535.00" },
    { name: "Scotland", teamName: "Tartan Army", flag: "gb-sct", rank: 34, coach: "Steve Clarke", record: "5-4-6", points: "1530.00" },
    { name: "Paraguay", teamName: "La Albirroja", flag: "py", rank: 35, coach: "Gustavo Alfaro", record: "5-5-5", points: "1525.00" },
    { name: "Tunisia", teamName: "Eagles of Carthage", flag: "tn", rank: 36, coach: "Faouzi Benzarti", record: "5-4-6", points: "1520.00" },
    { name: "Ivory Coast", teamName: "Les Éléphants", flag: "ci", rank: 37, coach: "Emerse Faé", record: "6-3-6", points: "1515.00" },
    { name: "Uzbekistan", teamName: "White Wolves", flag: "uz", rank: 50, coach: "Srecko Katanec", record: "5-4-6", points: "1450.00" },
    { name: "Qatar", teamName: "The Maroons", flag: "qa", rank: 38, coach: "Luís García", record: "5-3-7", points: "1510.00" },
    { name: "Saudi Arabia", teamName: "The Green Falcons", flag: "sa", rank: 39, coach: "Hervé Renard", record: "5-4-6", points: "1505.00" },
    { name: "South Africa", teamName: "Bafana Bafana", flag: "za", rank: 40, coach: "Hugo Broos", record: "5-4-6", points: "1500.00" },
    
    // Pot 4
    { name: "Jordan", teamName: "Al-Nashama", flag: "jo", rank: 60, coach: "Jamal Sellami", record: "5-3-7", points: "1400.00" },
    { name: "Cape Verde", teamName: "Blue Sharks", flag: "cv", rank: 55, coach: "Bubista", record: "5-4-6", points: "1420.00" },
    { name: "Ghana", teamName: "Black Stars", flag: "gh", rank: 45, coach: "Otto Addo", record: "5-4-6", points: "1470.00" },
    { name: "Curaçao", teamName: "Pais Kòrsou", flag: "cw", rank: 85, coach: "Dick Advocaat", record: "4-3-8", points: "1350.00" },
    { name: "Haiti", teamName: "Les Grenadiers", flag: "ht", rank: 75, coach: "Sébastien Migné", record: "4-4-7", points: "1380.00" },
    { name: "New Zealand", teamName: "All Whites", flag: "nz", rank: 80, coach: "Darren Bazeley", record: "4-3-8", points: "1360.00" },
  ];

  for (const team of teamsData) {
    await storage.createTeam(team);
  }

  console.log(`Seeded ${teamsData.length} teams successfully!`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});