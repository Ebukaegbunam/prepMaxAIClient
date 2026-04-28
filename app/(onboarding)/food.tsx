import { useRouter } from 'expo-router';
import { useOnboardingStore } from '@/state/onboarding-store';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';
import { Field, SegmentPicker, ChipGroup } from '@/components/onboarding/fields';

const DIET_OPTIONS = [
  'Gluten-free', 'Dairy-free', 'Vegetarian', 'Vegan',
  'Nut-free', 'Kosher', 'Halal', 'Low-FODMAP',
];

const EQUIPMENT_OPTIONS = [
  'Oven', 'Microwave', 'Air fryer', 'Instant pot',
  'Blender', 'Rice cooker', 'Grill', 'Meal prep containers',
];

export default function FoodScreen() {
  const router = useRouter();
  const store = useOnboardingStore();

  const canContinue = store.cooking_skill !== null;

  return (
    <OnboardingShell
      step={4}
      title="Food preferences"
      subtitle="We'll build meal plans you'll actually want to eat."
      onContinue={() => router.push('/(onboarding)/prep')}
      continueDisabled={!canContinue}
    >
      <SegmentPicker
        label="Cooking skill"
        options={[
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Mid' },
          { value: 'advanced', label: 'Advanced' },
        ]}
        value={store.cooking_skill}
        onChange={(v) => store.set({ cooking_skill: v })}
      />

      <ChipGroup
        label="Dietary restrictions"
        options={DIET_OPTIONS}
        selected={store.dietary_restrictions}
        onChange={(v) => store.set({ dietary_restrictions: v })}
      />

      <ChipGroup
        label="Kitchen equipment"
        options={EQUIPMENT_OPTIONS}
        selected={store.kitchen_equipment}
        onChange={(v) => store.set({ kitchen_equipment: v })}
      />

      <Field
        label="Foods you love (comma-separated)"
        value={store.loved_foods}
        onChangeText={(v) => store.set({ loved_foods: v })}
        placeholder="chicken, rice, eggs, oats"
        returnKeyType="next"
      />

      <Field
        label="Foods you hate (comma-separated)"
        value={store.hated_foods}
        onChangeText={(v) => store.set({ hated_foods: v })}
        placeholder="brussels sprouts, liver"
        returnKeyType="next"
      />

      <Field
        label="Anything else about your diet? (optional)"
        value={store.free_text_about_me}
        onChangeText={(v) => store.set({ free_text_about_me: v })}
        placeholder="I meal prep Sunday evenings, can't cook during the week..."
        multiline
        numberOfLines={3}
        style={{ minHeight: 80, textAlignVertical: 'top', paddingTop: 12 }}
        returnKeyType="done"
      />
    </OnboardingShell>
  );
}
