import { create } from 'zustand';

export type Sex = 'male' | 'female';
export type UnitsWeight = 'kg' | 'lb';
export type UnitsMeasurement = 'cm' | 'in';
export type CookingSkill = 'beginner' | 'intermediate' | 'advanced';
export type StressLevel = 'low' | 'moderate' | 'high';
export type TrainingTime = 'morning' | 'midday' | 'evening';
export type Division = 'classic_physique' | 'mens_physique' | 'bikini' | 'wellness';

export interface OnboardingDraft {
  // Step 1 — basics
  name: string;
  age: string;
  sex: Sex | null;
  height_cm: string;
  // Step 2 — body
  units_weight: UnitsWeight;
  units_measurement: UnitsMeasurement;
  starting_weight_kg: string;
  starting_bf_pct: string;
  // Step 3 — lifestyle
  job_type: string;
  work_hours: string;
  stress_level: StressLevel | null;
  sleep_window: string;
  preferred_training_time: TrainingTime | null;
  training_days_per_week: number;
  // Step 4 — food
  dietary_restrictions: string[];
  cooking_skill: CookingSkill | null;
  loved_foods: string;
  hated_foods: string;
  kitchen_equipment: string[];
  free_text_about_me: string;
  // Step 5 — prep
  division: Division | null;
  target_weight_kg: string;
  target_bf_pct: string;
  maintenance_weeks: number;
  cut_weeks: number;
  // Step 6 — competition
  target_competition_id: string | null;
  target_competition_name: string | null;
}

const DEFAULT: OnboardingDraft = {
  name: '',
  age: '',
  sex: null,
  height_cm: '',
  units_weight: 'lb',
  units_measurement: 'in',
  starting_weight_kg: '',
  starting_bf_pct: '',
  job_type: '',
  work_hours: '9-5',
  stress_level: null,
  sleep_window: '10pm-6am',
  preferred_training_time: null,
  training_days_per_week: 5,
  dietary_restrictions: [],
  cooking_skill: null,
  loved_foods: '',
  hated_foods: '',
  kitchen_equipment: [],
  free_text_about_me: '',
  division: null,
  target_weight_kg: '',
  target_bf_pct: '',
  maintenance_weeks: 2,
  cut_weeks: 14,
  target_competition_id: null,
  target_competition_name: null,
};

interface OnboardingStore extends OnboardingDraft {
  set: (patch: Partial<OnboardingDraft>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((setState) => ({
  ...DEFAULT,
  set: (patch) => setState((s) => ({ ...s, ...patch })),
  reset: () => setState(() => ({ ...DEFAULT, set: undefined as never, reset: undefined as never })),
}));
