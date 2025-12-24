import { reminderService } from './ReminderService';
import { triggerStadiumEntryAlert, checkStadiumProximity } from './StadiumProximityService';
import { checkCurrencyChange } from './CurrencyAlertService';
import { checkSafetyAlerts, checkProximityToSafetyZone, triggerZoneSafetyAlert, getCitySafetyInfo } from './SafetyAlertService';
import { checkMatchResults, getFollowedTeams } from './MatchResultService';
import { triggerGameDayAlerts } from './GameDayService';
import { checkForWeatherAlerts } from './WeatherService';

const TRIGGER_CHECK_INTERVAL = 5 * 60 * 1000;
const LAST_CHECK_KEY = 'trigger_last_check';

class TriggerManager {
  private intervalId: NodeJS.Timeout | null = null;
  private currentCityKey: string | null = null;
  private isRunning = false;

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    reminderService.startMonitoring();

    this.runAllChecks();
    this.intervalId = setInterval(() => {
      this.runAllChecks();
    }, TRIGGER_CHECK_INTERVAL);
  }

  stop(): void {
    this.isRunning = false;
    reminderService.stopMonitoring();
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async runAllChecks(): Promise<void> {
    const lastCheck = localStorage.getItem(LAST_CHECK_KEY);
    const now = Date.now();
    
    if (lastCheck && now - parseInt(lastCheck) < 60000) {
      return;
    }
    localStorage.setItem(LAST_CHECK_KEY, now.toString());

    try {
      await this.checkGameDay();
      await this.checkMatchResults();
      
      if (this.currentCityKey) {
        this.checkWeatherTriggers();
        this.checkSafetyTriggers();
      }
    } catch (error) {
      console.error('Trigger check failed:', error);
    }
  }

  setCurrentCity(cityKey: string | null): void {
    const previousCity = this.currentCityKey;
    this.currentCityKey = cityKey;

    if (cityKey && cityKey !== previousCity) {
      checkCurrencyChange(cityKey);
      checkSafetyAlerts(cityKey);
    }
  }

  updateLocation(lat: number, lon: number): void {
    triggerStadiumEntryAlert(lat, lon);

    if (this.currentCityKey) {
      const safetyInfo = getCitySafetyInfo(this.currentCityKey);
      if (safetyInfo) {
        const dangerZone = checkProximityToSafetyZone(this.currentCityKey, lat, lon);
        if (dangerZone) {
          triggerZoneSafetyAlert(dangerZone, safetyInfo.cityName);
        }
      }
    }
  }

  scheduleMatchReminders(
    matchId: number,
    matchDateTime: Date,
    homeTeam: string,
    awayTeam: string,
    venue: string
  ): void {
    reminderService.scheduleMatchReminders(matchId, matchDateTime, homeTeam, awayTeam, venue);
  }

  cancelMatchReminders(matchId: number): void {
    reminderService.cancelMatchReminders(matchId);
  }

  private async checkGameDay(): Promise<void> {
    await triggerGameDayAlerts();
  }

  private async checkMatchResults(): Promise<void> {
    const followedTeams = getFollowedTeams();
    if (followedTeams.length > 0) {
      await checkMatchResults();
    }
  }

  private async checkWeatherTriggers(): Promise<void> {
    if (this.currentCityKey) {
      await checkForWeatherAlerts(this.currentCityKey);
    }
  }

  private checkSafetyTriggers(): void {
    if (this.currentCityKey) {
      checkSafetyAlerts(this.currentCityKey);
    }
  }

  getStatus(): {
    isRunning: boolean;
    currentCity: string | null;
    followedTeams: string[];
    scheduledReminders: number;
  } {
    return {
      isRunning: this.isRunning,
      currentCity: this.currentCityKey,
      followedTeams: getFollowedTeams(),
      scheduledReminders: reminderService.getScheduledReminders().length,
    };
  }
}

export const triggerManager = new TriggerManager();
