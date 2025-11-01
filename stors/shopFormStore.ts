import { create } from "zustand";

interface ShopFormData {
  name: string;
  number: string;
  shopDiscreption: string;
  wilaya: string;
  daira: string;
  shopImage: string | null;
}

interface ShopFormStore {
  formData: ShopFormData;
  setFormData: (data: Partial<ShopFormData>) => void;
  updateField: (field: keyof ShopFormData, value: string | null) => void;
  clearFormData: () => void;
}

const initialFormData: ShopFormData = {
  name: '',
  number: '',
  shopDiscreption: '',
  wilaya: '',
  daira: '',
  shopImage: null,
};

export const useShopFormStore = create<ShopFormStore>((set) => ({
  formData: initialFormData,
  setFormData: (data) => set((state) => ({ 
    formData: { ...state.formData, ...data } 
  })),
  updateField: (field, value) => set((state) => ({
    formData: { ...state.formData, [field]: value }
  })),
  clearFormData: () => set({ formData: initialFormData }),
}));
