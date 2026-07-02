import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { updateConversationLastMessage } from "../utils/messageHelper.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { receiverId, content, conversationId } = req.body;
    const senderId = req.user._id;
    let conversation;

    if (!content) {
      return res
        .status(400)
        .json({ message: "Nội dung tin nhắn không được để trống" });
    }

    if (!receiverId) {
      return res.status(400).json({ message: "Thiếu người nhận" });
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res
          .status(404)
          .json({ message: "Cuộc trò chuyện không tồn tại" });
      }
    } else {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: receiverId, joinedAt: new Date() },
        ],
        lastMessage: new Date(),
        unreadCount: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    updateConversationLastMessage(conversation, message, senderId);

    await conversation.save();

    return res
      .status(201)
      .json({ message: "Tin nhắn đã được gửi", data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if (!content) {
      return res.status(400).json("thiếu nội dung");
    }

    const message = await Message.create({ conversationId, senderId, content });
    updateConversationLastMessage(conversation, message, senderId);

    await conversation.save();
    return res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
