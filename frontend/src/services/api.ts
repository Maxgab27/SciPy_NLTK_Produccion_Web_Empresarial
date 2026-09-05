import { requestJson } from './http';
export const API_BASE_URL = '/api';
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}, fallbackData?: T): Promise<{ data: T; isFallback: boolean }> {
  try {
    return { data: await requestJson<T>(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, options), isFallback: false };
  } catch (error) {
    if (fallbackData !== undefined && (options.method ?? 'GET').toUpperCase() === 'GET') return { data: fallbackData, isFallback: true };
    throw error;
  }
}
