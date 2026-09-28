import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('donatehub_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear storage if needed, or let component handle
      const isAuthUrl = error.config.url.includes('/auth/');
      if (!isAuthUrl) {
        // localStorage.removeItem('donatehub_token');
        // localStorage.removeItem('donatehub_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getDashboard: () => api.get('/user/dashboard'),
  getUserDonations: () => api.get('/user/donations'),
  getUserDonationById: (id) => api.get(`/user/donations/${id}`),
  createDonation: (data) => api.post('/user/donations', data),
};

export const driveApi = {
  getActiveDrives: () => api.get('/drives'),
  getDriveById: (id) => api.get(`/drives/${id}`),
};

export const categoryApi = {
  getAllCategories: () => api.get('/categories'),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getReports: () => api.get('/admin/reports'),
  
  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Drives
  getDrives: (params) => api.get('/admin/drives', { params }),
  getDriveById: (id) => api.get(`/admin/drives/${id}`),
  createDrive: (data) => api.post('/admin/drives', data),
  updateDrive: (id, data) => api.put(`/admin/drives/${id}`, data),
  deleteDrive: (id) => api.delete(`/admin/drives/${id}`),

  // Donations
  getDonations: (params) => api.get('/admin/donations', { params }),
  getDonationById: (id) => api.get(`/admin/donations/${id}`),
  updateDonationStatus: (id, data) => api.put(`/admin/donations/${id}/status`, data),
  deleteDonation: (id) => api.delete(`/admin/donations/${id}`),

  // Donors
  getDonors: (params) => api.get('/admin/donors', { params }),
  getDonorById: (id) => api.get(`/admin/donors/${id}`),

  // Recipients
  getRecipients: (params) => api.get('/admin/recipients', { params }),
  getAllRecipientsList: () => api.get('/admin/recipients/all'),
  getRecipientById: (id) => api.get(`/admin/recipients/${id}`),
  createRecipient: (data) => api.post('/admin/recipients', data),
  updateRecipient: (id, data) => api.put(`/admin/recipients/${id}`, data),
  deleteRecipient: (id) => api.delete(`/admin/recipients/${id}`),

  // Distributions
  getDistributions: (params) => api.get('/admin/distributions', { params }),
  getDistributionById: (id) => api.get(`/admin/distributions/${id}`),
  recordDistribution: (data) => api.post('/admin/distributions', data),
  deleteDistribution: (id) => api.delete(`/admin/distributions/${id}`),

  // Categories
  getCategories: (params) => api.get('/admin/categories', { params }),
  getCategoryById: (id) => api.get(`/admin/categories/${id}`),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),

  // Audit Logs
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
};

export default api;
