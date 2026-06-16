import api from './api';

export const getCorporates = async (params) => {
  const { data } = await api.get('/corporates', { params });
  return data;
};

export const getCorporateById = async (id) => {
  const { data } = await api.get(`/corporates/${id}`);
  return data;
};

export const createCorporate = async (corporateData) => {
  const { data } = await api.post('/corporates', corporateData);
  return data;
};

export const updateCorporate = async (id, corporateData) => {
  const { data } = await api.put(`/corporates/${id}`, corporateData);
  return data;
};

export const deleteCorporate = async (id) => {
  const { data } = await api.delete(`/corporates/${id}`);
  return data;
};