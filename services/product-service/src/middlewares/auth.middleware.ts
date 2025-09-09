import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import STATUS_CODES from "../utils/statusCodes";
import MESSAGES from "../utils/messages";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ success: false, message: MESSAGES.AUTH.UNAUTHORIZED });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    req.user = decoded;
    next();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  } catch (error) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ success: false, message: MESSAGES.AUTH.INVALID_TOKEN });
  }
};
