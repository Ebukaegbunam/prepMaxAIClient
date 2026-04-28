import { column, Schema, Table } from '@powersync/react-native';

// Mirrors the Supabase tables that are synced to local SQLite.
// Only columns the client reads/writes are listed — extra server columns are ignored.

const profile = new Table({
  user_id: column.text,
  name: column.text,
  age: column.integer,
  sex: column.text,
  height_cm: column.real,
  units_weight: column.text,
  units_measurement: column.text,
  dietary_restrictions: column.text, // JSON array stored as text
  loved_foods: column.text,
  hated_foods: column.text,
  cooking_skill: column.text,
  kitchen_equipment: column.text,
  job_type: column.text,
  work_hours: column.text,
  stress_level: column.text,
  sleep_window: column.text,
  preferred_training_time: column.text,
  training_days_per_week: column.integer,
  narrative: column.text,
  narrative_updated_at: column.text,
  created_at: column.text,
  updated_at: column.text,
}, { indexes: { user_id: ['user_id'] } });

const prep = new Table({
  user_id: column.text,
  division: column.text,
  prep_length_weeks: column.integer,
  start_date: column.text,
  target_date: column.text,
  target_competition_id: column.text,
  status: column.text,
  current_week: column.integer,
  current_phase: column.text,
  starting_weight_kg: column.real,
  target_weight_kg: column.real,
  starting_bf_pct: column.real,
  target_bf_pct: column.real,
  created_at: column.text,
}, { indexes: { user_id: ['user_id'], status: ['status'] } });

const weekly_plan = new Table({
  prep_id: column.text,
  week_number: column.integer,
  phase: column.text,
  daily_calories: column.real,
  protein_g: column.real,
  carbs_g: column.real,
  fat_g: column.real,
  cardio: column.text, // JSON
  step_floor: column.integer,
  notes: column.text,
  created_at: column.text,
}, { indexes: { prep_id: ['prep_id', 'week_number'] } });

const workout_template = new Table({
  prep_id: column.text,
  name: column.text,
  description: column.text,
  created_at: column.text,
}, { indexes: { prep_id: ['prep_id'] } });

const workout_day = new Table({
  template_id: column.text,
  day_of_week: column.integer,
  name: column.text,
  notes: column.text,
}, { indexes: { template_id: ['template_id'] } });

const exercise = new Table({
  workout_day_id: column.text,
  canonical_exercise_id: column.text,
  name: column.text,
  order_index: column.integer,
  sets: column.integer,
  reps_min: column.integer,
  reps_max: column.integer,
  rpe_target: column.real,
  rest_seconds: column.integer,
  notes: column.text,
}, { indexes: { day: ['workout_day_id', 'order_index'] } });

const workout_session = new Table({
  prep_id: column.text,
  workout_day_id: column.text,
  started_at: column.text,
  completed_at: column.text,
  duration_seconds: column.integer,
  notes: column.text,
}, { indexes: { prep_id: ['prep_id', 'started_at'] } });

const set_log = new Table({
  workout_session_id: column.text,
  exercise_id: column.text,
  canonical_exercise_id: column.text,
  exercise_name_raw: column.text,
  set_number: column.integer,
  weight_kg: column.real,
  reps: column.integer,
  rpe: column.real,
  notes: column.text,
  performed_at: column.text,
}, { indexes: { session: ['workout_session_id'], exercise: ['canonical_exercise_id', 'performed_at'] } });

const meal_plan = new Table({
  weekly_plan_id: column.text,
  slot: column.text,
  name: column.text,
  calories: column.real,
  protein_g: column.real,
  carbs_g: column.real,
  fat_g: column.real,
  recipe_notes: column.text,
}, { indexes: { plan: ['weekly_plan_id', 'slot'] } });

const meal_log = new Table({
  prep_id: column.text,
  eaten_at: column.text,
  slot: column.text,
  name: column.text,
  calories: column.real,
  protein_g: column.real,
  carbs_g: column.real,
  fat_g: column.real,
  source: column.text,
  linked_meal_plan_id: column.text,
  notes: column.text,
}, { indexes: { prep_date: ['prep_id', 'eaten_at'] } });

const weight_log = new Table({
  prep_id: column.text,
  logged_at: column.text,
  weight_kg: column.real,
  source: column.text,
}, { indexes: { prep_date: ['prep_id', 'logged_at'] } });

const measurement_log = new Table({
  prep_id: column.text,
  logged_at: column.text,
  measurements: column.text, // JSON
}, { indexes: { prep_date: ['prep_id', 'logged_at'] } });

const check_in = new Table({
  prep_id: column.text,
  week_number: column.integer,
  checked_in_at: column.text,
  weight_kg: column.real,
  body_fat_pct: column.real,
  energy_level: column.integer,
  mood_score: column.integer,
  sleep_quality: column.integer,
  training_performance: column.integer,
  notes: column.text,
}, { indexes: { prep_week: ['prep_id', 'week_number'] } });

const photo = new Table({
  prep_id: column.text,
  check_in_id: column.text,
  storage_key: column.text,
  thumbnail_key: column.text,
  week_number: column.integer,
  angle: column.text,
  captured_at: column.text,
}, { indexes: { prep: ['prep_id', 'week_number'] } });

const ai_report = new Table({
  prep_id: column.text,
  check_in_id: column.text,
  kind: column.text,
  content: column.text,
  created_at: column.text,
}, { indexes: { prep: ['prep_id', 'created_at'] } });

const saved_competition = new Table({
  competition_id: column.text,
  snapshot: column.text, // JSON
  saved_at: column.text,
}, { indexes: { comp: ['competition_id'] } });

export const AppSchema = new Schema({
  profile,
  prep,
  weekly_plan,
  workout_template,
  workout_day,
  exercise,
  workout_session,
  set_log,
  meal_plan,
  meal_log,
  weight_log,
  measurement_log,
  check_in,
  photo,
  ai_report,
  saved_competition,
});

export type Database = (typeof AppSchema)['types'];
