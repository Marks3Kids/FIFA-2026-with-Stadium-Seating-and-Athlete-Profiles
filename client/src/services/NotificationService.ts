export type NotificationType = 
  | 'welcome' 
  | 'weather' 
  | 'gameday' 
  | 'safety' 
  | 'transport' 
  | 'general'
  | 'reminder'
  | 'stadium'
  | 'currency'
  | 'matchResult';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, unknown>;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const NOTIFICATION_STORAGE_KEY = 'wc2026_notifications';

export function getStoredNotifications(): AppNotification[] {
  try {
    const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!stored) return [];
    const notifications = JSON.parse(stored);
    return notifications.map((n: AppNotification) => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }));
  } catch {
    return [];
  }
}

export function storeNotification(notification: AppNotification): void {
  const notifications = getStoredNotifications();
  notifications.unshift(notification);
  const limited = notifications.slice(0, 50);
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(limited));
}

export function markNotificationRead(id: string): void {
  const notifications = getStoredNotifications();
  const updated = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updated));
}

export function clearNotifications(): void {
  localStorage.removeItem(NOTIFICATION_STORAGE_KEY);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendPushNotification(notification: AppNotification): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const iconMap: Record<string, string> = {
    welcome: '🎉',
    weather: '🌡️',
    gameday: '⚽',
    safety: '🚨',
    transport: '🚌',
    general: '📱',
  };

  new Notification(notification.title, {
    body: notification.body,
    icon: '/pwa-192x192.svg',
    tag: notification.id,
    badge: '/pwa-192x192.svg',
    data: notification.data,
    requireInteraction: notification.type === 'safety',
  });
}

export function createNotification(
  type: AppNotification['type'],
  title: string,
  body: string,
  options?: {
    actionUrl?: string;
    data?: Record<string, unknown>;
    sendPush?: boolean;
  }
): AppNotification {
  const notification: AppNotification = {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    body,
    timestamp: new Date(),
    read: false,
    actionUrl: options?.actionUrl,
    data: options?.data,
  };

  storeNotification(notification);

  if (options?.sendPush) {
    sendPushNotification(notification);
  }

  return notification;
}

export function createWelcomeNotification(cityName: string, motto: string): AppNotification {
  return createNotification(
    'welcome',
    `🎉 Welcome to ${cityName}!`,
    motto,
    { sendPush: true, actionUrl: '/cities' }
  );
}

export function createWeatherAlert(
  cityName: string,
  temperatureF: number,
  recommendation: string
): AppNotification {
  return createNotification(
    'weather',
    `🌡️ Hydration Alert: ${cityName} is ${Math.round(temperatureF)}°F today`,
    recommendation,
    { sendPush: true, actionUrl: '/critical-info' }
  );
}

export function createGameDayNotification(
  team1: string,
  team2: string,
  stadium: string,
  hoursUntilKickoff: number,
  transportTip: string
): AppNotification {
  return createNotification(
    'gameday',
    `⚽ ${team1} vs ${team2} in ${hoursUntilKickoff} hours`,
    `Heading to ${stadium}? ${transportTip}`,
    { sendPush: true, actionUrl: '/transportation' }
  );
}

export function createTransportNotification(
  message: string,
  actionUrl?: string
): AppNotification {
  return createNotification(
    'transport',
    '🚌 Transport Update',
    message,
    { sendPush: true, actionUrl }
  );
}

export interface AddNotificationOptions {
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  data?: Record<string, unknown>;
}

export const NotificationService = {
  addNotification(options: AddNotificationOptions): AppNotification {
    return createNotification(
      options.type,
      `${options.icon || ''} ${options.title}`.trim(),
      options.message,
      { 
        sendPush: options.priority === 'high', 
        actionUrl: options.actionUrl,
        data: options.data,
      }
    );
  },

  getAll(): AppNotification[] {
    return getStoredNotifications();
  },

  markRead(id: string): void {
    markNotificationRead(id);
  },

  clearAll(): void {
    clearNotifications();
  },

  markAllAsRead(): void {
    const notifications = getStoredNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('wc2026_notifications', JSON.stringify(updated));
  },
};
