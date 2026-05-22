import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import * as authApi from '../api/auth';

const secureStorage = {
  getItem:    (key) => SecureStore.getItemAsync(key),
  setItem:    (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export const useAuthStore = create(
  persist(
    (set) => ({
      token:           null,
      user:            null,
      family:          null,
      isAuthenticated: false,

      login: async (credentials) => {
        const { data } = await authApi.login(credentials);
        const { token, user, family } = data;
        await SecureStore.setItemAsync('auth_token', token);
        set({ token, user, family, isAuthenticated: true });
      },

      register: async (payload) => {
        const { data } = await authApi.register(payload);
        const { token, user, family } = data;
        await SecureStore.setItemAsync('auth_token', token);
        set({ token, user, family, isAuthenticated: true });
      },

      logout: async () => {
        try { await authApi.logout(); } catch (_) {}
        await SecureStore.deleteItemAsync('auth_token');
        set({ token: null, user: null, family: null, isAuthenticated: false });
      },

      setFamily: (family) => set({ family }),

      reset: () => set({ token: null, user: null, family: null, isAuthenticated: false }),
    }),
    {
      name:    'auth-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
