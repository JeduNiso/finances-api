import Constants from 'expo-constants';

export const BASE_URL = Constants.expoConfig?.extra?.apiUrl ?? 'http://10.0.2.2:8000/api';

export const ENDPOINTS = {
  register:    '/auth/register',
  login:       '/auth/login',
  logout:      '/auth/logout',
  families:    '/families',
  accounts:    '/accounts',
  banks:       '/banks',
  categories:  '/categories',
  spending:    '/spending',
  expenses:    '/expenses',
  debts:       '/debts',
  dashboard:   '/dashboard',
};
