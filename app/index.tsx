import { Redirect } from 'expo-router';

// TODO(phase-auth): check tokens from expo-secure-store.
// - No tokens → (auth)/sign-in
// - Tokens present, no profile → (onboarding)/welcome
// - Tokens + profile → (tabs)/home
// For now, route straight to auth.
export default function Entry() {
  return <Redirect href="/(auth)/sign-in" />;
}
