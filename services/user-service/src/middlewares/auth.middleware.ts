/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = verifyJWT(token);
    (req as any).user = decoded;
    next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
