import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  avtUrl: {
    type: String,
  },
  avtId: {
    type: String,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // bỏ khoảng trắng ở đầu và cuối
    lowercase: true, // chuyển hết về chữ viết thường
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    sparse: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  
}, {
    timestamps: true,
});
const User = mongoose.model("User", UserSchema)
export default User