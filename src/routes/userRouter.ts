import express from "express";

import {
  getAllUser,
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
} from "../controllers/userController";
import { verifyToken } from "../utils/auth";

const userRouter = express.Router();

userRouter.get("/user", getAllUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/profile", verifyToken, getProfile);

export default userRouter;
