import { create } from 'zustand';
import type { User } from '../../domain/entities/User';
import { supabase } from '../supabase/supabaseClient';

interface AppState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isRestoringSession: boolean;
  setCredentials: (token: string, user: User) => void;
  logout: () => Promise<void>;
  setRestoringSession: (v: boolean) => void;

  currentOrderId: string | null;
  setCurrentOrderId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isRestoringSession: false,

  setCredentials: (token, user) =>
    set({ token, user, isAuthenticated: true }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ token: null, user: null, isAuthenticated: false, currentOrderId: null });
  },

  setRestoringSession: (v) => set({ isRestoringSession: v }),

  currentOrderId: null,
  setCurrentOrderId: (id) => set({ currentOrderId: id }),
}));
