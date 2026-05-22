import client from './client';
import { ENDPOINTS } from '../constants/api';

export const getFamily      = ()            => client.get(ENDPOINTS.families + '/mine');
export const getMembers     = ()            => client.get(ENDPOINTS.families + '/members');
export const inviteMember   = (payload)     => client.post(ENDPOINTS.families + '/invite', payload);
export const removeMember   = (userId)      => client.delete(`${ENDPOINTS.families}/members/${userId}`);
