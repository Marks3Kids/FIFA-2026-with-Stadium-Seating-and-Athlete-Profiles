import { useTranslation } from 'react-i18next';
import { useLocation } from '@/contexts/LocationContext';
import { MapPin, Navigation, Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEMO_CITIES = [
  { key: 'kansasCity', name: 'Kansas City' },
  { key: 'newYork', name: 'New York' },
  { key: 'losAngeles', name: 'Los Angeles' },
  { key: 'miami', name: 'Miami' },
  { key: 'dallas', name: 'Dallas' },
  { key: 'houston', name: 'Houston' },
  { key: 'atlanta', name: 'Atlanta' },
  { key: 'toronto', name: 'Toronto' },
  { key: 'mexicoCity', name: 'Mexico City' },
];

export function LocationSettings() {
  const { t } = useTranslation();
  const {
    currentCity,
    currentVault,
    isTracking,
    hasPermission,
    startTracking,
    stopTracking,
    requestPermission,
    simulateCity,
  } = useLocation();

  const handleToggleTracking = async () => {
    if (isTracking) {
      stopTracking();
    } else {
      const granted = await requestPermission();
      if (granted) {
        startTracking();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-white">{t('location.enableLocation')}</h3>
              <p className="text-xs text-muted-foreground">{t('location.enableLocationDesc')}</p>
            </div>
          </div>
          <Switch
            checked={isTracking}
            onCheckedChange={handleToggleTracking}
          />
        </div>

        {currentCity && currentVault && (
          <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">{t('location.youAreIn', { city: currentCity.name })}</span>
            </div>
            <p className="text-xs text-gray-300 italic">"{currentVault.motto}"</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
              <CheckCircle className="w-3 h-3" />
              <span>{t('location.primedAndReady', { city: currentCity.name })}</span>
            </div>
          </div>
        )}

        {isTracking && !currentCity && (
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">{t('location.notInHostCity')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('location.trackingActive')}</p>
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-white">{t('location.simulateCity')}</h3>
            <p className="text-xs text-muted-foreground">Test welcome notifications</p>
          </div>
        </div>
        
        <Select onValueChange={(value) => simulateCity(value)}>
          <SelectTrigger className="w-full bg-white/5 border-white/10">
            <SelectValue placeholder="Select a city to simulate..." />
          </SelectTrigger>
          <SelectContent>
            {DEMO_CITIES.map((city) => (
              <SelectItem key={city.key} value={city.key}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
