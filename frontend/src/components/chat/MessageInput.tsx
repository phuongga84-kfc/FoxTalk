import { useRef, useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import EmojiPicker from "./EmojiPicker";

import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { chatService } from "@/services/chatService";
import type { Conversation } from "@/types/chat";

const MessageInput = ({
  selectedConvo,
}: {
  selectedConvo: Conversation;
}) => {
  const { user } = useAuthStore();

  const { sendDirectMessage, sendGroupMessage } = useChatStore();

  const [value, setValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleChooseImage = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn ảnh.");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Ảnh tối đa 1MB.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessage = async () => {
    if (!value.trim() && !selectedFile) return;

    try {
      setUploading(true);

      let imageUrl = "";

      // Upload ảnh trước
      if (selectedFile) {
        imageUrl = await chatService.uploadMessageImage(selectedFile);
      }

      if (selectedConvo.type === "direct") {
        const otherUser = selectedConvo.participants.find(
          (p) => p._id !== user._id,
        );

        if (!otherUser) {
          toast.error("Không tìm thấy người nhận.");
          return;
        }

        await sendDirectMessage(
          otherUser._id,
          value.trim(),
          imageUrl,
        );
      } else {
        await sendGroupMessage(
          selectedConvo._id,
          value.trim(),
          imageUrl,
        );
      }

      setValue("");
      removeImage();
    } catch (error) {
      console.error(error);
      toast.error("Gửi tin nhắn thất bại.");
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="border-t bg-background">
      {preview && (
        <div className="px-3 pt-3">
          <div className="relative w-fit">
            <img
              src={preview}
              alt="preview"
              className="max-w-52 rounded-xl border"
            />

            <Button
              size="icon"
              variant="destructive"
              className="absolute -top-2 -right-2 size-6"
              onClick={removeImage}
            >
              <X className="size-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 p-3">
        <input
          ref={fileInputRef}
          hidden
          type="file"
          accept="image/*"
          onChange={handleChooseImage}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <ImagePlus className="size-5" />
        </Button>

        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Soạn tin nhắn..."
            className="pr-12"
            disabled={uploading}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <EmojiPicker
              onChange={(emoji: string) =>
                setValue((prev) => prev + emoji)
              }
            />
          </div>
        </div>

        <Button
          onClick={sendMessage}
          disabled={
            uploading || (!value.trim() && !selectedFile)
          }
          className="bg-gradient-chat hover:shadow-glow"
        >
          <Send className="size-4 text-white" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;