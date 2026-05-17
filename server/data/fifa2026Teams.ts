/**
 * Official roster of all 48 teams qualified for the FIFA World Cup 2026.
 *
 * Source: data provided by Mark Heap (verified against FIFA.com on 2026-05-18).
 * Includes group draw, current FIFA world ranking, and historical
 * tournament participation count.
 *
 * `teamName` (nickname) and `coach` are best-known values; some are TBD when
 * FIFA hadn't published a confirmed head coach as of the data export.
 * The `record`/`points` columns are populated with placeholders — the legacy
 * UI references them but they're not actively maintained.
 */
export interface OfficialFifaTeam {
  name: string;
  teamName: string;
  flag: string;
  rank: number;
  coach: string;
  record: string;
  points: string;
  groupStage: string;
  participations: number;
}

export const FIFA_2026_TEAMS: OfficialFifaTeam[] = [
  // Host countries
  { name: "Canada", teamName: "Les Rouges", flag: "ca", rank: 30, coach: "Jesse Marsch", record: "TBD", points: "0", groupStage: "B", participations: 2 },
  { name: "Mexico", teamName: "El Tri", flag: "mx", rank: 15, coach: "Javier Aguirre", record: "TBD", points: "0", groupStage: "A", participations: 17 },
  { name: "USA", teamName: "USMNT", flag: "us", rank: 16, coach: "Mauricio Pochettino", record: "TBD", points: "0", groupStage: "D", participations: 11 },

  // Qualified teams (alphabetical)
  { name: "Algeria", teamName: "Les Fennecs", flag: "dz", rank: 28, coach: "Vladimir Petković", record: "TBD", points: "0", groupStage: "J", participations: 4 },
  { name: "Argentina", teamName: "La Albiceleste", flag: "ar", rank: 3, coach: "Lionel Scaloni", record: "TBD", points: "0", groupStage: "J", participations: 18 },
  { name: "Australia", teamName: "Socceroos", flag: "au", rank: 27, coach: "Tony Popovic", record: "TBD", points: "0", groupStage: "D", participations: 6 },
  { name: "Austria", teamName: "Das Team", flag: "at", rank: 24, coach: "Ralf Rangnick", record: "TBD", points: "0", groupStage: "J", participations: 7 },
  { name: "Belgium", teamName: "Red Devils", flag: "be", rank: 9, coach: "Domenico Tedesco", record: "TBD", points: "0", groupStage: "G", participations: 13 },
  { name: "Bosnia and Herzegovina", teamName: "Zmajevi", flag: "ba", rank: 65, coach: "TBD", record: "TBD", points: "0", groupStage: "B", participations: 1 },
  { name: "Brazil", teamName: "Seleção", flag: "br", rank: 6, coach: "Carlo Ancelotti", record: "TBD", points: "0", groupStage: "C", participations: 22 },
  { name: "Cabo Verde", teamName: "Blue Sharks", flag: "cv", rank: 69, coach: "Bubista", record: "TBD", points: "0", groupStage: "H", participations: 0 },
  { name: "Colombia", teamName: "Los Cafeteros", flag: "co", rank: 13, coach: "Néstor Lorenzo", record: "TBD", points: "0", groupStage: "K", participations: 6 },
  { name: "Congo DR", teamName: "Léopards", flag: "cd", rank: 46, coach: "TBD", record: "TBD", points: "0", groupStage: "K", participations: 1 },
  { name: "Côte d'Ivoire", teamName: "Les Éléphants", flag: "ci", rank: 34, coach: "Emerse Faé", record: "TBD", points: "0", groupStage: "E", participations: 3 },
  { name: "Croatia", teamName: "Vatreni", flag: "hr", rank: 11, coach: "Zlatko Dalić", record: "TBD", points: "0", groupStage: "L", participations: 6 },
  { name: "Curaçao", teamName: "Pais Kòrsou", flag: "cw", rank: 82, coach: "Dick Advocaat", record: "TBD", points: "0", groupStage: "E", participations: 0 },
  { name: "Czechia", teamName: "Národní tým", flag: "cz", rank: 41, coach: "TBD", record: "TBD", points: "0", groupStage: "A", participations: 9 },
  { name: "Ecuador", teamName: "La Tri", flag: "ec", rank: 23, coach: "Sebastián Beccacece", record: "TBD", points: "0", groupStage: "E", participations: 4 },
  { name: "Egypt", teamName: "Pharaohs", flag: "eg", rank: 29, coach: "Hossam Hassan", record: "TBD", points: "0", groupStage: "G", participations: 3 },
  { name: "England", teamName: "Three Lions", flag: "gb-eng", rank: 4, coach: "Thomas Tuchel", record: "TBD", points: "0", groupStage: "L", participations: 16 },
  { name: "France", teamName: "Les Bleus", flag: "fr", rank: 1, coach: "Didier Deschamps", record: "TBD", points: "0", groupStage: "I", participations: 16 },
  { name: "Germany", teamName: "Die Mannschaft", flag: "de", rank: 10, coach: "Julian Nagelsmann", record: "TBD", points: "0", groupStage: "E", participations: 20 },
  { name: "Ghana", teamName: "Black Stars", flag: "gh", rank: 74, coach: "Otto Addo", record: "TBD", points: "0", groupStage: "L", participations: 4 },
  { name: "Haiti", teamName: "Les Grenadiers", flag: "ht", rank: 83, coach: "Sébastien Migné", record: "TBD", points: "0", groupStage: "C", participations: 1 },
  { name: "IR Iran", teamName: "Team Melli", flag: "ir", rank: 21, coach: "Amir Ghalenoei", record: "TBD", points: "0", groupStage: "G", participations: 6 },
  { name: "Iraq", teamName: "Lions of Mesopotamia", flag: "iq", rank: 57, coach: "TBD", record: "TBD", points: "0", groupStage: "I", participations: 1 },
  { name: "Japan", teamName: "Samurai Blue", flag: "jp", rank: 18, coach: "Hajime Moriyasu", record: "TBD", points: "0", groupStage: "F", participations: 7 },
  { name: "Jordan", teamName: "Al-Nashama", flag: "jo", rank: 63, coach: "Jamal Sellami", record: "TBD", points: "0", groupStage: "J", participations: 0 },
  { name: "Korea Republic", teamName: "Taegeuk Warriors", flag: "kr", rank: 25, coach: "Hong Myung-bo", record: "TBD", points: "0", groupStage: "A", participations: 10 },
  { name: "Morocco", teamName: "Atlas Lions", flag: "ma", rank: 8, coach: "Walid Regragui", record: "TBD", points: "0", groupStage: "C", participations: 6 },
  { name: "Netherlands", teamName: "Oranje", flag: "nl", rank: 7, coach: "Ronald Koeman", record: "TBD", points: "0", groupStage: "F", participations: 10 },
  { name: "New Zealand", teamName: "All Whites", flag: "nz", rank: 85, coach: "Darren Bazeley", record: "TBD", points: "0", groupStage: "G", participations: 2 },
  { name: "Norway", teamName: "Løvene", flag: "no", rank: 31, coach: "Ståle Solbakken", record: "TBD", points: "0", groupStage: "I", participations: 3 },
  { name: "Panama", teamName: "Los Canaleros", flag: "pa", rank: 33, coach: "Thomas Christiansen", record: "TBD", points: "0", groupStage: "L", participations: 1 },
  { name: "Paraguay", teamName: "La Albirroja", flag: "py", rank: 40, coach: "Gustavo Alfaro", record: "TBD", points: "0", groupStage: "D", participations: 8 },
  { name: "Portugal", teamName: "Seleção das Quinas", flag: "pt", rank: 5, coach: "Roberto Martínez", record: "TBD", points: "0", groupStage: "K", participations: 8 },
  { name: "Qatar", teamName: "The Maroons", flag: "qa", rank: 55, coach: "Luís García", record: "TBD", points: "0", groupStage: "B", participations: 1 },
  { name: "Saudi Arabia", teamName: "The Green Falcons", flag: "sa", rank: 61, coach: "Hervé Renard", record: "TBD", points: "0", groupStage: "H", participations: 6 },
  { name: "Scotland", teamName: "Tartan Army", flag: "gb-sct", rank: 43, coach: "Steve Clarke", record: "TBD", points: "0", groupStage: "C", participations: 7 },
  { name: "Senegal", teamName: "Lions of Teranga", flag: "sn", rank: 14, coach: "Aliou Cissé", record: "TBD", points: "0", groupStage: "I", participations: 3 },
  { name: "South Africa", teamName: "Bafana Bafana", flag: "za", rank: 60, coach: "Hugo Broos", record: "TBD", points: "0", groupStage: "A", participations: 3 },
  { name: "Spain", teamName: "La Roja", flag: "es", rank: 2, coach: "Luis de la Fuente", record: "TBD", points: "0", groupStage: "H", participations: 16 },
  { name: "Sweden", teamName: "Blågult", flag: "se", rank: 38, coach: "TBD", record: "TBD", points: "0", groupStage: "F", participations: 12 },
  { name: "Switzerland", teamName: "Nati", flag: "ch", rank: 19, coach: "Murat Yakin", record: "TBD", points: "0", groupStage: "B", participations: 12 },
  { name: "Tunisia", teamName: "Eagles of Carthage", flag: "tn", rank: 44, coach: "Faouzi Benzarti", record: "TBD", points: "0", groupStage: "F", participations: 6 },
  { name: "Türkiye", teamName: "Ay-Yıldızlılar", flag: "tr", rank: 22, coach: "TBD", record: "TBD", points: "0", groupStage: "D", participations: 2 },
  { name: "Uruguay", teamName: "La Celeste", flag: "uy", rank: 17, coach: "Marcelo Bielsa", record: "TBD", points: "0", groupStage: "H", participations: 14 },
  { name: "Uzbekistan", teamName: "White Wolves", flag: "uz", rank: 50, coach: "Srecko Katanec", record: "TBD", points: "0", groupStage: "K", participations: 0 },
];
