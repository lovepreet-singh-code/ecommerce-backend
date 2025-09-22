import jwt, { SignOptions, JwtPayload, Secret } from 'jsonwebtoken';

const secret: Secret = process.env.JWT_SECRET || 'change_this_quickly';

export function sign(payload: object, options?: SignOptions): string {
  const raw = process.env.JWT_EXPIRES_IN || '7d';

  // Force correct type: number or template literal string
  const expiresIn: SignOptions['expiresIn'] = !isNaN(Number(raw))
    ? Number(raw)
    : (raw as `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'y'}`);

  const signOptions: SignOptions = {
    expiresIn,
    ...options,
  };

  return jwt.sign(payload, secret, signOptions);
}

export function verify(token: string): string | JwtPayload {
  return jwt.verify(token, secret) as string | JwtPayload;
}
