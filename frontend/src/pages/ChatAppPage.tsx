import { AppSidebar } from "@/components/sidebar/app-sidebar";
import ChatWindowLayout from "@/components/chat/ChatWindowLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";

const ChatAppPage = () => {
  const { fetchConversations } = useChatStore();

  useEffect(() => {
    fetchConversations();
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex h-screen w-full p-2">
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  );
};

export default ChatAppPage;
