import { create } from 'zustand';
import * as familyApi from '../api/family';

export const useFamilyStore = create((set) => ({
  family:    null,
  members:   [],
  isLoading: false,
  error:     null,

  fetchFamily: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await familyApi.getMyFamily();
      set({ family: data });
    } catch (e) {
      set({ error: e.response?.data?.message ?? 'Error al cargar familia' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMembers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await familyApi.getMembers();
      set({ members: data });
    } catch (e) {
      set({ error: e.response?.data?.message ?? 'Error al cargar miembros' });
    } finally {
      set({ isLoading: false });
    }
  },

  invite: async (email) => {
    await familyApi.inviteMember({ email });
  },

  remove: async (userId) => {
    await familyApi.removeMember(userId);
    set((s) => ({ members: s.members.filter((m) => m.id !== userId) }));
  },

  reset: () => set({ family: null, members: [], isLoading: false, error: null }),
}));
