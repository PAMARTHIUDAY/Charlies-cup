import axios from 'axios';

// 🔁 Change if API is hosted elsewhere
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const API = axios.create({ baseURL: API_BASE });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

export const authAPI = {
  sendOTP: (phone) => API.post('/api/auth/otp/send', { phone }),
  verifyOTP: (phone, otp) => API.post('/api/auth/otp/verify', { phone, otp }),
};

export const productAPI = {
  list: () => API.get('/api/products'),
  get: (id) => API.get(`/api/products/${id}`),
};

export const orderAPI = {
  list: () => API.get('/api/orders'),
  get: (id) => API.get(`/api/orders/${id}`),
  updateStatus: (id, status) => API.patch(`/api/orders/${id}`, { status }),
};

export const couponAPI = {
  list: () => API.get('/api/coupons'),
  validate: (code, subtotal) => API.post('/api/coupons/validate', { code, subtotal }),
};
