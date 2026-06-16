import api from './api';

export const getQuotationsByQuery = async (queryId) => {
  const { data } = await api.get(`/quotations/query/${queryId}`);
  return data;
};

export const getQuotationById = async (id) => {
  const { data } = await api.get(`/quotations/${id}`);
  return data;
};

export const createQuotation = async (quotationData) => {
  const { data } = await api.post('/quotations', quotationData);
  return data;
};

export const updateQuotationStatus = async (id, statusData) => {
  const { data } = await api.patch(`/quotations/${id}/status`, statusData);
  return data;
};

export const deleteQuotation = async (id) => {
  const { data } = await api.delete(`/quotations/${id}`);
  return data;
};

export const downloadQuotation = async (id) => {
  const response = await api.get(`/quotations/${id}/download`, {
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Quotation_${id}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};