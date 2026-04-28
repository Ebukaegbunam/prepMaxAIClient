import { api } from '@/api/client';
import { PrepSchema, PrepCreateSchema } from '@/api/schemas';
import type { Prep, PrepCreate } from '@/api/schemas';

export async function getCurrentPrep(): Promise<Prep> {
  const raw = await api.get<unknown>('preps/current');
  return PrepSchema.parse(raw);
}

export async function createPrep(data: PrepCreate): Promise<Prep> {
  const body = PrepCreateSchema.parse(data);
  const raw = await api.post<unknown>('preps', body);
  return PrepSchema.parse(raw);
}
