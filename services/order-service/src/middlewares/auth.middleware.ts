import { Request, Response, NextFunction } from 'express';
import { verify } from '../utils/jwt';

export default function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const token = header.replace('Bearer ', '');
  try {
    const decoded = verify(token) as any;
    req.user = { id: decoded.id || decoded.userId, role: decoded.role };
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
