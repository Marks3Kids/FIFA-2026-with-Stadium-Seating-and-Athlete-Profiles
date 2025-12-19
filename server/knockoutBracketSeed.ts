import { storage } from "./storage";
import type { InsertKnockoutBracket } from "@shared/schema";

const knockoutBracketData: InsertKnockoutBracket[] = [
  // Round of 32 - Left Side (16 matches)
  { stage: "round_of_32", matchNumber: 1, bracketSide: "left", team1Slot: "Winner Group A", team2Slot: "Runner-up Group H", stadium: "MetLife Stadium", city: "New York/New Jersey", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 2, bracketSide: "left", team1Slot: "Winner Group B", team2Slot: "Runner-up Group G", stadium: "AT&T Stadium", city: "Dallas", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 3, bracketSide: "left", team1Slot: "Winner Group C", team2Slot: "Runner-up Group F", stadium: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 4, bracketSide: "left", team1Slot: "Winner Group D", team2Slot: "Runner-up Group E", stadium: "Hard Rock Stadium", city: "Miami", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 5, bracketSide: "left", team1Slot: "Winner Group E", team2Slot: "Runner-up Group D", stadium: "Estadio Azteca", city: "Mexico City", country: "Mexico", status: "pending" },
  { stage: "round_of_32", matchNumber: 6, bracketSide: "left", team1Slot: "Winner Group F", team2Slot: "Runner-up Group C", stadium: "Estadio BBVA", city: "Monterrey", country: "Mexico", status: "pending" },
  { stage: "round_of_32", matchNumber: 7, bracketSide: "left", team1Slot: "Winner Group G", team2Slot: "Runner-up Group B", stadium: "Estadio Akron", city: "Guadalajara", country: "Mexico", status: "pending" },
  { stage: "round_of_32", matchNumber: 8, bracketSide: "left", team1Slot: "Winner Group H", team2Slot: "Runner-up Group A", stadium: "BC Place", city: "Vancouver", country: "Canada", status: "pending" },
  
  // Round of 32 - Right Side (8 more matches)
  { stage: "round_of_32", matchNumber: 9, bracketSide: "right", team1Slot: "Winner Group I", team2Slot: "Runner-up Group L", stadium: "BMO Field", city: "Toronto", country: "Canada", status: "pending" },
  { stage: "round_of_32", matchNumber: 10, bracketSide: "right", team1Slot: "Winner Group J", team2Slot: "Runner-up Group K", stadium: "Lumen Field", city: "Seattle", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 11, bracketSide: "right", team1Slot: "Winner Group K", team2Slot: "Runner-up Group J", stadium: "Levi's Stadium", city: "San Francisco Bay Area", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 12, bracketSide: "right", team1Slot: "Winner Group L", team2Slot: "Runner-up Group I", stadium: "NRG Stadium", city: "Houston", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 13, bracketSide: "right", team1Slot: "Third Place Group A", team2Slot: "Third Place Group B", stadium: "Mercedes-Benz Stadium", city: "Atlanta", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 14, bracketSide: "right", team1Slot: "Third Place Group C", team2Slot: "Third Place Group D", stadium: "Lincoln Financial Field", city: "Philadelphia", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 15, bracketSide: "right", team1Slot: "Third Place Group E", team2Slot: "Third Place Group F", stadium: "Arrowhead Stadium", city: "Kansas City", country: "USA", status: "pending" },
  { stage: "round_of_32", matchNumber: 16, bracketSide: "right", team1Slot: "Third Place Group G", team2Slot: "Third Place Group H", stadium: "Gillette Stadium", city: "Boston", country: "USA", status: "pending" },

  // Round of 16 - Left Side (8 matches)
  { stage: "round_of_16", matchNumber: 1, bracketSide: "left", team1Slot: "Winner R32 Match 1", team2Slot: "Winner R32 Match 2", stadium: "MetLife Stadium", city: "New York/New Jersey", country: "USA", status: "pending" },
  { stage: "round_of_16", matchNumber: 2, bracketSide: "left", team1Slot: "Winner R32 Match 3", team2Slot: "Winner R32 Match 4", stadium: "AT&T Stadium", city: "Dallas", country: "USA", status: "pending" },
  { stage: "round_of_16", matchNumber: 3, bracketSide: "left", team1Slot: "Winner R32 Match 5", team2Slot: "Winner R32 Match 6", stadium: "Estadio Azteca", city: "Mexico City", country: "Mexico", status: "pending" },
  { stage: "round_of_16", matchNumber: 4, bracketSide: "left", team1Slot: "Winner R32 Match 7", team2Slot: "Winner R32 Match 8", stadium: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "pending" },
  
  // Round of 16 - Right Side
  { stage: "round_of_16", matchNumber: 5, bracketSide: "right", team1Slot: "Winner R32 Match 9", team2Slot: "Winner R32 Match 10", stadium: "Hard Rock Stadium", city: "Miami", country: "USA", status: "pending" },
  { stage: "round_of_16", matchNumber: 6, bracketSide: "right", team1Slot: "Winner R32 Match 11", team2Slot: "Winner R32 Match 12", stadium: "BC Place", city: "Vancouver", country: "Canada", status: "pending" },
  { stage: "round_of_16", matchNumber: 7, bracketSide: "right", team1Slot: "Winner R32 Match 13", team2Slot: "Winner R32 Match 14", stadium: "BMO Field", city: "Toronto", country: "Canada", status: "pending" },
  { stage: "round_of_16", matchNumber: 8, bracketSide: "right", team1Slot: "Winner R32 Match 15", team2Slot: "Winner R32 Match 16", stadium: "Lumen Field", city: "Seattle", country: "USA", status: "pending" },

  // Quarterfinals (4 matches)
  { stage: "quarterfinal", matchNumber: 1, bracketSide: "left", team1Slot: "Winner R16 Match 1", team2Slot: "Winner R16 Match 2", stadium: "MetLife Stadium", city: "New York/New Jersey", country: "USA", status: "pending" },
  { stage: "quarterfinal", matchNumber: 2, bracketSide: "left", team1Slot: "Winner R16 Match 3", team2Slot: "Winner R16 Match 4", stadium: "Estadio Azteca", city: "Mexico City", country: "Mexico", status: "pending" },
  { stage: "quarterfinal", matchNumber: 3, bracketSide: "right", team1Slot: "Winner R16 Match 5", team2Slot: "Winner R16 Match 6", stadium: "SoFi Stadium", city: "Los Angeles", country: "USA", status: "pending" },
  { stage: "quarterfinal", matchNumber: 4, bracketSide: "right", team1Slot: "Winner R16 Match 7", team2Slot: "Winner R16 Match 8", stadium: "AT&T Stadium", city: "Dallas", country: "USA", status: "pending" },

  // Semifinals (2 matches)
  { stage: "semifinal", matchNumber: 1, bracketSide: "left", team1Slot: "Winner QF Match 1", team2Slot: "Winner QF Match 2", stadium: "AT&T Stadium", city: "Dallas", country: "USA", status: "pending" },
  { stage: "semifinal", matchNumber: 2, bracketSide: "right", team1Slot: "Winner QF Match 3", team2Slot: "Winner QF Match 4", stadium: "Hard Rock Stadium", city: "Miami", country: "USA", status: "pending" },

  // Third Place Match
  { stage: "third_place", matchNumber: 1, bracketSide: "center", team1Slot: "Loser SF Match 1", team2Slot: "Loser SF Match 2", stadium: "Hard Rock Stadium", city: "Miami", country: "USA", status: "pending" },

  // Final
  { stage: "final", matchNumber: 1, bracketSide: "center", team1Slot: "Winner SF Match 1", team2Slot: "Winner SF Match 2", stadium: "MetLife Stadium", city: "New York/New Jersey", country: "USA", status: "pending" },
];

export async function seedKnockoutBrackets() {
  console.log("[Knockout Brackets] Starting seed...");
  
  await storage.deleteAllKnockoutBrackets();
  console.log("[Knockout Brackets] Cleared existing brackets");
  
  for (const bracket of knockoutBracketData) {
    await storage.createKnockoutBracket(bracket);
  }
  
  console.log(`[Knockout Brackets] Seeded ${knockoutBracketData.length} bracket matches`);
}
