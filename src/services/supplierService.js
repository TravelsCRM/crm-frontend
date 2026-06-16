import api from './api';

export const getSuppliers = async (params) => {
  const { data } = await api.get('/suppliers', { params });
  return data;
};

export const getSupplierById = async (id) => {
  const { data } = await api.get(`/suppliers/${id}`);
  return data;
};

export const createSupplier = async (supplierData) => {
  const { data } = await api.post('/suppliers', supplierData);
  return data;
};

export const updateSupplier = async (id, supplierData) => {
  const { data } = await api.put(`/suppliers/${id}`, supplierData);
  return data;
};

export const deleteSupplier = async (id) => {
  const { data } = await api.delete(`/suppliers/${id}`);
  return data;
};