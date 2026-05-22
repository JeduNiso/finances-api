import client from './client';
import { ENDPOINTS } from '../constants/api';

export const getExpenses        = ()            => client.get(ENDPOINTS.expenses);
export const createExpense      = (payload)     => client.post(ENDPOINTS.expenses, payload);
export const updateExpense      = (id, payload) => client.put(`${ENDPOINTS.expenses}/${id}`, payload);
export const deleteExpense      = (id)          => client.delete(`${ENDPOINTS.expenses}/${id}`);
export const payExpense         = (id, payload) => client.post(`${ENDPOINTS.expenses}/${id}/pay`, payload);
export const getExpenseCalendar = ()            => client.get(`${ENDPOINTS.expenses}/calendar`);
