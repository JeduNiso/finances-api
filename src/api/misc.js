import client from './client';
import { ENDPOINTS } from '../constants/api';

export const getBanks      = ()            => client.get(ENDPOINTS.banks);
export const getCategories = ()            => client.get(ENDPOINTS.categories);
