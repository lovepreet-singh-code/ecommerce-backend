import { Request, Response } from "express";
import { User } from "../models/user.model";
import { hashPassword, comparePassword } from "../utils/password";
import { signJWT } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";
import { StatusCodes } from "../constants/statusCodes";
import { Messages } from "../constants/messages";
import crypto from "crypto"; 


export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: Messages.EMAIL_EXISTS });
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed });

  res
    .status(StatusCodes.CREATED)
    .json({ message: Messages.USER_CREATED, user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: Messages.INVALID_CREDENTIALS });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: Messages.INVALID_CREDENTIALS });
  }

  const token = signJWT({ id: user._id, email: user.email });
  res.status(StatusCodes.OK).json({ token });
});


// ✅ Forgot Password
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

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

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex"); // ✅ ab error nahi aayega
    const resetTokenExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    // TODO: send email using nodemailer
    res.status(StatusCodes.OK).json({
      message: Messages.RESET_TOKEN_SENT,
      resetToken, // ⚠️ testing ke liye, baad me hata dena
    });
  }
);

// ✅ Reset Password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: Messages.TOKEN_AND_PASSWORD_REQUIRED });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: Messages.INVALID_OR_EXPIRED_TOKEN });
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(StatusCodes.OK).json({ message: Messages.PASSWORD_RESET });
  }
);

