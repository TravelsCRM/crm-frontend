import api from './api';

export const getDestinations = async () => {
  const { data } = await api.get('/destinations');
  return data;
};

export const createDestination = async (data) => {
  const { data: response } = await api.post('/destinations', data);
  return response;
};

export const updateDestination = async (id, data) => {
  const { data: response } = await api.put(`/destinations/${id}`, data);
  return response;
};

export const deleteDestination = async (id) => {
  const { data: response } = await api.delete(`/destinations/${id}`);
  return response;
};