import { User } from '@/type';
import { create } from 'zustand'
type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
}

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state: { bears: number }) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears: any) => set({ bears: newBears }),
}))

export default useStore
export type UseStore = ReturnType<typeof useStore>

