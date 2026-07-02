import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto, { setEngine } from "crypto";
import Session from "../models/Session.js";
const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";

export const signUp = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    if (!username || !password || !email || !firstname || !lastname)
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstname, lastname",
      });

    // kiểm tra user có tồn tại hay chưa
    const duplicate = await User.findOne({ username });
    if (duplicate)
      return res.status(409).json({ message: "Username đã tồn tại" });

    // mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user mới
    await User.create({
      displayName: `${firstname} ${lastname}`,
      username,
      email,
      hashedPassword,
    });

    //return
    console.log(`người dùng ${username} đã tạo tài khoản thành công!`);
    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signUp", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signIn = async (req, res) => {
  try {
    // Lấy input

    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({
        message: "Không thể thiếu username hoặc password",
      });

    // lấy hashPassword so sánh với db
    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(401)
        .json({ message: "tên đăng nhập hoặc mật khẩu không đúng" });
    }
    // check password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "tên đăng nhập hoặc mật khẩu không đúng" });
    }

    // nếu khớp, tạo access token với jwt
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // tạo session mới để lưu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // trả refresh token vè trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: REFRESH_TOKEN_TTL,
    });

    // trả access về trong respone
    console.log(`người dùng ${username} đã đăng nhập thành công!`);
    const arr = user.displayName.split(" ");
    return res.status(200).json({
      
      message: `Chào mừng ${arr[1]} đã quay trở lại!`,
      accessToken,
    });
  } catch (error) {
    console.error("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signOut = async (req, res) => {
  try {
    // Lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // xóa refresh token trong Session
      await Session.deleteOne({ refreshToken: token });
      // xóa cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
    }
    
    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi signOut", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// tạo accessToken mới từ refreshToken
export const refreshToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại." });
    }
    // so với rt trong db
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res
        .status(403)
        .json({ message: "token không hợp lệ hoặc đã hết hạn" });
    }

    // kiểm tra rf hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res
        .status(403)
        .json({ message: "token không hợp lệ hoặc đã hết hạn" });
    }

    // hợp lệ tạo at mới
    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("lỗi khi gọi refresh ", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
