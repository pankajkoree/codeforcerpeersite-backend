import jwt from "jsonwebtoken";
import { stringify } from "querystring";

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};
