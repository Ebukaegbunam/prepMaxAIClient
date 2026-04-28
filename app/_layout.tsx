import '../global.css';

import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSessionStore } from '@/state/session-store';
import { getProfile } from '@/api/endpoints/profile';
import { ApiRequestError } from '@/api/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 2 },
  },
});

type ProfileStatus = 'unknown' | 'exists' | 'missing';

function AuthGate() {
  const { isAuthenticated, isLoading, loadSession } = useSessionStore();
  const segments = useSegments();
  const router = useRouter();
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>('unknown');

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated()) return;
    if (profileStatus !== 'unknown') return;

    getProfile()
      .then(() => setProfileStatus('exists'))
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 404) {
          setProfileStatus('missing');
        } else {
          // Network error — assume profile exists, home will handle it
          setProfileStatus('exists');
        }
      });
  }, [isLoading, isAuthenticated()]);

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';
    const authed = isAuthenticated();

    if (!authed && !inAuth) {
      router.replace('/(auth)/sign-in');
      return;
    }

    if (authed && inAuth) {
      // Don't route until we know profile status
      if (profileStatus === 'unknown') return;
      if (profileStatus === 'missing') {
        router.replace('/(onboarding)/basics');
      } else {
        router.replace('/(tabs)/home');
      }
      return;
    }

    if (authed && !inOnboarding && !inAuth && profileStatus === 'missing') {
      router.replace('/(onboarding)/basics');
    }
  }, [isLoading, segments, profileStatus]);

  return null;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <AuthGate />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="settings" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
