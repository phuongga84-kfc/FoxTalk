import { useChatStore } from "@/stores/useChatStore";
import GroupChatCard from "./GroupChatCard";

const GroupChatList = () => {
  const { conversations } = useChatStore();

  if (!conversations) return;

  const groupchats = conversations.filter((convo) => convo.type === "group");
  return (
    <div className="flex flex-col gap-2 overflow-y-auto p-2">
      {groupchats.map((convo) => (
        <GroupChatCard
          convo={convo}
          key={convo._id}
        />
      ))}
    </div>
  );
};

export default GroupChatList;
