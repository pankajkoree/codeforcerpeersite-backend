import express from "express";

import { getAllUser, postAddUser } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/user", getAllUser);
userRouter.post("/addUser", postAddUser);

export default userRouter;
