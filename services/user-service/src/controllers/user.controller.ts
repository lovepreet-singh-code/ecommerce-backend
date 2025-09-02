/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { StatusCodes } from "../constants/statusCodes";
import { Messages } from "../constants/messages";

// ✅ Get profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: Messages.USER_NOT_FOUND });
  }

  res.status(StatusCodes.OK).json(user);
});

// ✅ Update profile
export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: Messages.USER_NOT_FOUND });
    }

    res.status(StatusCodes.OK).json(user);
  }
);

// ✅ Change password
export const changePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: Messages.BOTH_PASSWORDS_REQUIRED });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: Messages.USER_NOT_FOUND });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: Messages.OLD_PASSWORD_INCORRECT });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: Messages.PASSWORD_UPDATED });
  }
);

// ✅ Delete account
export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: Messages.USER_NOT_FOUND });
    }

    res
      .status(StatusCodes.OK)
      .json({ message: Messages.ACCOUNT_DELETED });
  }
);
