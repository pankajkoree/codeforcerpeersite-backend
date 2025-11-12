import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DBURI = process.env.DB_URI;

// cors on top
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://codeforcerpeersite-frontend.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(userRouter);

if (!DBURI) {
  throw new Error("MONGODB URI not found");
}
mongoose.connect(DBURI!).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
