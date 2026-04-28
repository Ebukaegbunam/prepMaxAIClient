import { z } from 'zod';

// ─── Auth ──────────────────────────────────────────────────────────────────

export const SessionSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.string(),
});

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
});

export const AuthResponseSchema = z.object({
  user: AuthUserSchema,
  session: SessionSchema,
});

// legacy alias
export const AuthCallbackResponseSchema = AuthResponseSchema;

export type Session = z.infer<typeof SessionSchema>;
export type AuthUser = z.infer<typeof AuthUserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ─── Profile ───────────────────────────────────────────────────────────────

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string(),
  age: z.number().int().positive(),
  sex: z.enum(['male', 'female']),
  height_cm: z.number().positive(),
  units_weight: z.enum(['kg', 'lb']),
  units_measurement: z.enum(['cm', 'in']),
  dietary_restrictions: z.array(z.string()),
  loved_foods: z.array(z.string()),
  hated_foods: z.array(z.string()),
  cooking_skill: z.enum(['beginner', 'intermediate', 'advanced']),
  kitchen_equipment: z.array(z.string()),
  job_type: z.string(),
  work_hours: z.string(),
  stress_level: z.enum(['low', 'moderate', 'high']),
  sleep_window: z.string(),
  preferred_training_time: z.enum(['morning', 'midday', 'evening']),
  training_days_per_week: z.number().int().min(1).max(7),
  narrative: z.string().nullable(),
  narrative_updated_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProfileInitializeSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().min(16).max(80),
  sex: z.enum(['male', 'female']),
  height_cm: z.number().positive(),
  units_weight: z.enum(['kg', 'lb']),
  units_measurement: z.enum(['cm', 'in']),
  dietary_restrictions: z.array(z.string()).default([]),
  loved_foods: z.array(z.string()).default([]),
  hated_foods: z.array(z.string()).default([]),
  cooking_skill: z.enum(['beginner', 'intermediate', 'advanced']),
  kitchen_equipment: z.array(z.string()).default([]),
  job_type: z.string(),
  work_hours: z.string(),
  stress_level: z.enum(['low', 'moderate', 'high']),
  sleep_window: z.string(),
  preferred_training_time: z.enum(['morning', 'midday', 'evening']),
  training_days_per_week: z.number().int().min(1).max(7),
  free_text_about_me: z.string().optional(),
});

export const ProfilePatchSchema = ProfileInitializeSchema.partial().extend({
  free_text_update: z.string().optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileInitialize = z.infer<typeof ProfileInitializeSchema>;
export type ProfilePatch = z.infer<typeof ProfilePatchSchema>;

// ─── Prep ──────────────────────────────────────────────────────────────────

export const PrepSchema = z.object({
  id: z.string().uuid(),
  division: z.enum([
    'classic_physique', 'men_physique', 'women_physique',
    'bikini', 'mens_open', 'womens_figure',
    // legacy / fallback
    'mens_physique', 'wellness',
  ]),
  prep_length_weeks: z.number().int().positive(),
  start_date: z.string(),
  target_date: z.string().nullable(),
  target_competition_id: z.string().uuid().nullable(),
  status: z.enum(['active', 'completed', 'abandoned']),
  current_week: z.number().int(),
  current_phase: z.enum(['maintenance', 'cut', 'peak']),
  starting_weight_kg: z.number().nullable(),
  target_weight_kg: z.number().nullable(),
  starting_bf_pct: z.number().min(0).max(100).nullable(),
  target_bf_pct: z.number().min(0).max(100).nullable(),
  created_at: z.string(),
});

export const PrepCreateSchema = z.object({
  division: z.enum([
    'classic_physique', 'men_physique', 'women_physique',
    'bikini', 'mens_open', 'womens_figure',
  ]),
  target_competition_id: z.string().uuid().optional(),
  start_date: z.string(),
  starting_weight_kg: z.number().positive(),
  starting_bf_pct: z.number().min(0).max(100).optional(),
  starting_measurements: z.record(z.number()).optional(),
  target_weight_kg: z.number().positive(),
  target_bf_pct: z.number().min(0).max(100).optional(),
  phase_split: z.object({
    maintenance_weeks: z.number().int().min(0),
    cut_weeks: z.number().int().min(1),
  }),
});

export type Prep = z.infer<typeof PrepSchema>;
export type PrepCreate = z.infer<typeof PrepCreateSchema>;

// ─── Set log ───────────────────────────────────────────────────────────────

export const SetLogCreateSchema = z.object({
  exercise_id: z.string().uuid(),
  set_number: z.number().int().positive(),
  weight_kg: z.number().nonnegative(),
  reps: z.number().int().positive(),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

export const SetLogSchema = SetLogCreateSchema.extend({
  id: z.string().uuid(),
  workout_session_id: z.string().uuid(),
  canonical_exercise_id: z.string(),
  exercise_name_raw: z.string(),
  performed_at: z.string(),
});

export type SetLogCreate = z.infer<typeof SetLogCreateSchema>;
export type SetLog = z.infer<typeof SetLogSchema>;

// ─── Meal log ──────────────────────────────────────────────────────────────

export const MealLogCreateSchema = z.object({
  eaten_at: z.string(),
  slot: z.enum(['breakfast', 'lunch', 'dinner', 'snack_1', 'snack_2', 'pre_workout', 'post_workout']),
  name: z.string().min(1),
  calories: z.number().nonnegative(),
  protein_g: z.number().nonnegative(),
  carbs_g: z.number().nonnegative(),
  fat_g: z.number().nonnegative(),
  source: z.enum(['planned', 'swap', 'freeform']),
  linked_meal_plan_id: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export type MealLogCreate = z.infer<typeof MealLogCreateSchema>;

// ─── Weight log ────────────────────────────────────────────────────────────

export const WeightLogCreateSchema = z.object({
  logged_at: z.string(),
  weight_kg: z.number().positive(),
  source: z.enum(['manual', 'healthkit']).default('manual'),
});

export type WeightLogCreate = z.infer<typeof WeightLogCreateSchema>;

// ─── Weekly plan ───────────────────────────────────────────────────────────

export const WeeklyPlanSchema = z.object({
  id: z.string().uuid(),
  prep_id: z.string().uuid(),
  week_number: z.number().int().positive(),
  phase: z.enum(['maintenance', 'cut', 'peak']),
  daily_calories: z.number().positive(),
  protein_g: z.number().positive(),
  carbs_g: z.number().nonnegative(),
  fat_g: z.number().nonnegative(),
  cardio: z.object({
    frequency_per_week: z.number().int().min(0),
    modality: z.string().nullable(),
    duration_min: z.number().nullable(),
  }),
  step_floor: z.number().int().nonnegative(),
  notes: z.string().nullable(),
  created_at: z.string(),
});

export type WeeklyPlan = z.infer<typeof WeeklyPlanSchema>;

// ─── AI diff suggestion ────────────────────────────────────────────────────

export const DiffSuggestionSchema = z.object({
  id: z.string(),
  kind: z.enum(['add', 'remove', 'modify']),
  day_of_week: z.number().int().min(0).max(6).optional(),
  exercise_index: z.number().int().optional(),
  before: z.record(z.unknown()).optional(),
  after: z.record(z.unknown()).optional(),
  rationale: z.string(),
});

export type DiffSuggestion = z.infer<typeof DiffSuggestionSchema>;

// ─── API error ─────────────────────────────────────────────────────────────

export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    retry_after: z.number().optional(),
    details: z.unknown().optional(),
  }),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;
