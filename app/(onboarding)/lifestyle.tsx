import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@/state/onboarding-store';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { Field, SegmentPicker, Stepper } from '@/components/onboarding/fields';

const WORK_HOURS = [
  { value: '9-5', label: '9–5' },
  { value: 'shift', label: 'Shift' },
  { value: 'flexible', label: 'Flex' },
  { value: 'variable', label: 'Variable' },
];

export default function LifestyleScreen() {
  const router = useRouter();
  const store = useOnboardingStore();

  const canContinue = store.job_type.trim().length > 0
    && store.stress_level !== null
    && store.sleep_window.trim().length > 0
    && store.preferred_training_time !== null;

  return (
    <OnboardingShell
      step={3}
      title="Your lifestyle"
      subtitle="Helps us plan around your real schedule."
      onContinue={() => router.push('/(onboarding)/food')}
      continueDisabled={!canContinue}
    >
      <Field
        label="Job / occupation"
        value={store.job_type}
        onChangeText={(v) => store.set({ job_type: v })}
        placeholder="Software engineer"
        autoCapitalize="words"
        returnKeyType="next"
      />

      <SegmentPicker
        label="Work hours"
        options={WORK_HOURS}
        value={store.work_hours as typeof WORK_HOURS[0]['value']}
        onChange={(v) => store.set({ work_hours: v })}
      />

      <SegmentPicker
        label="Stress level"
        options={[
          { value: 'low', label: 'Low' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'high', label: 'High' },
        ]}
        value={store.stress_level}
        onChange={(v) => store.set({ stress_level: v })}
      />

      <Field
        label="Sleep window"
        value={store.sleep_window}
        onChangeText={(v) => store.set({ sleep_window: v })}
        placeholder="10pm – 6am"
        returnKeyType="done"
      />

      <SegmentPicker
        label="Training time"
        options={[
          { value: 'morning', label: 'Morning' },
          { value: 'midday', label: 'Midday' },
          { value: 'evening', label: 'Evening' },
        ]}
        value={store.preferred_training_time}
        onChange={(v) => store.set({ preferred_training_time: v })}
      />

      <Stepper
        label="Training days per week"
        value={store.training_days_per_week}
        min={1}
        max={7}
        onChange={(v) => store.set({ training_days_per_week: v })}
        suffix="d"
      />
    </OnboardingShell>
  );
}
