import { Capacitor } from '@capacitor/core';

const getApiBaseUrl = (): string => {
  if (Capacitor.isNativePlatform()) {
    return import.meta.env.VITE_API_URL || 'https://worldcupcompanion2026.replit.app';
  }
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export const apiUrl = (path: string): string => {
  if (path.startsWith('/')) {
    return `${API_BASE_URL}${path}`;
  }
  return `${API_BASE_URL}/${path}`;
};