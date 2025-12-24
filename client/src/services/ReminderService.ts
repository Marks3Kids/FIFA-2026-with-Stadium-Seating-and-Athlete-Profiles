import { NotificationService } from './NotificationService';

interface ScheduledReminder {
  id: string;
  matchId: number;
  type: 'pack_bag' | 'leave_hotel' | 'gate_opens';
  triggerTime: Date;
  message: string;
  triggered: boolean;
}

const REMINDER_STORAGE_KEY = 'championship_reminders';

export class ReminderService {
  private reminders: ScheduledReminder[] = [];
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadReminders();
  }

  private loadReminders(): void {
    try {
      const stored = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.reminders = parsed.map((r: any) => ({
          ...r,
          triggerTime: new Date(r.triggerTime),
        }));
      }
    } catch (e) {
      this.reminders = [];
    }
  }

  private saveReminders(): void {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(this.reminders));
  }

  scheduleMatchReminders(
    matchId: number,
    matchDateTime: Date,
    homeTeam: string,
    awayTeam: string,
    venue: string
  ): void {
    const existingIds = this.reminders
      .filter(r => r.matchId === matchId)
      .map(r => r.id);
    
    if (existingIds.length > 0) {
      return;
    }

    const matchTime = new Date(matchDateTime);
    
    const packBagTime = new Date(matchTime.getTime() - 24 * 60 * 60 * 1000);
    if (packBagTime > new Date()) {
      this.reminders.push({
        id: `${matchId}_pack`,
        matchId,
        type: 'pack_bag',
        triggerTime: packBagTime,
        message: `Pack your bag for tomorrow's match: ${homeTeam} vs ${awayTeam} at ${venue}. Don't forget: tickets, ID, comfortable shoes, and a portable charger!`,
        triggered: false,
      });
    }

    const leaveHotelTime = new Date(matchTime.getTime() - 4 * 60 * 60 * 1000);
    if (leaveHotelTime > new Date()) {
      this.reminders.push({
        id: `${matchId}_leave`,
        matchId,
        type: 'leave_hotel',
        triggerTime: leaveHotelTime,
        message: `Time to head out! ${homeTeam} vs ${awayTeam} kicks off in 4 hours. Leave now to avoid traffic and explore the stadium area.`,
        triggered: false,
      });
    }

    const gateOpensTime = new Date(matchTime.getTime() - 2 * 60 * 60 * 1000);
    if (gateOpensTime > new Date()) {
      this.reminders.push({
        id: `${matchId}_gates`,
        matchId,
        type: 'gate_opens',
        triggerTime: gateOpensTime,
        message: `Stadium gates are now open for ${homeTeam} vs ${awayTeam}! Arrive early for the best experience and pre-match atmosphere.`,
        triggered: false,
      });
    }

    this.saveReminders();
  }

  startMonitoring(): void {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(() => {
      this.checkReminders();
    }, 60000);

    this.checkReminders();
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private checkReminders(): void {
    const now = new Date();

    for (const reminder of this.reminders) {
      if (!reminder.triggered && reminder.triggerTime <= now) {
        this.triggerReminder(reminder);
        reminder.triggered = true;
      }
    }

    this.reminders = this.reminders.filter(
      r => !r.triggered || r.triggerTime > new Date(now.getTime() - 24 * 60 * 60 * 1000)
    );

    this.saveReminders();
  }

  private triggerReminder(reminder: ScheduledReminder): void {
    const iconMap: Record<string, string> = {
      pack_bag: '🎒',
      leave_hotel: '🚗',
      gate_opens: '🏟️',
    };

    const titleMap: Record<string, string> = {
      pack_bag: 'Pack Your Match Day Bag',
      leave_hotel: 'Time to Leave',
      gate_opens: 'Stadium Gates Open',
    };

    NotificationService.addNotification({
      type: 'reminder',
      title: titleMap[reminder.type] || 'Match Reminder',
      message: reminder.message,
      icon: iconMap[reminder.type] || '⏰',
      priority: reminder.type === 'leave_hotel' ? 'high' : 'medium',
    });
  }

  cancelMatchReminders(matchId: number): void {
    this.reminders = this.reminders.filter(r => r.matchId !== matchId);
    this.saveReminders();
  }

  getScheduledReminders(): ScheduledReminder[] {
    return [...this.reminders].filter(r => !r.triggered);
  }
}

export const reminderService = new ReminderService();
