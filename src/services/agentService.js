import api from './api';

export const getAgents = async (params) => {
  const { data } = await api.get('/agents', { params });
  return data;
};

export const getAgentById = async (id) => {
  const { data } = await api.get(`/agents/${id}`);
  return data;
};

export const createAgent = async (agentData) => {
  const { data } = await api.post('/agents', agentData);
  return data;
};

export const updateAgent = async (id, agentData) => {
  const { data } = await api.put(`/agents/${id}`, agentData);
  return data;
};

export const deleteAgent = async (id) => {
  const { data } = await api.delete(`/agents/${id}`);
  return data;
};