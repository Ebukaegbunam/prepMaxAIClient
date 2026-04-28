const _require = (key: string, fallback?: string): string => {
  const val = process.env[key] ?? fallback ?? '';
  return val;
};

export const ENV = {
  API_URL: _require('EXPO_PUBLIC_API_URL', 'http://localhost:8000/v1'),
  SUPABASE_URL: _require('EXPO_PUBLIC_SUPABASE_URL'),
  POWERSYNC_URL: _require('EXPO_PUBLIC_POWERSYNC_URL'),
} as const;
