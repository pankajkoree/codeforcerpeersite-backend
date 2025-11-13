import { Request, Response } from "express";
import User from "../model/User";
import validator from "validator";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import Token from "../model/Token";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(users);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "failed to fetch users", error: error });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, gender, university } = req.body;

    // validation
    if (!name || !email || !password || !gender || !university) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "email not valid" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "password must be 8 characters" });
    }

    // checking if user exits
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      university,
    });

    await newUser.save();

    return res.status(201).json({
      message: "registration successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        university: newUser.university,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    if (!user.password) {
      return res.status(400).json({ message: "password not found" });
    }

    const isPasswordMatched = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "incorrect password" });
    }

    const token = generateToken(user._id.toString());

    await Token.create({ userId: user._id, token });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        university: user.university,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error,
    });
  }
};

// get profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error,
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};
