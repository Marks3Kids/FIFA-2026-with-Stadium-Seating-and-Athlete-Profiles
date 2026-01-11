import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { stripeService } from "./stripeService";
import { getNewsWithAutoRefresh, refreshNewsNow } from "./newsService";
import { getTranslatedNews } from "./translationService";
import { 
  insertTeamSchema, 
  insertCitySchema, 
  insertMatchSchema, 
  insertNewsItemSchema,
  insertTripSchema,
  insertTripTransportationSchema,
  insertTripStaySchema,
  insertTripDiningSchema,
  insertTripMatchSchema,
  insertTripAgendaSchema,
  insertTripDocumentSchema,
  insertTripContactSchema,
  stadiumSectionsQuerySchema,
  playersQuerySchema,
  insertLeadSchema,
  insertWatchHubSubmissionSchema
} from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Simple health check - returns JSON
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
  
  // One-time production database seed - GET shows a page with a button
  app.get("/api/admin/seed-production", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Seed Production Database</title>
        <style>
          body { font-family: system-ui; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
          .container { text-align: center; padding: 40px; background: #1e293b; border-radius: 12px; max-width: 500px; }
          h1 { color: #10b981; margin-bottom: 20px; }
          button { background: #10b981; color: white; border: none; padding: 16px 32px; font-size: 18px; border-radius: 8px; cursor: pointer; }
          button:hover { background: #059669; }
          button:disabled { background: #4b5563; cursor: not-allowed; }
          #result { margin-top: 20px; padding: 16px; border-radius: 8px; }
          .success { background: #065f46; }
          .error { background: #991b1b; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Seed Production Database</h1>
          <p>Click the button below to populate the database with teams, cities, and matches.</p>
          <button id="seedBtn" onclick="seedDatabase()">Seed Database Now</button>
          <div id="result"></div>
        </div>
        <script>
          async function seedDatabase() {
            const btn = document.getElementById('seedBtn');
            const result = document.getElementById('result');
            btn.disabled = true;
            btn.textContent = 'Seeding...';
            try {
              const res = await fetch('/api/admin/seed-production', { method: 'POST' });
              const data = await res.json();
              result.className = 'success';
              result.innerHTML = '<strong>Success!</strong><br>' + JSON.stringify(data, null, 2);
            } catch (err) {
              result.className = 'error';
              result.innerHTML = '<strong>Error:</strong> ' + err.message;
            }
            btn.disabled = false;
            btn.textContent = 'Seed Database Now';
          }
        </script>
      </body>
      </html>
    `);
  });

  // One-time production database seed endpoint
  app.post("/api/admin/seed-production", async (req, res) => {
    try {
      const results: any = { teams: 0, cities: 0, matches: 0, stadiumSections: 0 };
      
      // Check if already seeded
      const existingTeams = await storage.getAllTeams();
      if (existingTeams.length > 0) {
        return res.json({ 
          message: "Database already seeded", 
          existing: { teams: existingTeams.length }
        });
      }
      
      // Seed Teams - All 48 qualified teams
      const teamsData = [
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
        { name: "Jordan", teamName: "Al-Nashama", flag: "jo", rank: 60, coach: "Jamal Sellami", record: "5-3-7", points: "1400.00" },
        { name: "Cape Verde", teamName: "Blue Sharks", flag: "cv", rank: 55, coach: "Bubista", record: "5-4-6", points: "1420.00" },
        { name: "Ghana", teamName: "Black Stars", flag: "gh", rank: 45, coach: "Otto Addo", record: "5-4-6", points: "1470.00" },
        { name: "Curaçao", teamName: "Pais Kòrsou", flag: "cw", rank: 85, coach: "Dick Advocaat", record: "4-3-8", points: "1350.00" },
        { name: "Haiti", teamName: "Les Grenadiers", flag: "ht", rank: 75, coach: "Sébastien Migné", record: "4-4-7", points: "1380.00" },
        { name: "New Zealand", teamName: "All Whites", flag: "nz", rank: 80, coach: "Darren Bazeley", record: "4-3-8", points: "1360.00" },
        { name: "Italy", teamName: "Gli Azzurri", flag: "it", rank: 11, coach: "Luciano Spalletti", record: "8-3-4", points: "1695.00" },
        { name: "Denmark", teamName: "Danish Dynamite", flag: "dk", rank: 26, coach: "Kasper Hjulmand", record: "6-4-5", points: "1600.00" },
        { name: "Serbia", teamName: "Orlovi", flag: "rs", rank: 28, coach: "Dragan Stojković", record: "6-4-5", points: "1580.00" },
        { name: "Poland", teamName: "Biało-czerwoni", flag: "pl", rank: 29, coach: "Michał Probierz", record: "6-3-6", points: "1570.00" },
        { name: "Venezuela", teamName: "La Vinotinto", flag: "ve", rank: 31, coach: "Fernando Batista", record: "6-4-5", points: "1550.00" },
        { name: "Indonesia", teamName: "Garuda", flag: "id", rank: 100, coach: "Shin Tae-yong", record: "4-2-9", points: "1300.00" },
      ];
      
      for (const team of teamsData) {
        try {
          await storage.createTeam(team);
          results.teams++;
        } catch (e) {
          console.log(`Team ${team.name} may already exist`);
        }
      }
      
      // Seed Cities - All 16 host cities with FIFA Tournament Names
      const citiesData = [
        { name: "New York/New Jersey", stadium: "MetLife Stadium", fifaStadiumName: "New York/New Jersey Stadium", capacity: "82500", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16", "Quarterfinal", "Semifinal", "Final"], description: "The largest stadium hosting the tournament, located in East Rutherford. Will host the Final." },
        { name: "Los Angeles", stadium: "SoFi Stadium", fifaStadiumName: "Los Angeles Stadium FIFA", capacity: "70000", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16", "Quarterfinal"], description: "State-of-the-art stadium in Inglewood with a translucent roof." },
        { name: "Dallas", stadium: "AT&T Stadium", fifaStadiumName: "Dallas Stadium FIFA", capacity: "80000", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16"], description: "Home of the Dallas Cowboys with its iconic retractable roof." },
        { name: "Miami", stadium: "Hard Rock Stadium", fifaStadiumName: "Miami Stadium FIFA", capacity: "65000", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16", "Quarterfinal"], description: "Features innovative canopy and Florida's tropical climate." },
        { name: "Atlanta", stadium: "Mercedes-Benz Stadium", fifaStadiumName: "Atlanta Stadium FIFA", capacity: "71000", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16"], description: "Known for its unique retractable roof and fan-friendly pricing." },
        { name: "Seattle", stadium: "Lumen Field", fifaStadiumName: "Seattle Stadium FIFA", capacity: "69000", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16"], description: "Home of the Sounders with stunning Pacific Northwest views." },
        { name: "San Francisco Bay Area", stadium: "Levi's Stadium", fifaStadiumName: "San Francisco Bay Area Stadium", capacity: "68500", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16"], description: "Silicon Valley's high-tech stadium in Santa Clara." },
        { name: "Houston", stadium: "NRG Stadium", fifaStadiumName: "Houston Stadium", capacity: "72000", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16"], description: "Climate-controlled venue with retractable roof." },
        { name: "Philadelphia", stadium: "Lincoln Financial Field", fifaStadiumName: "Philadelphia Stadium", capacity: "69000", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16"], description: "Known for passionate fans and historic surroundings." },
        { name: "Kansas City", stadium: "GEHA Field at Arrowhead Stadium", fifaStadiumName: "Kansas City Stadium FIFA", capacity: "76000", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16"], description: "The Soccer Capital of America & The Heart of the Tournament." },
        { name: "Boston", stadium: "Gillette Stadium", fifaStadiumName: "Boston Stadium FIFA", capacity: "65000", country: "USA", matches: ["Group Stage", "Round of 32", "Round of 16"], description: "Located in Foxborough with the Patriot Place entertainment complex." },
        { name: "Toronto", stadium: "BMO Field", fifaStadiumName: "Toronto Stadium", capacity: "45000", country: "Canada", matches: ["Group Stage", "Round of 32", "Round of 16"], description: "Intimate soccer-specific stadium with expansion for World Cup." },
        { name: "Vancouver", stadium: "BC Place", fifaStadiumName: "Vancouver Stadium", capacity: "54500", country: "Canada", matches: ["Group Stage", "Round of 32"], description: "Features a cable-supported retractable roof with waterfront views." },
        { name: "Guadalajara", stadium: "Estadio Akron", fifaStadiumName: "Estadio Guadalajara", capacity: "49850", country: "Mexico", matches: ["Group Stage", "Round of 32"], description: "Modern stadium known for its volcanic rock design." },
        { name: "Monterrey", stadium: "Estadio BBVA", fifaStadiumName: "Estadio Monterrey", capacity: "53500", country: "Mexico", matches: ["Group Stage", "Round of 32"], description: "Stunning mountain backdrop with modern facilities." },
        { name: "Mexico City", stadium: "Estadio Azteca", fifaStadiumName: "Estadio Ciudad de México", capacity: "87000", country: "Mexico", matches: ["Group Stage", "Round of 32", "Round of 16", "Quarterfinal"], description: "Legendary venue that hosted two World Cup Finals (1970, 1986)." },
      ];
      
      for (const city of citiesData) {
        try {
          await storage.createCity(city);
          results.cities++;
        } catch (e) {
          console.log(`City ${city.name} may already exist`);
        }
      }
      
      // Seed some Group Stage Matches
      const matchesData = [
        { team1: "Mexico", team2: "TBD", stage: "Group Stage", date: "June 11, 2026", time: "6:00 PM CT", stadium: "Estadio Azteca", city: "Mexico City" },
        { team1: "USA", team2: "TBD", stage: "Group Stage", date: "June 11, 2026", time: "9:00 PM ET", stadium: "MetLife Stadium", city: "New York/New Jersey" },
        { team1: "Canada", team2: "TBD", stage: "Group Stage", date: "June 12, 2026", time: "6:00 PM ET", stadium: "BMO Field", city: "Toronto" },
        { team1: "Argentina", team2: "TBD", stage: "Group Stage", date: "June 13, 2026", time: "3:00 PM ET", stadium: "Hard Rock Stadium", city: "Miami" },
        { team1: "Spain", team2: "TBD", stage: "Group Stage", date: "June 13, 2026", time: "6:00 PM PT", stadium: "SoFi Stadium", city: "Los Angeles" },
        { team1: "France", team2: "TBD", stage: "Group Stage", date: "June 14, 2026", time: "3:00 PM CT", stadium: "AT&T Stadium", city: "Dallas" },
        { team1: "England", team2: "TBD", stage: "Group Stage", date: "June 14, 2026", time: "6:00 PM PT", stadium: "Levi's Stadium", city: "San Francisco Bay Area" },
        { team1: "Germany", team2: "TBD", stage: "Group Stage", date: "June 15, 2026", time: "3:00 PM ET", stadium: "Mercedes-Benz Stadium", city: "Atlanta" },
        { team1: "Brazil", team2: "TBD", stage: "Group Stage", date: "June 15, 2026", time: "6:00 PM CT", stadium: "NRG Stadium", city: "Houston" },
        { team1: "Portugal", team2: "TBD", stage: "Group Stage", date: "June 16, 2026", time: "3:00 PM CT", stadium: "Arrowhead Stadium", city: "Kansas City" },
      ];
      
      for (const match of matchesData) {
        try {
          await storage.createMatch(match);
          results.matches++;
        } catch (e) {
          console.log(`Match ${match.team1} vs ${match.team2} may already exist`);
        }
      }
      
      console.log("Production database seeded:", results);
      res.json({ 
        success: true, 
        message: "Production database seeded successfully!",
        results 
      });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  // Seed players endpoint - GET shows page with button
  app.get("/api/admin/seed-players", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Seed Players Database</title>
        <style>
          body { font-family: system-ui; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
          .container { text-align: center; padding: 40px; background: #1e293b; border-radius: 12px; max-width: 500px; }
          h1 { color: #10b981; margin-bottom: 20px; }
          button { background: #10b981; color: white; border: none; padding: 16px 32px; font-size: 18px; border-radius: 8px; cursor: pointer; }
          button:hover { background: #059669; }
          button:disabled { background: #4b5563; cursor: not-allowed; }
          #result { margin-top: 20px; padding: 16px; border-radius: 8px; white-space: pre-wrap; }
          .success { background: #065f46; }
          .error { background: #991b1b; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Seed Players Database</h1>
          <p>Click the button below to add 43 star players from major teams (Messi, Mbappé, Kane, Ronaldo, etc.)</p>
          <button id="seedBtn" onclick="seedPlayers()">Seed Players Now</button>
          <div id="result"></div>
        </div>
        <script>
          async function seedPlayers() {
            const btn = document.getElementById('seedBtn');
            const result = document.getElementById('result');
            btn.disabled = true;
            btn.textContent = 'Seeding...';
            try {
              const res = await fetch('/api/admin/seed-players', { method: 'POST' });
              const data = await res.json();
              result.className = 'success';
              result.innerHTML = '<strong>Success!</strong>\\n' + JSON.stringify(data, null, 2);
            } catch (err) {
              result.className = 'error';
              result.innerHTML = '<strong>Error:</strong> ' + err.message;
            }
            btn.disabled = false;
            btn.textContent = 'Seed Players Now';
          }
        </script>
      </body>
      </html>
    `);
  });

  // Seed players endpoint - POST actually seeds
  app.post("/api/admin/seed-players", async (req, res) => {
    try {
      // Check if players already exist
      const existingPlayers = await storage.getPlayersByTeam(1);
      if (existingPlayers && existingPlayers.length > 0) {
        const allPlayers = await storage.getAllPlayers?.() || [];
        return res.json({ 
          message: "Players already seeded", 
          existing: { players: allPlayers.length || existingPlayers.length }
        });
      }

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
      let seededCount = 0;
      
      for (const player of validPlayers) {
        try {
          await storage.createPlayer(player as any);
          seededCount++;
        } catch (e) {
          console.log(`Player ${player.name} may already exist`);
        }
      }

      console.log(`Seeded ${seededCount} players`);
      res.json({ 
        success: true, 
        message: `Players seeded successfully!`,
        results: { players: seededCount }
      });
    } catch (error) {
      console.error("Seed players error:", error);
      res.status(500).json({ error: "Failed to seed players" });
    }
  });

  // Update existing cities with FIFA stadium names
  app.post("/api/admin/update-fifa-names", async (req, res) => {
    try {
      const fifaNameMappings = [
        { cityName: "New York/New Jersey", fifaStadiumName: "New York/New Jersey Stadium" },
        { cityName: "Los Angeles", fifaStadiumName: "Los Angeles Stadium FIFA" },
        { cityName: "Dallas", fifaStadiumName: "Dallas Stadium FIFA" },
        { cityName: "Miami", fifaStadiumName: "Miami Stadium FIFA" },
        { cityName: "Atlanta", fifaStadiumName: "Atlanta Stadium FIFA" },
        { cityName: "Seattle", fifaStadiumName: "Seattle Stadium FIFA" },
        { cityName: "San Francisco Bay Area", fifaStadiumName: "San Francisco Bay Area Stadium" },
        { cityName: "Houston", fifaStadiumName: "Houston Stadium" },
        { cityName: "Philadelphia", fifaStadiumName: "Philadelphia Stadium" },
        { cityName: "Kansas City", fifaStadiumName: "Kansas City Stadium FIFA" },
        { cityName: "Boston", fifaStadiumName: "Boston Stadium FIFA" },
        { cityName: "Toronto", fifaStadiumName: "Toronto Stadium" },
        { cityName: "Vancouver", fifaStadiumName: "Vancouver Stadium" },
        { cityName: "Guadalajara", fifaStadiumName: "Estadio Guadalajara" },
        { cityName: "Monterrey", fifaStadiumName: "Estadio Monterrey" },
        { cityName: "Mexico City", fifaStadiumName: "Estadio Ciudad de México" },
      ];

      let updated = 0;
      for (const mapping of fifaNameMappings) {
        const result = await storage.updateCityFifaName(mapping.cityName, mapping.fifaStadiumName);
        if (result) updated++;
      }

      res.json({ 
        success: true, 
        message: `Updated ${updated} cities with FIFA stadium names`,
        updated 
      });
    } catch (error) {
      console.error("Update FIFA names error:", error);
      res.status(500).json({ error: "Failed to update FIFA names" });
    }
  });
  
  // Teams API
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const team = await storage.getTeam(id);
      if (!team) {
        return res.status(404).json({ error: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch team" });
    }
  });

  app.post("/api/teams", async (req, res) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validatedData);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ error: "Invalid team data" });
    }
  });

  // Cities API
  app.get("/api/cities", async (req, res) => {
    try {
      const cities = await storage.getAllCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cities" });
    }
  });

  app.get("/api/cities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const city = await storage.getCity(id);
      if (!city) {
        return res.status(404).json({ error: "City not found" });
      }
      res.json(city);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch city" });
    }
  });

  app.post("/api/cities", async (req, res) => {
    try {
      const validatedData = insertCitySchema.parse(req.body);
      const city = await storage.createCity(validatedData);
      res.status(201).json(city);
    } catch (error) {
      res.status(400).json({ error: "Invalid city data" });
    }
  });

  // Matches API
  app.get("/api/matches", async (req, res) => {
    try {
      const { stage, locale } = req.query;
      let matches;
      
      if (stage && typeof stage === "string") {
        matches = await storage.getMatchesByStage(stage);
      } else {
        matches = await storage.getAllMatches();
      }
      
      // If locale is provided and not English, translate team names
      if (locale && locale !== "en" && typeof locale === "string") {
        const { translateMatches } = await import("./translationService");
        const translatedMatches = await translateMatches(matches, locale);
        return res.json(translatedMatches);
      }
      
      res.json(matches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const validatedData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validatedData);
      res.status(201).json(match);
    } catch (error) {
      res.status(400).json({ error: "Invalid match data" });
    }
  });

  // Knockout Brackets API
  app.get("/api/knockout-brackets", async (req, res) => {
    try {
      const { stage, locale } = req.query;
      let brackets;
      
      if (stage && typeof stage === "string") {
        brackets = await storage.getKnockoutBracketsByStage(stage);
      } else {
        brackets = await storage.getAllKnockoutBrackets();
      }
      
      // If locale is provided and not English, translate the slot names
      if (locale && locale !== "en" && typeof locale === "string") {
        const { translateKnockoutBrackets } = await import("./translationService");
        const translatedBrackets = await translateKnockoutBrackets(brackets, locale);
        return res.json(translatedBrackets);
      }
      
      res.json(brackets);
    } catch (error) {
      console.error("Error fetching knockout brackets:", error);
      res.status(500).json({ error: "Failed to fetch knockout brackets" });
    }
  });

  app.post("/api/knockout-brackets/seed", async (req, res) => {
    try {
      const { seedKnockoutBrackets } = await import("./knockoutBracketSeed");
      await seedKnockoutBrackets();
      res.json({ success: true, message: "Knockout brackets seeded successfully" });
    } catch (error) {
      console.error("Error seeding knockout brackets:", error);
      res.status(500).json({ error: "Failed to seed knockout brackets" });
    }
  });

  // News API - Auto-refreshing from RSS feeds with translation support
  app.get("/api/news", async (req, res) => {
    try {
      let limit = 3;
      if (req.query.limit) {
        const parsed = parseInt(req.query.limit as string, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 10) {
          limit = parsed;
        }
      }
      
      const locale = (req.query.locale as string) || "en";
      const news = await getNewsWithAutoRefresh(limit);
      
      if (locale !== "en") {
        const translatedNews = await getTranslatedNews(news, locale);
        return res.json(translatedNews);
      }
      
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  app.post("/api/news/refresh", async (req, res) => {
    try {
      await refreshNewsNow();
      res.json({ success: true, message: "News refreshed successfully" });
    } catch (error) {
      console.error("Error refreshing news:", error);
      res.status(500).json({ error: "Failed to refresh news" });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const validatedData = insertNewsItemSchema.parse(req.body);
      const newsItem = await storage.createNewsItem(validatedData);
      res.status(201).json(newsItem);
    } catch (error) {
      res.status(400).json({ error: "Invalid news data" });
    }
  });

  // Trips API
  app.get("/api/trips", async (req, res) => {
    try {
      const trips = await storage.getAllTrips();
      res.json(trips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const trip = await storage.getTrip(id);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trip" });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const validatedData = insertTripSchema.parse(req.body);
      const trip = await storage.createTrip(validatedData);
      res.status(201).json(trip);
    } catch (error) {
      res.status(400).json({ error: "Invalid trip data" });
    }
  });

  app.patch("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid trip ID" });
      }
      const validatedData = insertTripSchema.partial().parse(req.body);
      const trip = await storage.updateTrip(id, validatedData);
      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }
      res.json(trip);
    } catch (error) {
      res.status(400).json({ error: "Failed to update trip" });
    }
  });

  app.delete("/api/trips/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid trip ID" });
      }
      await storage.deleteTrip(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete trip" });
    }
  });

  // Trip Transportation
  app.get("/api/trips/:tripId/transportation", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripTransportation(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transportation" });
    }
  });

  app.post("/api/trips/:tripId/transportation", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripTransportationSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripTransportation(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid transportation data" });
    }
  });

  app.delete("/api/transportation/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripTransportation(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transportation" });
    }
  });

  // Trip Stays
  app.get("/api/trips/:tripId/stays", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripStays(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stays" });
    }
  });

  app.post("/api/trips/:tripId/stays", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripStaySchema.parse({ ...req.body, tripId });
      const item = await storage.createTripStay(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid stay data" });
    }
  });

  app.delete("/api/stays/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripStay(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete stay" });
    }
  });

  // Trip Dining
  app.get("/api/trips/:tripId/dining", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripDining(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dining" });
    }
  });

  app.post("/api/trips/:tripId/dining", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripDiningSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripDining(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid dining data" });
    }
  });

  app.delete("/api/dining/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripDining(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete dining" });
    }
  });

  // Trip Matches
  app.get("/api/trips/:tripId/matches", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripMatches(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch matches" });
    }
  });

  app.post("/api/trips/:tripId/matches", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripMatchSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripMatch(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid match data" });
    }
  });

  app.delete("/api/trip-matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripMatch(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete match" });
    }
  });

  // Trip Agenda
  app.get("/api/trips/:tripId/agenda", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripAgenda(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agenda" });
    }
  });

  app.post("/api/trips/:tripId/agenda", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripAgendaSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripAgenda(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid agenda data" });
    }
  });

  app.delete("/api/agenda/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripAgenda(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete agenda item" });
    }
  });

  // Trip Documents
  app.get("/api/trips/:tripId/documents", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripDocuments(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/trips/:tripId/documents", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripDocumentSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripDocument(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid document data" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripDocument(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  // Trip Contacts
  app.get("/api/trips/:tripId/contacts", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const items = await storage.getTripContacts(tripId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  app.post("/api/trips/:tripId/contacts", async (req, res) => {
    try {
      const tripId = parseInt(req.params.tripId);
      const validatedData = insertTripContactSchema.parse({ ...req.body, tripId });
      const item = await storage.createTripContact(validatedData);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID" });
      }
      await storage.deleteTripContact(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  // Currency Exchange API
  interface ExchangeRates {
    base: string;
    date: string;
    rates: Record<string, number>;
    lastFetched: number;
  }

  let cachedRates: ExchangeRates | null = null;
  const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  app.get("/api/currency/rates", async (req, res) => {
    try {
      const now = Date.now();
      
      // Return cached rates if still valid
      if (cachedRates && (now - cachedRates.lastFetched) < CACHE_DURATION) {
        return res.json(cachedRates);
      }

      // Fetch fresh rates from Frankfurter API (free, no API key required)
      // Note: Don't include USD in target list since it's the base currency
      const currencies = "EUR,GBP,CAD,MXN,JPY,CNY,AUD,BRL,ARS,KRW,CHF,INR,SAR,AED,QAR";
      const response = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${currencies}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }

      const data = await response.json();
      
      // USD is the base, so its rate is always 1
      cachedRates = {
        base: "USD",
        date: data.date,
        rates: { USD: 1, ...data.rates },
        lastFetched: now
      };

      res.json(cachedRates);
    } catch (error) {
      console.error("Currency API error:", error);
      
      // Return cached rates even if expired, as fallback
      if (cachedRates) {
        return res.json({ ...cachedRates, stale: true });
      }
      
      res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
  });

  // AI Concierge API
  const SYSTEM_PROMPT = `You are the Championship Concierge AI assistant for the 2026 World Cup. You are a helpful, knowledgeable, and friendly assistant that helps visitors plan their World Cup experience across the United States, Canada, and Mexico.

You have expertise in:
- All 16 host cities: New York/New Jersey (MetLife Stadium), Los Angeles (SoFi Stadium), Dallas (AT&T Stadium), Miami (Hard Rock Stadium), Atlanta (Mercedes-Benz Stadium), Seattle (Lumen Field), San Francisco Bay Area (Levi's Stadium), Houston (NRG Stadium), Philadelphia (Lincoln Financial Field), Kansas City (Arrowhead Stadium), Boston (Gillette Stadium), Toronto (BMO Field), Vancouver (BC Place), Guadalajara (Estadio Akron), Monterrey (Estadio BBVA), and Mexico City (Estadio Azteca)
- All 48 qualified teams and the tournament format
- Transportation options including flights, trains, buses, and car rentals
- Lodging recommendations across all price ranges
- Local dining and entertainment
- Visa and entry requirements for the USA, Canada, and Mexico
- Stadium policies and prohibited items
- Safety information for each host city
- TV broadcasting schedules and streaming options

Be concise but thorough. Use a warm, professional tone. When recommending places or services, mention price ranges when relevant. If you don't know something specific, be honest but try to point the user in the right direction.

Format your responses with clear structure when appropriate:
- Use bullet points for lists
- Bold key information using **text**
- Keep paragraphs short for mobile readability

Remember: You're helping fans have the best World Cup experience of their lives!`;

  app.post("/api/concierge/chat", async (req, res) => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        return res.status(503).json({ error: "AI Concierge is not configured. Please set up OpenAI API key." });
      }
      
      const { messages, email } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required" });
      }

      if (!email) {
        return res.status(400).json({ error: "Email is required for message tracking" });
      }

      const { canSendMessage, incrementMessageCount, getMessageUsage } = await import("./aiMessageService");
      
      const canSend = await canSendMessage(email);
      if (!canSend) {
        const usage = await getMessageUsage(email);
        return res.status(403).json({ 
          error: "Message limit reached. Purchase additional messages to continue.",
          limitReached: true,
          usage
        });
      }

      const incrementResult = await incrementMessageCount(email);
      if (!incrementResult.success) {
        return res.status(403).json({ 
          error: incrementResult.error,
          limitReached: true
        });
      }

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 1024,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
      const usage = await getMessageUsage(email);
      res.json({ reply, usage });
    } catch (error: any) {
      console.error("Concierge API error:", error);
      if (error?.status === 401) {
        return res.status(500).json({ error: "API key configuration error" });
      }
      res.status(500).json({ error: "Failed to get response from AI" });
    }
  });

  // Stripe Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await stripeService.listProducts();
      res.json({ data: products });
    } catch (error) {
      console.error("Products API error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products-with-prices", async (req, res) => {
    try {
      const rows = await stripeService.listProductsWithPrices();
      
      const productsMap = new Map<string, any>();
      for (const row of rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
          });
        }
      }

      res.json({ data: Array.from(productsMap.values()) });
    } catch (error) {
      console.error("Products with prices API error:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  // Stripe Checkout Session
  app.post("/api/checkout", async (req, res) => {
    try {
      const { priceId, email } = req.body;
      
      if (!priceId) {
        return res.status(400).json({ error: "Price ID is required" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      let customerId: string | undefined;

      // If email provided, try to find or create customer
      if (email) {
        const user = await storage.getUserByEmail(email);
        if (user && user.stripeCustomerId) {
          customerId = user.stripeCustomerId;
        } else {
          const customer = await stripeService.createCustomer(email, user?.id ? parseInt(user.id) : 0);
          customerId = customer.id;
          if (user) {
            await storage.updateUserStripeInfo(user.id, { stripeCustomerId: customerId });
          }
        }
      }

      // Create checkout session (customer optional - Stripe will collect email)
      const session = await stripeService.createCheckoutSessionWithOptionalCustomer(
        priceId,
        `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/pricing`,
        customerId
      );

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Checkout API error:", error);
      const errorMessage = error?.message || String(error);
      res.status(500).json({ 
        error: "Failed to create checkout session", 
        details: errorMessage 
      });
    }
  });

  // Customer Portal
  app.post("/api/customer-portal", async (req, res) => {
    try {
      const { customerId } = req.body;
      
      if (!customerId) {
        return res.status(400).json({ error: "Customer ID is required" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const session = await stripeService.createCustomerPortalSession(
        customerId,
        `${baseUrl}/`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Customer portal API error:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  // Verify checkout session and save purchase
  app.get("/api/checkout/verify", async (req, res) => {
    try {
      const sessionId = req.query.session_id as string;
      
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }

      const session = await stripeService.retrieveCheckoutSession(sessionId);
      
      if (session.payment_status === "paid") {
        const email = session.customer_email || session.customer_details?.email;
        const priceId = (session as any).line_items?.data?.[0]?.price?.id;
        const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
        
        // Map price IDs to subscription tiers (includes both test and live IDs)
        const priceToTierMap: Record<string, string> = {
          // Live price IDs
          "price_1SoSQYKAEwbrdBYlW0kPI4ww": "team_info",
          "price_1SoSSoKAEwbrdBYlphO1lVDx": "logistics", 
          "price_1SoSU6KAEwbrdBYloERNzAzQ": "ai_concierge",
          "price_1SoSVEKAEwbrdBYlYWUlAyJU": "ai_concierge", // Message pack
          // Test/Sandbox price IDs (for development)
          "price_1Sn6eHEwO7dpbt1eB8PGVFhA": "team_info",
          "price_1Sn6kREwO7dpbt1eKfbFJrIq": "logistics", 
          "price_1Sn6ovEwO7dpbt1eXZ45C5pP": "ai_concierge",
          "price_1Sn8dSEwO7dpbt1e9m1RS1cb": "ai_concierge",
        };
        
        const tier = priceToTierMap[priceId] || "team_info";
        
        if (email && priceId) {
          const existingPurchase = await storage.getPurchaseByEmail(email);
          if (!existingPurchase) {
            await storage.createPurchase({
              email,
              tier,
              priceId,
              stripeCustomerId: customerId || null,
              stripeSessionId: sessionId,
            });
          } else {
            // Upgrade tier if new tier is higher
            const tierHierarchy = ["free", "team_info", "logistics", "ai_concierge"];
            const currentTierIndex = tierHierarchy.indexOf(existingPurchase.tier);
            const newTierIndex = tierHierarchy.indexOf(tier);
            if (newTierIndex > currentTierIndex) {
              await storage.updatePurchaseTier(email, tier);
            }
          }
        }
        
        res.json({ 
          success: true, 
          email,
          priceId,
          tier,
          customerId
        });
      } else {
        res.json({ success: false });
      }
    } catch (error) {
      console.error("Checkout verify error:", error);
      res.status(500).json({ error: "Failed to verify session" });
    }
  });

  // Verify subscription (with tier)
  app.get("/api/subscription/verify", async (req, res) => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        return res.json({ valid: false });
      }

      const purchase = await storage.getPurchaseByEmail(email);
      
      if (!purchase) {
        return res.json({ valid: false });
      }

      res.json({ 
        valid: true,
        tier: purchase.tier,
        purchasedAt: purchase.purchasedAt
      });
    } catch (error) {
      console.error("Subscription verify error:", error);
      res.json({ valid: false });
    }
  });

  // Check subscription status
  app.get("/api/subscription/check", async (req, res) => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        return res.json({ hasActiveSubscription: false });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user || !user.stripeCustomerId) {
        return res.json({ hasActiveSubscription: false });
      }

      const subscriptions = await stripeService.getCustomerSubscriptions(user.stripeCustomerId);
      const hasActiveSubscription = subscriptions.length > 0;

      res.json({ 
        hasActiveSubscription,
        subscriptionStatus: user.subscriptionStatus
      });
    } catch (error) {
      console.error("Subscription check error:", error);
      res.json({ hasActiveSubscription: false });
    }
  });

  // Players API
  app.get("/api/players", async (req, res) => {
    try {
      const query = playersQuerySchema.safeParse(req.query);
      if (!query.success) {
        return res.status(400).json({ error: "Invalid query parameters" });
      }
      if (query.data.teamId) {
        const players = await storage.getPlayersByTeam(parseInt(query.data.teamId));
        return res.json(players);
      }
      const players = await storage.getAllPlayers();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch players" });
    }
  });

  app.get("/api/players/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayer(id);
      if (!player) {
        return res.status(404).json({ error: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch player" });
    }
  });

  // Tournament History API
  app.get("/api/history", async (req, res) => {
    try {
      const history = await storage.getAllTournamentHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournament history" });
    }
  });

  app.get("/api/history/:year", async (req, res) => {
    try {
      const year = parseInt(req.params.year);
      const tournament = await storage.getTournamentByYear(year);
      if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tournament" });
    }
  });

  // Stadium Sections API
  app.get("/api/stadiums/sections", async (req, res) => {
    try {
      const query = stadiumSectionsQuerySchema.safeParse(req.query);
      if (!query.success) {
        return res.status(400).json({ error: "Invalid query parameters" });
      }
      if (query.data.stadium) {
        const sections = await storage.getStadiumSections(query.data.stadium);
        return res.json(sections);
      }
      const sections = await storage.getAllStadiumSections();
      res.json(sections);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stadium sections" });
    }
  });

  // Email Leads API (for free bracket downloads)
  app.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      res.status(201).json({ success: true, id: lead.id });
    } catch (error) {
      console.error("Failed to save lead:", error);
      res.status(400).json({ error: "Invalid lead data" });
    }
  });

  // Admin: Get all leads
  app.get("/api/admin/leads", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      res.json(leads);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Admin: Export leads as CSV
  app.get("/api/admin/leads/export", async (req, res) => {
    try {
      const leads = await storage.getAllLeads();
      const csvHeader = "ID,Name,Email,City,Source,Created At\n";
      const csvRows = leads.map(lead => 
        `${lead.id},"${lead.name || ''}","${lead.email}","${lead.city || ''}","${lead.source || ''}","${lead.createdAt}"`
      ).join("\n");
      const csv = csvHeader + csvRows;
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Failed to export leads:", error);
      res.status(500).json({ error: "Failed to export leads" });
    }
  });

  // Weather API (using OpenWeatherMap)
  const CITY_COORDINATES: Record<string, { lat: number; lon: number; name: string }> = {
    kansasCity: { lat: 39.0997, lon: -94.5786, name: 'Kansas City' },
    newYork: { lat: 40.7128, lon: -74.0060, name: 'New York' },
    losAngeles: { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
    miami: { lat: 25.7617, lon: -80.1918, name: 'Miami' },
    dallas: { lat: 32.7767, lon: -96.7970, name: 'Dallas' },
    houston: { lat: 29.7604, lon: -95.3698, name: 'Houston' },
    atlanta: { lat: 33.7490, lon: -84.3880, name: 'Atlanta' },
    philadelphia: { lat: 39.9526, lon: -75.1652, name: 'Philadelphia' },
    seattle: { lat: 47.6062, lon: -122.3321, name: 'Seattle' },
    boston: { lat: 42.3601, lon: -71.0589, name: 'Boston' },
    sanFrancisco: { lat: 37.7749, lon: -122.4194, name: 'San Francisco' },
    toronto: { lat: 43.6532, lon: -79.3832, name: 'Toronto' },
    vancouver: { lat: 49.2827, lon: -123.1207, name: 'Vancouver' },
    mexicoCity: { lat: 19.4326, lon: -99.1332, name: 'Mexico City' },
    guadalajara: { lat: 20.6597, lon: -103.3496, name: 'Guadalajara' },
    monterrey: { lat: 25.6866, lon: -100.3161, name: 'Monterrey' },
  };

  app.get("/api/weather/:cityKey", async (req, res) => {
    try {
      const { cityKey } = req.params;
      const cityCoords = CITY_COORDINATES[cityKey];
      
      if (!cityCoords) {
        return res.status(404).json({ error: "City not found" });
      }

      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        // Return simulated weather data if no API key (for demo purposes)
        const baseTemp = getSimulatedTemperature(cityKey);
        return res.json({
          city: cityCoords.name,
          temperature: Math.round((baseTemp - 32) * 5/9),
          temperatureF: baseTemp,
          description: 'Clear sky',
          humidity: 65,
          feelsLike: Math.round((baseTemp + 3 - 32) * 5/9),
          feelsLikeF: baseTemp + 3,
          icon: '01d',
          simulated: true,
        });
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${cityCoords.lat}&lon=${cityCoords.lon}&appid=${apiKey}&units=imperial`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Weather API error');
      }
      
      const data = await response.json();
      
      res.json({
        city: cityCoords.name,
        temperature: Math.round((data.main.temp - 32) * 5/9),
        temperatureF: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        feelsLike: Math.round((data.main.feels_like - 32) * 5/9),
        feelsLikeF: Math.round(data.main.feels_like),
        icon: data.weather[0].icon,
      });
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather" });
    }
  });

  // Game Day alerts - get upcoming matches
  app.get("/api/gameday/upcoming", async (req, res) => {
    try {
      const hours = parseInt(req.query.hours as string) || 24;
      const matches = await storage.getAllMatches();
      
      const now = new Date();
      const cutoff = new Date(now.getTime() + hours * 60 * 60 * 1000);
      
      const upcoming = matches.filter(match => {
        if (!match.date || !match.time) return false;
        const matchDateTime = new Date(`${match.date}T${match.time}`);
        return matchDateTime > now && matchDateTime <= cutoff;
      }).map(match => {
        const matchDateTime = new Date(`${match.date}T${match.time}`);
        return {
          ...match,
          hoursUntilKickoff: Math.round((matchDateTime.getTime() - now.getTime()) / (60 * 60 * 1000)),
        };
      });

      res.json(upcoming);
    } catch (error) {
      console.error("Failed to fetch upcoming matches:", error);
      res.status(500).json({ error: "Failed to fetch upcoming matches" });
    }
  });

  // Match results - get finished matches with scores
  // Since the tournament hasn't started yet, this returns simulated results for demo/testing
  app.get("/api/matches/results", async (req, res) => {
    try {
      const matches = await storage.getAllMatches();
      
      // For demo purposes, simulate some finished matches from past dates
      // In production, this would integrate with a live sports API
      const now = new Date();
      const results = matches
        .filter(match => {
          if (!match.date) return false;
          const matchDate = new Date(match.date);
          // Return matches from before today as "finished"
          return matchDate < now;
        })
        .slice(0, 10) // Limit to 10 for demo
        .map((match, index) => ({
          matchId: match.id,
          homeTeam: match.team1,
          awayTeam: match.team2,
          homeScore: Math.floor(Math.random() * 4),
          awayScore: Math.floor(Math.random() * 4),
          status: 'finished' as const,
          venue: match.stadium,
          city: match.city,
          date: match.date,
          time: match.time,
        }));

      res.json(results);
    } catch (error) {
      console.error("Failed to fetch match results:", error);
      res.status(500).json({ error: "Failed to fetch match results" });
    }
  });

  // Watch Hub Venues API
  app.get("/api/watch-hubs/venues", async (req, res) => {
    try {
      const { countryCode, hostCityKey } = req.query;
      let venues;
      
      if (countryCode && typeof countryCode === "string") {
        venues = await storage.getWatchHubVenuesByCountry(countryCode);
      } else if (hostCityKey && typeof hostCityKey === "string") {
        venues = await storage.getWatchHubVenuesByHostCity(hostCityKey);
      } else {
        venues = await storage.getAllWatchHubVenues();
      }
      
      res.json(venues);
    } catch (error) {
      console.error("Failed to fetch watch hub venues:", error);
      res.status(500).json({ error: "Failed to fetch venues" });
    }
  });

  // Watch Hub Submissions - Submit a new venue
  app.post("/api/watch-hubs/submissions", async (req, res) => {
    try {
      const validatedData = insertWatchHubSubmissionSchema.parse({
        ...req.body,
        status: "pending"
      });
      const submission = await storage.createWatchHubSubmission(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Thank you! Your venue submission is pending review.",
        submission 
      });
    } catch (error: any) {
      console.error("Failed to submit watch hub venue:", error);
      res.status(400).json({ error: error.message || "Invalid submission data" });
    }
  });

  // Admin: Get all submissions (pending only by default)
  app.get("/api/watch-hubs/submissions", async (req, res) => {
    try {
      const { status } = req.query;
      let submissions;
      
      if (status === "all") {
        submissions = await storage.getAllWatchHubSubmissions();
      } else {
        submissions = await storage.getPendingWatchHubSubmissions();
      }
      
      res.json(submissions);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // Admin: Approve a submission
  app.post("/api/watch-hubs/submissions/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid submission ID" });
      }
      
      const venue = await storage.approveWatchHubSubmission(id);
      if (!venue) {
        return res.status(404).json({ error: "Submission not found or already processed" });
      }
      
      res.json({ success: true, venue });
    } catch (error) {
      console.error("Failed to approve submission:", error);
      res.status(500).json({ error: "Failed to approve submission" });
    }
  });

  // Admin: Reject a submission
  app.post("/api/watch-hubs/submissions/:id/reject", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { notes } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid submission ID" });
      }
      
      const submission = await storage.rejectWatchHubSubmission(id, notes || "");
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      
      res.json({ success: true, submission });
    } catch (error) {
      console.error("Failed to reject submission:", error);
      res.status(500).json({ error: "Failed to reject submission" });
    }
  });

  // AI Message Usage endpoints
  const { getMessageUsage, addBonusMessages, MESSAGE_PACK_PRODUCT_ID } = await import("./aiMessageService");

  app.get("/api/ai-messages/usage", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const usage = await getMessageUsage(email);
      res.json(usage);
    } catch (error) {
      console.error("Failed to get message usage:", error);
      res.status(500).json({ error: "Failed to get message usage" });
    }
  });

  app.post("/api/ai-messages/create-checkout", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const products = await stripeService.listProductsWithPrices(true);
      const messagePackProduct = products.find((p: any) => p.product_id === MESSAGE_PACK_PRODUCT_ID);
      
      if (!messagePackProduct) {
        return res.status(404).json({ error: "Message pack product not found" });
      }

      const priceId = messagePackProduct.price_id as string;
      
      let customer;
      const existingPurchase = await storage.getPurchaseByEmail(email);
      if (existingPurchase?.stripeCustomerId) {
        customer = { id: existingPurchase.stripeCustomerId };
      } else {
        customer = await stripeService.createCustomer(email, 0);
      }

      const session = await stripeService.createCheckoutSession(
        customer.id,
        priceId,
        `${req.protocol}://${req.get("host")}/concierge?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
        `${req.protocol}://${req.get("host")}/concierge?purchase=cancelled`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Failed to create message pack checkout:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/ai-messages/add-bonus", async (req, res) => {
    try {
      const { email, sessionId } = req.body;
      if (!email || !sessionId) {
        return res.status(400).json({ error: "Email and session ID are required" });
      }

      const { isSessionAlreadyUsed } = await import("./aiMessageService");
      const alreadyUsed = await isSessionAlreadyUsed(sessionId);
      if (alreadyUsed) {
        return res.status(409).json({ error: "Session already processed", alreadyProcessed: true });
      }

      const session = await stripeService.retrieveCheckoutSessionWithProduct(sessionId);
      
      if (!session || session.payment_status !== 'paid') {
        return res.status(400).json({ error: "Invalid or unpaid session" });
      }

      const sessionEmail = session.customer_details?.email;
      if (!sessionEmail) {
        return res.status(400).json({ error: "Session has no associated email" });
      }
      if (sessionEmail.toLowerCase() !== email.toLowerCase()) {
        return res.status(403).json({ error: "Session email mismatch" });
      }

      const lineItems = session.line_items?.data || [];
      const isMessagePack = lineItems.some((item: any) => {
        const productId = typeof item.price?.product === 'string' 
          ? item.price.product 
          : item.price?.product?.id;
        return productId === MESSAGE_PACK_PRODUCT_ID;
      });
      
      if (!isMessagePack) {
        return res.status(400).json({ error: "Session is not for message pack" });
      }

      const result = await addBonusMessages(email, 50, sessionId);
      if (result.alreadyProcessed) {
        return res.status(409).json({ error: "Session already processed", alreadyProcessed: true });
      }
      
      const usage = await getMessageUsage(email);
      res.json({ success: true, usage });
    } catch (error) {
      console.error("Failed to add bonus messages:", error);
      res.status(500).json({ error: "Failed to add bonus messages" });
    }
  });

  return httpServer;
}

// Helper function for simulated weather when no API key
function getSimulatedTemperature(cityKey: string): number {
  const hotCities = ['miami', 'dallas', 'houston', 'mexicoCity', 'monterrey', 'guadalajara'];
  const mildCities = ['seattle', 'sanFrancisco', 'boston', 'vancouver', 'toronto'];
  
  if (hotCities.includes(cityKey)) {
    return 85 + Math.floor(Math.random() * 15); // 85-100°F
  } else if (mildCities.includes(cityKey)) {
    return 65 + Math.floor(Math.random() * 15); // 65-80°F
  } else {
    return 75 + Math.floor(Math.random() * 15); // 75-90°F
  }
}