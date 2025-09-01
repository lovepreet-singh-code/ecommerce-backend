import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../constants';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction // "_" prefix = ignore unused var
) => {
  console.error('Error:', err.message);

  res.status(err.statusCode || STATUS_CODES.SERVER_ERROR).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
