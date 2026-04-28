import { z } from 'zod';
import { api } from '@/api/client';

const CompetitionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  federation: z.string(),
  date: z.string(),
  city: z.string().nullable(),
  state_province: z.string().nullable(),
  country: z.string(),
  divisions: z.array(z.string()),
  registration_url: z.string().nullable(),
});

export type Competition = z.infer<typeof CompetitionSchema>;

export async function searchCompetitions(params?: {
  q?: string;
  after_date?: string;
  division?: string;
}): Promise<Competition[]> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.after_date) qs.set('after_date', params.after_date);
  if (params?.division) qs.set('division', params.division);
  const path = `competitions/search${qs.toString() ? '?' + qs.toString() : ''}`;
  const raw = await api.get<unknown[]>(path);
  return z.array(CompetitionSchema).parse(raw);
}
