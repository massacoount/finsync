import { httpClient } from './httpClient';

export const getUserProfile = async () => {
  return httpClient.get('/user/profile');
};

export const updateUserProfile = async (data) => {
  return httpClient.put('/user/profile', data);
};