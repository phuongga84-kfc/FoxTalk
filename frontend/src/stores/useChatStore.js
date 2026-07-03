import { chatService } from "@/services/chatServices";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create()(
  persist(
    (set, get) => ({
      conversations: [],
      message: {},
      activeConversationId: null,
      loading: false,

      setActiveConversation: (id) => set({ activeConversationId: id }),
      reset: () => {
        set({
          conversations: [],
          message: {},
          activeConversationId: null,
          loading: false,
        });
      },
      fetchConversations: async () => {
        try {
          set({ loading: true });
          const { conversations } = await chatService.fetchConversations();

          set({ conversations, loading: false });
        } catch (error) {
          console.error(error);
          set({ loading: false });
        }
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({ converstations: state.converstations }),
    },
  ),
);
