import express from "express";

import { getAllUser, registerUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/user", getAllUser);
userRouter.post("/register", registerUser);

export default userRouter;
