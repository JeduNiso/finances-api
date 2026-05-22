import client from './client';

export const getMyFamily    = ()           => client.get('/families/mine');
export const createFamily   = (data)       => client.post('/families', data);
export const getMembers     = ()           => client.get('/families/members');
export const inviteMember   = (data)       => client.post('/families/invite', data);
export const removeMember   = (userId)     => client.delete(`/families/members/${userId}`);
