import { NotificationService } from './NotificationService';

interface SafetyZone {
  name: string;
  type: 'caution' | 'avoid' | 'safe';
  description: string;
  timeRestriction?: { start: number; end: number };
  lat: number;
  lon: number;
  radiusMiles: number;
}

interface CitySafetyInfo {
  cityKey: string;
  cityName: string;
  generalTips: string[];
  emergencyNumbers: { police: string; ambulance: string; fire: string; tourist: string };
  safetyZones: SafetyZone[];
  nightTimeTips: string[];
  publicTransitSafety: string;
}

const CITY_SAFETY_DATA: Record<string, CitySafetyInfo> = {
  kansasCity: {
    cityKey: 'kansasCity',
    cityName: 'Kansas City',
    generalTips: [
      'Stay in well-lit areas around Power & Light District at night',
      'The Crossroads and Plaza areas are generally very safe',
      'Use designated parking lots near Arrowhead Stadium',
    ],
    emergencyNumbers: { police: '911', ambulance: '911', fire: '911', tourist: '816-474-4FUN' },
    safetyZones: [
      { name: 'Power & Light District', type: 'safe', description: 'Well-patrolled entertainment area', lat: 39.0997, lon: -94.5786, radiusMiles: 0.3 },
      { name: 'Independence Ave (east)', type: 'caution', description: 'Stay alert after dark', lat: 39.0920, lon: -94.5450, radiusMiles: 0.5, timeRestriction: { start: 22, end: 6 } },
    ],
    nightTimeTips: ['Stick to the Power & Light and Crossroads areas', 'Use rideshare after midnight'],
    publicTransitSafety: 'KC Streetcar is safe and free. Buses are generally safe during daytime.',
  },
  newYork: {
    cityKey: 'newYork',
    cityName: 'New York',
    generalTips: [
      'Times Square and Midtown are heavily patrolled 24/7',
      'Keep valuables secure on subway - pickpockets target tourists',
      'Stick to main streets in unfamiliar neighborhoods',
    ],
    emergencyNumbers: { police: '911', ambulance: '911', fire: '911', tourist: '212-484-1222' },
    safetyZones: [
      { name: 'Times Square', type: 'safe', description: 'Heavy police presence 24/7', lat: 40.7580, lon: -73.9855, radiusMiles: 0.3 },
      { name: 'Penn Station Area', type: 'caution', description: 'Stay alert late at night', lat: 40.7506, lon: -73.9935, radiusMiles: 0.2, timeRestriction: { start: 0, end: 6 } },
    ],
    nightTimeTips: ['Subway is generally safe but stay in populated cars', 'Avoid walking alone in unfamiliar areas after midnight'],
    publicTransitSafety: 'Subway is safe but stay alert. Sit near the conductor (middle of train). NJ Transit to MetLife Stadium is safe.',
  },
  losAngeles: {
    cityKey: 'losAngeles',
    cityName: 'Los Angeles',
    generalTips: [
      'LA is car-centric - rideshares are often safer than walking long distances',
      'Santa Monica, Beverly Hills, and West Hollywood are very safe',
      'Lock car doors and hide valuables - car break-ins are common',
    ],
    emergencyNumbers: { police: '911', ambulance: '911', fire: '911', tourist: '213-624-7300' },
    safetyZones: [
      { name: 'Hollywood Blvd', type: 'caution', description: 'Tourist area - watch for scams', lat: 34.1016, lon: -118.3267, radiusMiles: 0.3 },
      { name: 'Santa Monica', type: 'safe', description: 'Well-patrolled beach community', lat: 34.0195, lon: -118.4912, radiusMiles: 1.0 },
    ],
    nightTimeTips: ['Use rideshare after events - parking lots can be isolated', 'Downtown LA has improved but use caution at night'],
    publicTransitSafety: 'Metro is improving but use caution late at night. Metro C Line to SoFi Stadium is safe on game days.',
  },
  miami: {
    cityKey: 'miami',
    cityName: 'Miami',
    generalTips: [
      'South Beach and Brickell are tourist-friendly and well-patrolled',
      'Be aware of belongings on the beach - dont leave valuables unattended',
      'Drink plenty of water in the heat',
    ],
    emergencyNumbers: { police: '911', ambulance: '911', fire: '911', tourist: '305-539-3000' },
    safetyZones: [
      { name: 'South Beach', type: 'safe', description: 'Heavy tourist and police presence', lat: 25.7825, lon: -80.1340, radiusMiles: 0.5 },
      { name: 'Brickell', type: 'safe', description: 'Business district - very safe', lat: 25.7617, lon: -80.1918, radiusMiles: 0.5 },
    ],
    nightTimeTips: ['Stick to Ocean Drive and Collins Ave areas', 'Use rideshare when leaving clubs late'],
    publicTransitSafety: 'Metrorail is safe during the day. Metromover in downtown is free and safe.',
  },
  dallas: {
    cityKey: 'dallas',
    cityName: 'Dallas',
    generalTips: [
      'Uptown and Victory Park are very safe entertainment areas',
      'Texas Live! near the stadium is the official fan zone',
      'Summer heat can be dangerous - stay hydrated',
    ],
    emergencyNumbers: { police: '911', ambulance: '911', fire: '911', tourist: '214-571-1000' },
    safetyZones: [
      { name: 'Uptown', type: 'safe', description: 'Popular nightlife area with good security', lat: 32.7990, lon: -96.8024, radiusMiles: 0.5 },
      { name: 'Deep Ellum', type: 'caution', description: 'Great nightlife but stay alert late', lat: 32.7843, lon: -96.7833, radiusMiles: 0.3, timeRestriction: { start: 2, end: 6 } },
    ],
    nightTimeTips: ['Deep Ellum is popular but parking can be sketchy - use rideshare', 'Uptown has great restaurants and is very safe'],
    publicTransitSafety: 'DART light rail is safe. Express service runs to AT&T Stadium on game days.',
  },
  houston: {
    cityKey: 'houston',
    cityName: 'Houston',
    generalTips: [
      'Montrose and The Heights are trendy, safe neighborhoods',
      'Museum District is well-patrolled',
      'Summer heat is extreme - stay hydrated and seek shade',
    ],
    emergencyNumbers: { police: '911', ambulance: '911', fire: '911', tourist: '713-437-5200' },
    safetyZones: [
      { name: 'Museum District', type: 'safe', description: 'Cultural area with security', lat: 29.7225, lon: -95.3905, radiusMiles: 0.5 },
      { name: 'Midtown', type: 'safe', description: 'Good nightlife and restaurants', lat: 29.7410, lon: -95.3738, radiusMiles: 0.3 },
    ],
    nightTimeTips: ['Downtown has improved but some areas are still quiet at night', 'Montrose and Midtown are better for nightlife'],
    publicTransitSafety: 'METRORail is safe during events. Red Line connects to NRG Stadium.',
  },
  mexicoCity: {
    cityKey: 'mexicoCity',
    cityName: 'Mexico City',
    generalTips: [
      'Polanco, Roma, and Condesa are very safe tourist areas',
      'Use official taxis or apps (Uber, Didi) - avoid street hails',
      'Drink bottled water and be cautious with street food',
      'Keep valuables hidden and dont flash expensive items',
    ],
    emergencyNumbers: { police: '911', ambulance: '065', fire: '068', tourist: '55-5658-1111' },
    safetyZones: [
      { name: 'Polanco', type: 'safe', description: 'Upscale area with excellent security', lat: 19.4331, lon: -99.1981, radiusMiles: 1.0 },
      { name: 'Roma/Condesa', type: 'safe', description: 'Trendy neighborhoods popular with expats', lat: 19.4146, lon: -99.1716, radiusMiles: 0.7 },
      { name: 'Tepito', type: 'avoid', description: 'Avoid this area', lat: 19.4453, lon: -99.1261, radiusMiles: 0.5 },
    ],
    nightTimeTips: ['Stick to Roma, Condesa, and Polanco for nightlife', 'Always use Uber or Didi at night', 'Avoid showing expensive phones on the street'],
    publicTransitSafety: 'Metro is safe but crowded. Pink cars are women-only during rush hour. Metrobús is a good alternative.',
  },
  guadalajara: {
    cityKey: 'guadalajara',
    cityName: 'Guadalajara',
    generalTips: [
      'Centro Historico and Tlaquepaque are tourist-friendly',
      'Use registered taxis or ride apps',
      'The city is generally safer than it is often portrayed',
    ],
    emergencyNumbers: { police: '911', ambulance: '065', fire: '068', tourist: '33-3668-1600' },
    safetyZones: [
      { name: 'Centro Historico', type: 'safe', description: 'Historic downtown with police presence', lat: 20.6767, lon: -103.3475, radiusMiles: 0.5 },
      { name: 'Tlaquepaque', type: 'safe', description: 'Artisan village - very tourist friendly', lat: 20.6407, lon: -103.3133, radiusMiles: 0.4 },
    ],
    nightTimeTips: ['Chapultepec Ave has good nightlife', 'Use Uber or Didi after dark'],
    publicTransitSafety: 'Macrobús and Tren Ligero are safe during the day.',
  },
  monterrey: {
    cityKey: 'monterrey',
    cityName: 'Monterrey',
    generalTips: [
      'San Pedro Garza Garcia is one of the safest areas in Mexico',
      'The Macroplaza and Barrio Antiguo are well-patrolled',
      'The city is very business-oriented and generally safe',
    ],
    emergencyNumbers: { police: '911', ambulance: '065', fire: '068', tourist: '81-2020-6700' },
    safetyZones: [
      { name: 'San Pedro', type: 'safe', description: 'Wealthy suburb - excellent security', lat: 25.6571, lon: -100.3989, radiusMiles: 2.0 },
      { name: 'Macroplaza', type: 'safe', description: 'Downtown cultural area', lat: 25.6693, lon: -100.3097, radiusMiles: 0.3 },
    ],
    nightTimeTips: ['Barrio Antiguo has good nightlife with security', 'San Pedro has upscale venues'],
    publicTransitSafety: 'Metrorrey is safe and efficient. Line 1 connects to the stadium area.',
  },
  toronto: {
    cityKey: 'toronto',
    cityName: 'Toronto',
    generalTips: [
      'Toronto is one of the safest major cities in North America',
      'Downtown, Yorkville, and the Waterfront are all very safe',
      'TTC is safe to use at all hours',
    ],
    emergencyNumbers: { police: '911', ambulance: '911', fire: '911', tourist: '416-203-2500' },
    safetyZones: [
      { name: 'Downtown Core', type: 'safe', description: 'Very safe business and entertainment district', lat: 43.6532, lon: -79.3832, radiusMiles: 1.0 },
    ],
    nightTimeTips: ['King West and Queen West have great nightlife', 'TTC runs until about 1:30 AM, then use night buses or rideshare'],
    publicTransitSafety: 'TTC is very safe. Subway runs until about 1:30 AM on weekends.',
  },
  vancouver: {
    cityKey: 'vancouver',
    cityName: 'Vancouver',
    generalTips: [
      'Vancouver is extremely safe for tourists',
      'Gastown, Yaletown, and the West End are all safe areas',
      'The Downtown Eastside (DTES) has visible homelessness but is not dangerous to tourists',
    ],
    emergencyNumbers: { police: '911', ambulance: '911', fire: '911', tourist: '604-683-2000' },
    safetyZones: [
      { name: 'Gastown', type: 'safe', description: 'Historic area with good restaurants', lat: 49.2837, lon: -123.1089, radiusMiles: 0.3 },
      { name: 'Yaletown', type: 'safe', description: 'Trendy neighborhood near BC Place', lat: 49.2750, lon: -123.1209, radiusMiles: 0.3 },
    ],
    nightTimeTips: ['Granville Street has nightlife but can get rowdy on weekends', 'Yaletown is a calmer alternative'],
    publicTransitSafety: 'SkyTrain is very safe. Canada Line connects airport to downtown.',
  },
};

