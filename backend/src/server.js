import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/database.js";
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import cookieParser from "cookie-parser"
import { protectedRoute } from "./middlewares/authMiddleware.js";
import cors from 'cors'
import friendRoute from "./routes/friendRoute.js";
import messageRoute from "./routes/messageRoute.js";
import conversationRoute from "./routes/conversationRoute.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
const HOST = process.env.HOST;

// middlewares

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))

// public routes
app.use('/api/auth', authRoute)

// private routes
app.use(protectedRoute)
app.use('/api/user', userRoute)
app.use('/api/friends', friendRoute)
app.use('/api/messages', messageRoute)
app.use('/api/conversations', conversationRoute)
connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Server đang chạy tại http://${HOST}:${PORT}`);
  });
});
