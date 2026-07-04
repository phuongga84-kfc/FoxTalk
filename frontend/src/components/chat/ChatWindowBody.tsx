import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomeScreen";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();
  const [lastMessageStatus, setLastMessageStatus] = useState<
    "delivered" | "seen"
  >("delivered");
  const messages = allMessages[activeConversationId!]?.items ?? [];
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId,
  );

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }
  if (!messages?.length) {
    return (
      <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
        <div className="flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar">
          {messages.map((message) => {<>{message.content}</>})}
          
        </div>
      </div>
    );
  }
  return <div>ChatWindowBody</div>;
};

export default ChatWindowBody;
