import express from "express";

import {
  getAllUser,
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/userController";
import { verifyToken } from "../utils/auth";

const userRouter = express.Router();

userRouter.get("/user", getAllUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/profile", verifyToken, (req, res) => {
  return res.status(200).json({
    message: "profile accessed",
    userId: (req as any).userId,
  });
});

export default userRouter;
