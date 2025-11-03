import { Request, Response } from "express";
import User from "../model/User";
import validator from "validator";
import bcryptjs from "bcryptjs";

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

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, gender, university } =
      req.body;

    // validation
    if (!firstName || !email || !password || !gender || !university) {
      return res.json({
        status: 400,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        status: 400,
        message: "email not valid",
      });
    }

    if (password.length < 8) {
      return res.json({
        status: 400,
        message: "password must be 8 characters",
      });
    }

    // checking if user exits
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        status: 400,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      university,
    });

    await user.save();
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
