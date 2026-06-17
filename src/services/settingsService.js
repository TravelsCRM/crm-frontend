import api from './api';

export const getSettings = async () => {
  const { data } = await api.get('/settings');
  return data;
};

export const updateSettings = async (settingsData) => {
  const { data } = await api.put('/settings', settingsData);
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.put('/auth/profile', profileData);
  return data;
};
