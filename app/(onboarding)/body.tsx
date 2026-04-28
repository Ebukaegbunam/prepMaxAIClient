import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@/state/onboarding-store';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { Field, SegmentPicker } from '@/components/onboarding/fields';

export default function BodyScreen() {
  const router = useRouter();
  const store = useOnboardingStore();

  const weightLabel = store.units_weight === 'lb' ? 'Current weight (lb)' : 'Current weight (kg)';
  const weightPlaceholder = store.units_weight === 'lb' ? '185' : '84';

  const canContinue = store.starting_weight_kg.trim().length > 0;

  const handleContinue = () => {
    router.push('/(onboarding)/lifestyle');
  };

  return (
    <OnboardingShell
      step={2}
      title="Body stats"
      subtitle="We'll convert everything to kg internally."
      onContinue={handleContinue}
      continueDisabled={!canContinue}
    >
      <SegmentPicker
        label="Weight unit"
        options={[
          { value: 'lb', label: 'Pounds (lb)' },
          { value: 'kg', label: 'Kilograms (kg)' },
        ]}
        value={store.units_weight}
        onChange={(v) => store.set({ units_weight: v })}
      />

      <SegmentPicker
        label="Measurement unit"
        options={[
          { value: 'in', label: 'Inches (in)' },
          { value: 'cm', label: 'Centimeters (cm)' },
        ]}
        value={store.units_measurement}
        onChange={(v) => store.set({ units_measurement: v })}
      />

      <Field
        label={weightLabel}
        value={store.starting_weight_kg}
        onChangeText={(v) => store.set({ starting_weight_kg: v.replace(/[^0-9.]/g, '') })}
        placeholder={weightPlaceholder}
        keyboardType="decimal-pad"
        suffix={store.units_weight}
        returnKeyType="next"
      />

      <Field
        label="Body fat % (optional)"
        value={store.starting_bf_pct}
        onChangeText={(v) => store.set({ starting_bf_pct: v.replace(/[^0-9.]/g, '') })}
        placeholder="14"
        keyboardType="decimal-pad"
        suffix="%"
        returnKeyType="done"
      />
    </OnboardingShell>
  );
}
