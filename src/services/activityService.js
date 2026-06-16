import api from './api';

export const getActivities = async (params) => {
  const { data } = await api.get('/activities', { params });
  return data;
};

export const getActivityById = async (id) => {
  const { data } = await api.get(`/activities/${id}`);
  return data;
};

export const createActivity = async (activityData) => {
  const { data } = await api.post('/activities', activityData);
  return data;
};

export const updateActivity = async (id, activityData) => {
  const { data } = await api.put(`/activities/${id}`, activityData);
  return data;
};

export const deleteActivity = async (id) => {
  const { data } = await api.delete(`/activities/${id}`);
  return data;
};