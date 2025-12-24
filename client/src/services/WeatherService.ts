import { cityVaults } from '@/data/cityVaults';
import { createWeatherAlert } from './NotificationService';

interface WeatherData {
  city: string;
  temperature: number;
  temperatureF: number;
  description: string;
  humidity: number;
  feelsLike: number;
  feelsLikeF: number;
  icon: string;
}

interface WeatherAlert {
  type: 'heat' | 'hydration' | 'cold' | 'rain';
  severity: 'low' | 'medium' | 'high';
  message: string;
  recommendation: string;
  cityKey: string;
}

const CITY_NAMES: Record<string, string> = {
  kansasCity: 'Kansas City',
  newYork: 'New York',
  losAngeles: 'Los Angeles',
  miami: 'Miami',
  dallas: 'Dallas',
  houston: 'Houston',
  atlanta: 'Atlanta',
  philadelphia: 'Philadelphia',
  seattle: 'Seattle',
  boston: 'Boston',
  sanFrancisco: 'San Francisco',
  toronto: 'Toronto',
  vancouver: 'Vancouver',
  mexicoCity: 'Mexico City',
  guadalajara: 'Guadalajara',
  monterrey: 'Monterrey',
};

const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  kansasCity: { lat: 39.0997, lon: -94.5786 },
  newYork: { lat: 40.7128, lon: -74.0060 },
  losAngeles: { lat: 34.0522, lon: -118.2437 },
  miami: { lat: 25.7617, lon: -80.1918 },
  dallas: { lat: 32.7767, lon: -96.7970 },
  houston: { lat: 29.7604, lon: -95.3698 },
  atlanta: { lat: 33.7490, lon: -84.3880 },
  philadelphia: { lat: 39.9526, lon: -75.1652 },
  seattle: { lat: 47.6062, lon: -122.3321 },
  boston: { lat: 42.3601, lon: -71.0589 },
  sanFrancisco: { lat: 37.7749, lon: -122.4194 },
  toronto: { lat: 43.6532, lon: -79.3832 },
  vancouver: { lat: 49.2827, lon: -123.1207 },
  mexicoCity: { lat: 19.4326, lon: -99.1332 },
  guadalajara: { lat: 20.6597, lon: -103.3496 },
  monterrey: { lat: 25.6866, lon: -100.3161 },
};

function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9/5) + 32;
}

export async function getWeatherForCity(cityKey: string): Promise<WeatherData | null> {
  const coords = CITY_COORDINATES[cityKey];
  if (!coords) return null;

  try {
    const response = await fetch(`/api/weather/${cityKey}`);
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    return null;
  }
}

export function generateWeatherAlert(weather: WeatherData, cityKey: string): WeatherAlert | null {
  const vault = cityVaults.find(v => v.cityKey === cityKey);
  const cityName = CITY_NAMES[cityKey] || cityKey;
  if (!vault) return null;

  if (weather.temperatureF >= 90) {
    const severity = weather.temperatureF >= 100 ? 'high' : weather.temperatureF >= 95 ? 'medium' : 'low';
    return {
      type: 'heat',
      severity,
      message: `🌡️ Hydration Alert: ${cityName} is ${Math.round(weather.temperatureF)}°F today.`,
      recommendation: vault.logistics?.solution || 'Stay hydrated and seek air-conditioned areas.',
      cityKey,
    };
  }

  if (weather.humidity >= 80 && weather.temperatureF >= 80) {
    return {
      type: 'hydration',
      severity: 'medium',
      message: `💧 High Humidity Alert: ${cityName} has ${weather.humidity}% humidity.`,
      recommendation: 'Take frequent breaks and stay hydrated. The heat index makes it feel hotter.',
      cityKey,
    };
  }

  return null;
}

export function getHydrationRecommendations(temperatureF: number): string[] {
  const recommendations: string[] = [];
  
  if (temperatureF >= 85) {
    recommendations.push('Drink water every 15-20 minutes');
    recommendations.push('Wear light, loose-fitting clothing');
    recommendations.push('Use sunscreen SPF 30+');
  }
  
  if (temperatureF >= 95) {
    recommendations.push('Limit outdoor exposure during peak hours (11am-4pm)');
    recommendations.push('Seek air-conditioned venues');
    recommendations.push('Carry a portable fan or cooling towel');
  }
  
  if (temperatureF >= 100) {
    recommendations.push('Consider watching match at an indoor venue');
    recommendations.push('Know the location of medical tents');
    recommendations.push('Watch for signs of heat exhaustion');
  }
  
  return recommendations;
}

export function getCoolingStations(cityKey: string): { name: string; type: string }[] {
  const stations: Record<string, { name: string; type: string }[]> = {
    dallas: [
      { name: 'AT&T Stadium Cooling Zones', type: 'Stadium' },
      { name: 'Galleria Dallas', type: 'Mall' },
      { name: 'Dallas Public Library', type: 'Library' },
    ],
    houston: [
      { name: 'NRG Stadium Cooling Areas', type: 'Stadium' },
      { name: 'The Galleria', type: 'Mall' },
      { name: 'Houston Public Library', type: 'Library' },
    ],
    miami: [
      { name: 'Hard Rock Stadium Misting Zones', type: 'Stadium' },
      { name: 'Aventura Mall', type: 'Mall' },
      { name: 'Miami-Dade Public Library', type: 'Library' },
    ],
    mexicoCity: [
      { name: 'Estadio Azteca Fan Zones', type: 'Stadium' },
      { name: 'Centro Santa Fe', type: 'Mall' },
      { name: 'Biblioteca Central UNAM', type: 'Library' },
    ],
    monterrey: [
      { name: 'Estadio BBVA Cooling Areas', type: 'Stadium' },
      { name: 'Galerías Monterrey', type: 'Mall' },
      { name: 'Biblioteca Central', type: 'Library' },
    ],
  };
  
  return stations[cityKey] || [
    { name: 'Stadium Cooling Zones', type: 'Stadium' },
    { name: 'Nearby Shopping Centers', type: 'Mall' },
  ];
}

const WEATHER_ALERT_KEY = 'weather_alert_last_triggered';
const WEATHER_ALERT_COOLDOWN = 4 * 60 * 60 * 1000;

export async function checkForWeatherAlerts(cityKey: string): Promise<WeatherAlert | null> {
  const lastTriggered = localStorage.getItem(`${WEATHER_ALERT_KEY}_${cityKey}`);
  const now = Date.now();
  
  if (lastTriggered && now - parseInt(lastTriggered) < WEATHER_ALERT_COOLDOWN) {
    return null;
  }

  const weather = await getWeatherForCity(cityKey);
  if (!weather) return null;
  
  const alert = generateWeatherAlert(weather, cityKey);
  if (!alert) return null;

  localStorage.setItem(`${WEATHER_ALERT_KEY}_${cityKey}`, now.toString());

  const hydrationTips = getHydrationRecommendations(weather.temperatureF);
  const coolingStations = getCoolingStations(cityKey);

  let recommendation = alert.recommendation;
  if (hydrationTips.length > 0) {
    recommendation += '\n\n• ' + hydrationTips.slice(0, 3).join('\n• ');
  }
  if (coolingStations.length > 0) {
    recommendation += '\n\n📍 Nearest cooling station: ' + coolingStations[0].name;
  }

  createWeatherAlert(
    CITY_NAMES[cityKey] || cityKey,
    weather.temperatureF,
    recommendation
  );

  return alert;
}
