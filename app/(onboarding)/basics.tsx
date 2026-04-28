import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@/state/onboarding-store';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { Field, SegmentPicker } from '@/components/onboarding/fields';

export default function BasicsScreen() {
  const router = useRouter();
  const store = useOnboardingStore();

  const canContinue = store.name.trim().length > 0
    && store.age.trim().length > 0
    && store.sex !== null
    && store.height_cm.trim().length > 0;

  const handleContinue = () => {
    router.push('/(onboarding)/body');
  };

  return (
    <OnboardingShell
      step={1}
      title="About you"
      subtitle="Basic info so we can build your prep."
      onContinue={handleContinue}
      continueDisabled={!canContinue}
    >
      <Field
        label="Full name"
        value={store.name}
        onChangeText={(v) => store.set({ name: v })}
        placeholder="Ebuka"
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
      />

      <Field
        label="Age"
        value={store.age}
        onChangeText={(v) => store.set({ age: v.replace(/[^0-9]/g, '') })}
        placeholder="25"
        keyboardType="number-pad"
        returnKeyType="next"
      />

      <SegmentPicker
        label="Sex"
        options={[
          { value: 'male', label: 'Male' },
          { value: 'female', label: 'Female' },
        ]}
        value={store.sex}
        onChange={(v) => store.set({ sex: v })}
      />

      <Field
        label="Height (cm)"
        value={store.height_cm}
        onChangeText={(v) => store.set({ height_cm: v.replace(/[^0-9.]/g, '') })}
        placeholder="178"
        keyboardType="decimal-pad"
        suffix="cm"
        returnKeyType="done"
      />
    </OnboardingShell>
  );
}
