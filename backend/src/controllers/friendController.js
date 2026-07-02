import Friend from "../models/Friend.js";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    const from = req.user._id?.toString();
    const toUserId = to?.toString();

    if (from === toUserId) {
      return res
        .status(400)
        .json({ message: "Bạn không thể gửi lời mời kết bạn cho chính mình" });
    }

    const userexists = await User.exists({ _id: to });
    if (!userexists) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    let userA = from.toString();
    let userB = to.toString();
    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }
    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);
    if (alreadyFriends) {
      return res.status(400).json({ message: "Bạn đã là bạn bè" });
    }
    if (existingRequest) {
      return res.status(400).json({ message: "Lời mời kết bạn đã tồn tại" });
    }
    const request = await FriendRequest.create({ from, to, message });

    // Create new friend request
    return res
      .status(201)
      .json({ message: "Lời mời kết bạn đã được gửi", request });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Lời mời kết bạn không tồn tại" });
    }
    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền chấp nhận lời mời kết bạn này" });
    }

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select("_id displayName avatarUrl")
      .lean();

    return res.status(200).json({
      message: "Lời mời kết bạn đã được chấp nhận",
      newFriend: {
        _id: from?._id,
        displayName: from?.displayName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: "Lời mời kết bạn không tồn tại" });
    }
    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền từ chối lời mời kết bạn này" });
    }
    await FriendRequest.findByIdAndDelete(requestId);
    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate("userA", "_id displayName avatarUrl")
      .populate("userB", "_id displayName avatarUrl")
      .lean();

    if (!friendships || friendships.length === 0) {
      return res.status(200).json({ friends: [] });
    }

    const friends = friendships.map((friendship) =>
      friendship.userA._id.toString() === userId.toString()
        ? friendship.userB
        : friendship.userA,
    );

    return res.status(200).json({ friends });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const populateFields = '_id username displayName avatarUrl';

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId }).populate("to", populateFields),
      FriendRequest.find({ to: userId }).populate("from", populateFields),
    ]);

    res.status(200).json({ sent, received })

    return res.status(200).json({ sent, received });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
