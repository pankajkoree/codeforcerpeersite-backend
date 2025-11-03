import { Request, Response } from "express";
import User from "../model/User";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const response = await User.find();
    if (!response) {
      return res.json({
        error: "User not found",
        status: 404,
      });
    }
    return res.json(response);
  } catch (error) {
    return res.json({
      error: error,
      status: 404,
    });
  }
};

export const postAddUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, gender, university } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      gender,
      university,
    });

    user.save();
    return res.json({
      status: 200,
      data: user,
    });
  } catch (error) {
    return res.json({
      error: error,
      status: 404,
    });
  }
};
