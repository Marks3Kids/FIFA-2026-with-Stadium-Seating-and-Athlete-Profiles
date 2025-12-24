import { NotificationService } from './NotificationService';

interface StadiumLocation {
  name: string;
  city: string;
  cityKey: string;
  lat: number;
  lon: number;
  entryGates: EntryGate[];
  rideShareZones: RideShareZone[];
}

interface EntryGate {
  name: string;
  description: string;
  lat: number;
  lon: number;
  forSections: string;
}

interface RideShareZone {
  provider: 'uber' | 'lyft' | 'all';
  type: 'pickup' | 'dropoff' | 'both';
  name: string;
  description: string;
  lat: number;
  lon: number;
  walkingMinutes: number;
}

const STADIUMS: StadiumLocation[] = [
  {
    name: 'Arrowhead Stadium',
    city: 'Kansas City',
    cityKey: 'kansasCity',
    lat: 39.0489,
    lon: -94.4839,
    entryGates: [
      { name: 'Gate A', description: 'North entrance near Lot A', lat: 39.0502, lon: -94.4839, forSections: '100-112' },
      { name: 'Gate B', description: 'East entrance near Lot B', lat: 39.0489, lon: -94.4815, forSections: '113-124' },
      { name: 'Gate C', description: 'South entrance near Lot C', lat: 39.0476, lon: -94.4839, forSections: '125-136' },
      { name: 'Gate D', description: 'West entrance near Lot D', lat: 39.0489, lon: -94.4863, forSections: '301-324' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Lot N RideShare Zone', description: 'Primary rideshare location - north of stadium', lat: 39.0525, lon: -94.4839, walkingMinutes: 8 },
      { provider: 'all', type: 'pickup', name: 'Red Lot Exit', description: 'Post-game pickup - follow signs', lat: 39.0510, lon: -94.4875, walkingMinutes: 10 },
    ],
  },
  {
    name: 'MetLife Stadium',
    city: 'New York/New Jersey',
    cityKey: 'newYork',
    lat: 40.8128,
    lon: -74.0742,
    entryGates: [
      { name: 'Gate A', description: 'East entrance - main gate', lat: 40.8138, lon: -74.0725, forSections: '100-112, 201-212' },
      { name: 'Gate B', description: 'South entrance', lat: 40.8115, lon: -74.0742, forSections: '113-124, 213-224' },
      { name: 'Gate C', description: 'West entrance', lat: 40.8128, lon: -74.0765, forSections: '125-136, 225-236' },
      { name: 'Gate D', description: 'North entrance', lat: 40.8145, lon: -74.0742, forSections: '137-148, 237-248' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'dropoff', name: 'Lot E RideShare Drop-off', description: 'Before game - east side', lat: 40.8150, lon: -74.0710, walkingMinutes: 7 },
      { provider: 'all', type: 'pickup', name: 'Lot K RideShare Pickup', description: 'After game - follow blue signs', lat: 40.8100, lon: -74.0780, walkingMinutes: 12 },
    ],
  },
  {
    name: 'SoFi Stadium',
    city: 'Los Angeles',
    cityKey: 'losAngeles',
    lat: 33.9534,
    lon: -118.3390,
    entryGates: [
      { name: 'American Airlines Plaza', description: 'Main entrance - north side', lat: 33.9548, lon: -118.3390, forSections: '100-115, C100-C115' },
      { name: 'YouTube Theater Entrance', description: 'East side entrance', lat: 33.9534, lon: -118.3365, forSections: '116-130, C116-C130' },
      { name: 'South Gate', description: 'South entrance near VIP', lat: 33.9520, lon: -118.3390, forSections: '131-145, C131-C145' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Pink Zone', description: 'Hollywood Park Casino area', lat: 33.9575, lon: -118.3360, walkingMinutes: 10 },
      { provider: 'uber', type: 'pickup', name: 'Uber Lot', description: 'Designated Uber pickup - east', lat: 33.9510, lon: -118.3340, walkingMinutes: 8 },
      { provider: 'lyft', type: 'pickup', name: 'Lyft Zone', description: 'Designated Lyft pickup - west', lat: 33.9510, lon: -118.3420, walkingMinutes: 9 },
    ],
  },
  {
    name: 'Hard Rock Stadium',
    city: 'Miami',
    cityKey: 'miami',
    lat: 25.9580,
    lon: -80.2389,
    entryGates: [
      { name: 'Gate 1', description: 'Northwest entrance', lat: 25.9595, lon: -80.2405, forSections: '100-112' },
      { name: 'Gate 2', description: 'Northeast entrance', lat: 25.9595, lon: -80.2373, forSections: '113-125' },
      { name: 'Gate 3', description: 'Southeast entrance', lat: 25.9565, lon: -80.2373, forSections: '126-138' },
      { name: 'Gate 4', description: 'Southwest entrance', lat: 25.9565, lon: -80.2405, forSections: '139-150' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'dropoff', name: 'RideShare Lot', description: 'Enter from 199th Street', lat: 25.9620, lon: -80.2389, walkingMinutes: 8 },
      { provider: 'all', type: 'pickup', name: 'Post-Game Pickup', description: 'Lot 18 - follow illuminated signs', lat: 25.9550, lon: -80.2420, walkingMinutes: 10 },
    ],
  },
  {
    name: 'AT&T Stadium',
    city: 'Dallas',
    cityKey: 'dallas',
    lat: 32.7473,
    lon: -97.0945,
    entryGates: [
      { name: 'Gate A', description: 'West plaza main entrance', lat: 32.7473, lon: -97.0970, forSections: '100-115, C200-C215' },
      { name: 'Gate B', description: 'East plaza entrance', lat: 32.7473, lon: -97.0920, forSections: '116-130, C216-C230' },
      { name: 'Gate C', description: 'North entrance', lat: 32.7490, lon: -97.0945, forSections: '131-145, C231-C245' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Lot 4 RideShare', description: 'Primary rideshare - Collins Street', lat: 32.7500, lon: -97.0980, walkingMinutes: 12 },
      { provider: 'all', type: 'pickup', name: 'Texas Live! Pickup', description: 'Entertainment district pickup', lat: 32.7510, lon: -97.0900, walkingMinutes: 10 },
    ],
  },
  {
    name: 'NRG Stadium',
    city: 'Houston',
    cityKey: 'houston',
    lat: 29.6847,
    lon: -95.4107,
    entryGates: [
      { name: 'Gate A', description: 'East entrance', lat: 29.6847, lon: -95.4080, forSections: '100-115' },
      { name: 'Gate B', description: 'West entrance', lat: 29.6847, lon: -95.4134, forSections: '116-130' },
      { name: 'Gate C', description: 'North entrance - NRG Center', lat: 29.6865, lon: -95.4107, forSections: '500-530' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Yellow Lot', description: 'Kirby Drive entrance', lat: 29.6880, lon: -95.4080, walkingMinutes: 10 },
    ],
  },
  {
    name: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    cityKey: 'atlanta',
    lat: 33.7553,
    lon: -84.4006,
    entryGates: [
      { name: 'Gate 1', description: 'Northwest corner - main', lat: 33.7570, lon: -84.4020, forSections: '100-112' },
      { name: 'Gate 2', description: 'Northeast corner', lat: 33.7570, lon: -84.3992, forSections: '113-124' },
      { name: 'Gate 3', description: 'Southeast corner', lat: 33.7536, lon: -84.3992, forSections: '125-136' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'dropoff', name: 'Gulch Drop-off', description: 'Martin Luther King Jr Dr', lat: 33.7530, lon: -84.4030, walkingMinutes: 5 },
      { provider: 'all', type: 'pickup', name: 'State Farm Arena Pickup', description: 'Post-game designated area', lat: 33.7573, lon: -84.3963, walkingMinutes: 8 },
    ],
  },
  {
    name: 'Lincoln Financial Field',
    city: 'Philadelphia',
    cityKey: 'philadelphia',
    lat: 39.9008,
    lon: -75.1675,
    entryGates: [
      { name: 'Gate A', description: 'Northeast entrance', lat: 39.9020, lon: -75.1660, forSections: '100-112' },
      { name: 'Gate B', description: 'Southeast entrance', lat: 39.8996, lon: -75.1660, forSections: '113-124' },
      { name: 'Gate C', description: 'Southwest entrance', lat: 39.8996, lon: -75.1690, forSections: '125-136' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Lot K RideShare', description: 'Darien Street entrance', lat: 39.9035, lon: -75.1650, walkingMinutes: 8 },
    ],
  },
  {
    name: 'Lumen Field',
    city: 'Seattle',
    cityKey: 'seattle',
    lat: 47.5952,
    lon: -122.3316,
    entryGates: [
      { name: 'North Gate', description: 'Main entrance - S Royal Brougham', lat: 47.5968, lon: -122.3316, forSections: '100-115' },
      { name: 'South Gate', description: 'S Atlantic Street entrance', lat: 47.5936, lon: -122.3316, forSections: '116-130' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'dropoff', name: 'Occidental Ave Drop-off', description: 'Near Pioneer Square', lat: 47.5990, lon: -122.3330, walkingMinutes: 5 },
      { provider: 'all', type: 'pickup', name: '1st Ave S Pickup', description: 'Post-game pickup zone', lat: 47.5920, lon: -122.3340, walkingMinutes: 7 },
    ],
  },
  {
    name: 'Gillette Stadium',
    city: 'Boston',
    cityKey: 'boston',
    lat: 42.0909,
    lon: -71.2643,
    entryGates: [
      { name: 'Gate A', description: 'North entrance - Patriot Place', lat: 42.0925, lon: -71.2643, forSections: '100-115' },
      { name: 'Gate B', description: 'West entrance', lat: 42.0909, lon: -71.2665, forSections: '116-130' },
      { name: 'Gate C', description: 'East entrance', lat: 42.0909, lon: -71.2621, forSections: '131-145' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'P5 RideShare Lot', description: 'Route 1 entrance', lat: 42.0940, lon: -71.2620, walkingMinutes: 10 },
    ],
  },
  {
    name: "Levi's Stadium",
    city: 'San Francisco',
    cityKey: 'sanFrancisco',
    lat: 37.4033,
    lon: -121.9695,
    entryGates: [
      { name: 'Gate A', description: 'Intel Gate - northeast', lat: 37.4045, lon: -121.9680, forSections: '100-115' },
      { name: 'Gate B', description: 'Dignity Health Gate - southeast', lat: 37.4021, lon: -121.9680, forSections: '116-130' },
      { name: 'Gate F', description: 'Yahoo! Gate - northwest', lat: 37.4045, lon: -121.9710, forSections: '200-215' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'dropoff', name: 'Great America Pkwy Drop-off', description: 'Near VTA station', lat: 37.4060, lon: -121.9720, walkingMinutes: 8 },
      { provider: 'all', type: 'pickup', name: 'Lot 1 Pickup', description: 'Post-game designated zone', lat: 37.4010, lon: -121.9730, walkingMinutes: 10 },
    ],
  },
  {
    name: 'BMO Field',
    city: 'Toronto',
    cityKey: 'toronto',
    lat: 43.6332,
    lon: -79.4186,
    entryGates: [
      { name: 'Gate 1', description: 'Main entrance - Princes Blvd', lat: 43.6340, lon: -79.4186, forSections: '100-115' },
      { name: 'Gate 2', description: 'South entrance', lat: 43.6324, lon: -79.4186, forSections: '116-130' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Exhibition Place Drop Zone', description: 'Near CNE grounds', lat: 43.6355, lon: -79.4170, walkingMinutes: 6 },
    ],
  },
  {
    name: 'BC Place',
    city: 'Vancouver',
    cityKey: 'vancouver',
    lat: 49.2768,
    lon: -123.1118,
    entryGates: [
      { name: 'Gate A', description: 'North entrance - Robson Street', lat: 49.2780, lon: -123.1118, forSections: '200-215' },
      { name: 'Gate B', description: 'East entrance - Terry Fox Plaza', lat: 49.2768, lon: -123.1095, forSections: '216-230' },
      { name: 'Gate C', description: 'West entrance', lat: 49.2768, lon: -123.1141, forSections: '231-245' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Pacific Blvd Zone', description: 'Near Costco', lat: 49.2755, lon: -123.1150, walkingMinutes: 5 },
    ],
  },
  {
    name: 'Estadio Azteca',
    city: 'Mexico City',
    cityKey: 'mexicoCity',
    lat: 19.3029,
    lon: -99.1505,
    entryGates: [
      { name: 'Puerta 1', description: 'Entrance north - Calzada de Tlalpan', lat: 19.3045, lon: -99.1505, forSections: '100-115' },
      { name: 'Puerta 2', description: 'Entrance east', lat: 19.3029, lon: -99.1480, forSections: '116-130' },
      { name: 'Puerta 3', description: 'Entrance south - main', lat: 19.3013, lon: -99.1505, forSections: '131-145' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Zona Uber/Didi', description: 'Calzada de Tlalpan entrance', lat: 19.3055, lon: -99.1490, walkingMinutes: 8 },
    ],
  },
  {
    name: 'Estadio Akron',
    city: 'Guadalajara',
    cityKey: 'guadalajara',
    lat: 20.6810,
    lon: -103.4621,
    entryGates: [
      { name: 'Acceso Norte', description: 'North entrance', lat: 20.6825, lon: -103.4621, forSections: '100-115' },
      { name: 'Acceso Sur', description: 'South entrance', lat: 20.6795, lon: -103.4621, forSections: '116-130' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Zona de Rideshare', description: 'Via Av. de las Torres', lat: 20.6840, lon: -103.4600, walkingMinutes: 10 },
    ],
  },
  {
    name: 'Estadio BBVA',
    city: 'Monterrey',
    cityKey: 'monterrey',
    lat: 25.6699,
    lon: -100.2445,
    entryGates: [
      { name: 'Acceso Principal', description: 'Main entrance - Av. Pablo Livas', lat: 25.6710, lon: -100.2445, forSections: '100-120' },
      { name: 'Acceso Este', description: 'East entrance', lat: 25.6699, lon: -100.2420, forSections: '121-140' },
    ],
    rideShareZones: [
      { provider: 'all', type: 'both', name: 'Zona Uber/Didi', description: 'Av. Pablo Livas', lat: 25.6725, lon: -100.2430, walkingMinutes: 7 },
    ],
  },
];

const PROXIMITY_THRESHOLD_MILES = 1.0;
const ALERTED_STADIUMS_KEY = 'stadium_proximity_alerts';

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function getAlertedStadiums(): Set<string> {
  try {
    const stored = localStorage.getItem(ALERTED_STADIUMS_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

function markStadiumAlerted(stadiumName: string): void {
  const alerted = getAlertedStadiums();
  alerted.add(stadiumName);
  localStorage.setItem(ALERTED_STADIUMS_KEY, JSON.stringify(Array.from(alerted)));
}

export function checkStadiumProximity(userLat: number, userLon: number): StadiumLocation | null {
  for (const stadium of STADIUMS) {
    const distance = calculateDistance(userLat, userLon, stadium.lat, stadium.lon);
    if (distance <= PROXIMITY_THRESHOLD_MILES) {
      return stadium;
    }
  }
  return null;
}

export function triggerStadiumEntryAlert(userLat: number, userLon: number): void {
  const stadium = checkStadiumProximity(userLat, userLon);
  if (!stadium) return;

  const alerted = getAlertedStadiums();
  const alertKey = `${stadium.name}_${new Date().toDateString()}`;
  
  if (alerted.has(alertKey)) return;

  const nearestGate = findNearestGate(userLat, userLon, stadium.entryGates);
  const nearestDropoff = findNearestRideShareZone(userLat, userLon, stadium.rideShareZones, 'dropoff');

  let message = `You're approaching ${stadium.name}! `;
  if (nearestGate) {
    message += `Nearest entry: ${nearestGate.name} (${nearestGate.forSections}). `;
  }
  if (nearestDropoff) {
    message += `RideShare drop-off: ${nearestDropoff.name} (~${nearestDropoff.walkingMinutes} min walk).`;
  }

  NotificationService.addNotification({
    type: 'stadium',
    title: `Arriving at ${stadium.name}`,
    message,
    icon: '🏟️',
    priority: 'high',
  });

  markStadiumAlerted(alertKey);
}

function findNearestGate(lat: number, lon: number, gates: EntryGate[]): EntryGate | null {
  let nearest: EntryGate | null = null;
  let minDistance = Infinity;

  for (const gate of gates) {
    const distance = calculateDistance(lat, lon, gate.lat, gate.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = gate;
    }
  }

  return nearest;
}

function findNearestRideShareZone(
  lat: number, 
  lon: number, 
  zones: RideShareZone[], 
  type: 'pickup' | 'dropoff'
): RideShareZone | null {
  const filtered = zones.filter(z => z.type === type || z.type === 'both');
  let nearest: RideShareZone | null = null;
  let minDistance = Infinity;

  for (const zone of filtered) {
    const distance = calculateDistance(lat, lon, zone.lat, zone.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = zone;
    }
  }

  return nearest;
}

export function getStadiumByCity(cityKey: string): StadiumLocation | undefined {
  return STADIUMS.find(s => s.cityKey === cityKey);
}

export function getStadiumRideShareInfo(cityKey: string): { entryGates: EntryGate[]; rideShareZones: RideShareZone[] } | null {
  const stadium = getStadiumByCity(cityKey);
  if (!stadium) return null;
  return {
    entryGates: stadium.entryGates,
    rideShareZones: stadium.rideShareZones,
  };
}

export function getAllStadiums(): StadiumLocation[] {
  return STADIUMS;
}
