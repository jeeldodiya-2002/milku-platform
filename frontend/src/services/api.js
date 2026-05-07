import axios from 'axios';

// PRODUCTION-READY DYNAMIC BASE URL
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  
  // If we are on the production domain, use the production API
  if (window.location.hostname === 'milkudairy.com' || window.location.hostname === 'www.milkudairy.com') {
    return 'https://milku-api.onrender.com/api';
  }

  // Fallback for local development
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000, // Extended to 60s to reliably handle Render cold-starts during initial load
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

export const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') return '';
  
  // 1. Handle Full URLs (Cloudinary/External)
  if (path.startsWith('http') || path.startsWith('blob:')) {
    return path;
  }
  
  // 2. Normalize separators (Windows fixes)
  const normalizedPath = path.replace(/\\/g, '/');
  
  // 3. Special handling for /media/ folder
  // If it's a known media asset, we prefer the local (frontend) path 
  // because it's safer for CORS and performance.
  if (normalizedPath.startsWith('/media/')) {
    return encodeURI(normalizedPath);
  }
  
  // 4. Resolve other relative paths via Backend API
  const baseUrl = getBaseURL().replace('/api', '');
  const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return encodeURI(`${baseUrl}${cleanPath}`);
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

// Review API
export const getReviews = (page = 1, limit = 6) => api.get(`/reviews?page=${page}&limit=${limit}`);
export const submitReview = (data) => api.post('/reviews', data);
export const adminGetPendingReviews = () => api.get('/admin/reviews/pending');
export const adminApproveReview = (id) => api.put(`/admin/reviews/${id}/approve`);
export const adminDeleteReview = (id) => api.delete(`/admin/reviews/${id}`);

export default api;
