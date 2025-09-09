/* eslint-disable @typescript-eslint/no-unused-vars */
// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

// Global Error Handler Middleware
export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong. Please try again later.";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

// 404 Not Found Middleware
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