const LAST_SAFETY_CHECK_KEY = 'last_safety_alert';

function getCurrentHour(): number {
  return new Date().getHours();
}

function isWithinTimeRestriction(zone: SafetyZone): boolean {
  if (!zone.timeRestriction) return true;
  const hour = getCurrentHour();
  const { start, end } = zone.timeRestriction;
  if (start > end) {
    return hour >= start || hour < end;
  }
  return hour >= start && hour < end;
}

export function checkSafetyAlerts(cityKey: string): void {
  const safetyInfo = CITY_SAFETY_DATA[cityKey];
  if (!safetyInfo) return;

  const hour = getCurrentHour();
  const isNightTime = hour >= 22 || hour < 6;

  const lastCheck = localStorage.getItem(LAST_SAFETY_CHECK_KEY);
  const checkKey = `${cityKey}_${isNightTime ? 'night' : 'day'}_${new Date().toDateString()}`;

  if (lastCheck === checkKey) return;

  if (isNightTime && safetyInfo.nightTimeTips.length > 0) {
    NotificationService.addNotification({
      type: 'safety',
      title: `Night Safety Tips - ${safetyInfo.cityName}`,
      message: safetyInfo.nightTimeTips[0],
      icon: '🌙',
      priority: 'medium',
    });
    localStorage.setItem(LAST_SAFETY_CHECK_KEY, checkKey);
  }
}

