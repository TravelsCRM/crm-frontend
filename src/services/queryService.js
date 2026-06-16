import api from './api';

export const getQueries = async (params) => {
  const { data } = await api.get('/queries', { params });
  return data;
};

export const getQueryById = async (id) => {
  const { data } = await api.get(`/queries/${id}`);
  return data;
};

export const createQuery = async (queryData) => {
  const { data } = await api.post('/queries', queryData);
  return data;
};

export const updateQueryStatus = async (id, statusData) => {
  const { data } = await api.patch(`/queries/${id}/status`, statusData);
  return data;
};

export const assignQuery = async (id, assignData) => {
  const { data } = await api.patch(`/queries/${id}/assign`, assignData);
  return data;
};

export const exportQueries = async () => {
  const response = await api.get('/queries/export', {
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Queries_Report.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};