import { api } from '@/api/client';
import { ProfileSchema, ProfileInitializeSchema, ProfilePatchSchema } from '@/api/schemas';
import type { Profile, ProfileInitialize, ProfilePatch } from '@/api/schemas';

export async function getProfile(): Promise<Profile> {
  const raw = await api.get<unknown>('profile');
  return ProfileSchema.parse(raw);
}

export async function initializeProfile(data: ProfileInitialize): Promise<Profile> {
  const body = ProfileInitializeSchema.parse(data);
  const raw = await api.post<unknown>('profile/initialize', body);
  return ProfileSchema.parse(raw);
}

export async function patchProfile(data: ProfilePatch): Promise<Profile> {
  const body = ProfilePatchSchema.parse(data);
  const raw = await api.patch<unknown>('profile', body);
  return ProfileSchema.parse(raw);
}

export async function deleteAccount(): Promise<void> {
  await api.delete('profile');
}
