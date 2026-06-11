const API_BASE = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:3000/api';

function getToken(): string | null {
  return localStorage.getItem('access_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    throw new Error('Session expirée, veuillez vous reconnecter');
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => ({})) as Record<string, unknown>;
    // Le back renvoie { error: { message, name, statusCode } } pour les ApiError
    const errObj = payload.error;
    const errMsg =
      typeof errObj === 'string' ? errObj
      : typeof errObj === 'object' && errObj !== null && 'message' in errObj ? String((errObj as Record<string,unknown>).message)
      : typeof payload.message === 'string' ? payload.message
      : `Erreur ${res.status}`;
    throw new Error(errMsg);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string) =>
    request<T>(path),
  post:   <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch:  <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};
