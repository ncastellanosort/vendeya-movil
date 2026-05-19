export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';
export const SCAN_API_URL = process.env.EXPO_PUBLIC_SCAN_API_URL_LOCAL ?? 'http://localhost:8080/scan/';
export const SCAN_HEALTH_URL = SCAN_API_URL.replace(/\/scan\/?$/, '/health');
export const API_TIMEOUT = 30000;
