import client from './client';
import { ENDPOINTS } from '../constants/api';

export const getSpending    = (params)      => client.get(ENDPOINTS.spending, { params });
export const createSpending = (payload)     => client.post(ENDPOINTS.spending, payload);
export const updateSpending = (id, payload) => client.put(`${ENDPOINTS.spending}/${id}`, payload);
export const deleteSpending = (id)          => client.delete(`${ENDPOINTS.spending}/${id}`);
export const getSpendingSummary = (params)  => client.get(`${ENDPOINTS.spending}/summary`, { params });
