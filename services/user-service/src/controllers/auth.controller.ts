import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/password";
import { signJWT } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";
import { StatusCodes } from "../constants/statusCodes";
import { Messages } from "../constants/messages";
import crypto from "crypto";

// ========================
// ✅ Register
// ========================
export const register = asyncHandler(async (req: Request, res: Response) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();
  const role = req.body.role?.trim() || "user";

  if (!name || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: Messages.BOTH_FIELDS_REQUIRED });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: Messages.EMAIL_EXISTS });
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed, role });

  const userId = user._id.toString(); // ✅ cast _id to string

  res.status(StatusCodes.CREATED).json({
    message: Messages.USER_CREATED,
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ========================
// ✅ Login
// ========================
export const login = asyncHandler(async (req: Request, res: Response) => {
  const email = req.body.email?.trim();
  const password = req.body.password?.trim();

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: Messages.BOTH_FIELDS_REQUIRED });
  }

  // 🔍 check user existence
  const user = (await User.findOne({ email })) as IUser | null;
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: Messages.INVALID_CREDENTIALS });
  }

  // 🔍 check password match
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: Messages.INVALID_CREDENTIALS });
  }

  // ✅ convert ObjectId to string for JWT
  const userId = user._id.toString();
  const tokenPayload = { id: userId, email: user.email, role: user.role };
  const token = signJWT(tokenPayload);

  // 🟢 success response
  return res.status(StatusCodes.OK).json({
    message: Messages.LOGIN_SUCCESS,
    token,
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// ========================
// ✅ Forgot Password
// ========================
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const email = req.body.email?.trim();
    if (!email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: Messages.EMAIL_REQUIRED });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: Messages.USER_NOT_FOUND });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpire; // ✅ fixed
    await user.save();

    res.status(StatusCodes.OK).json({
      message: Messages.RESET_TOKEN_SENT,
      resetToken, // ⚠️ remove in production
    });
  }
);

// ========================
// ✅ Reset Password
// ========================
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.body.token?.trim();
    const newPassword = req.body.newPassword?.trim();

    if (!token || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: Messages.TOKEN_AND_PASSWORD_REQUIRED });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // ✅ fixed
    });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: Messages.INVALID_OR_EXPIRED_TOKEN });
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined; // ✅ fixed
    await user.save();

    res.status(StatusCodes.OK).json({ message: Messages.PASSWORD_RESET });
  }
);
