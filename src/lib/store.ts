import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EstimateWorkItem } from './api';

interface EstimateState {
  // Basic info
  investorName: string;
  investorAddress: string;
  contractorName: string;
  contractorAddress: string;
  contractorPhone: string;
  contractorEmail: string;

  // Work items
  workItems: EstimateWorkItem[];

  // Discounts
  materialDiscount: number;
  laborDiscount: number;

  // Dates and notes
  validUntil: string;
  startDate: string;
  notes: string;

  // Current step in wizard
  currentStep: number;

  // Actions
  setBasicInfo: (info: Partial<{
    investorName: string;
    investorAddress: string;
    contractorName: string;
    contractorAddress: string;
    contractorPhone: string;
    contractorEmail: string;
  }>) => void;
  addWorkItem: (item: EstimateWorkItem) => void;
  updateWorkItem: (index: number, item: Partial<EstimateWorkItem>) => void;
  removeWorkItem: (index: number) => void;
  setDiscounts: (materialDiscount: number, laborDiscount: number) => void;
  setDates: (validUntil: string, startDate: string) => void;
  setNotes: (notes: string) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;

  // Calculations
  calculateMaterialCost: () => number;
  calculateLaborCost: () => number;
  calculateTotalCost: () => number;
}

const initialState = {
  investorName: '',
  investorAddress: '',
  contractorName: '',
  contractorAddress: '',
  contractorPhone: '',
  contractorEmail: '',
  workItems: [],
  materialDiscount: 0,
  laborDiscount: 0,
  validUntil: '',
  startDate: '',
  notes: '',
  currentStep: 0,
};

export const useEstimateStore = create<EstimateState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setBasicInfo: (info) => set((state) => ({ ...state, ...info })),

      addWorkItem: (item) => set((state) => ({
        workItems: [...state.workItems, item]
      })),

      updateWorkItem: (index, updates) => set((state) => ({
        workItems: state.workItems.map((item, i) =>
          i === index ? { ...item, ...updates } : item
        )
      })),

      removeWorkItem: (index) => set((state) => ({
        workItems: state.workItems.filter((_, i) => i !== index)
      })),

      setDiscounts: (materialDiscount, laborDiscount) =>
        set({ materialDiscount, laborDiscount }),

      setDates: (validUntil, startDate) =>
        set({ validUntil, startDate }),

      setNotes: (notes) => set({ notes }),

      setCurrentStep: (step) => set({ currentStep: step }),

      reset: () => set(initialState),

      calculateMaterialCost: () => {
        const { workItems } = get();
        return workItems.reduce((total, item) => {
          const itemMaterialCost = item.materialPrices.reduce((sum, mat) =>
            sum + (mat.consumptionPerWorkUnit * mat.pricePerUnit * item.quantity), 0);
          return total + itemMaterialCost;
        }, 0);
      },

      calculateLaborCost: () => {
        const { workItems } = get();
        return workItems.reduce((total, item) =>
          total + (item.laborPricePerUnit * item.quantity), 0);
      },

      calculateTotalCost: () => {
        const { materialDiscount, laborDiscount } = get();
        const materialCost = get().calculateMaterialCost();
        const laborCost = get().calculateLaborCost();
        const materialWithDiscount = materialCost * (1 - materialDiscount / 100);
        const laborWithDiscount = laborCost * (1 - laborDiscount / 100);
        return materialWithDiscount + laborWithDiscount;
      },
    }),
    {
      name: 'estimate-storage',
    }
  )
);
