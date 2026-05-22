import { create } from 'zustand';
import * as expensesApi from '../api/expenses';

export const useExpensesStore = create((set) => ({
  items:     [],
  calendar:  [],
  isLoading: false,
  error:     null,

  fetch: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await expensesApi.getExpenses(params);
      set({ items: data.data ?? data });
    } catch (e) {
      set({ error: e.response?.data?.message ?? 'Error al cargar gastos fijos' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCalendar: async () => {
    const { data } = await expensesApi.getExpenseCalendar();
    set({ calendar: data });
  },

  create: async (payload) => {
    const { data } = await expensesApi.createExpense(payload);
    set((s) => ({ items: [...s.items, data.data ?? data] }));
  },

  update: async (id, payload) => {
    const { data } = await expensesApi.updateExpense(id, payload);
    const updated = data.data ?? data;
    set((s) => ({ items: s.items.map((i) => (i.id === id ? updated : i)) }));
  },

  remove: async (id) => {
    await expensesApi.deleteExpense(id);
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },

  pay: async (id, payload) => {
    await expensesApi.payExpense(id, payload);
    set((s) => ({
      calendar: s.calendar.map((e) => (e.id === id ? { ...e, paid: true } : e)),
    }));
  },

  reset: () => set({ items: [], calendar: [], isLoading: false, error: null }),
}));
