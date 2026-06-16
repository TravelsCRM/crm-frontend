import api from './api';

export const getClients = async (params) => {
  const { data } = await api.get('/clients', { params });
  return data;
};

export const getClientById = async (id) => {
  const { data } = await api.get(`/clients/${id}`);
  return data;
};

export const createClient = async (clientData) => {
  const { data } = await api.post('/clients', clientData);
  return data;
};

export const updateClient = async (id, clientData) => {
  const { data } = await api.put(`/clients/${id}`, clientData);
  return data;
};

export const deleteClient = async (id) => {
  const { data } = await api.delete(`/clients/${id}`);
  return data;
};