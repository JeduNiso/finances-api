import { create } from 'zustand';
import * as spendingApi from '../api/spending';

export const useSpendingStore = create((set, get) => ({
  items:     [],
  summary:   [],
  filters:   {},
  isLoading: false,
  error:     null,

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await spendingApi.getSpending(get().filters);
      set({ items: data.data ?? data });
    } catch (e) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  create: async (payload) => {
    const { data } = await spendingApi.createSpending(payload);
    set((s) => ({ items: [data.data ?? data, ...s.items] }));
  },

  remove: async (id) => {
    await spendingApi.deleteSpending(id);
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },

  reset: () => set({ items: [], summary: [], filters: {}, isLoading: false, error: null }),
}));
