import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand'
type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (value: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
setUser: (user: User | null) => set({ user }),
setIsLoading: (value: boolean) => set({ isLoading: value }),
fetchAuthenticatedUser: async () => {
  set({ isLoading: true });// In sign-in.tsx submit function
console.log("Authentication successful, redirecting...");

// In (tabs)/_layout.tsx
console.log('Auth state:', useAuthStore.getState().isAuthenticated);

  try {
    const doc = await getCurrentUser(); // DefaultDocument
    if (doc) {
      const user: User = {
        ...doc,

        name: doc.name,
        email: doc.email,
        avatar: doc.avatar,
      };
      set({ isAuthenticated: true, user });
    } else {
      set({ isAuthenticated: false, user: null });
    }
  } catch (error) {
    console.error(error);
    set({ isAuthenticated: false, user: null });
  } finally {
    set({ isLoading: false });
  }
}
}))
export default useAuthStore;
export const useAuth = () => useAuthStore((state) => state);

