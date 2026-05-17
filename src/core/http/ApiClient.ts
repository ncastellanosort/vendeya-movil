import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_TIMEOUT } from '../constants/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      SecureStore.deleteItemAsync('auth_token');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
