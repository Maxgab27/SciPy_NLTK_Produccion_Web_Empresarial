// Cliente base para comunicación con el backend FastAPI
export const API_BASE_URL = 'http://localhost:8000/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<{ data: T; isFallback: boolean }> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error en API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { data, isFallback: false };
  } catch (error) {
    console.warn(`Aviso de conexión con el backend [${endpoint}]:`, error);
    if (fallbackData !== undefined) {
      return { data: fallbackData, isFallback: true };
    }
    throw error;
  }
}
