import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; companyName?: string; phone?: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  demo: () =>
    api.post('/api/auth/demo'),
};

// User API
export const userApi = {
  getMe: () => api.get('/api/users/me'),
  updateMe: (data: { companyName?: string; phone?: string; newPassword?: string; currentPassword?: string }) =>
    api.put('/api/users/me', data),
  deleteMe: () => api.delete('/api/users/me'),
};

// Works API
export const worksApi = {
  getAll: () => api.get('/api/works'),
  getById: (id: string) => api.get(`/api/works/${id}`),
  create: (data: { name: string; unit: string; materials?: Material[] }) =>
    api.post('/api/works', data),
  update: (id: string, data: { name: string; unit: string; materials?: Material[] }) =>
    api.put(`/api/works/${id}`, data),
  delete: (id: string) => api.delete(`/api/works/${id}`),
};

// Templates API
export const templatesApi = {
  getAll: () => api.get('/api/templates'),
  getById: (id: string) => api.get(`/api/templates/${id}`),
  create: (data: { name: string; workIds?: string[] }) =>
    api.post('/api/templates', data),
  update: (id: string, data: { name: string; workIds?: string[] }) =>
    api.put(`/api/templates/${id}`, data),
  delete: (id: string) => api.delete(`/api/templates/${id}`),
};

// Estimates API
export const estimatesApi = {
  getAll: () => api.get('/api/estimates'),
  getById: (id: string) => api.get(`/api/estimates/${id}`),
  create: (data: EstimateRequest) => api.post('/api/estimates', data),
  update: (id: string, data: EstimateRequest) => api.put(`/api/estimates/${id}`, data),
  delete: (id: string) => api.delete(`/api/estimates/${id}`),
  getPdf: (id: string, detail: 'full' | 'basic' = 'full') =>
    api.get(`/api/estimates/${id}/pdf?detail=${detail}`, { responseType: 'blob' }),
};

// Types
export interface Material {
  name: string;
  unit: string;
  consumptionPerWorkUnit: number;
}

export interface Work {
  id: string;
  name: string;
  unit: string;
  materials: Material[];
  createdAt: string;
  updatedAt: string;
}

export interface RenovationTemplate {
  id: string;
  name: string;
  workIds: string[];
  works?: Work[];
  createdAt: string;
  updatedAt: string;
}

export interface EstimateMaterialPrice {
  materialName: string;
  unit: string;
  consumptionPerWorkUnit: number;
  pricePerUnit: number;
}

export interface EstimateWorkItem {
  workId: string;
  workName: string;
  unit: string;
  quantity: number;
  laborPricePerUnit: number;
  materialPrices: EstimateMaterialPrice[];
}

export interface EstimateRequest {
  investorName: string;
  investorAddress: string;
  templateIds?: string[];
  workItems?: EstimateWorkItem[];
  materialDiscount?: number;
  laborDiscount?: number;
  notes?: string;
  validUntil?: string;
  startDate?: string;
}

export interface Estimate {
  id: string;
  investorName: string;
  investorAddress: string;
  templateIds: string[];
  workItems: EstimateWorkItem[];
  materialCost: number;
  laborCost: number;
  materialDiscount: number;
  laborDiscount: number;
  materialCostWithDiscount: number;
  laborCostWithDiscount: number;
  totalCost: number;
  notes?: string;
  validUntil?: string;
  startDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  companyName?: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  role: string;
  companyName?: string;
  phone?: string;
}
