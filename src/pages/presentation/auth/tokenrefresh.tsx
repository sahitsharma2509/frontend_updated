import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import jwt_decode from 'jwt-decode';


import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
const refreshAxios = axios.create();
const BASE_URL = 'http://localhost:8000';

refreshAxios.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: { exp: number } = jwt_decode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        try {
          const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
            refresh: localStorage.getItem('refreshToken'),
          });
          localStorage.setItem('token', response.data.access);
          config.headers = config.headers || {}; // Initialize headers if undefined
          config.headers['Authorization'] = `Bearer ${response.data.access}`;
        } catch (error) {
          // Refresh token has expired, redirect to login page
          window.location.href = '/auth/login';
        }
      } else {
        config.headers = config.headers || {}; // Initialize headers if undefined
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config as InternalAxiosRequestConfig; // Type assertion
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default refreshAxios;
