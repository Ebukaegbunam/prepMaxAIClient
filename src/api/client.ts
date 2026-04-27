import * as SecureStore from 'expo-secure-store';
import { logger } from '@/lib/logger';

// TODO(env): move to src/config/env.ts once env management is set up
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000/v1';

const NETWORK_BUFFER_SIZE = 20;

interface NetworkEvent {
  timestamp: string;
  method: string;
  url: string;
  status?: number;
  duration_ms?: number;
  request_id?: string;
}

const networkBuffer: NetworkEvent[] = [];

function trackNetwork(event: NetworkEvent) {
  if (networkBuffer.length >= NETWORK_BUFFER_SIZE) {
    networkBuffer.shift();
  }
  networkBuffer.push(event);
}

export function getNetworkBuffer(): NetworkEvent[] {
  return [...networkBuffer];
}

async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync('access_token');
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = await SecureStore.getItemAsync('refresh_token');
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json() as { session: { access_token: string; refresh_token: string } };
    await SecureStore.setItemAsync('access_token', data.session.access_token);
    await SecureStore.setItemAsync('refresh_token', data.session.refresh_token);
    return true;
  } catch {
    return false;
  }
}

interface ApiError {
  error: { code: string; message: string; retry_after?: number; details?: unknown };
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly retryAfter?: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retried = false,
): Promise<T> {
  const token = await getAccessToken();
  const url = `${BASE_URL}${path}`;
  const start = Date.now();
  const method = (options.method ?? 'GET').toUpperCase();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  const duration_ms = Date.now() - start;
  const requestId = res.headers.get('x-request-id') ?? undefined;

  trackNetwork({ timestamp: new Date().toISOString(), method, url, status: res.status, duration_ms, request_id: requestId });
  logger.info(`${method} ${path}`, { status: res.status, duration_ms, request_id: requestId });

  if (res.status === 401 && !retried) {
    const refreshed = await refreshTokens();
    if (refreshed) return apiFetch<T>(path, options, true);
    // Force sign-out handled by caller via catching 401 ApiRequestError.
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: { code: 'parse_error', message: 'Failed to parse error response' } })) as ApiError;
    throw new ApiRequestError(res.status, body.error.code, body.error.message, body.error.retry_after);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};
