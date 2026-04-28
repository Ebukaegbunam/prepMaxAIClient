import '../global.css';

import { useEffect, useRef, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSessionStore } from '@/state/session-store';
import { getProfile } from '@/api/endpoints/profile';
import { ApiRequestError } from '@/api/client';

// Hold the native splash until we know where to send the user.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 2 },
  },
});

type ProfileStatus = 'unknown' | 'exists' | 'missing';

function AuthGate() {
  const { user, accessToken, isLoading, loadSession } = useSessionStore();
  const segments = useSegments();
  const router = useRouter();
  const authed = !!(user && accessToken);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus>('unknown');
  const splashHidden = useRef(false);

  function revealApp() {
    if (splashHidden.current) return;
    splashHidden.current = true;
    SplashScreen.hideAsync().catch(() => {});
  }

  useEffect(() => {
    loadSession();
  }, []);

  // Reset profile check on sign-out so every new sign-in re-checks
  useEffect(() => {
    if (!authed) setProfileStatus('unknown');
  }, [authed]);

  // Fetch profile as soon as we know the user is authenticated
  useEffect(() => {
    if (isLoading || !authed || profileStatus !== 'unknown') return;
    getProfile()
      .then(() => setProfileStatus('exists'))
      .catch((err) => {
        if (err instanceof ApiRequestError && err.status === 404) {
          setProfileStatus('missing');
        } else {
          setProfileStatus('exists'); // network error — assume profile exists
        }
      });
  }, [isLoading, authed, profileStatus]);

  // Route once we have a definitive answer, then reveal the app
  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inTabs = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!authed) {
      if (!inAuth) router.replace('/(auth)/sign-in');
      revealApp();
      return;
    }

    // Authenticated but still waiting for profile check — keep splash up
    if (profileStatus === 'unknown') return;

    if (profileStatus === 'missing') {
      if (!inOnboarding) router.replace('/(onboarding)/basics');
    } else {
      if (!inTabs) router.replace('/(tabs)/home');
    }
    revealApp();
  }, [isLoading, authed, segments, profileStatus]);

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
