import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DBURI = process.env.DB_URI;
const secretKey = process.env.SESSION_SECRET!;

console.log("secret key in app ts : ", secretKey);

app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://codeforcerpeersite-frontend.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: DBURI,
      collectionName: "sessions",
      ttl: 15 * 24 * 60 * 60,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV! === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(userRouter);
app.get("/test", (req, res) => {
  console.log("🔥 Test route hit");
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "render server working fine",
  });
});

if (!DBURI) {
  throw new Error("MONGODB URI not found");
}
mongoose.connect(DBURI!).then(() => {
  process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err);
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("🔥 Unhandled Rejection:", reason);
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
