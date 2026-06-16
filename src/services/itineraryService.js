import api from './api';

export const getItineraries = async (params) => {
  const { data } = await api.get('/itineraries', { params });
  return data;
};

export const getItineraryById = async (id) => {
  const { data } = await api.get(`/itineraries/${id}`);
  return data;
};

export const createItinerary = async (itineraryData) => {
  const { data } = await api.post('/itineraries', itineraryData);
  return data;
};

export const updateItinerary = async (id, itineraryData) => {
  const { data } = await api.put(`/itineraries/${id}`, itineraryData);
  return data;
};

export const deleteItinerary = async (id) => {
  const { data } = await api.delete(`/itineraries/${id}`);
  return data;
};

export const cloneItinerary = async (id) => {
  const { data } = await api.post(`/itineraries/${id}/clone`);
  return data;
};