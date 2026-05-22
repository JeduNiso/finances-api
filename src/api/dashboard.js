import client from './client';
import { ENDPOINTS } from '../constants/api';

export const getDashboard = () => client.get(ENDPOINTS.dashboard);
