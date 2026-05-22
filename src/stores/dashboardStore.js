import { create } from 'zustand';
import * as dashboardApi from '../api/dashboard';

export const useDashboardStore = create((set) => ({
  data:      null,
  isLoading: false,
  error:     null,

  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await dashboardApi.getDashboard();
      set({ data });
    } catch (e) {
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => set({ data: null, isLoading: false, error: null }),
}));
