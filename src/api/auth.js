import client from './client';
import { ENDPOINTS } from '../constants/api';

export const register = (payload) => client.post(ENDPOINTS.register, payload);
export const login    = (payload) => client.post(ENDPOINTS.login,    payload);
export const logout   = ()        => client.post(ENDPOINTS.logout);
