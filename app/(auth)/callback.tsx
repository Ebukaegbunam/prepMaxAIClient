import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/api/client';
import { AuthResponseSchema } from '@/api/schemas';
import { useSessionStore } from '@/state/session-store';
import { colors } from '@/constants/theme';
import { logger } from '@/lib/logger';

export default function AuthCallback() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!code) {
      router.replace('/(auth)/sign-in');
      return;
    }

    (async () => {
      try {
        const codeVerifier = await SecureStore.getItemAsync('prepmax_pkce_verifier') ?? '';
        const raw = await api.post('auth/google/callback', { code, code_verifier: codeVerifier });
        const parsed = AuthResponseSchema.parse(raw);
        await useSessionStore.getState().setSession(
          parsed.user,
          parsed.session.access_token,
          parsed.session.refresh_token,
          parsed.session.expires_at,
        );
        await SecureStore.deleteItemAsync('prepmax_pkce_verifier');
        router.replace('/(tabs)/home');
      } catch (err) {
        logger.error('OAuth callback failed', { err });
        router.replace('/(auth)/sign-in');
      }
    })();
  }, [code]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral[0] }}>
      <ActivityIndicator size="large" color={colors.brand[500]} />
    </View>
  );
}
