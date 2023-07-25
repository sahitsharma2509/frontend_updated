import axios from 'axios';
import { getAccessToken } from './helpers/helpers';

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BASE_URL

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');

  if (refreshToken) {
    try {
      const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      });

      localStorage.setItem('access_token', response.data.access);
      return response.data.access;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      return null;
    }
  }

  return null;
};

const api = (updateToken?: (newToken: string | null) => void) => {
  const instance = axios.create({
    baseURL: BASE_URL,
  });

  instance.interceptors.request.use(function (config) {
    const token = getAccessToken();
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const accessToken = await refreshAccessToken();

        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return instance(originalRequest);
        } else {
          updateToken && updateToken(null);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};


export { api, refreshAccessToken };
