import { Redirect } from 'expo-router';

// AuthGate in _layout.tsx handles all routing logic.
// This just renders a redirect to kick the router; AuthGate will override it.
export default function Entry() {
  return <Redirect href="/(auth)/sign-in" />;
}
