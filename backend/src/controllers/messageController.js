import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from "../utils/messageHelper.js";
import { io } from "../socket/index.js";
import { uploadImageFromBuffer } from "../middlewares/uploadMiddleware.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const {
      recipientId,
      content,
      conversationId,
      imageUrl,
    } = req.body;

    const senderId = req.user._id;

    if (!content && !imageUrl) {
      return res.status(400).json({
        message: "Tin nhắn trống",
      });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content: content ?? "",
      imageUrl: imageUrl ?? null,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    emitNewMessage(io, conversation, message);

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn trực tiếp", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const {
      conversationId,
      content,
      imageUrl,
    } = req.body;

    const senderId = req.user._id;

    const conversation = req.conversation;

    if (!content && !imageUrl) {
      return res.status(400).json({
        message: "Tin nhắn trống",
      });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content: content ?? "",
      imageUrl: imageUrl ?? null,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    emitNewMessage(io, conversation, message);

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Lỗi xảy ra khi gửi tin nhắn nhóm", error);

    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const uploadMessageImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Chưa chọn ảnh",
      });
    }

    const result = await uploadImageFromBuffer(req.file.buffer, {
      folder: "fox-talk/messages",
    });

    return res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload ảnh thất bại", error);

    return res.status(500).json({
      message: "Upload ảnh thất bại",
    });
  }
};