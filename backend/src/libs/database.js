import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Kết nối tới CSDL thành công!");
    console.log("Mongo URL:", process.env.MONGODB_URL);
  } catch (error) {
    console.log("Lỗi khi kết nối tới CSDL: ", error);
    process.exit(1)
  }
};
