import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = (req, res, next) => {
  try {
    // lấy access token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }
    // xác nhận token hợp lệ
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error("Lỗi khi xác nhận token ", err);
          return res
            .status(403)
            .json({ message: "Access token đã hết hạn hoặc không tồn tại" });
        }
        // tìm user
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        );

        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        // trả user về trong req
        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Lỗi khi xác minh trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi Hệ Thống" });
  }
};
