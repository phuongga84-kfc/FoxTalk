import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { useChatStore } from "./useChatStore";

const getErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      // ✅ thêm hàm này
      setUser: (user) => {
        set({ user });
      },

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
        });

        localStorage.clear();
        useChatStore.getState().reset();
      },

      signUp: async (
        firstName,
        lastName,
        username,
        email,
        password
      ) => {
        try {
          set({ loading: true });

          await authService.signUp(
            firstName,
            lastName,
            username,
            email,
            password
          );

          toast.success("Tạo tài khoản thành công!");
          return true;
        } catch (error) {
          console.error(error);
          toast.error(
            getErrorMessage(error, "Tạo tài khoản thất bại")
          );
          return false;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (username, password) => {
        try {
          set({ loading: true });

          localStorage.clear();
          useChatStore.getState().reset();

          const { accessToken, message } =
            await authService.signIn(username, password);

          get().setAccessToken(accessToken);

          await get().fetchMe();

          await useChatStore.getState().fetchConversations();

          toast.success(message || "Đăng nhập thành công!");

          return true;
        } catch (error) {
          console.error(error);

          toast.error(
            getErrorMessage(error, "Đăng nhập thất bại")
          );

          return false;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        try {
          await authService.signOut();

          get().clearState();

          toast.success("Đăng xuất thành công!");

          return true;
        } catch (error) {
          console.error(error);

          toast.error(
            getErrorMessage(
              error,
              "Lỗi xảy ra khi đăng xuất, hãy thử lại."
            )
          );

          return false;
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });

          const user = await authService.fetchMe();

          set({ user });
        } catch (error) {
          console.error(error);

          set({
            user: null,
            accessToken: null,
          });

          toast.error(
            getErrorMessage(
              error,
              "Lỗi xảy ra khi lấy dữ liệu người dùng."
            )
          );
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });

          const accessToken = await authService.refresh();

          get().setAccessToken(accessToken);

          if (!get().user) {
            await get().fetchMe();
          }

          return true;
        } catch (error) {
          console.error(error);

          toast.error(
            getErrorMessage(
              error,
              "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!"
            )
          );

          get().clearState();

          return false;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "fox-talk-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);