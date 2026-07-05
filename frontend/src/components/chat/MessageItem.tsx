import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { cn, formatMessageTime } from "@/lib/utils";
import type { Conversation, Message, Participant } from "@/types/chat";

import UserAvatar from "./UserAvatar";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface MessageItemProps {
  message: Message;
  index: number;
  messages: Message[];
  selectedConvo: Conversation;
  lastMessageStatus: "delivered" | "seen";
}

const MessageItem = ({
  message,
  index,
  messages,
  selectedConvo,
  lastMessageStatus,
}: MessageItemProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const prev = index + 1 < messages.length ? messages[index + 1] : undefined;

  const isShowTime =
    index === 0 ||
    new Date(message.createdAt).getTime() -
      new Date(prev?.createdAt || 0).getTime() >
      300000;

  const isGroupBreak = isShowTime || message.senderId !== prev?.senderId;

  const participant = selectedConvo.participants.find(
    (p: Participant) => p._id === message.senderId,
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {isShowTime && (
        <span className="flex justify-center px-1 text-xs text-muted-foreground">
          {formatMessageTime(new Date(message.createdAt))}
        </span>
      )}

      <div
        className={cn(
          "mt-1 flex gap-2 message-bounce",
          message.isOwn ? "justify-end" : "justify-start",
        )}
      >
        {!message.isOwn && (
          <div className="w-8">
            {isGroupBreak && (
              <UserAvatar
                type="chat"
                name={participant?.displayName ?? "FoxTalk"}
                avatarUrl={participant?.avatarUrl ?? undefined}
              />
            )}
          </div>
        )}

        <div
          className={cn(
            "flex max-w-xs flex-col space-y-1 lg:max-w-md",
            message.isOwn ? "items-end" : "items-start",
          )}
        >
          <Card
            className={cn(
              "p-2",
              message.isOwn
                ? "chat-bubble-sent border-0"
                : "chat-bubble-received",
            )}
          >
            {message.imageUrl && (
              <img
                src={message.imageUrl}
                alt="Ảnh"
                onClick={() => setPreviewImage(message.imageUrl!)}
                className="mb-2 max-h-80 max-w-xs cursor-pointer rounded-xl object-cover transition hover:opacity-90 hover:scale-[1.02]"
              />
            )}

            {message.content && (
              <p className="break-words text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
          </Card>

          {message.isOwn &&
            message._id === selectedConvo.lastMessage?._id && (
              <Badge
                variant="outline"
                className={cn(
                  "h-4 border-0 px-1.5 py-0.5 text-xs",
                  lastMessageStatus === "seen"
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {lastMessageStatus === "seen"
                  ? "Đã xem"
                  : "Đã nhận"}
              </Badge>
            )}
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-5 top-5 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewImage(null);
            }}
          >
            <X className="size-5" />
          </Button>

          <img
            src={previewImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl object-contain"
          />
        </div>
      )}
    </>
  );
};

export default MessageItem;