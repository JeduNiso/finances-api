import client from './client';

export const getDebts         = (params)    => client.get('/debts', { params });
export const createDebt       = (data)      => client.post('/debts', data);
export const updateDebt       = (id, data)  => client.put(`/debts/${id}`, data);
export const deleteDebt       = (id)        => client.delete(`/debts/${id}`);
export const addDebtPayment   = (id, data)  => client.post(`/debts/${id}/payment`, data);
export const getDebtSummary   = ()          => client.get('/debts/summary');
