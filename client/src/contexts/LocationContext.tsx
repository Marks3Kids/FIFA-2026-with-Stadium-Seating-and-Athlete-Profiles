import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cityVaults } from '@/data/cityVaults';
import { useToast } from '@/hooks/use-toast';

interface CityBoundary {
  cityKey: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
}

const HOST_CITY_BOUNDARIES: CityBoundary[] = [
  { cityKey: 'kansasCity', name: 'Kansas City', latitude: 39.0997, longitude: -94.5786, radiusKm: 50 },
  { cityKey: 'newYork', name: 'New York', latitude: 40.7128, longitude: -74.0060, radiusKm: 60 },
  { cityKey: 'losAngeles', name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, radiusKm: 80 },
  { cityKey: 'miami', name: 'Miami', latitude: 25.7617, longitude: -80.1918, radiusKm: 50 },
  { cityKey: 'dallas', name: 'Dallas', latitude: 32.7767, longitude: -96.7970, radiusKm: 60 },
  { cityKey: 'houston', name: 'Houston', latitude: 29.7604, longitude: -95.3698, radiusKm: 70 },
  { cityKey: 'atlanta', name: 'Atlanta', latitude: 33.7490, longitude: -84.3880, radiusKm: 50 },
  { cityKey: 'philadelphia', name: 'Philadelphia', latitude: 39.9526, longitude: -75.1652, radiusKm: 40 },
  { cityKey: 'seattle', name: 'Seattle', latitude: 47.6062, longitude: -122.3321, radiusKm: 50 },
  { cityKey: 'boston', name: 'Boston', latitude: 42.3601, longitude: -71.0589, radiusKm: 50 },
  { cityKey: 'sanFrancisco', name: 'San Francisco', latitude: 37.7749, longitude: -122.4194, radiusKm: 60 },
  { cityKey: 'toronto', name: 'Toronto', latitude: 43.6532, longitude: -79.3832, radiusKm: 50 },
  { cityKey: 'vancouver', name: 'Vancouver', latitude: 49.2827, longitude: -123.1207, radiusKm: 50 },
  { cityKey: 'mexicoCity', name: 'Mexico City', latitude: 19.4326, longitude: -99.1332, radiusKm: 60 },
  { cityKey: 'guadalajara', name: 'Guadalajara', latitude: 20.6597, longitude: -103.3496, radiusKm: 50 },
  { cityKey: 'monterrey', name: 'Monterrey', latitude: 25.6866, longitude: -100.3161, radiusKm: 50 },
];

interface LocationContextType {
  currentCity: CityBoundary | null;
  currentVault: typeof cityVaults[0] | null;
  isTracking: boolean;
  hasPermission: boolean;
  lastPosition: GeolocationPosition | null;
  startTracking: () => void;
  stopTracking: () => void;
  requestPermission: () => Promise<boolean>;
  simulateCity: (cityKey: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [currentCity, setCurrentCity] = useState<CityBoundary | null>(null);
  const [currentVault, setCurrentVault] = useState<typeof cityVaults[0] | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [lastPosition, setLastPosition] = useState<GeolocationPosition | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [previousCity, setPreviousCity] = useState<string | null>(null);

  const checkCityPerimeter = useCallback((latitude: number, longitude: number) => {
    for (const city of HOST_CITY_BOUNDARIES) {
      const distance = calculateDistance(latitude, longitude, city.latitude, city.longitude);
      if (distance <= city.radiusKm) {
        return city;
      }
    }
    return null;
  }, []);

  const showWelcomeNotification = useCallback((city: CityBoundary, vault: typeof cityVaults[0]) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(t('location.welcomeTo', { city: city.name }), {
        body: vault.welcomeMessage.slice(0, 100) + '...',
        icon: '/pwa-192x192.svg',
        tag: `welcome-${city.cityKey}`,
      });
    }

    toast({
      title: `🎉 ${t('location.welcomeTo', { city: city.name })}`,
      description: vault.motto,
      duration: 8000,
    });
  }, [t, toast]);

  const handlePositionUpdate = useCallback((position: GeolocationPosition) => {
    setLastPosition(position);
    const { latitude, longitude } = position.coords;
    
    const detectedCity = checkCityPerimeter(latitude, longitude);
    
    if (detectedCity) {
      const vault = cityVaults.find(v => v.cityKey === detectedCity.cityKey);
      
      if (detectedCity.cityKey !== previousCity) {
        setCurrentCity(detectedCity);
        setCurrentVault(vault || null);
        setPreviousCity(detectedCity.cityKey);
        
        if (vault) {
          showWelcomeNotification(detectedCity, vault);
        }
        
        localStorage.setItem('lastDetectedCity', detectedCity.cityKey);
      }
    } else if (previousCity !== null) {
      setCurrentCity(null);
      setCurrentVault(null);
      setPreviousCity(null);
    }
  }, [checkCityPerimeter, previousCity, showWelcomeNotification]);

  const requestPermission = async (): Promise<boolean> => {
    if (!('geolocation' in navigator)) {
      toast({
        title: t('location.notSupported'),
        description: t('location.notSupportedDesc'),
        variant: 'destructive',
      });
      return false;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'granted') {
        setHasPermission(true);
        return true;
      }
      
      if (permission.state === 'prompt') {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              setHasPermission(true);
              resolve(true);
            },
            () => {
              setHasPermission(false);
              resolve(false);
            }
          );
        });
      }
      
      return false;
    } catch {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            setHasPermission(true);
            resolve(true);
          },
          () => {
            setHasPermission(false);
            resolve(false);
          }
        );
      });
    }
  };

  const startTracking = useCallback(() => {
    if (!('geolocation' in navigator)) return;
    
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    
    const id = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      (error) => {
        console.error('Geolocation error:', error);
        if (error.code === error.PERMISSION_DENIED) {
          setHasPermission(false);
        }
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000,
      }
    );
    
    setWatchId(id);
    setIsTracking(true);
    
    localStorage.setItem('locationTrackingEnabled', 'true');
  }, [watchId, handlePositionUpdate]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    localStorage.setItem('locationTrackingEnabled', 'false');
  }, [watchId]);

  const simulateCity = useCallback((cityKey: string) => {
    const city = HOST_CITY_BOUNDARIES.find(c => c.cityKey === cityKey);
    const vault = cityVaults.find(v => v.cityKey === cityKey);
    
    if (city && vault) {
      setCurrentCity(city);
      setCurrentVault(vault);
      setPreviousCity(cityKey);
      showWelcomeNotification(city, vault);
      localStorage.setItem('lastDetectedCity', cityKey);
    }
  }, [showWelcomeNotification]);

  useEffect(() => {
    const lastCity = localStorage.getItem('lastDetectedCity');
    if (lastCity) {
      const city = HOST_CITY_BOUNDARIES.find(c => c.cityKey === lastCity);
      const vault = cityVaults.find(v => v.cityKey === lastCity);
      if (city && vault) {
        setCurrentCity(city);
        setCurrentVault(vault);
        setPreviousCity(lastCity);
      }
    }

    const trackingEnabled = localStorage.getItem('locationTrackingEnabled');
    if (trackingEnabled === 'true') {
      requestPermission().then((granted) => {
        if (granted) {
          startTracking();
        }
      });
    }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return (
    <LocationContext.Provider
      value={{
        currentCity,
        currentVault,
        isTracking,
        hasPermission,
        lastPosition,
        startTracking,
        stopTracking,
        requestPermission,
        simulateCity,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
