import { create } from 'zustand';
import * as debtsApi from '../api/debts';

export const useDebtsStore = create((set) => ({
  items:     [],
  summary:   null,
  isLoading: false,
  error:     null,

  fetch: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await debtsApi.getDebts(params);
      set({ items: data.data ?? data });
    } catch (e) {
      set({ error: e.response?.data?.message ?? 'Error al cargar deudas' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSummary: async () => {
    const { data } = await debtsApi.getDebtSummary();
    set({ summary: data });
  },

  create: async (payload) => {
    const { data } = await debtsApi.createDebt(payload);
    set((s) => ({ items: [...s.items, data.data ?? data] }));
  },

  update: async (id, payload) => {
    const { data } = await debtsApi.updateDebt(id, payload);
    const updated = data.data ?? data;
    set((s) => ({ items: s.items.map((i) => (i.id === id ? updated : i)) }));
  },

  remove: async (id) => {
    await debtsApi.deleteDebt(id);
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },

  addPayment: async (id, payload) => {
    const { data } = await debtsApi.addDebtPayment(id, payload);
    const updated = data.data ?? data;
    set((s) => ({ items: s.items.map((i) => (i.id === id ? updated : i)) }));
  },

  reset: () => set({ items: [], summary: null, isLoading: false, error: null }),
}));
