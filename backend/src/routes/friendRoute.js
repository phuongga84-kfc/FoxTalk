import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests,
} from "../controllers/friendController.js";

const router = express.Router();

// Danh sách bạn bè
router.get("/", getAllFriends);

// Danh sách lời mời kết bạn
router.get("/requests", getFriendRequests);

// Gửi lời mời kết bạn
router.post("/requests", sendFriendRequest);

// Chấp nhận lời mời
router.post("/requests/:requestId/accept", acceptFriendRequest);

// Từ chối lời mời
router.post("/requests/:requestId/decline", declineFriendRequest);

export default router;