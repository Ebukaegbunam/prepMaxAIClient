import { z } from 'zod';
import { api } from '@/api/client';
import { WeeklyPlanSchema, MealLogCreateSchema } from '@/api/schemas';
import type { WeeklyPlan, MealLogCreate } from '@/api/schemas';

export { type WeeklyPlan };

const DailyMacrosSchema = z.object({
  date: z.string(),
  targets: z.object({
    calories: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
  }),
  logged: z.object({
    calories: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
  }),
  remaining: z.object({
    calories: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
  }),
  logs: z.array(z.object({
    id: z.string().uuid(),
    slot: z.string(),
    name: z.string(),
    calories: z.number(),
    protein_g: z.number(),
    carbs_g: z.number(),
    fat_g: z.number(),
    source: z.string(),
    eaten_at: z.string(),
  })),
});

export type DailyMacros = z.infer<typeof DailyMacrosSchema>;

export async function getDailyMacros(prepId: string, date: string): Promise<DailyMacros> {
  const raw = await api.get<unknown>(`preps/${prepId}/meals/daily?date=${date}`);
  return DailyMacrosSchema.parse(raw);
}

export async function logMeal(prepId: string, data: MealLogCreate): Promise<void> {
  await api.post(`preps/${prepId}/meals`, MealLogCreateSchema.parse(data));
}

export async function getWeeklyPlan(prepId: string): Promise<WeeklyPlan> {
  const raw = await api.get<unknown>(`preps/${prepId}/plan/current`);
  return WeeklyPlanSchema.parse(raw);
}
