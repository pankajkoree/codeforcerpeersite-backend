import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import validator from "validator";
import bcryptjs from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import Token from "../model/Token";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

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
    const {
      name,
      cfusername,
      email,
      password,
      gender,
      university,
      country,
      registeredOn,
    } = req.body;

    // validation
    if (
      !name ||
      !cfusername ||
      !email ||
      !password ||
      !gender ||
      !university ||
      !country
    ) {
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
      cfusername,
      email,
      password: hashedPassword,
      gender,
      university,
      country,
      registeredOn,
    });

    await newUser.save();

    return res.status(201).json({
      message: "registration successful",
      user: {
        _id: newUser._id,
        name: newUser.name,
        cfusername: newUser.cfusername,
        email: newUser.email,
        gender: newUser.gender,
        university: newUser.university,
        country: newUser.country,
        registeredOn: newUser.registeredOn,
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
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      data: {
        _id: user._id,
        name: user.name,
        cfusername: user.cfusername,
        email: user.email,
        gender: user.gender,
        university: user.university,
        country: user.country,
        registeredOn: user.registeredOn,
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
    sameSite: isProduction ? "none" : "lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - missing token",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");

    const validToken = await Token.findOne({ token });
    if (!validToken) {
      return res.status(401).json({
        message: "invalid or expred token while validating the token",
      });
    }
    (req as any).userId = decoded.id;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res
        .status(400)
        .json({ message: "Email or codeforce username is required" });
    }
    let user;
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier.toLowercase() });
    } else {
      try {
        user = await User.findOne({ cfusername: identifier });
      } catch (error) {
        return res
          .status(404)
          .json({ message: "User not found", error: error });
      }
    }
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    return res.status(200).json({ exists: true });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { identifier, newPassword } = req.body;

    // Validate input
    if (!identifier || !newPassword) {
      return res.status(400).json({ message: "both fields are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "password must be 8 characters" });
    }

    // Find user
    let user;
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier.toLowerCase() });
    } else {
      user = await User.findOne({ cfusername: identifier });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash & update password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password" });
  }
};
