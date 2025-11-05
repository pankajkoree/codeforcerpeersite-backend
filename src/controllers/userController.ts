import { Request, Response } from "express";
import User from "../model/User";
import validator from "validator";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/auth";

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
    const { name, email, password, gender, university } = req.body;

    // validation
    if (!name || !email || !password || !gender || !university) {
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
      name,
      email,
      password: hashedPassword,
      gender,
      university,
    });

    await user.save();

    const token = generateToken(user._id.toString());

    (req.session as any).userId = user._id;
    return res.json({
      status: 200,
      data: user,
      token: token,
    });
  } catch (error) {
    return res.json({
      error: error,
      status: 404,
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.json({
        status: 400,
        message: "user not found",
      });

    const isPasswordMatched = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatched)
      return res.json({
        status: 400,
        message: "invalid credentials",
      });

    const token = generateToken(user._id.toString());

    (req.session as any).userId = user._id;
    return res.json({
      status: 200,
      message: "Login successful",
      token: token,
      data: user,
    });
  } catch (error) {
    return res.json({
      status: 500,
      message: "Server error",
      error: error,
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    return res.json({
      status: 200,
      message: "Logged out successfully",
    });
  });
};
