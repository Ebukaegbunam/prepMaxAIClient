import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const KEYS = {
  accessToken:  'prepmax_access_token',
  refreshToken: 'prepmax_refresh_token',
  expiresAt:    'prepmax_expires_at',
  userId:       'prepmax_user_id',
  userEmail:    'prepmax_user_email',
  userName:     'prepmax_user_name',
} as const;

export interface SessionUser {
  id: string;
  email?: string | null;
  name?: string | null;
}

interface SessionState {
  user: SessionUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isLoading: boolean;

  setSession: (user: SessionUser, accessToken: string, refreshToken: string, expiresAt: string) => Promise<void>;
  clearSession: () => Promise<void>;
  loadSession: () => Promise<void>;
  isAuthenticated: () => boolean;
  isTokenExpired: () => boolean;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  isLoading: true,

  setSession: async (user, accessToken, refreshToken, expiresAt) => {
    const exp = new Date(expiresAt).getTime();
    await Promise.all([
      SecureStore.setItemAsync(KEYS.accessToken,  accessToken),
      SecureStore.setItemAsync(KEYS.refreshToken, refreshToken),
      SecureStore.setItemAsync(KEYS.expiresAt,    String(exp)),
      SecureStore.setItemAsync(KEYS.userId,       user.id),
      SecureStore.setItemAsync(KEYS.userEmail,    user.email ?? ''),
      SecureStore.setItemAsync(KEYS.userName,     user.name ?? ''),
    ]);
    set({ user, accessToken, refreshToken, expiresAt: exp, isLoading: false });
  },

  clearSession: async () => {
    await Promise.all(Object.values(KEYS).map((k) => SecureStore.deleteItemAsync(k)));
    set({ user: null, accessToken: null, refreshToken: null, expiresAt: null, isLoading: false });
  },

  loadSession: async () => {
    try {
      const [accessToken, refreshToken, expiresAtStr, userId, userEmail, userName] = await Promise.all([
        SecureStore.getItemAsync(KEYS.accessToken),
        SecureStore.getItemAsync(KEYS.refreshToken),
        SecureStore.getItemAsync(KEYS.expiresAt),
        SecureStore.getItemAsync(KEYS.userId),
        SecureStore.getItemAsync(KEYS.userEmail),
        SecureStore.getItemAsync(KEYS.userName),
      ]);

      if (accessToken && refreshToken && userId) {
        set({
          accessToken,
          refreshToken,
          expiresAt: expiresAtStr ? Number(expiresAtStr) : null,
          user: { id: userId, email: userEmail || null, name: userName || null },
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  isAuthenticated: () => {
    const { accessToken, user } = get();
    return !!(accessToken && user);
  },

  isTokenExpired: () => {
    const { expiresAt } = get();
    if (!expiresAt) return true;
    // Expire 60s early to avoid race conditions
    return Date.now() > expiresAt - 60_000;
  },
}));
