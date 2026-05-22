import client from './client';

export const getSpending      = (params)    => client.get('/spending', { params });
export const createSpending   = (data)      => client.post('/spending', data);
export const updateSpending   = (id, data)  => client.put(`/spending/${id}`, data);
export const deleteSpending   = (id)        => client.delete(`/spending/${id}`);
export const getSpendingSummary = ()        => client.get('/spending/summary');
