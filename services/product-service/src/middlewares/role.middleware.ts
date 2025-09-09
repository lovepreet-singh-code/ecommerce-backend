import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import STATUS_CODES from "../utils/statusCodes";
import MESSAGES from "../utils/messages";

export const roleMiddleware = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(STATUS_CODES.FORBIDDEN)
        .json({ success: false, message: MESSAGES.AUTH.FORBIDDEN });
    }
    next();
  };
};
