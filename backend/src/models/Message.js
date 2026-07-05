import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Nội dung tin nhắn
    content: {
      type: String,
      trim: true,
      default: "",
    },

    // Link ảnh trên Cloudinary
    imageUrl: {
      type: String,
      default: null,
    },

    // Loại tin nhắn
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ conversationId: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;