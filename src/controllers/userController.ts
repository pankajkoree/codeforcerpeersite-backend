import { Request, Response } from "express";
import User from "../model/User";
import validator from "validator";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/auth";

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const response = await User.find();
    if (!response) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(response);
  } catch (error) {
    return res.status(404).json({ error: error });
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

    const user = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      university,
    });

    try {
      await user.save();
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Failed to save user", error: err });
    }

    const token = generateToken(user._id.toString());

    (req.session as any).userId = user._id;
    return res.status(200).json({ data: user, token: token });
  } catch (error) {
    return res.status(404).json({ error: error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "user not found" });
    if (!user.password)
      return res.status(400).json({ message: "password not found" });

    const isPasswordMatched = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatched)
      return res.status(400).json({ message: "invalid credentials" });

    const token = generateToken(user._id.toString());

    (req.session as any).userId = user._id;
    req.session.save((err) => {
      if (err) return res.status(500).json({ error: "Session save failed" });
      res.json({ message: "Logged in successfully" });
    });
    return res.status(200).json({
      message: "Login successful",
      token: token,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error,
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out successfully" });
  });
};
