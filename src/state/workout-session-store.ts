import { create } from 'zustand';
import type { Exercise } from '@/api/endpoints/workouts';

interface LoggedSet {
  weight: string;
  reps: string;
  rpe: string;
}

interface ActiveSession {
  sessionId: string;
  prepId: string;
  dayId: string;
  dayName: string;
  exercises: Exercise[];
  currentIdx: number;
  loggedSets: Record<string, LoggedSet[]>; // exerciseId → sets
  startedAt: number;
}

interface WorkoutSessionStore {
  active: ActiveSession | null;
  startSession: (session: Omit<ActiveSession, 'loggedSets' | 'startedAt'>) => void;
  logSet: (exerciseId: string, set: LoggedSet) => void;
  advanceExercise: () => void;
  jumpToExercise: (idx: number) => void;
  endSession: () => void;
}

export const useWorkoutSessionStore = create<WorkoutSessionStore>((set, get) => ({
  active: null,

  startSession: (session) =>
    set({
      active: {
        ...session,
        loggedSets: {},
        startedAt: Date.now(),
      },
    }),

  logSet: (exerciseId, loggedSet) =>
    set((s) => {
      if (!s.active) return s;
      const prev = s.active.loggedSets[exerciseId] ?? [];
      return {
        active: {
          ...s.active,
          loggedSets: { ...s.active.loggedSets, [exerciseId]: [...prev, loggedSet] },
        },
      };
    }),

  advanceExercise: () =>
    set((s) => {
      if (!s.active) return s;
      const next = s.active.currentIdx + 1;
      if (next >= s.active.exercises.length) return s;
      return { active: { ...s.active, currentIdx: next } };
    }),

  jumpToExercise: (idx) =>
    set((s) => {
      if (!s.active) return s;
      return { active: { ...s.active, currentIdx: idx } };
    }),

  endSession: () => set({ active: null }),
}));
