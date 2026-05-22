import client from './client';

export const getExpenses      = (params)    => client.get('/expenses', { params });
export const createExpense    = (data)      => client.post('/expenses', data);
export const updateExpense    = (id, data)  => client.put(`/expenses/${id}`, data);
export const deleteExpense    = (id)        => client.delete(`/expenses/${id}`);
export const payExpense       = (id, data)  => client.post(`/expenses/${id}/pay`, data);
export const getExpenseCalendar = ()        => client.get('/expenses/calendar');
