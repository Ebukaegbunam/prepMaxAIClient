import { z } from 'zod';
import { api } from '@/api/client';

const ExerciseSchema = z.object({
  id: z.string().uuid(),
  workout_day_id: z.string().uuid(),
  canonical_exercise_id: z.string(),
  name: z.string(),
  order_index: z.number(),
  sets: z.number(),
  reps_min: z.number(),
  reps_max: z.number(),
  rpe_target: z.number().nullable(),
  rest_seconds: z.number().nullable(),
  notes: z.string().nullable(),
});

const WorkoutDaySchema = z.object({
  id: z.string().uuid(),
  template_id: z.string().uuid(),
  day_of_week: z.number().int().min(0).max(6),
  name: z.string(),
  notes: z.string().nullable(),
  exercises: z.array(ExerciseSchema).default([]),
});

const WorkoutTemplateSchema = z.object({
  id: z.string().uuid(),
  prep_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  days: z.array(WorkoutDaySchema).default([]),
});

export type Exercise = z.infer<typeof ExerciseSchema>;
export type WorkoutDay = z.infer<typeof WorkoutDaySchema>;
export type WorkoutTemplate = z.infer<typeof WorkoutTemplateSchema>;

export async function getWorkoutTemplate(prepId: string): Promise<WorkoutTemplate> {
  const raw = await api.get<unknown>(`preps/${prepId}/workout-templates/current`);
  return WorkoutTemplateSchema.parse(raw);
}

const SetLogCreateSchema = z.object({
  exercise_id: z.string().uuid(),
  set_number: z.number().int().positive(),
  weight_kg: z.number().nonnegative(),
  reps: z.number().int().positive(),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

const SessionSchema = z.object({
  id: z.string().uuid(),
  workout_day_id: z.string().uuid(),
  started_at: z.string(),
  completed_at: z.string().nullable(),
  duration_seconds: z.number().nullable(),
});

export type SetLogCreate = z.infer<typeof SetLogCreateSchema>;
export type WorkoutSession = z.infer<typeof SessionSchema>;

export async function startSession(prepId: string, workoutDayId: string): Promise<WorkoutSession> {
  const raw = await api.post<unknown>(`preps/${prepId}/sessions`, { workout_day_id: workoutDayId });
  return SessionSchema.parse(raw);
}

export async function logSet(sessionId: string, data: SetLogCreate): Promise<void> {
  await api.post(`sessions/${sessionId}/sets`, SetLogCreateSchema.parse(data));
}

export async function completeSession(sessionId: string): Promise<void> {
  await api.post(`sessions/${sessionId}/complete`, {});
}

const ExerciseHistorySchema = z.object({
  canonical_exercise_id: z.string(),
  history: z.array(z.object({
    performed_at: z.string(),
    sets: z.array(z.object({
      set_number: z.number(),
      weight_kg: z.number(),
      reps: z.number(),
      rpe: z.number().nullable(),
    })),
  })),
});

export type ExerciseHistory = z.infer<typeof ExerciseHistorySchema>;

export async function getExerciseHistory(canonicalId: string): Promise<ExerciseHistory> {
  const raw = await api.get<unknown>(`exercises/${canonicalId}/history`);
  return ExerciseHistorySchema.parse(raw);
}
