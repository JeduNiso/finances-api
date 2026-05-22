import client from './client';
import { ENDPOINTS } from '../constants/api';

export const getAccounts    = ()            => client.get(ENDPOINTS.accounts);
export const createAccount  = (payload)     => client.post(ENDPOINTS.accounts, payload);
export const updateAccount  = (id, payload) => client.put(`${ENDPOINTS.accounts}/${id}`, payload);
export const deleteAccount  = (id)          => client.delete(`${ENDPOINTS.accounts}/${id}`);
export const getAccountSummary = (id)       => client.get(`${ENDPOINTS.accounts}/${id}/summary`);
