import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // sends httpOnly JWT cookie automatically
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // cookie expired — don't redirect, just let auth state clear
    }
    return Promise.reject(err);
  }
);

export default api;
