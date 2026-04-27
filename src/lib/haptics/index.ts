import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import type { hapticMap } from '@/constants/theme';

type HapticEvent = keyof typeof hapticMap;

const hapticHandlers: Record<HapticEvent, () => Promise<void>> = {
  tabChange: () => Haptics.selectionAsync(),
  dayChange: () => Haptics.selectionAsync(),
  buttonPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  setLogged: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  workoutComplete: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  mealLogged: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  weeklyCheckInSubmit: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  photoCaptured: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  aiSuggestionAccepted: () => Haptics.selectionAsync(),
  aiSuggestionRejected: () => Haptics.selectionAsync(),
  errorToast: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
  warningToast: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  longPressStart: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  pullToRefreshThreshold: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
};

let lastHapticAt = 0;
const MIN_HAPTIC_GAP_MS = 100;

// useHaptic returns a stable callback that fires the correct haptic for an event.
// Respects the 100ms minimum gap between haptics.
// TODO(settings): check user's global haptics-disabled preference before firing.
export function useHaptic() {
  return useCallback((event: HapticEvent) => {
    const now = Date.now();
    if (now - lastHapticAt < MIN_HAPTIC_GAP_MS) return;
    lastHapticAt = now;
    hapticHandlers[event]().catch(() => { /* haptics are best-effort */ });
  }, []);
}
