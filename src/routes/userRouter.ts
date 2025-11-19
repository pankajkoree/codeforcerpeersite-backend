import express from "express";

import {
  getAllUser,
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  resetPassword,
} from "../controllers/userController";
import { verifyJWT } from "../middleware/verifyJWT";

const userRouter = express.Router();

userRouter.get("/user", getAllUser);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/profile", verifyJWT, getProfile);
userRouter.post("/forgotPassword", resetPassword);

export default userRouter;
