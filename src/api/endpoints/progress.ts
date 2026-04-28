import { z } from 'zod';
import { api } from '@/api/client';
import { WeightLogCreateSchema } from '@/api/schemas';
import type { WeightLogCreate } from '@/api/schemas';

export { type WeightLogCreate };

const WeightLogSchema = z.object({
  id: z.string().uuid(),
  logged_at: z.string(),
  weight_kg: z.number(),
  source: z.string(),
});

export type WeightLog = z.infer<typeof WeightLogSchema>;

export async function logWeight(prepId: string, data: WeightLogCreate): Promise<WeightLog> {
  const raw = await api.post<unknown>(`preps/${prepId}/weight-logs`, WeightLogCreateSchema.parse(data));
  return WeightLogSchema.parse(raw);
}

export async function getWeightTrend(prepId: string): Promise<WeightLog[]> {
  const raw = await api.get<unknown[]>(`preps/${prepId}/weight-logs?limit=30`);
  return z.array(WeightLogSchema).parse(raw);
}

const CheckInCreateSchema = z.object({
  weight_kg: z.number().positive(),
  body_fat_pct: z.number().min(0).max(100).optional(),
  energy_level: z.number().int().min(1).max(5),
  mood_score: z.number().int().min(1).max(5),
  sleep_quality: z.number().int().min(1).max(5),
  training_performance: z.number().int().min(1).max(5),
  notes: z.string().optional(),
});

const CheckInSchema = CheckInCreateSchema.extend({
  id: z.string().uuid(),
  prep_id: z.string().uuid(),
  week_number: z.number(),
  checked_in_at: z.string(),
});

export type CheckIn = z.infer<typeof CheckInSchema>;
export type CheckInCreate = z.infer<typeof CheckInCreateSchema>;

export async function createCheckIn(prepId: string, data: CheckInCreate): Promise<CheckIn> {
  const raw = await api.post<unknown>(`preps/${prepId}/check-ins`, CheckInCreateSchema.parse(data));
  return CheckInSchema.parse(raw);
}

export async function getCheckIns(prepId: string): Promise<CheckIn[]> {
  const raw = await api.get<unknown[]>(`preps/${prepId}/check-ins`);
  return z.array(CheckInSchema).parse(raw);
}

export async function getUploadUrl(prepId: string): Promise<{ upload_url: string; storage_key: string }> {
  const raw = await api.post<{ upload_url: string; storage_key: string }>(`preps/${prepId}/photos/upload-url`, {});
  return raw;
}

export async function registerPhoto(prepId: string, data: {
  storage_key: string;
  check_in_id?: string;
  angle: string;
}): Promise<void> {
  await api.post(`preps/${prepId}/photos`, data);
}
