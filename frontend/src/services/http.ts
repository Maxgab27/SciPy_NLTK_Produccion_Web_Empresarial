export async function requestJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) throw new Error(`La solicitud fue rechazada (HTTP ${response.status}).`);
  return response.json();
}
