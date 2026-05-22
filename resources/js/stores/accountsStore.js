import { create } from 'zustand';
import * as accountsApi from '../api/accounts';

export const useAccountsStore = create((set) => ({
  accounts:  [],
  isLoading: false,
  error:     null,

  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await accountsApi.getAccounts();
      set({ accounts: data.data ?? data });
    } catch (e) {
      set({ error: e.response?.data?.message ?? 'Error al cargar cuentas' });
    } finally {
      set({ isLoading: false });
    }
  },

  create: async (payload) => {
    const { data } = await accountsApi.createAccount(payload);
    set((s) => ({ accounts: [...s.accounts, data.data ?? data] }));
  },

  update: async (id, payload) => {
    const { data } = await accountsApi.updateAccount(id, payload);
    const updated = data.data ?? data;
    set((s) => ({ accounts: s.accounts.map((a) => (a.id === id ? updated : a)) }));
  },

  remove: async (id) => {
    await accountsApi.deleteAccount(id);
    set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) }));
  },

  reset: () => set({ accounts: [], isLoading: false, error: null }),
}));
