import api from './api';

export const getHotels = async (params) => {
  const { data } = await api.get('/hotels', { params });
  return data;
};

export const getHotelById = async (id) => {
  const { data } = await api.get(`/hotels/${id}`);
  return data;
};

export const createHotel = async (hotelData) => {
  const { data } = await api.post('/hotels', hotelData);
  return data;
};

export const updateHotel = async (id, hotelData) => {
  const { data } = await api.put(`/hotels/${id}`, hotelData);
  return data;
};

export const deleteHotel = async (id) => {
  const { data } = await api.delete(`/hotels/${id}`);
  return data;
};