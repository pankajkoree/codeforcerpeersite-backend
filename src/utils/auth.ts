// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";

// dotenv.config();

// // jwt secret
// const JWT_SECRET = process.env.JWT_SECRET!;

// // jwt token generation
// export const generateToken = (userId: string) => {
//   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
// };

// // verify jwt middleware
// export const verifyToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader)
//     return res.json({
//       status: 400,
//       message: "no token provided",
//     });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decodedToken = jwt.verify(token, JWT_SECRET) as { userId: string };
//     (req as any).userId = decodedToken.userId;
//     return next();
//   } catch (error) {
//     return res.json({
//       status: 400,
//       message: "invalid token",
//     });
//   }
// };
