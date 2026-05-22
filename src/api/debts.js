import client from './client';
import { ENDPOINTS } from '../constants/api';

export const getDebts       = (params)      => client.get(ENDPOINTS.debts, { params });
export const createDebt     = (payload)     => client.post(ENDPOINTS.debts, payload);
export const updateDebt     = (id, payload) => client.put(`${ENDPOINTS.debts}/${id}`, payload);
export const deleteDebt     = (id)          => client.delete(`${ENDPOINTS.debts}/${id}`);
export const addPayment     = (id, payload) => client.post(`${ENDPOINTS.debts}/${id}/payment`, payload);
export const getDebtSummary = ()            => client.get(`${ENDPOINTS.debts}/summary`);
