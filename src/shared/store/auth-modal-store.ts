import { create } from 'zustand';

interface AuthModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  redirectPath: string | null;
  setRedirectPath: (path: string) => void;
  clearRedirectPath: () => void;
}

export const useAuthModalStore = create<AuthModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
  redirectPath: null,
  setRedirectPath: (path) => set({ redirectPath: path }),
  clearRedirectPath: () => set({ redirectPath: null }),
}));