import { create } from "zustand";

interface User {
  id: string;
  username: string;
  email: string;
  is_superuser: boolean;
  is_verified: boolean;
}

interface UserStoreType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserStoreType>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
})); 