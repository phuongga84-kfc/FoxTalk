import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { authService } from "../services/authServices.js";
import { useChatStore } from "./useChatStore.js";

const getErrorMessage = (error, fallback) => {
  const backendMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message;
  return backendMessage || fallback;
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

      clearState: () => {
        set({ accessToken: null, user: null, loading: false });
      },
      signUp: async (firstname, lastname, username, email, password) => {
        try {
          set({ loading: true });

          await authService.signUp(
            firstname,
            lastname,
            username,
            email,
            password,
          );
          toast.success("tạo tài khoản thành công!");
          return true;
        } catch (error) {
          console.error(error);
          toast.error(getErrorMessage(error, "tạo tài khoản thất bại"));
          return false;
        } finally {
          set({ loading: false });
        }
      },
      signIn: async (username, password) => {
        try {
          set({ loading: true });

          localStorage.clear()
          useChatStore.getState().reset()

          const { accessToken, message } = await authService.signIn(
            username,
            password,
          );

          get().setAccessToken(accessToken);

          await get().fetchMe();
          useChatStore.getState().fetchConversations()


          toast.success(message || "Đăng nhập thành công!");
          return true;
        } catch (error) {
          console.error(error);
          toast.error(getErrorMessage(error, "đăng nhập thất bại"));
          return false;
        } finally {
          set({ loading: false });

          clearState: () => {
            set({accessToken: null, user: null, loading: false})
            localStorage.clear()
            useChatStore.getState().reset()
          }
        }
      },
      signOut: async () => {
        try {
          get().clearState();
          await authService.signOut();
          toast.success("Đăng xuất thành công!");
          return true;
        } catch (error) {
          console.error(error);
          toast.error(
            getErrorMessage(error, "lỗi sảy ra khi đăng xuất, hãy thử lại"),
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
          set({ user: null, accessToken: null });
          toast.error(
            getErrorMessage(error, "Lỗi sảy ra khi lấy dữ liệu người dùng"),
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
              "Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại!",
            ),
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
    },
  ),
);
