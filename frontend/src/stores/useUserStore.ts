import { userService } from "@/services/userService";
import type { UserState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { toast } from "sonner";
import { useChatStore } from "./useChatStore";

export const useUserStore = create<UserState>((set, get) => ({
  updateAvatarUrl: async (formData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: data.avatarUrl,
        });

        useChatStore.getState().fetchConversations();
      }
    } catch (error) {
      console.error("Lỗi khi updateAvatarUrl", error);
      toast.error("Upload avatar không thành công!");
    }
  },
  updateProfile: async (data) => {
    try {
      const result = await userService.updateProfile(data);

      useAuthStore.getState().setUser(result.user);

      toast.success(result.message || "Cập nhật thành công!");

      return true;
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Cập nhật thất bại!");

      return false;
    }
  },
}));
