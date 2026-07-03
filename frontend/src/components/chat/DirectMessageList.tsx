import { useChatStore } from "@/stores/useChatStore";
import DirectMessageCard from "./DirectMessageCard";

const DirectMessageList = () => {
  const { conversations } = useChatStore();

  if (!conversations) return;

  const directConversations = conversations.filter(
    (convo) => convo.type === "direct"
  );

  return (
    <div className="flex flex-col gap-2 overflow-y-auto p-2">
      {directConversations.map((convo) => (
        <DirectMessageCard
          convo={convo}
          key={convo._id}
        />
      ))}
    </div>
  );
};

export default DirectMessageList;
