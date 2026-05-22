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
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSummary: async () => {
    const { data } = await debtsApi.getDebtSummary();
    set({ summary: data });
  },

  addPayment: async (id, payload) => {
    await debtsApi.addPayment(id, payload);
  },

  reset: () => set({ items: [], summary: null, isLoading: false, error: null }),
}));
