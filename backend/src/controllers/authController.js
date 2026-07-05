// @ts-nocheck
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

// =========================
// SIGN UP (FIXED)
// =========================
export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    console.log("BODY:", req.body);

    // validate input
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message: "Thiếu dữ liệu bắt buộc",
      });
    }


    // check duplicate username
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({
        message: "Username đã tồn tại",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user (FIXED: return data + correct displayName)
    const user = await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    return res.status(201).json({
      message: "Tạo tài khoản thành công",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// =========================
// SIGN IN (FIXED nhẹ)
// =========================
export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Thiếu username hoặc password",
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Sai username hoặc password",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Sai username hoặc password",
      });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      message: `Welcome ${user.displayName}`,
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
    });
  } catch (error) {
    console.error("SIGNIN ERROR:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// =========================
// SIGN OUT (FIXED nhẹ)
// =========================
export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await Session.deleteOne({ refreshToken: token });
      res.clearCookie("refreshToken");
    }

    return res.status(200).json({
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("SIGNOUT ERROR:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// =========================
// REFRESH TOKEN (OK giữ nguyên logic)
// =========================
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res.status(403).json({ message: "Invalid session" });
    }

    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Expired session" });
    }

    const accessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("REFRESH ERROR:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};