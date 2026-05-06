import axios from 'axios';

// PRODUCTION-READY DYNAMIC BASE URL
const getBaseURL = () => {
   if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
   // Fallback for local development
   return `${window.location.protocol}//${window.location.hostname}:5000/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000, // Increased for heavy 3D asset handshakes
  headers: {
    'Content-Type': 'application/json',
  },
});

// GLOBAL REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('milku_admin_token');
  const deviceToken = localStorage.getItem('milku_device_token');
  
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (deviceToken) config.headers['x-device-token'] = deviceToken;
  
  // Auto-switch to multipart for file uploads
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  return config;
}, (error) => Promise.reject(error));

// GLOBAL RESPONSE INTERCEPTOR: Deep Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized - Silent Token Purge
    if (error.response?.status === 401) {
      localStorage.removeItem('milku_admin_token');
    }
    
    // Log failures only in dev mode to keep console clean for users
    if (import.meta.env.DEV) {
       console.error(`[API ERROR] ${error.config.url}:`, error.message);
    }
    
    return Promise.reject(error);
  }
);

// Unified Exports
export const getSettings = () => api.get('/settings');
export const updateSettings = (data) => api.put('/settings', data);
export const getProducts = (cat) => api.get(`/products${cat ? `?category=${cat}` : ''}`);
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (formData) => api.post('/products', formData);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const adminLogin = (pass) => api.post('/admin/login', { passphrase: pass });
export const verifyDevice = () => api.get('/admin/verify-device');

// Image Path Resolver
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  
  // If it's a local media asset from the public folder, return as is (but encoded for spaces)
  if (path.startsWith('/media/')) return encodeURI(path);
  
  const baseUrl = getBaseURL().replace('/api', '');
  return encodeURI(`${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`);
};

// Category API
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Customer API
export const getCustomers = () => api.get('/customers');
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

export default api;