export function checkProximityToSafetyZone(
  cityKey: string, 
  userLat: number, 
  userLon: number
): SafetyZone | null {
  const safetyInfo = CITY_SAFETY_DATA[cityKey];
  if (!safetyInfo) return null;

  for (const zone of safetyInfo.safetyZones) {
    if (zone.type === 'safe') continue;
    if (!isWithinTimeRestriction(zone)) continue;

    const distance = calculateDistance(userLat, userLon, zone.lat, zone.lon);
    if (distance <= zone.radiusMiles) {
      return zone;
    }
  }

  return null;
}

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

export function triggerZoneSafetyAlert(zone: SafetyZone, cityName: string): void {
  const icon = zone.type === 'avoid' ? '⚠️' : '⚡';
  const title = zone.type === 'avoid' 
    ? `Caution Area - ${cityName}` 
    : `Stay Alert - ${zone.name}`;

  NotificationService.addNotification({
    type: 'safety',
    title,
    message: zone.description,
    icon,
    priority: zone.type === 'avoid' ? 'high' : 'medium',
  });
}

export function getCitySafetyInfo(cityKey: string): CitySafetyInfo | null {
  return CITY_SAFETY_DATA[cityKey] || null;
}

export function getEmergencyNumbers(cityKey: string): { police: string; ambulance: string; fire: string; tourist: string } | null {
  const info = CITY_SAFETY_DATA[cityKey];
  return info?.emergencyNumbers || null;
}
