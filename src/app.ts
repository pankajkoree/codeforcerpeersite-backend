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

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: DBURI,
      collectionName: "sessions",
      ttl: 15 * 24 * 60 * 60,
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 24 * 60 * 60,
    },
  })
);

app.use(cors());
app.use(express.json());

app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Hello from TypeScript Node.js backend!");
});

if (!DBURI) {
  throw new Error("MONGODB URI not found");
}
mongoose.connect(DBURI!).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
