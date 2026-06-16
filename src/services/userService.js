import api from './api';

export const getUsers = async (params) => {
  const { data } = await api.get('/auth/users', { params });
  return data;
};

// I'll need to add an endpoint for fetching users in the backend as well.
// But for now, I'll focus on the frontend logic.