import { useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@/state/onboarding-store';
import { initializeProfile } from '@/api/endpoints/profile';
import { createPrep } from '@/api/endpoints/preps';
import { colors, typography } from '@/constants/theme';
import { logger } from '@/lib/logger';

function lbToKg(lb: number) { return lb * 0.45359237; }

export default function SubmittingScreen() {
  const router = useRouter();
  const store = useOnboardingStore();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    submit();
  }, []);

  async function submit() {
    try {
      const isLb = store.units_weight === 'lb';
      const toKg = (raw: string) => {
        const n = parseFloat(raw);
        if (isNaN(n)) return 0;
        return isLb ? lbToKg(n) : n;
      };

      const startingWeightKg = toKg(store.starting_weight_kg);
      const targetWeightKg = toKg(store.target_weight_kg);
      const startingBfPct = store.starting_bf_pct ? parseFloat(store.starting_bf_pct) : undefined;
      const targetBfPct = store.target_bf_pct ? parseFloat(store.target_bf_pct) : undefined;

      await initializeProfile({
        name: store.name.trim(),
        age: parseInt(store.age, 10),
        sex: store.sex!,
        height_cm: parseFloat(store.height_cm),
        units_weight: store.units_weight,
        units_measurement: store.units_measurement,
        dietary_restrictions: store.dietary_restrictions,
        loved_foods: store.loved_foods.split(',').map((s) => s.trim()).filter(Boolean),
        hated_foods: store.hated_foods.split(',').map((s) => s.trim()).filter(Boolean),
        cooking_skill: store.cooking_skill!,
        kitchen_equipment: store.kitchen_equipment,
        job_type: store.job_type,
        work_hours: store.work_hours,
        stress_level: store.stress_level!,
        sleep_window: store.sleep_window,
        preferred_training_time: store.preferred_training_time!,
        training_days_per_week: store.training_days_per_week,
        free_text_about_me: store.free_text_about_me || undefined,
      });

      await createPrep({
        division: store.division!,
        start_date: new Date().toISOString().split('T')[0],
        starting_weight_kg: startingWeightKg,
        starting_bf_pct: startingBfPct,
        target_weight_kg: targetWeightKg,
        target_bf_pct: targetBfPct,
        target_competition_id: store.target_competition_id ?? undefined,
        phase_split: {
          maintenance_weeks: store.maintenance_weeks,
          cut_weeks: store.cut_weeks,
        },
      });

      store.reset();
      router.replace('/(tabs)/home');
    } catch (err) {
      logger.error('Onboarding submission failed', { err });
      router.back();
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[0], alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color={colors.brand[500]} style={{ marginBottom: 20 }} />
      <Text style={{ ...typography.title3, color: colors.neutral[700] }}>
        Building your prep…
      </Text>
      <Text style={{ ...typography.body, color: colors.neutral[400], marginTop: 8 }}>
        This only takes a moment.
      </Text>
    </SafeAreaView>
  );
}
