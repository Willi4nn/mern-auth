import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://mern-auth-server-4co0.onrender.com'
    : 'http://localhost:8080'
});

export default api;
