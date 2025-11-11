import { Request, Response, NextFunction } from "express";

export const verifySession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!(req.session as any)?.userId) {
    return res.status(401).json({ message: "Unauthorized — no session" });
  }

  (req as any).userId = (req.session as any).userId;
  next();
};
