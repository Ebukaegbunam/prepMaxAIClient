import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="basics" />
      <Stack.Screen name="body" />
      <Stack.Screen name="lifestyle" />
      <Stack.Screen name="food" />
      <Stack.Screen name="prep" />
      <Stack.Screen name="competition" />
      <Stack.Screen name="submitting" />
    </Stack>
  );
}
