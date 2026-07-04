import { create } from "zustand";
import type { User } from "@/types/user";

interface ProfileState {
  open: boolean;
  user: User | null;

  openProfile: (user: User) => void;
  closeProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  open: false,
  user: null,

  openProfile: (user) =>
    set({
      open: true,
      user,
    }),

  closeProfile: () =>
    set({
      open: false,
      user: null,
    }),
}));