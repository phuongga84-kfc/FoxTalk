import { create } from "zustand";
import { persist } from "zustand/middleware";
import { chatService } from "@/services/chatServices";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      activeConversationId: null,

      convoLoading: false,
      messagesLoading: false,

      setActiveConversation: (id) =>
        set({ activeConversationId: id }),

      reset: () =>
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
          convoLoading: false,
          messagesLoading: false,
        }),

      fetchConversations: async () => {
        try {
          set({ convoLoading: true });

          const { conversations } =
            await chatService.fetchConversations();

          set({
            conversations,
            convoLoading: false,
          });
        } catch (error) {
          console.error(error);
          set({ convoLoading: false });
        }
      },

      fetchMessages: async (conversationId) => {
        const { activeConversationId, messages } = get();
        const { user } = useAuthStore.getState();

        const convoId = conversationId ?? activeConversationId;

        if (!convoId) return;

        const current = messages?.[convoId];

        const nextCursor =
          current?.nextCursor === undefined
            ? ""
            : current.nextCursor;

        // Hết dữ liệu
        if (nextCursor === null) return;

        try {
          set({ messagesLoading: true });

          const {
            messages: fetchedMessages,
            cursor,
          } = await chatService.fetchMessages(
            convoId,
            nextCursor
          );

          const processed = fetchedMessages.map((m) => ({
            ...m,
            isOwn: m.senderId === user?._id,
          }));

          set((state) => {
            const prev =
              state.messages?.[convoId]?.items ?? [];

            return {
              messages: {
                ...state.messages,
                [convoId]: {
                  items:
                    prev.length > 0
                      ? [...processed, ...prev]
                      : processed,
                  nextCursor: cursor ?? null,
                  hasMore: !!cursor,
                },
              },
            };
          });
        } catch (error) {
          console.error(error);
        } finally {
          set({ messagesLoading: false });
        }
      },

      addMessage: (message) => {
        set((state) => {
          const convoId = message.conversationId;

          const current =
            state.messages?.[convoId] ?? {
              items: [],
              nextCursor: "",
              hasMore: true,
            };

          return {
            messages: {
              ...state.messages,
              [convoId]: {
                ...current,
                items: [...current.items, message],
              },
            },
          };
        });
      },

      clearMessages: (conversationId) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: {
              items: [],
              nextCursor: "",
              hasMore: true,
            },
          },
        }));
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        conversations: state.conversations,
      }),
    }
  )
);