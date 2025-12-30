import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Catalog API (public, read-only)
export const catalogApi = {
  getWorks: () => api.get<Work[]>('/api/catalog/works'),
  getWorksByCategory: (category: string) => api.get<Work[]>(`/api/catalog/works/category/${category}`),
  getTemplates: () => api.get<RenovationTemplate[]>('/api/catalog/templates'),
  getTemplatesByCategory: (category: string) => api.get<RenovationTemplate[]>(`/api/catalog/templates/category/${category}`),
  getMaterialPrices: () => api.get<MaterialPrice[]>('/api/catalog/prices/materials'),
  getLaborPrices: () => api.get<LaborPrice[]>('/api/catalog/prices/labor'),
};

// PDF API
export const pdfApi = {
  generateEstimate: (data: PdfEstimateRequest, detail: 'FULL' | 'BASIC' = 'FULL') =>
    api.post(`/api/pdf/estimate?detail=${detail}`, data, { responseType: 'blob' }),
};

// Types
export interface Material {
  name: string;
  unit: string;
  consumptionPerWorkUnit: number;
  defaultPricePerUnit?: number;
}

export interface Work {
  id: string;
  name: string;
  category: string;
  unit: string;
  defaultLaborPrice: number;
  isSystem: boolean;
  materials: Material[];
}

export interface RenovationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  isSystem: boolean;
  workIds: string[];
}

export interface MaterialPrice {
  id: string;
  materialName: string;
  unit: string;
  priceMin: number;
  priceAvg: number;
  priceMax: number;
  sourceUrl?: string;
  region?: string;
  scrapedAt?: string;
}

export interface LaborPrice {
  id: string;
  workType: string;
  unit: string;
  priceMin: number;
  priceAvg: number;
  priceMax: number;
  sourceUrl?: string;
  region?: string;
  scrapedAt?: string;
}

export interface EstimateMaterialPrice {
  materialName: string;
  unit: string;
  consumptionPerWorkUnit: number;
  pricePerUnit: number;
}

export interface EstimateWorkItem {
  workId?: string;
  workName: string;
  unit: string;
  quantity: number;
  laborPricePerUnit: number;
  materialPrices: EstimateMaterialPrice[];
}

export interface PdfEstimateRequest {
  investorName: string;
  investorAddress: string;
  contractorName?: string;
  contractorAddress?: string;
  contractorPhone?: string;
  contractorEmail?: string;
  workItems: EstimateWorkItem[];
  materialDiscount: number;
  laborDiscount: number;
  notes?: string;
  validUntil?: string;
  startDate?: string;
}

// Helper function to download PDF
export const downloadPdf = async (data: PdfEstimateRequest, detail: 'FULL' | 'BASIC' = 'FULL') => {
  const response = await pdfApi.generateEstimate(data, detail);
  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `kosztorys_${data.investorName.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Helper to create work item from catalog work
export const createWorkItemFromWork = (work: Work, quantity: number = 1): EstimateWorkItem => ({
  workId: work.id,
  workName: work.name,
  unit: work.unit,
  quantity,
  laborPricePerUnit: work.defaultLaborPrice,
  materialPrices: work.materials.map(mat => ({
    materialName: mat.name,
    unit: mat.unit,
    consumptionPerWorkUnit: mat.consumptionPerWorkUnit,
    pricePerUnit: mat.defaultPricePerUnit || 0,
  })),
});
