import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(userRouter);

app.get("/", (req, res) => {
  res.send("Hello from TypeScript Node.js backend!");
});
const DBURI = process.env.DB_URI;

if (!DBURI) {
  throw new Error("MONGODB URI not found");
}
mongoose.connect(DBURI!).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
