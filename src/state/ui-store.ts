import { create } from 'zustand';

interface UiState {
  // Workout tab
  selectedWorkoutDay: number | null;
  setSelectedWorkoutDay: (day: number | null) => void;

  // Progress tab
  selectedBodyPart: string | null;
  setSelectedBodyPart: (part: string | null) => void;

  // Modals
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;

  // AI diff state — proposal held here until user accepts/rejects
  pendingDiff: unknown | null;
  setPendingDiff: (diff: unknown | null) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedWorkoutDay: null,
  setSelectedWorkoutDay: (day) => set({ selectedWorkoutDay: day }),

  selectedBodyPart: null,
  setSelectedBodyPart: (part) => set({ selectedBodyPart: part }),

  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  pendingDiff: null,
  setPendingDiff: (diff) => set({ pendingDiff: diff }),
}));
