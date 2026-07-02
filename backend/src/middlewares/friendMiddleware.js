import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";

const pair = (a, b) => {
  const left = a?.toString();
  const right = b?.toString();
  return left < right ? [left, right] : [right, left];
};

export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user?._id?.toString();
    const receiverId = req.body?.receiverId ?? null;
    const memberIds = req.body?.memberIds ?? [];

    if (!me) {
      return res.status(401).json({ message: "Không xác định được người dùng" });
    }

    if (!receiverId && memberIds.length === 0) {
      return res.status(400).json({ message: "Thiếu người nhận" });
    }

    if (receiverId) {
      const [userA, userB] = pair(me, receiverId);
      const isFriend = await Friend.findOne({ userA, userB });

      if (!isFriend) {
        return res.status(403).json({ message: "Bạn chưa kết bạn với người này" });
      }

      return next();
    }

    const friendChecks = memberIds.map(async (memberId) => {
      const [userA, userB] = pair(me, memberId);
      const isFriend = await Friend.findOne({ userA, userB });
      return isFriend ? null : memberId;
    });

    const results = await Promise.all(friendChecks);
    const notFriends = results.filter(Boolean);

    if (notFriends.length > 0) {
      return res.status(403).json({ message: "Bạn chưa kết bạn với một số người trong nhóm", notFriends });
    }

    return next();
  } catch (error) {
    console.error("Error in checkFriendship middleware:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const checkGroupMembership = async (req, res, next) => {
  try {
    const {conversationId} = req.body
    const userId = req.user._id

    const conversation = await Conversation.findById(conversationId)

    if(!conversation){
      return res.status(404).json("không tìm thấy cuộc trò chuyện")
    }

    const isMember = conversation.participants.some((p) => p.userId.toString() === userId.toString())

    if(!isMember){
      return res.status(403).json({message: "Bạn không ở nhóm này"})
    }

    req.conversation = conversation
    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Lỗi hệ thống" });
    
  }
}