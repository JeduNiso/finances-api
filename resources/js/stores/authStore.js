import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authApi from '../api/auth';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token:           null,
      user:            null,
      family:          null,
      isAuthenticated: false,

      login: async (credentials) => {
        const { data } = await authApi.login(credentials);
        set({ token: data.token, user: data.user, family: data.family, isAuthenticated: true });
        return data;
      },

      register: async (payload) => {
        const { data } = await authApi.register(payload);
        set({ token: data.token, user: data.user, isAuthenticated: true });
        return data;
      },

      logout: async () => {
        try { await authApi.logout(); } catch (_) {}
        set({ token: null, user: null, family: null, isAuthenticated: false });
      },

      setFamily: (family) => set({ family }),

      reset: () => set({ token: null, user: null, family: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage', partialize: (s) => ({ token: s.token, user: s.user, family: s.family }) }
  )
);
