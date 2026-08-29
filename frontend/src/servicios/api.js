import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;
    const token = localStorage.getItem('token');

    if (status === 401 && token) {
      localStorage.removeItem('token');

      window.dispatchEvent(
        new Event('sesion-expirada')
      );
    }

    return Promise.reject(error);
  }
);

export default api;