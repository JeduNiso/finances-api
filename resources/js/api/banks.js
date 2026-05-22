import client from './client';

export const getBanks = () => client.get('/banks');
