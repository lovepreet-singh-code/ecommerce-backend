import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

// ✅ Use secret from .env and throw error if not set
const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

/**
 * Sign a JWT token
 */
export const signJWT = (payload: object, options: SignOptions = {}): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h", ...options });
};

/**
 * Verify a JWT token
 */
export const verifyJWT = (token: string): JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Decode a JWT token without verifying (useful for debugging)
 */
export const decodeJWT = (
  token: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): null | { [key: string]: any } | string => {
  return jwt.decode(token);
};
