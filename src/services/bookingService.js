import api from './api';

export const getBookings = async (params) => {
  const { data } = await api.get('/bookings', { params });
  return data;
};

export const getBookingById = async (id) => {
  const { data } = await api.get(`/bookings/${id}`);
  return data;
};

export const convertQuotationToBooking = async (quotationId) => {
  const { data } = await api.post(`/bookings/convert/${quotationId}`);
  return data;
};

export const updateBookingStatus = async (id, statusData) => {
  const { data } = await api.patch(`/bookings/${id}/status`, statusData);
  return data;
};

export const downloadVoucher = async (id, bookingNumber) => {
  const response = await api.get(`/bookings/${id}/download`, {
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Voucher_${bookingNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};