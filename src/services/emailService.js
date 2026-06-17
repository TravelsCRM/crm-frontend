import api from './api';

export const getEmails = async () => {
  const { data } = await api.get('/emails');
  return data;
};

export const sendEmail = async (emailData) => {
  const { data } = await api.post('/emails', emailData);
  return data;
};
