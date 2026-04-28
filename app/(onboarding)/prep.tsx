import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboardingStore, type Division } from '@/state/onboarding-store';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { Field, SegmentPicker, Stepper } from '@/components/onboarding/fields';
import { colors, typography } from '@/constants/theme';

const DIVISIONS: { value: Division; label: string }[] = [
  { value: 'classic_physique', label: 'Classic' },
  { value: 'mens_physique', label: "Men's Physique" },
  { value: 'bikini', label: 'Bikini' },
  { value: 'wellness', label: 'Wellness' },
];

export default function PrepScreen() {
  const router = useRouter();
  const store = useOnboardingStore();

  const totalWeeks = store.maintenance_weeks + store.cut_weeks;
  const weightUnit = store.units_weight;
  const targetLabel = `Target weight (${weightUnit})`;

  const canContinue = store.division !== null && store.target_weight_kg.trim().length > 0;

  return (
    <OnboardingShell
      step={5}
      title="Your prep"
      subtitle="We'll calculate your 16-week plan from these numbers."
      onContinue={() => router.push('/(onboarding)/competition')}
      continueDisabled={!canContinue}
    >
      <SegmentPicker
        label="Division"
        options={DIVISIONS}
        value={store.division}
        onChange={(v) => store.set({ division: v })}
      />

      <Field
        label={targetLabel}
        value={store.target_weight_kg}
        onChangeText={(v) => store.set({ target_weight_kg: v.replace(/[^0-9.]/g, '') })}
        placeholder={weightUnit === 'lb' ? '170' : '77'}
        keyboardType="decimal-pad"
        suffix={weightUnit}
        returnKeyType="next"
      />

      <Field
        label="Target body fat % (optional)"
        value={store.target_bf_pct}
        onChangeText={(v) => store.set({ target_bf_pct: v.replace(/[^0-9.]/g, '') })}
        placeholder="5"
        keyboardType="decimal-pad"
        suffix="%"
        returnKeyType="done"
      />

      <View style={{ marginBottom: 16 }}>
        <Text style={{ ...typography.footnote, color: colors.neutral[600], fontWeight: '600', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Phase split ({totalWeeks} weeks total)
        </Text>
        <Stepper
          label="Maintenance weeks"
          value={store.maintenance_weeks}
          min={0}
          max={8}
          onChange={(v) => store.set({ maintenance_weeks: v })}
          suffix="w"
        />
        <Stepper
          label="Cut weeks"
          value={store.cut_weeks}
          min={4}
          max={20}
          onChange={(v) => store.set({ cut_weeks: v })}
          suffix="w"
        />
        <Text style={{ ...typography.footnote, color: colors.neutral[500], marginTop: 4 }}>
          Start date defaults to today. You can adjust later in Settings.
        </Text>
      </View>
    </OnboardingShell>
  );
}
