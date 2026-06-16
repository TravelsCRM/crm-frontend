import api from './api';

export const getPayments = async (params) => {
  const { data } = await api.get('/payments', { params });
  return data;
};

export const getPaymentsByBooking = async (bookingId) => {
  const { data } = await api.get(`/payments/booking/${bookingId}`);
  return data;
};

export const createPayment = async (paymentData) => {
  const { data } = await api.post('/payments', paymentData);
  return data;
};

export const updatePaymentStatus = async (id, statusData) => {
  const { data } = await api.patch(`/payments/${id}/status`, statusData);
  return data;
};