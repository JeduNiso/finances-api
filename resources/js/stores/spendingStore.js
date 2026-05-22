import { create } from 'zustand';
import * as spendingApi from '../api/spending';

export const useSpendingStore = create((set, get) => ({
  items:     [],
  summary:   [],
  filters:   { month: new Date().getMonth() + 1, year: new Date().getFullYear() },
  isLoading: false,
  error:     null,

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await spendingApi.getSpending(get().filters);
      set({ items: data.data ?? data });
    } catch (e) {
      set({ error: e.response?.data?.message ?? 'Error al cargar gastos' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSummary: async () => {
    const { data } = await spendingApi.getSpendingSummary();
    set({ summary: data });
  },

  create: async (payload) => {
    const { data } = await spendingApi.createSpending(payload);
    set((s) => ({ items: [data.data ?? data, ...s.items] }));
  },

  update: async (id, payload) => {
    const { data } = await spendingApi.updateSpending(id, payload);
    const updated = data.data ?? data;
    set((s) => ({ items: s.items.map((i) => (i.id === id ? updated : i)) }));
  },

  remove: async (id) => {
    await spendingApi.deleteSpending(id);
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },

  reset: () => set({ items: [], summary: [], filters: {}, isLoading: false, error: null }),
}));
