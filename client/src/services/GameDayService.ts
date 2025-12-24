import { createGameDayNotification } from './NotificationService';

interface UpcomingMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  city: string;
  dateTime: string;
  hoursUntilKickoff: number;
}

const CITY_KEY_MAP: Record<string, string> = {
  'Kansas City': 'kansasCity',
  'New York': 'newYork',
  'New York/New Jersey': 'newYork',
  'Los Angeles': 'losAngeles',
  'Miami': 'miami',
  'Dallas': 'dallas',
  'Houston': 'houston',
  'Atlanta': 'atlanta',
  'Philadelphia': 'philadelphia',
  'Seattle': 'seattle',
  'Boston': 'boston',
  'San Francisco': 'sanFrancisco',
  'Toronto': 'toronto',
  'Vancouver': 'vancouver',
  'Mexico City': 'mexicoCity',
  'Guadalajara': 'guadalajara',
  'Monterrey': 'monterrey',
};

const TRANSPORT_TIPS: Record<string, string> = {
  kansasCity: "The 402 Bus runs every 10 minutes to Arrowhead Stadium. Tap for your ticket QR code.",
  newYork: "NJ Transit has extra trains to MetLife Stadium. Penn Station departures every 15 mins.",
  losAngeles: "Metro C Line connects to SoFi Stadium. Allow 45 mins from Downtown LA.",
  miami: "Shuttle buses run from Aventura Mall to Hard Rock Stadium. $5 round trip.",
  dallas: "DART runs express service to AT&T Stadium. Board at Victory Station.",
  houston: "METRORail connects to NRG Stadium. Red Line from Downtown.",
  atlanta: "MARTA connects directly to Mercedes-Benz Stadium. Vine City station is closest.",
  philadelphia: "SEPTA Regional Rail has express service to Lincoln Financial Field.",
  seattle: "Light Rail runs to Lumen Field. International District station recommended.",
  boston: "MBTA Red Line to JFK/UMass, then shuttle to Gillette Stadium.",
  sanFrancisco: "Caltrain runs express to Levi's Stadium. Board at 4th & King.",
  toronto: "TTC Line 1 to Finch, then shuttle to BMO Field area.",
  vancouver: "SkyTrain Canada Line to Waterfront for BC Place access.",
  mexicoCity: "Metro Line 2 to Tasqueña, then shuttle to Estadio Azteca.",
  guadalajara: "Macrobús Line 2 to Estadio Akron. Service every 5 mins on match days.",
  monterrey: "Metrorrey Line 1 connects to Estadio BBVA area.",
};

export async function checkUpcomingMatches(): Promise<UpcomingMatch[]> {
  try {
    const response = await fetch('/api/gameday/upcoming?hours=6');
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Failed to check upcoming matches:', error);
    return [];
  }
}

export function getTransportTip(cityKey: string): string {
  return TRANSPORT_TIPS[cityKey] || "Check local transit for stadium access information.";
}

function normalizeCityKey(city: string): string {
  return CITY_KEY_MAP[city] || city.toLowerCase().replace(/\s+/g, '');
}

export async function triggerGameDayAlerts(): Promise<void> {
  const matches = await checkUpcomingMatches();
  
  for (const match of matches) {
    if (match.hoursUntilKickoff === 3) {
      const cityKey = normalizeCityKey(match.city || '');
      const transportTip = getTransportTip(cityKey);
      
      createGameDayNotification(
        match.homeTeam || 'TBD',
        match.awayTeam || 'TBD',
        match.venue || 'Stadium',
        match.hoursUntilKickoff,
        transportTip
      );
    }
  }
}

export function startGameDayMonitor(intervalMinutes: number = 30): () => void {
  triggerGameDayAlerts();
  
  const intervalId = setInterval(() => {
    triggerGameDayAlerts();
  }, intervalMinutes * 60 * 1000);

  return () => clearInterval(intervalId);
}

export function getMatchDayChecklist(hoursUntilKickoff: number): string[] {
  const checklist: string[] = [];
  
  if (hoursUntilKickoff >= 4) {
    checklist.push('Review your match ticket and ensure it\'s accessible');
    checklist.push('Check weather forecast and dress accordingly');
    checklist.push('Plan your route to the stadium');
  }
  
  if (hoursUntilKickoff >= 3) {
    checklist.push('Start heading to stadium area');
    checklist.push('Download offline maps of stadium area');
    checklist.push('Ensure phone is charged (stadium areas may be crowded)');
  }
  
  if (hoursUntilKickoff >= 2) {
    checklist.push('Arrive at stadium vicinity');
    checklist.push('Locate your entry gate');
    checklist.push('Find restrooms and concession areas');
  }
  
  if (hoursUntilKickoff >= 1) {
    checklist.push('Enter stadium and find your seat');
    checklist.push('Locate nearest emergency exits');
    checklist.push('Buy refreshments before kickoff rush');
  }
  
  return checklist;
}
